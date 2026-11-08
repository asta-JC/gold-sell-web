const isAdmin = location.pathname.endsWith('/admin.html');
const telegramContact = 'https://t.me/asta_cc';
const storefront = isAdmin ? 'index.html' : '';
const copy = {
  ...chatCopy,
  loading:['Yuklanmoqda…','Загрузка…'],
  backend:['Katalogni yuklab bo‘lmadi. Sahifani yangilang.','Не удалось загрузить каталог. Обновите страницу.'],
  login:['Kirish','Войти'],
  loginError:['Login yoki parol xato.','Неверный логин или пароль.'],
  username:['Login','Логин'],
  password:['Parol','Пароль'],
  logout:['Chiqish','Выйти'],
  skip:['Asosiy mazmunga o‘tish','Перейти к содержанию'], shop:['Katalog','Каталог'],
  cart:['Savat','Корзина'], search:['Qidiruv','Поиск'], admin:['Boshqaruv paneli','Панель управления'],
  label:['OLTIN TAQINCHOQLAR','ЗОЛОТЫЕ УКРАШЕНИЯ'],
  headline:['Siz eng yaxshisiga loyiqsiz','Вы достойны лучшего'],
  intro:['Har kun va alohida lahzalar uchun oltin taqinchoqlar. O‘zingizga mosini toping.','Золотые украшения для каждого дня и особых моментов. Найдите своё.'],
  heroAlt:['Tosh ustidagi oltin uzuk va sirg‘alar','Золотые кольцо и серьги на камне'],
  explore:['Katalogni ko‘rish','Смотреть каталог'],
  assay:['Oltin probasi va vazni','Проба и вес золота'], pickup:['Bron qilish va olib ketish','Бронирование и самовывоз'],
  contact:['Aloqa va maslahat','Контакты и консультация'], collect:['Kolleksiyalar','Коллекции'],
  choose:['Turini tanlang','Выберите категорию'], featured:['Tanlangan taqinchoqlar','Избранные украшения'],
  all:['Barchasi','Все'], info:['Xaridor uchun ma’lumot','Информация для покупателей'],
  photoDisclosure:['Mahsulot rasmlari haqida','О фотографиях изделий'],
  photoDisclosureText:['Mahsulot rasmlari sun’iy intellekt (AI) yordamida tahrirlangan. Shu sababli rang, yorug‘lik va ayrim detallar mahsulotning haqiqiy ko‘rinishidan farq qilishi mumkin. Xarid qilishdan oldin asl surat yoki videoni so‘rab, mahsulot tafsilotlarini do‘kon bilan aniqlashtiring.','Фотографии изделий обработаны с помощью искусственного интеллекта (ИИ). Цвет, освещение и отдельные детали могут отличаться от реального изделия. Перед покупкой запросите оригинальное фото или видео и уточните детали у магазина.'],
  assayText:['Oltin probasi va vaznini mahsulot sahifasidan ko‘ring.','Проба и вес указаны на странице изделия.'],
  pickupText:['Katalogda narxlarni ko‘ring. Tanlagan taqinchog‘ingizni bron qilib, do‘kondan olib ketasiz.','Посмотрите цены в каталоге. Выбранное украшение можно забронировать и забрать в магазине.'],
  contactText:['Savollaringiz bo‘lsa, Telegram orqali yozing.','Если у вас есть вопросы, напишите нам в Telegram.'],
  home:['Bosh sahifa','Главная'], category:['Turkum','Категория'],
  maxPrice:['Narx chegarasi','Предел цены'], noLimit:['Cheklanmagan','Без ограничений'], customPrice:['Boshqa summa','Другая сумма'], maxSum:['Eng yuqori narx (so‘m)','Цена до (сум)'], pricePrefix:['gacha','до'], purity:['Oltin probasi','Проба золота'], apply:['Qo‘llash','Применить'],
  reset:['Tozalash','Сбросить'], found:['Topilgan mahsulotlar','Найдено изделий'],
  none:['Mos taqinchoq topilmadi.','Подходящих украшений не найдено.'],
  gone:['Bu taqinchoq hozir katalogda yo‘q.','Этого украшения сейчас нет в каталоге.'],
  weight:['Vazni','Вес'], size:['O‘lchami','Размер'], stock:['Mavjudligi','Наличие'],
  available:['Mavjud','В наличии'], unavailable:['Mavjud emas','Нет в наличии'],
  checkout:['Rasmiylashtirish','Оформить бронь'], continueShopping:['Xaridni davom ettirish','Продолжить покупки'],
  add:['Savatga qo‘shish','В корзину'], added:['Savatga qo‘shildi','Добавлено в корзину'], inCart:['Savatingizda','В вашей корзине'], pieces:['ta','шт.'],
  emptyCart:['Savatingiz bo‘sh.','Ваша корзина пуста.'], total:['Jami','Итого'],
  remove:['Olib tashlash','Удалить'], less:['Miqdorni kamaytirish','Уменьшить количество'],
  more:['Miqdorni oshirish','Увеличить количество'], cartChanged:['Savat yangilandi','Корзина обновлена'],
  order:['Bron qilish','Бронирование'], orderNote:['Onlayn bron qilish hozircha ochilmagan.','Онлайн-бронирование пока недоступно.'],
  back:['Ortga','Назад'], edit:['Tahrirlash','Редактировать'], new:['Yangi taqinchoq','Новое украшение'],
  adminNote:['Mahalliy boshqaruv. O‘zgarishlar shu brauzerda saqlanadi.','Локальное управление. Изменения сохраняются в этом браузере.'],
  products:['Mahsulotlar','Изделия'], status:['Holati','Статус'], draft:['Qoralama','Черновик'],
  published:['Katalogda','В каталоге'], archived:['Arxivda','В архиве'],
  pickupDetail:['Do‘kondan olib ketish','Самовывоз из магазина'], pickupHint:['Olib ketish vaqtini bron chatida kelishamiz.','Время самовывоза согласуем в чате брони.'],
  related:['Sizga yoqishi mumkin','Вам также может понравиться'],
  customPurity:['Boshqa — o‘zim kiritaman','Другая — ввести вручную'], purityValue:['Proba qiymati','Значение пробы'],
  autoName:['Avto','Авто'], autoNameHint:['O‘zbekcha nomni kirillga o‘girish','Перевести узбекское название в кириллицу'],
  uzName:['Nomi · O‘zbekcha','Название · узбекский'], ruName:['Nomi · Русский','Название · русский'],
  uzDesc:['Tavsifi · O‘zbekcha (ixtiyoriy)','Описание · узбекский (необязательно)'], ruDesc:['Tavsifi · Русский (ixtiyoriy)','Описание · русский (необязательно)'],
  price:['Narx (so‘m)','Цена (сум)'], weightField:['Vazn (g)','Вес (г)'], photo:['Mahsulot rasmlari','Фото изделия'], removePhoto:['Rasmni olib tashlash','Удалить фото'], photoLimit:['5 tagacha rasm yuklang.','Загрузите до 5 фотографий.'],
  photoHint:['JPG, PNG yoki WebP. 5 tagacha rasm. Birinchi rasm katalogda ko‘rinadi.','JPG, PNG или WebP. До 5 фото. Первое фото отображается в каталоге.'],
  preview:['Oldindan ko‘rish','Предпросмотр'], close:['Yopish','Закрыть'], save:['Saqlash','Сохранить'],
  trash:['O‘chirish','Удалить'], restore:['Tiklash','Восстановить'],
  trashConfirm:['Mahsulot katalogdan yashiriladi va 3 kundan keyin butunlay o‘chadi. Davom etasizmi?','Изделие будет скрыто и удалено навсегда через 3 дня. Продолжить?'],
  trashed:['Mahsulot o‘chirildi. 3 kun ichida tiklash mumkin.','Изделие удалено. Восстановление доступно 3 дня.'],
  restored:['Mahsulot qoralama sifatida tiklandi.','Изделие восстановлено как черновик.'],
  trashDeadline:['Butunlay o‘chish vaqti','Будет удалено навсегда'],
  trashHelp:['3 kun ichida tiklashingiz mumkin.','Можно восстановить в течение 3 дней.'],
  archive:['Arxivlash','Архивировать'], saved:['Mahsulot saqlandi.','Изделие сохранено.'],
  required:['Majburiy maydonlarni to‘g‘ri to‘ldiring.','Заполните обязательные поля корректно.'],
  duplicate:['Bu SKU band. Boshqa kod kiriting.','Этот SKU уже занят. Укажите другой код.'],
  storage:['Saqlab bo‘lmadi. Brauzer xotirasini tekshiring.','Не удалось сохранить. Проверьте хранилище браузера.'],
  badPhoto:['JPG, PNG yoki WebP formatidagi rasmni tanlang.','Выберите фото в формате JPG, PNG или WebP.'],
  cartUnavailable:['Ayrim mahsulotlar endi mavjud emas va savatdan chiqarildi.','Некоторые изделия больше недоступны и удалены из корзины.']
};
const $ = selector => document.querySelector(selector);
let lang = readLocal('zarrin-language', 0) === 1 ? 1 : 0;
let basket = singleItemBasket(readLocal('zarrin-cart-v1', {}));
let adminEdit = null;
let saving = false;
let adminSearch = '';
let adminError = '';
let photoLoading = false;
let photoRevision = 0;
let noticeTimer;
const t = key => copy[key][lang];
const local = product => lang ? product.ru : product.uz;
const categoryName = key => categories[key]?.[lang] ?? t('all');
const number = value => lang
  ? new Intl.NumberFormat('ru-RU').format(value)
  : new Intl.NumberFormat('en', {maximumFractionDigits: 2}).format(value).replace(/,/g,'\u202f');
const money = value => number(value) + (lang ? ' сум' : ' so‘m');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
})[ch]);
const iconPaths = {
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  bag:'<path d="M5 8h14l2 13H3zM8 9V6a4 4 0 0 1 8 0v3"/>',
  arrow:'<path d="M3 12h17m-6-6 6 6-6 6"/>',
  weight:'<path d="M7 8h10l3 13H4L7 8Z"/><circle cx="12" cy="5" r="3"/>',
  ruler:'<path d="m3 16 13-13 5 5L8 21zM13 6l2 2m-5 1 2 2m-5 1 2 2m-5 1 2 2"/>',
  tag:'<path d="M3 3h8l10 10-8 8L3 11z"/><circle cx="7.5" cy="7.5" r="1"/>',
  gem:'<path d="m12 2 9 9-9 11-9-11zM3 11h18m-9-9-4 9 4 11 4-11z"/>',
  box:'<path d="M4 7l8-4 8 4v11l-8 4-8-4zm0 0 8 4 8-4m-8 4v11"/>',
  send:'<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
  bell:'<path d="M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10m-9 13a3 3 0 0 0 6 0"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
  help:'<path d="M4 4h16v12H9l-5 4z"/><path d="M8 9h8m-8 3h5"/>'
};
const icon = key => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + iconPaths[key] + '</svg>';
const shopLink = category => '#catalog' + (category ? '?category=' + category : '');
const productLink = product => '#product/' + encodeURIComponent(product.id);
const btn = (label, href, secondary = false) => '<a class="button' + (secondary ? ' secondary' : '') + '" href="' + href + '">' + t(label) + (secondary ? '' : icon('arrow')) + '</a>';
const published = () => catalog.all().filter(product => product.status === 'published');
const cartItems = () => published().filter(product => product.available && basket[product.id] > 0);
const cartTotal = items => items.reduce((sum, product) => sum + product.price * basket[product.id], 0);
const route = () => {
  const [path, query] = location.hash.slice(1).split('?');
  return {path, params: new URLSearchParams(query)};
};
function inform(key, detail = '') {
  const notice = $('#notice');
  notice.dataset.tone = ['storage', 'backend', 'gone', 'login'].includes(key) ? 'error'
    : ['cartUnavailable', 'alertsUnavailable'].includes(key) ? 'warning'
    : ['trashed', 'restored', 'added', 'cartChanged', 'saved', 'chatDeleted', 'alertsEnabled'].includes(key) ? 'success' : 'info';
  notice.textContent = detail || t(key);
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => { $('#notice').textContent = ''; }, 2800);
}
function setCart(product, amount) {
  const previous = basket;
  basket = {...basket};
  if (amount > 0) basket[product.id] = 1;
  else delete basket[product.id];
  try { localStorage.setItem('zarrin-cart-v1', JSON.stringify(basket)); }
  catch { basket = previous; inform('storage'); return false; }
  return true;
}
// Keep existing elements mounted when only the locale changes.
function updateMarkup(target, markup, preserveChat = false) {
  const template = document.createElement('template');
  template.innerHTML = markup;

  function syncChildren(current, next) {
    const desired = [...next.childNodes];
    desired.forEach((fresh, index) => {
      const existing = current.childNodes[index];
      if (!existing) {
        current.append(fresh.cloneNode(true));
        return;
      }
      if (existing.nodeType !== fresh.nodeType || existing.nodeName !== fresh.nodeName) {
        existing.replaceWith(fresh.cloneNode(true));
        return;
      }
      if (existing.nodeType !== Node.ELEMENT_NODE) {
        if (existing.nodeValue !== fresh.nodeValue) existing.nodeValue = fresh.nodeValue;
        return;
      }
      if (preserveChat && existing.id === fresh.id && ['chat-inbox','chat-thread'].includes(existing.id)) return;
      for (const name of existing.getAttributeNames()) {
        if (!fresh.hasAttribute(name)) existing.removeAttribute(name);
      }
      for (const {name,value} of fresh.attributes) {
        if (existing.getAttribute(name) !== value) existing.setAttribute(name,value);
      }
      syncChildren(existing, fresh);
    });
    while (current.childNodes.length > desired.length) current.lastChild.remove();
  }

  syncChildren(target, template.content);
}

let headerLanguage;
function header(preserve = false) {
  const count = cartItems().reduce((sum, product) => sum + basket[product.id], 0);
  if (headerLanguage === lang) {
    const cartLink = $('#header-cart');
    if (cartLink) {
      cartLink.setAttribute('aria-label', t('cart') + ' · ' + count);
      cartLink.querySelector('.count').textContent = count;
    }
    return;
  }
  headerLanguage = lang;
  const headerMarkup = `
    <div class="masthead wrap">
      <div class="languages" aria-label="${lang ? 'Язык' : 'Til'}">
        <button type="button" data-language="0" lang="uz" aria-pressed="${!lang}">O‘zbekcha</button>
        <button type="button" data-language="1" lang="ru" aria-pressed="${!!lang}">Русский</button>
      </div>
      <a class="wordmark" href="${storefront}#home" aria-label="M Gold · ${t('home')}"><img src="assets/mark.svg?v=facet" alt="">M GOLD</a>
      ${isAdmin ? '' : `<div class="header-actions">
        <a class="icon-link" href="#catalog?focus=search" aria-label="${t('search')}">${icon('search')}</a>
        <a class="icon-link header-chat" href="#chat" aria-label="${t('chat')}" title="${t('chat')}">${icon('help')}<span>${t('chatShort')}</span><span id="visitor-chat-badge" class="unread-badge" aria-live="polite" aria-label="${t('unreadChat')}" ${visitorUnreadChats.size ? '' : 'hidden'}>${visitorUnreadChats.size}</span></a>
        <a id="header-cart" class="icon-link" href="#cart" aria-label="${t('cart')} · ${count}">${icon('bag')}<span class="count" aria-hidden="true">${count}</span></a>
      </div>`}
    </div>
    ${isAdmin ? '' : `<div class="nav-shell"><nav class="nav wrap" aria-label="${t('shop')}">
      <a href="#catalog">${t('shop')}</a>
      ${Object.keys(categories).map(key => `<a href="${shopLink(key)}">${categoryName(key)}</a>`).join('')}
    </nav></div>`}`;
  const footerMarkup = `<div class="footer"><div class="wrap footer-inner"><div><a class="wordmark" href="${storefront}#home"><img src="assets/mark.svg?v=facet" alt="">M GOLD</a></div><a href="${telegramContact}">${t('contact')}</a></div></div>`;
  if (preserve) {
    updateMarkup($('#header'), headerMarkup);
    updateMarkup($('#footer'), footerMarkup);
  } else {
    $('#header').innerHTML = headerMarkup;
    $('#footer').innerHTML = footerMarkup;
  }
  $('#skip').textContent = t('skip');
  document.documentElement.lang = lang ? 'ru' : 'uz';
  document.title = 'M Gold — ' + (isAdmin ? t('admin') : lang ? 'Золотые украшения' : 'Oltin taqinchoqlar');
}
function card(product) {
  return `<a class="card" href="${productLink(product)}">
    <div class="card-visual"><img loading="lazy" src="${escapeHtml(product.photo)}" alt="">
      <span class="card-purity" aria-label="${t('purity')} ${escapeHtml(product.purity)}">${icon('gem')}${escapeHtml(product.purity)}</span></div>
    <div class="card-copy"><div class="card-meta"><small>${categoryName(product.category)}</small><span class="card-stock ${product.available ? 'is-available' : ''}">${t(product.available ? 'available' : 'unavailable')}</span></div>
      <h3>${escapeHtml(local(product))}</h3><div class="card-bottom"><span class="price">${money(product.price)}</span><span class="card-open" aria-hidden="true">${icon('arrow')}</span></div>
    </div></a>`;
}
function infoContent() {
  return `<div class="info-grid">${[['assay','assayText'],['pickup','pickupText'],['contact','contactText'],['photoDisclosure','photoDisclosureText']].map(([title, body]) =>
    `<article><h3>${t(title)}</h3><p>${t(body)}</p>${title === 'contact' ? `<a class="text-action" href="${telegramContact}">Telegram · @asta_cc ↗</a>` : ''}</article>`).join('')}</div>`;
}
function home() {
  const featured = published().slice(0, 3);
  return `<div class="wrap">
    <section class="hero"><div class="hero-copy"><span class="eyebrow">${t('label')}</span>
      <h1>${t('headline')}</h1><p>${t('intro')}</p>${btn('explore','#catalog')}</div>
      <div class="hero-visual"><img src="assets/hero.jpg" alt="${t('heroAlt')}"></div>
    </section>
    <div class="details-strip">
      <a href="${storefront}#info">${icon('gem')}${t('assay')}</a><a href="${storefront}#info">${icon('box')}${t('pickup')}</a><a href="${telegramContact}">${icon('help')}${t('contact')}</a>
    </div>
    <section class="section"><div class="section-title"><div><span class="eyebrow">${t('collect')}</span><h2>${t('choose')}</h2></div><a class="text-action" href="#catalog">${t('explore')} &nbsp; →</a></div>
      <div class="category-grid">${Object.keys(categories).map((key,i) => `<a class="category-card" href="${shopLink(key)}"><img loading="lazy" alt="" src="assets/${categoryArt[i]}.jpg"><span>${categoryName(key)} &nbsp; →</span></a>`).join('')}</div>
    </section>
    ${featured.length ? `<section class="section"><div class="section-title"><h2>${t('featured')}</h2></div><div class="product-grid">${featured.map(card).join('')}</div></section>` : ''}
    <section class="section"><div class="section-title"><h2>${t('info')}</h2></div>${infoContent()}</section>
  </div>`;
}
function page(title, content, back = storefront + '#home', backText = 'home') {
  return `<div class="page wrap"><a class="breadcrumb" href="${back}">← &nbsp; ${t(backText)}</a><h1>${title}</h1>${content}</div>`;
}
function field(label, control, full = false) {
  return `<label class="field${full ? ' span' : ''}"><span>${t(label)}</span>${control}</label>`;
}
function option(value, label, selected) {
  return `<option value="${escapeHtml(value)}"${value === selected ? ' selected' : ''}>${escapeHtml(label)}</option>`;
}
function categoryOptions(selected, includeAll) {
  return (includeAll ? option('',t('all'),selected) : '') +
    Object.keys(categories).map(key => option(key, categoryName(key), selected)).join('');
}
function normalize(value) {
  return value.toLowerCase().replace(/[‘’ʻʼ`']/g,'').trim();
}
function matches(product, query) {
  return normalize([product.uz, product.ru, product.sku, ...categories[product.category]].join(' ')).includes(normalize(query));
}
const priceLimits = ['1000000', '3000000', '5000000', '10000000', '20000000'];

function priceLimit(value) {
  const digits = value.replace(/[\s\u202f]/g, '');
  return /^\d{1,9}$/.test(digits) && Number(digits) > 0 ? String(Number(digits)) : '';
}

function updatePriceInput(form) {
  const custom = form.elements.pricePreset.value === 'custom';
  form.querySelector('#custom-price').hidden = !custom;
  form.elements.max.disabled = !custom;
}

function shop(params) {
  const query = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const purity = params.get('purity') ?? '';
  const max = priceLimit(params.get('max') ?? '');
  const preset = max && !priceLimits.includes(max) ? 'custom' : max;
  const results = published().filter(p => (!category || category === p.category) &&
    (!purity || purity === p.purity) && (!max || p.price <= Number(max)) && matches(p,query));
  const purityOptions = [...new Set([...commonPurities, ...published().map(p => p.purity)])].sort((a,b) => Number(a) - Number(b));
  return page(category && categories[category] ? categoryName(category) : t('shop'), `
    <form id="filters" class="filters" aria-label="${t('shop')}">
      ${field('search',`<input id="catalog-search" name="q" type="search" value="${escapeHtml(query)}">`)}
      ${field('category',`<select name="category">${categoryOptions(category,true)}</select>`)}
      ${field('purity',`<select name="purity">${option('',t('all'),purity)}${purityOptions.map(p => option(p,p,purity)).join('')}</select>`)}
      ${field('maxPrice',`<select name="pricePreset">${option('',t('noLimit'),preset)}
        ${priceLimits.map(limit => option(limit, lang ? t('pricePrefix') + ' ' + money(Number(limit)) : money(Number(limit)) + ' ' + t('pricePrefix'), preset)).join('')}
        ${option('custom',t('customPrice'),preset)}</select>`)}
      <button class="button">${t('apply')}</button>
      <div id="custom-price" ${preset === 'custom' ? '' : 'hidden'}>
        ${field('maxSum',`<input name="max" type="text" inputmode="numeric" pattern="[0-9\\s]{0,15}" maxlength="15" placeholder="2 500 000" value="${preset === 'custom' ? max : ''}" ${preset === 'custom' ? '' : 'disabled'}>`)}
      </div>
    </form><div class="actions"><p class="result-count muted">${t('found')} · ${results.length}</p>
    ${query || category || purity || max ? `<a class="text-action" href="#catalog">${t('reset')}</a>` : ''}</div>
    ${results.length ? `<div class="product-grid">${results.map(card).join('')}</div>` : `<div class="empty">${t('none')}</div>`}`);
}
function sizeText(size) {
  if (!size) return '—';
  return lang ? size.replace(/\bmm\b/g,'мм').replace(/\bcm\b/g,'см') : size;
}
const productPhotos = product => product.photos ?? (product.photo ? [product.photo] : []);

function purchaseControls(product) {
  const id = escapeHtml(product.id);
  if (!product.available || !basket[product.id]) {
    return `<button type="button" class="button" data-add="${id}" ${product.available ? '' : 'disabled'}>${icon('bag')}${t('add')}</button>`;
  }
  return `<div class="purchase-next"><span class="cart-added">${icon('bag')}${t('inCart')}</span><div class="actions">
    ${localMode ? btn('cart','#cart',true) : `<button type="button" class="button" id="start-chat">${t('checkout')}${icon('arrow')}</button>`}
    ${btn('continueShopping','#catalog',true)}</div></div>`;
}

function relatedProducts(product) {
  return published().filter(item => item.id !== product.id && item.category === product.category).reverse().slice(0,3);
}
function detail(product, preview = false) {
  const photos = productPhotos(product);
  const specs = [['purity',product.purity,'gem'],['weight',number(product.weight) + (lang ? ' г' : ' g'),'weight'],
    ['size',sizeText(product.size),'ruler'],['stock',t(product.available ? 'available' : 'unavailable'),'box'],['SKU',product.sku,'tag']];
  const description = lang ? product.descRu : product.descUz;
  return `<article class="product-detail">
    <div class="product-gallery"><img class="gallery-main" src="${escapeHtml(photos[0])}" alt="${escapeHtml(local(product))}">
      ${photos.length > 1 ? `<div class="photo-list">${photos.map((photo,index) =>
        `<button type="button" data-gallery-photo="${escapeHtml(photo)}" aria-label="${t('photo')} ${index+1}" aria-pressed="${index === 0}"><img src="${escapeHtml(photo)}" alt=""></button>`).join('')}</div>` : ''}</div>
    <div class="product-info"><span class="eyebrow">${categoryName(product.category)}</span><${preview ? 'h2' : 'h1'}>${escapeHtml(local(product))}</${preview ? 'h2' : 'h1'}>
      <div class="product-price"><span class="muted">${t('price')}</span><p class="price">${money(product.price)}</p></div>${description ? `<p class="product-description">${escapeHtml(description)}</p>` : ''}
      <dl class="specs product-specs">${specs.map(([label,value,symbol]) => `<div><dt><span class="spec-icon">${icon(symbol)}</span>${copy[label] ? t(label) : label}</dt><dd>${label === 'stock' ? `<span class="detail-stock ${product.available ? 'is-available' : ''}">${escapeHtml(value)}</span>` : escapeHtml(value)}</dd></div>`).join('')}</dl>
      ${preview ? '' : `<div id="product-purchase">${purchaseControls(product)}</div><div class="product-pickup">${icon('box')}<div><strong>${t('pickupDetail')}</strong><p>${t('pickupHint')}</p></div></div>`}
    </div></article>${preview ? '' : relatedSection(product)}`;
}
function relatedSection(product) {
  const related = relatedProducts(product);
  if (!related.length) return '';
  return `<section class="section" aria-labelledby="related-title"><div class="section-title"><div><span class="eyebrow">${categoryName(product.category)}</span><h2 id="related-title">${t('related')}</h2></div>${btn('all','#catalog?category=' + encodeURIComponent(product.category),true)}</div><div class="product-grid">${related.map(card).join('')}</div></section>`;
}
function cartPage() {
  const items = cartItems();
  const existingChat = visitorThread && !localMode ? `<a class="button secondary" href="#chat">${icon('help')}${t('openChat')}</a>` : '';
  if (!items.length) return page(t('cart'),`<div class="empty"><p>${t('emptyCart')}</p><div class="actions cart-empty-actions">${btn('explore','#catalog')}${existingChat}</div></div>`);
  return page(t('cart'), `
    <div class="cart-layout"><section class="panel">
      ${items.map(product => `<div class="cart-row"><img src="${escapeHtml(product.photo)}" alt="">
        <div class="grow"><a href="${productLink(product)}"><strong>${escapeHtml(local(product))}</strong></a><br><small>${money(product.price)}</small></div>
        <button class="text-action" data-remove="${product.id}" aria-label="${t('remove')} · ${escapeHtml(local(product))}">${icon('trash')}${t('remove')}</button></div>`).join('')}
      <div class="cart-continue">${btn('continueShopping','#catalog',true)}</div>
    </section><section class="panel stack"><h2>${t('order')}</h2><strong>${t('total')} · ${money(cartTotal(items))}</strong><p class="muted">${t(localMode ? 'orderNote' : 'chatHelp')}</p>
    ${localMode ? '' : `<button class="button" id="start-chat">${t('checkout')}${icon('arrow')}</button>${existingChat}`}
    </section></div>`, '#catalog','shop');
}
function adminPage(id) {
  if (id && (!adminEdit || adminEdit.id !== id)) {
    const product = catalog.all().find(item => item.id === id);
    adminEdit = product ? {...product} : {id, category:'rings', purity:'585', available:true, status:'draft'};
    adminError = '';
    photoRevision++;
    photoLoading = false;
  }
  const editor = id ? editorForm(adminEdit) : '';
  return page(t('admin'), `${localMode ? `<p class="muted">${t('adminNote')}</p>` : `<button class="text-action" id="admin-logout">${t('logout')}</button> <a class="button secondary" href="#admin/chat">${t('chat')} <span id="admin-chat-badge" class="unread-badge" aria-live="polite" aria-label="${t('unreadChat')}" ${unreadChats.size ? '' : 'hidden'}>${unreadChats.size}</span></a>`}
    <div class="admin-layout"><section class="panel stack"><h2>${t('products')}</h2>${btn('new','#admin/new')}
    ${field('search',`<input id="admin-search" type="search" value="${escapeHtml(adminSearch)}">`)}
    <div id="admin-list">${adminList()}</div></section>${editor}</div>`);
}
function adminList() {
  const results = catalog.all().filter(product => matches(product,adminSearch) && (!product.deleted_at || Date.parse(product.deleted_at) + retentionMs > Date.now()));
  return results.map(product => {
    const editLink = '#admin/' + encodeURIComponent(product.id);
    return `<div class="admin-row"><a class="admin-product-link grow" href="${editLink}">
      ${product.photo ? `<img class="admin-product-thumb" loading="lazy" src="${escapeHtml(product.photo)}" alt="">` : ''}
      <span><strong>${escapeHtml(local(product))}</strong>
      <small>${escapeHtml(product.sku)} · ${t(product.status)}</small></span></a>
      ${product.deleted_at ? `<small>${t('trashDeadline')}: ${escapeHtml(new Date(Date.parse(product.deleted_at) + retentionMs).toLocaleString(lang ? 'ru-RU' : 'uz-UZ'))}</small><button class="button secondary" data-restore-product="${product.id}">${t('restore')}</button>` : `${btn('edit',editLink,true)}<button class="text-action error" data-trash-product="${product.id}">${t('trash')}</button>`}</div>`;
  }).join('') || `<p>${t('none')}</p>`;
}
const commonPurities = ['375','500','583','585','750','916','958','999'];
function editorForm(p) {
  if (p.deleted_at) return `<section class="panel stack"><h2>${escapeHtml(local(p))}</h2><p>${t('trashHelp')}</p><p>${t('trashDeadline')}: ${escapeHtml(new Date(Date.parse(p.deleted_at) + retentionMs).toLocaleString(lang ? 'ru-RU' : 'uz-UZ'))}</p><button class="button secondary" data-restore-product="${p.id}">${t('restore')}</button></section>`;
  const input = (name, attrs = '') => `<input name="${name}" value="${escapeHtml(p[name])}" ${attrs}>`;
  const purityPreset = p.purityPreset === 'custom' ? 'custom' : commonPurities.includes(String(p.purity)) ? String(p.purity) : 'custom';
  const desc = name => `<textarea name="${name}" maxlength="1500">${escapeHtml(p[name])}</textarea>`;
  return `<section class="panel"><h2>${t(p.id === 'new' ? 'new' : 'edit')}</h2>
    <form id="product-form" class="form-grid" novalidate>
      <label class="field"><span>SKU</span>${input('sku','required maxlength="40"')}</label>
      ${field('category',`<select name="category">${categoryOptions(p.category,false)}</select>`)}
      ${field('uzName',input('uz','required maxlength="100"'),true)}
      <div class="field span"><div class="field-heading"><label for="product-ru-name">${t('ruName')}</label><button class="auto-name" type="button" id="auto-name" title="${t('autoNameHint')}" aria-label="${t('autoNameHint')}">${t('autoName')}</button></div>${input('ru','id="product-ru-name" required maxlength="100"')}</div>
      ${field('uzDesc',desc('descUz'),true)}
      ${field('ruDesc',desc('descRu'),true)}
      ${field('price',`<input name="price" type="text" inputmode="numeric" required pattern="[1-9][0-9]{0,2}(,[0-9]{3}){0,2}" value="${formatPriceInput(p.price)}" placeholder="7,534,232">`)}
      <div class="stack">${field('purity',`<select name="purityPreset">${commonPurities.map(value => option(value,value,purityPreset)).join('')}${option('custom',t('customPurity'),purityPreset)}</select>`)}
      <div id="custom-purity" ${purityPreset === 'custom' ? '' : 'hidden'}>${field('purityValue',input('purity',`type="number" inputmode="numeric" required min="1" max="999" step="1" ${purityPreset === 'custom' ? '' : 'disabled'}`))}</div></div>
      ${field('weightField',input('weight','type="number" required min="0.01" step="0.01" max="9999"'))}
      ${field('size',input('size','maxlength="40" placeholder="17 mm"'))}
      ${field('stock',`<select name="available">${option('true',t('available'),String(p.available))}${option('false',t('unavailable'),String(p.available))}</select>`)}
      ${field('status',`<select name="status">${['draft','published','archived'].map(s => option(s,t(s),p.status)).join('')}</select>`)}
      ${field('photo','<input id="photo-input" type="file" multiple accept="image/jpeg,image/png,image/webp" aria-describedby="photo-hint">',true)}
      <small id="photo-hint" class="span">${t('photoHint')}</small>
      <div id="photo-thumb" class="span">${photoThumb(p)}</div>
      <p class="error span" role="alert" id="admin-error">${adminError ? t(adminError) : ''}</p>
      <div class="actions span"><button class="button" data-photo-action ${photoLoading ? 'disabled' : ''}>${t('save')}</button>
      <button class="button secondary" type="button" id="preview-product" data-photo-action ${photoLoading ? 'disabled' : ''}>${t('preview')}</button>
      ${p.id !== 'new' ? `<button class="text-action error" type="button" data-trash-product="${p.id}" data-photo-action ${photoLoading ? 'disabled' : ''}>${t('trash')}</button>` : ''}
      ${p.id !== 'new' && catalog.all().some(item => item.id === p.id && item.status !== 'archived') ? `<button class="text-action" type="button" id="archive-product" data-photo-action ${photoLoading ? 'disabled' : ''}>${t('archive')}</button>` : ''}</div>
    </form><dialog id="preview-dialog" class="preview-dialog" aria-label="${t('preview')}"></dialog></section>`;
}
function photoThumb(product) {
  return `<div class="photo-list">${productPhotos(product).map((photo,index) => `<div>
    <img class="upload-thumb" src="${escapeHtml(photo)}" alt="${t('photo')} ${index+1}">
    <button type="button" class="text-action" data-remove-photo="${index}" aria-label="${t('removePhoto')} ${index+1}">×</button>
  </div>`).join('')}</div>`;
}

async function preparePhoto(file) {
  const source = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = source;
    await img.decode();
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 1400 / Math.max(img.width,img.height));
    canvas.width = Math.max(1,Math.round(img.width * scale));
    canvas.height = Math.max(1,Math.round(img.height * scale));
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0,0,canvas.width,canvas.height);
    context.drawImage(img,0,0,canvas.width,canvas.height);
    for (const quality of [0.86,0.72,0.56,0.40]) {
      const encoded = canvas.toDataURL('image/jpeg',quality);
      if (encoded.length < 700000) return encoded;
    }
    throw new Error('Photo too large');
  } finally { URL.revokeObjectURL(source); }
}
function syncEditor(form) {
  const values = Object.fromEntries(new FormData(form));
  values.price = values.price.replace(/,/g, '');
  values.purity = values.purityPreset === 'custom' ? form.elements.purity.value : values.purityPreset;
  adminEdit = {...adminEdit, ...values, available:values.available === 'true'};
}
function adminMessage(key) {
  adminError = key;
  const target = $('#admin-error');
  if (target) target.textContent = key ? t(key) : '';
}
async function editorAction(action) {
  if (saving) return;
  const form = $('#product-form');
  syncEditor(form);
  const product = {...adminEdit};
  for (const key of ['sku','uz','ru','descUz','descRu','size']) product[key] = product[key].trim();
  if (!form.checkValidity() || !product.photo || !['sku','uz','ru'].every(key => product[key])) {
    adminMessage('required');
    form.querySelector(':invalid')?.focus();
    return;
  }
  product.price = Number(product.price);
  product.weight = Number(product.weight);
  product.purity = String(Number(product.purity));
  adminMessage('');
  if (action === 'preview') {
    const dialog = $('#preview-dialog');
    dialog.innerHTML = `<form method="dialog"><button class="button secondary" autofocus>${t('close')}</button></form>${detail(product,true)}`;
    dialog.showModal();
    return;
  }
  if (action === 'archive') product.status = 'archived';
  if (localMode && product.id === 'new') product.id = Date.now().toString(36) + Math.random().toString(36).slice(2,9);
  saving = true;
  const controls = [...form.querySelectorAll('button')];
  controls.forEach(button => { button.disabled = true; });
  const error = await catalog.save(product);
  saving = false;
  controls.forEach(button => { button.disabled = false; });
  if (error) {
    if (error === 'login' && !localMode) { catalogState = 'login'; render(); }
    else adminMessage(copy[error] ? error : 'storage');
    return;
  }
  adminEdit = catalog.all().find(item => item.id === product.id) ?? product;
  if (route().path !== 'admin/' + product.id) location.hash = 'admin/' + product.id;
  else { render(); $('#product-form button')?.focus(); }
  inform('saved');
}
function render(preserve = false) {
  const {path, params} = route();
  header(preserve);
  let markup;
  if (isAdmin && catalogState === 'login') {
    markup = page(t('admin'), `<form id="login-form" class="panel stack">
      ${field('username','<input name="login" autocomplete="username" required>')}
      ${field('password','<input name="password" type="password" autocomplete="current-password" required>')}
      <p class="error" id="login-error" role="alert"></p><button class="button">${t('login')}</button>
    </form>`);
  } else if (catalogState !== 'ready') {
    markup = page(t(isAdmin ? 'admin' : 'shop'), `<p class="empty">${t(catalogState)}</p>`);
  } else if ((!localMode && isAdmin && path === 'admin/chat') || (!isAdmin && path === 'chat')) {
    markup = chatPage();
  } else if (isAdmin) {
    const id = path.split('/')[1];
    markup = adminPage(id === 'new' || catalog.all().some(item => item.id === id) ? id : null);
  } else if (path === 'catalog') markup = shop(params);
  else if (path.startsWith('product/')) {
    const p = published().find(item => productLink(item).slice(1) === path);
    markup = p ? `<div class="page wrap"><a class="breadcrumb" href="${shopLink(p.category)}">← &nbsp; ${categoryName(p.category)}</a>${detail(p)}</div>`
      : page(t('shop'),`<p class="empty">${t('gone')}</p>`);
  } else if (path === 'cart') markup = cartPage();
  else if (path === 'info') markup = page(t('info'),infoContent());
  else markup = home();
  if (preserve) updateMarkup($('#main'), markup, true);
  else $('#main').innerHTML = markup;
  if ($('#chat-thread')) refreshChat();
}
function pruneCart() {
  const ids = new Set(cartItems().map(product => product.id));
  let removed = false;
  for (const id of Object.keys(basket)) {
    if (!ids.has(id)) removed = setCart({id},0) || removed;
  }
  if (removed) inform('cartUnavailable');
}
addEventListener('hashchange', () => {
  if (catalogState === 'ready') pruneCart();
  render();
  if (route().params.get('focus') === 'search') $('#catalog-search')?.focus();
  else {
    window.scrollTo(0,0);
    $('#main').focus({preventScroll:true});
  }
});
document.addEventListener('input', event => {
  const input = event.target;
  if (input.name === 'price' && input.closest('#product-form')) {
    const raw = input.value;
    const caret = input.selectionStart ?? raw.length;
    const digitsBefore = raw.slice(0, caret).replace(/[^0-9]/g, '').length;
    input.value = formatPriceInput(raw);
    let position = 0, digits = 0;
    while (position < input.value.length && digits < digitsBefore) {
      if (/[0-9]/.test(input.value[position])) digits++;
      position++;
    }
    input.setSelectionRange(position, position);
  }
  if (input.id === 'admin-search') { adminSearch = input.value; $('#admin-list').innerHTML = adminList(); }
  if (input.closest('#product-form') && input.id !== 'photo-input') syncEditor(input.form);

});
document.addEventListener('change', async event => {
  if (event.target.name === 'purityPreset') {
    const form = event.target.form;
    const custom = event.target.value === 'custom';
    form.querySelector('#custom-purity').hidden = !custom;
    form.elements.purity.disabled = !custom;
    syncEditor(form);
    if (custom) form.elements.purity.focus();
  }
  if (event.target.name === 'pricePreset') {
    updatePriceInput(event.target.form);
    if (event.target.value === 'custom') event.target.form.elements.max.focus();
  }
  if (event.target.id !== 'photo-input') return;
  const files = [...event.target.files];
  event.target.value = '';
  if (!files.length || photoLoading || saving) return;
  const photos = productPhotos(adminEdit);
  if (photos.length + files.length > 5) { adminMessage('photoLimit'); return; }
  if (files.some(file => !['image/jpeg','image/png','image/webp'].includes(file.type))) {
    adminMessage('badPhoto');
    return;
  }
  const revision = ++photoRevision;
  photoLoading = true;
  document.querySelectorAll('[data-photo-action]').forEach(button => { button.disabled = true; });
  try {
    const added = await Promise.all(files.map(preparePhoto));
    if (revision !== photoRevision) return;
    adminEdit.photos = [...photos,...added];
    adminEdit.photo = adminEdit.photos[0];
    $('#photo-thumb').innerHTML = photoThumb(adminEdit);
    adminMessage('');
  } catch {
    if (revision === photoRevision) adminMessage('badPhoto');
  } finally {
    if (revision === photoRevision) {
      photoLoading = false;
      document.querySelectorAll('[data-photo-action]').forEach(button => { button.disabled = false; });
    }
  }
});
document.addEventListener('submit', async event => {
  const form = event.target;
  if (form.id === 'login-form') {
    event.preventDefault();
    const button = form.querySelector('button');
    button.disabled = true;
    try {
      await catalogRequest('login', Object.fromEntries(new FormData(form)));
      await loadCatalog();
    } catch (error) {
      const message = form.querySelector('#login-error');
      message.textContent = t(error.message === 'login' ? 'loginError' : 'backend');
      button.disabled = false;
    }
  }
  if (form.id === 'filters') {
    event.preventDefault();
    const params = new URLSearchParams();
    const values = new FormData(form);
    for (const key of ['q','category','purity']) {
      const value = values.get(key).trim();
      if (value) params.set(key,value);
    }
    const max = priceLimit(values.get('pricePreset') === 'custom' ? values.get('max') : values.get('pricePreset'));
    if (max) params.set('max',max);
    location.hash = 'catalog' + (params.size ? '?' + params : '');
  }
  if (form.id === 'product-form') {
    event.preventDefault();
    if (!photoLoading) editorAction('save');
  }
});
document.addEventListener('click', async event => {
  const button = event.target.closest('button');
  if (button?.dataset.galleryPhoto) {
    const gallery = button.closest('.product-gallery');
    gallery.querySelector('.gallery-main').src = button.dataset.galleryPhoto;
    gallery.querySelectorAll('[data-gallery-photo]').forEach(option =>
      option.setAttribute('aria-pressed', String(option === button)));
  }
  if (button?.dataset.removePhoto !== undefined && !photoLoading && !saving) {
    adminEdit.photos = productPhotos(adminEdit).filter((_,index) => index !== Number(button.dataset.removePhoto));
    adminEdit.photo = adminEdit.photos[0] ?? '';
    $('#photo-thumb').innerHTML = photoThumb(adminEdit);
    adminMessage('');
  }

  if (!button) {
    if (event.target.closest('#skip')) {
      event.preventDefault();
      $('#main').focus();
      $('#main').scrollIntoView();
    }
    if (event.target.closest('a[href="#catalog?focus=search"]') && route().params.get('focus') === 'search') $('#catalog-search')?.focus();
    return;
  }
  if (button.id === 'auto-name') {
    const form = $('#product-form');
    const source = form.elements.uz;
    if (!source.value.trim()) { source.focus(); return; }
    form.elements.ru.value = nameToCyrillic(source.value);
    syncEditor(form);
    form.elements.ru.focus();
    return;
  }
  const {language, add, remove} = button.dataset;
  if (language !== undefined) {
    if (Number(language) === lang) return;
    const filters = $('#filters') ? [...new FormData($('#filters'))] : [];
    lang = Number(language);
    try { localStorage.setItem('zarrin-language',JSON.stringify(lang)); } catch {}
    $('#notice').textContent = '';
    render(true);
    if (filters.length) {
      const form = $('#filters');
      filters.forEach(([key,value]) => { form.elements[key].value = value; });
      updatePriceInput(form);
    }
    $('[data-language="' + language + '"]').focus();
  }
  if (add || remove) {
    const product = published().find(p => p.id === (add || remove) && p.available);
    if (!product) return;
    const amount = remove ? 0 : 1;
    if (!setCart(product,amount)) return;
    const purchase = $('#product-purchase');
    if (purchase) {
      header();
      updateMarkup(purchase,purchaseControls(product));
    } else render();
    ((purchase && purchase.querySelector('button:not(:disabled)')) || $('#main')).focus({preventScroll:true});
    if (add) inform('added', local(product) + ' — ' + t('added'));
    else inform('cartChanged');
  }
  if (button.id === 'admin-logout') {
    button.disabled = true;
    try {
      await catalogRequest('logout', {});
      adminEdit = null;
      inbox = null;
      currentStaffThread = null;
      remoteProducts = [];
      catalogState = 'login';
      render();
    } catch { button.disabled = false; inform('backend'); }
  }
  if (button.id === 'preview-product' && !photoLoading) editorAction('preview');
  if (button.dataset.trashProduct || button.dataset.restoreProduct) {
    if (saving) return;
    const restore = !!button.dataset.restoreProduct;
    if (!restore && !confirm(t('trashConfirm'))) return;
    saving = true; button.disabled = true;
    const error = await catalog.trash(button.dataset.restoreProduct || button.dataset.trashProduct, restore);
    saving = false; button.disabled = false;
    if (error) { inform(copy[error] ? error : 'backend'); return; }
    adminEdit = null;
    render();
    inform(restore ? 'restored' : 'trashed');
  }
  if (button.id === 'archive-product' && !photoLoading) editorAction('archive');
});
addEventListener('storage', event => {
  if (event.key === 'zarrin-cart-v1') basket = singleItemBasket(readLocal(event.key,{}));
  if (catalogState === 'ready' && (event.key === 'zarrin-catalog-v1' || event.key === 'zarrin-cart-v1')) {
    pruneCart();
    if (isAdmin) {
      header();
      if ($('#admin-list')) $('#admin-list').innerHTML = adminList();
    } else render();
  }
});
async function loadCatalog() {
  try {
    remoteProducts = await catalogRequest(isAdmin ? 'staff' : 'public');
    catalogState = 'ready';
    if (!isAdmin) pruneCart();
  } catch (error) {
    catalogState = error.message === 'login' && isAdmin ? 'login' : 'backend';
  }
  render();
  if (catalogState === 'ready') refreshChat();
}

if (localMode) pruneCart();
render();
if (!localMode) {
  loadCatalog();
  setInterval(refreshChat, 8000);
}
