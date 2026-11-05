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
const localCatalog = {
  all() { return readLocal('zarrin-catalog-v1', []).filter(product =>
    !sampleIds.has(product.id) && !(product.sku === 'QA-001' && product.uz === 'Sinov uzugi')
  ); },
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
  async save(product) {
    try {
      const saved = await catalogRequest('save', {...product, id:product.id === 'new' ? undefined : product.id});
      remoteProducts = await catalogRequest('staff');
      product.id = saved.id;
      return null;
    } catch (error) { return error.message; }
  }
};
