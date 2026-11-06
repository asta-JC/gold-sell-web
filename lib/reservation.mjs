import { createHash } from 'node:crypto';

const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value);
const itemDetails = 'id,photo,size,purity,weight,descUz,descRu';
const threadColumns = 'id,items,total,created_at,contact,archived_at';
const messageColumns = 'id,reservation_id,sender,body,created_at';
const json = data => ({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});

export async function reservation(action, req, res, staff) {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return res.status(503).json({error:'chatError'});
  async function db(path, options = {}) {
    const response = await fetch(process.env.SUPABASE_URL + '/rest/v1/' + path, {
      ...options,
      headers:{apikey:key, ...(key.startsWith('eyJ') ? {Authorization:'Bearer ' + key} : {}), ...options.headers}
    });
    if (!response.ok) throw new Error('Database request failed');
    const body = await response.text();
    return body ? JSON.parse(body) : null;
  }
  const data = req.body ?? {};
  const {id, secret} = data;
  const staffAction = action.startsWith('chat-staff-');
  if (staffAction && !staff) return res.status(401).json({error:'login'});
  if (action === 'chat-staff-inbox') {
    const [threads, recent] = await Promise.all([
      db('reservations?select=' + threadColumns + '&archived_at=is.null&order=created_at.desc&limit=100'),
      db('reservation_messages?select=id,reservation_id,created_at&sender=eq.visitor&order=created_at.desc&limit=100')
    ]);
    const active = new Set(threads.map(thread => thread.id));
    return res.json({threads,recent:recent.filter(message => active.has(message.reservation_id))});
  }
  if (!uuid(id) || (!staffAction && !uuid(secret))) return res.status(400).json({error:'chatError'});
  const hash = staffAction ? '' : createHash('sha256').update(secret).digest('hex');
  const threadQuery = 'reservations?select=' + threadColumns + '&id=eq.' + id +
    (staffAction ? '' : '&visitor_hash=eq.' + hash);
  let [thread] = await db(threadQuery);

  if (action === 'chat-start') {
    if (thread) return res.json({id});
    const {firstName,lastName,phone} = data.contact ?? {};
    const contact = [firstName,lastName,phone].map(value => typeof value === 'string' ? value.trim() : '');
    const phoneDigits = contact[2].replace(/[^0-9]/g,'');
    if (contact.slice(0,2).some(name => !name || name.length > 60) ||
        !/^\+?[0-9 ()-]+$/.test(contact[2]) || contact[2].length > 24 ||
        phoneDigits.length < 9 || phoneDigits.length > 15) {
      return res.status(400).json({error:'invalidContact'});
    }
    const entries = data.items;
    if (!Array.isArray(entries) || !entries.length || entries.length > 25 ||
        entries.some(item => !item || !uuid(item.id) || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) ||
        new Set(entries.map(item => item.id)).size !== entries.length) {
      return res.status(400).json({error:'chatError'});
    }
    const products = await db('products?select=' + itemDetails + ',sku,uz,ru,price&status=eq.published&available=eq.true&id=in.(' +
      entries.map(item => item.id).join(',') + ')');
    if (products.length !== entries.length) return res.status(409).json({error:'cartUnavailable'});
    const items = entries.map(item => ({...products.find(product => product.id === item.id),qty:item.qty}));
    const total = items.reduce((sum,item) => sum + item.price * item.qty,0);
    const options = json({id,visitor_hash:hash,items,total,contact:{firstName:contact[0],lastName:contact[1],phone:contact[2]}});
    options.headers.Prefer = 'resolution=ignore-duplicates,return=minimal';
    await db('reservations?on_conflict=id',options);
    [thread] = await db(threadQuery);
    return thread ? res.json({id}) : res.status(404).json({error:'chatError'});
  }

  if (!thread) return res.status(404).json({error:'chatError'});
  if (action === 'chat-staff-archive') {
    await db('reservations?id=eq.' + id + '&archived_at=is.null', {
      ...json({archived_at:new Date().toISOString()}),method:'PATCH'
    });
    return res.json({id});
  }
  if (staffAction && thread.archived_at) return res.status(404).json({error:'chatClosed'});
  if (action === 'chat-send' || action === 'chat-staff-send') {
    if (thread.archived_at) return res.status(409).json({error:'chatClosed'});
    const body = typeof data.body === 'string' ? data.body.trim() : '';
    if (!body || body.length > 1000 || !uuid(data.messageId)) {
      return res.status(400).json({error:'required'});
    }
    const options = json({id:data.messageId,reservation_id:id,sender:staffAction ? 'staff' : 'visitor',body});
    options.headers.Prefer = 'resolution=ignore-duplicates,return=minimal';
    await db('reservation_messages?on_conflict=id',options);
  }
  const messages = await db('reservation_messages?select=' + messageColumns + '&reservation_id=eq.' + id +
    '&order=created_at.desc,id.desc&limit=100');
  const missingDetails = thread.items.filter(item => uuid(item.id) && !Object.hasOwn(item,'photo'));
  const current = missingDetails.length
    ? await db('products?select=' + itemDetails + '&id=in.(' + missingDetails.map(item => item.id).join(',') + ')')
    : [];
  thread.items = thread.items.map(item => {
    const details = {...current.find(product => product.id === item.id), ...item};
    if (details.photo) {
      details.photo = process.env.SUPABASE_URL + '/storage/v1/object/public/product-photos/' +
        encodeURIComponent(details.photo.split(',')[0]);
    }
    return details;
  });
  if (!staffAction) delete thread.contact;
  return res.json({thread,messages:messages.reverse()});
}
