const categories = {
  rings: ['Uzuklar', 'Кольца'],
  earrings: ['Sirg‘alar', 'Серьги'],
  bracelets: ['Bilaguzuklar', 'Браслеты'],
  necklaces: ['Marjon va kulonlar', 'Колье и подвески'],
  sets: ['To‘plamlar', 'Комплекты']
};
const categoryArt = ['ring', 'earrings', 'bracelet', 'necklace', 'set'];
const sampleIds = new Set(['1','2','3','4','5','6']);

function readLocal(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
const retentionMs = 72 * 60 * 60 * 1000;
const localCatalog = {
  all() {
    const stored = readLocal('zarrin-catalog-v1', []);
    const retained = stored.filter(product => !product.deleted_at || Date.parse(product.deleted_at) + retentionMs > Date.now());
    if (retained.length !== stored.length) {
      try { localStorage.setItem('zarrin-catalog-v1', JSON.stringify(retained)); } catch {}
    }
    return retained.filter(product =>
    !sampleIds.has(product.id) && !(product.sku === 'QA-001' && product.uz === 'Sinov uzugi')
  ); },
  async trash(id, restore = false) {
    const product = this.all().find(item => item.id === id);
    if (!product || (restore && !product.deleted_at)) return 'gone';
    if (!restore && product.deleted_at) return null;
    return this.save({...product, status:restore ? 'draft' : 'archived', deleted_at:restore ? null : new Date().toISOString()});
  },
  save(product) {
    const products = this.all();
    if (products.some(item => item.id !== product.id && item.sku.toUpperCase() === product.sku.toUpperCase())) {
      return 'duplicate';
    }
    const updated = products.some(item => item.id === product.id)
      ? products.map(item => item.id === product.id ? product : item)
      : [...products, product];
    try { localStorage.setItem('zarrin-catalog-v1', JSON.stringify(updated)); }
    catch { return 'storage'; }
    return null;
  }
};

const localMode = ['127.0.0.1', 'localhost', ''].includes(location.hostname);
let remoteProducts = [];
let catalogState = localMode ? 'ready' : 'loading';

async function catalogRequest(action, body) {
  const response = await fetch('/api/catalog?action=' + action, body === undefined ? {} : {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'backend');
  return data;
}

const catalog = localMode ? localCatalog : {
  all() { return remoteProducts; },
  async trash(id, restore = false) {
    try {
      await catalogRequest(restore ? 'restore' : 'trash', {id});
      remoteProducts = await catalogRequest('staff');
      return null;
    } catch (error) { return error.message; }
  },
  async save(product) {
    try {
      const saved = await catalogRequest('save', {...product, id:product.id === 'new' ? undefined : product.id});
      remoteProducts = await catalogRequest('staff');
      product.id = saved.id;
      return null;
    } catch (error) { return error.message; }
  }
};

// Uzbek Latin → Cyrillic: preserve the name rather than translate its meaning.
function nameToCyrillic(value) {
  const letters = {a:'а',b:'б',c:'ц',d:'д',e:'е',f:'ф',g:'г',h:'ҳ',i:'и',j:'ж',k:'к',l:'л',m:'м',n:'н',o:'о',p:'п',q:'қ',r:'р',s:'с',t:'т',u:'у',v:'в',w:'в',x:'х',y:'й',z:'з',sh:'ш',ch:'ч',yo:'ё',yu:'ю',ya:'я',ye:'е'};
  return value.replace(/o['‘’ʻʼ`ʹ]|g['‘’ʻʼ`ʹ]|sh|ch|yo|yu|ya|ye|[a-z]|['‘’ʻʼ`ʹ]/gi, (part, offset) => {
    const lower = part.toLowerCase();
    let result = lower.length === 2 && /['‘’ʻʼ`ʹ]/.test(lower[1])
      ? (lower[0] === 'o' ? 'ў' : 'ғ') : letters[lower] ?? 'ъ';
    if (lower === 'e' && (offset === 0 || !/[a-zа-яёўқғҳ]/i.test(value[offset-1]))) result = 'э';
    return part[0] !== part[0].toLowerCase() ? result.toUpperCase() : result;
  });
}

function formatPriceInput(value) {
  const digits = String(value ?? '').replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function contactNameValid(value) {
  return /^[\p{L}\p{M}]+(?:[ '‘’ʻʼ`-][\p{L}\p{M}]+)*$/u.test(value.trim()) && value.trim().length <= 60;
}
function phoneNationalDigits(value) {
  let digits = String(value ?? '').replace(/[^0-9]/g, '');
  if (digits.length > 9 && digits.startsWith('998')) digits = digits.slice(3);
  return digits.slice(0,9);
}
function formatContactPhone(value) {
  const d = phoneNationalDigits(value);
  if (!d) return '';
  return '(' + d.slice(0,2) + (d.length >= 2 ? ') ' : '') + d.slice(2,5) +
    (d.length > 5 ? '-' + d.slice(5,7) : '') + (d.length > 7 ? '-' + d.slice(7,9) : '');
}
