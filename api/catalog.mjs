import { randomUUID } from 'node:crypto';
import { reservation } from '../lib/reservation.mjs';

const cookieName = 'mg_staff';
const columns = 'id,sku,category,uz,ru,descUz,descRu,price,purity,weight,size,photo,available,status';
const categories = new Set(['rings', 'earrings', 'bracelets', 'necklaces', 'sets']);
const photoTypes = new Map([['jpeg', 'jpg'], ['png', 'png'], ['webp', 'webp']]);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return res.status(503).json({error:'backend'});
  const action = req.query.action;
  const token = req.cookies?.[cookieName];
  if (req.method === 'POST' && req.headers.origin !== 'https://' + req.headers.host) {
    return res.status(403).json({error:'forbidden'});
  }

  async function request(path, options = {}, jwt = token) {
    return fetch(url + path, {
      ...options,
      headers: {apikey:key, ...(jwt ? {Authorization:'Bearer ' + jwt} : {}), ...options.headers}
    });
  }
  async function isStaff(jwt) {
    if (!jwt) return false;
    const response = await request('/rest/v1/staff?select=user_id&limit=1', {}, jwt);
    return response.ok && (await response.json()).length === 1;
  }
  function session(value, seconds) {
    res.setHeader('Set-Cookie', cookieName + '=' + value +
      '; Path=/api/catalog; HttpOnly; Secure; SameSite=Strict; Max-Age=' + seconds);
  }
  try {
    if (req.method === 'GET' && (action === 'public' || action === 'staff')) {
      const staff = action === 'staff';
      if (staff && !await isStaff(token)) return res.status(401).json({error:'login'});
      const result = await request('/rest/v1/products?select=' + columns +
        '&order=created_at.asc' + (staff ? '' : '&status=eq.published'), {}, staff ? token : '');
      if (!result.ok) return res.status(502).json({error:'backend'});
      const products = await result.json();
      return res.json(products.map(product => {
        const photos = product.photo.split(',').map(path =>
          url + '/storage/v1/object/public/product-photos/' + encodeURIComponent(path));
        return {...product, photo:photos[0], photos};
      }));
    }
    if (req.method !== 'POST') return res.status(405).json({error:'method'});
    if (typeof action === 'string' && action.startsWith('chat-')) {
      return await reservation(action, req, res, action.startsWith('chat-staff-') && await isStaff(token));
    }
    if (action === 'logout') {
      session('', 0);
      return res.json({ok:true});
    }
    if (action === 'login') {
      const {login, password} = req.body ?? {};
      const email = process.env.M_GOLD_ADMIN_EMAIL;
      if (!email || login !== 'admin-001' || typeof password !== 'string' || password.length > 256) {
        return res.status(401).json({error:'login'});
      }
      const result = await request('/auth/v1/token?grant_type=password', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,password})
      }, '');
      if (!result.ok) return res.status(401).json({error:'login'});
      const auth = await result.json();
      if (!await isStaff(auth.access_token)) return res.status(401).json({error:'login'});
      session(auth.access_token, auth.expires_in);
      return res.json({ok:true});
    }
    if (action !== 'save' || !await isStaff(token)) return res.status(401).json({error:'login'});
    const {id, photo, photos, ...fields} = req.body ?? {};
    const product = Object.fromEntries(columns.split(',').filter(key => !['id','photo'].includes(key))
      .map(key => [key,fields[key]]));
    const updating = typeof id === 'string' && /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(id);
    if (!categories.has(product.category) || (id && !updating)) return res.status(400).json({error:'required'});

    const gallery = photos ?? (typeof photo === 'string' && photo.startsWith('data:') ? [photo] : null);
    if (gallery !== null) {
      if (!Array.isArray(gallery) || gallery.length < 1 || gallery.length > 5) {
        return res.status(400).json({error:'badPhoto'});
      }
      const prefix = url + '/storage/v1/object/public/product-photos/';
      const entries = gallery.map(source => {
        if (typeof source !== 'string') return null;
        if (updating && source.startsWith(prefix)) {
          const path = source.slice(prefix.length);
          return /^[a-z0-9-]+[.](jpg|png|webp)$/i.test(path) ? {path} : null;
        }
        const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(source);
        if (!match) return null;
        const bytes = Buffer.from(match[2], 'base64');
        if (!bytes.length || bytes.length > 2097152) return null;
        return {path:randomUUID() + '.' + photoTypes.get(match[1]), type:match[1], bytes};
      });
      if (entries.some(entry => !entry)) return res.status(400).json({error:'badPhoto'});
      if (entries.reduce((sum, entry) => sum + (entry.bytes?.length ?? 0), 0) > 3000000) {
        return res.status(400).json({error:'badPhoto'});
      }
      for (const entry of entries) {
        if (!entry.bytes) continue;
        const upload = await request('/storage/v1/object/product-photos/' + entry.path, {
          method:'POST', headers:{'Content-Type':'image/' + entry.type}, body:entry.bytes
        });
        if (!upload.ok) return res.status(502).json({error:'storage'});
      }
      product.photo = entries.map(entry => entry.path).join(',');
    } else if (!updating) return res.status(400).json({error:'badPhoto'});

    const saved = await request('/rest/v1/products' + (updating ? '?id=eq.' + id : ''), {
      method:updating ? 'PATCH' : 'POST',
      headers:{'Content-Type':'application/json',Prefer:'return=representation'},
      body:JSON.stringify(product)
    });
    if (saved.status === 409) return res.status(409).json({error:'duplicate'});
    if (!saved.ok) return res.status(saved.status === 400 ? 400 : 502)
      .json({error:saved.status === 400 ? 'required' : 'storage'});
    const [row] = await saved.json();
    if (!row) return res.status(404).json({error:'gone'});
    return res.json({id:row.id});
  } catch {
    return res.status(502).json({error:'backend'});
  }
}
