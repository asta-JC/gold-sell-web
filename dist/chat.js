const chatCopy = {
  chat:['Bronlar va chat','Брони и чат'],
  openChat:['Bron suhbatini ochish','Открыть чат брони'],
  startChat:['Bron so‘rovini yuborish','Отправить запрос на бронь'],
  chatHelp:['Olib ketish vaqtini chatda kelishib oling. Bron do‘kon javobidan keyin tasdiqlanadi.','Договоритесь о самовывозе в чате. Бронь подтверждает магазин.'],
  chatError:['Ulanishda xato. Qayta urinib ko‘ring.','Ошибка соединения. Попробуйте ещё раз.'],
  newChat:['Yangi bron yoki xabar','Новая бронь или сообщение'],
  enableAlerts:['Brauzer bildirishnomalarini yoqish','Включить уведомления браузера'],
  alertsEnabled:['Brauzer bildirishnomalari yoqilgan.','Уведомления браузера включены.'],
  alertsUnavailable:['Bildirishnomaga brauzer sozlamalaridan ruxsat bering.','Разрешите уведомления в настройках браузера.'],
  message:['Xabar','Сообщение'],
  send:['Yuborish','Отправить'],
  visitor:['Xaridor','Покупатель'],
  store:['Do‘kon','Магазин'],
  emptyChat:['Hozircha bron so‘rovlari yo‘q.','Пока нет запросов на бронь.'],
  unreadChat:['O‘qilmagan suhbatlar','Непрочитанные чаты'],
  chatHistory:['Bron suhbatlari','Чаты бронирования'],
  reservationItems:['Bron qilingan mahsulotlar','Товары в запросе'],
  itemQty:['Soni','Количество'],
  chooseChat:['Suhbatni tanlang.','Выберите чат.']
};

const previousThread = readLocal('mg-visitor-thread',null);
let visitorThreads = readLocal('mg-visitor-threads', previousThread ? [previousThread] : []);
let visitorThread = visitorThreads[0] ?? null;
let startingChat = false;
let startAttempt;
let pendingMessage;
let inbox = null;
const readChatKey = 'mg-staff-read-chat';
let readChats = readLocal(readChatKey,{});
let unreadChats = new Set();

function updateUnreadChats() {
  if (!inbox) return;
  const latest = new Map(inbox.threads.map(thread => [thread.id,Date.parse(thread.created_at)]));
  for (const message of inbox.recent) {
    if (!latest.has(message.reservation_id)) continue;
    latest.set(message.reservation_id,Math.max(latest.get(message.reservation_id),Date.parse(message.created_at)));
  }
  unreadChats = new Set([...latest].filter(([id,time]) => time > (readChats[id] ?? 0)).map(([id]) => id));
  const badge = $('#admin-chat-badge');
  if (badge) {
    badge.textContent = unreadChats.size;
    badge.hidden = !unreadChats.size;
  }
}

function markChatRead(thread,messages) {
  const time = Math.max(Date.parse(thread.created_at),
    ...messages.filter(message => message.sender === 'visitor').map(message => Date.parse(message.created_at)));
  if (time <= (readChats[thread.id] ?? 0)) return;
  readChats[thread.id] = time;
  try { localStorage.setItem(readChatKey,JSON.stringify(readChats)); } catch {}
  updateUnreadChats();
}

addEventListener('storage', event => {
  if (event.key !== readChatKey || !isAdmin) return;
  readChats = readLocal(readChatKey,{});
  updateUnreadChats();
  if (inbox) showChatList(inbox.threads,currentStaffThread);
});
let currentStaffThread = null;
let chatBusy = false;
let chatRefreshQueued = false;

function chatPage() {
  return page(t('chat'), `<div class="cart-layout">
    <section class="panel stack"><h2>${t('chatHistory')}</h2>
      ${isAdmin ? `<button type="button" class="button secondary" id="enable-alerts">${t('enableAlerts')}</button>` : ''}
      <div id="chat-inbox"></div></section>
    <section class="panel stack"><div id="chat-thread" aria-live="polite"></div>
      <form id="chat-message" class="stack" hidden>
        ${field('message','<textarea name="body" maxlength="1000" rows="2" required></textarea>')}
        <button class="button">${t('send')}</button>
      </form>
      <p id="chat-error" class="error" role="alert"></p>
    </section></div>`, isAdmin ? '#admin' : '#cart', isAdmin ? 'admin' : 'cart');
}

function chatItems(thread) {
  return thread.items.map(item => {
    const description = lang ? item.descRu : item.descUz;
    const specs = [
      item.size && t('size') + ' · ' + sizeText(item.size),
      item.purity && t('purity') + ' · ' + item.purity,
      item.weight && t('weight') + ' · ' + number(item.weight) + (lang ? ' г' : ' g')
    ].filter(Boolean);
    return `<li class="chat-product">
      ${item.photo ? `<img src="${escapeHtml(item.photo)}" alt="${escapeHtml(local(item))}">` : ''}
      <div><strong>${escapeHtml(local(item))}</strong>
        <p>SKU · ${escapeHtml(item.sku)}</p>
        ${specs.length ? `<p>${specs.map(escapeHtml).join(' · ')}</p>` : ''}
        ${description ? `<p>${escapeHtml(description)}</p>` : ''}
        <p>${t('itemQty')} · ${item.qty} &nbsp; | &nbsp; ${money(item.price)} × ${item.qty} = <strong>${money(item.price * item.qty)}</strong></p>
      </div></li>`;
  }).join('');
}

function showChatList(threads, selected) {
  chatUpdate($('#chat-inbox'), threads.map(thread => {
    const title = thread.items?.[0] ? local(thread.items[0]) : t('order');
    const date = thread.created_at
      ? new Intl.DateTimeFormat(lang ? 'ru-RU' : 'uz-Latn-UZ', {dateStyle:'short',timeStyle:'short'}).format(new Date(thread.created_at))
      : '';
    return `<button type="button" class="chat-choice" data-thread="${escapeHtml(thread.id)}" aria-pressed="${thread.id === selected}">
      <strong>${escapeHtml(title)}</strong><span>#${escapeHtml(thread.id.slice(0,8))}${date ? ' · ' + escapeHtml(date) : ''}</span>${isAdmin && unreadChats.has(thread.id) ? `<span class="unread-badge" aria-label="${t('unreadChat')}">1</span>` : ''}
    </button>`;
  }).join('') || `<p>${t('emptyChat')}</p>`);
}

function chatUpdate(target, markup) {
  if (target && target.dataset.markup !== markup) {
    updateMarkup(target, markup);
    target.dataset.markup = markup;
  }
}

function chatError(key) {
  const error = $('#chat-error');
  if (error) error.textContent = key ? t(key) : '';
  else if (key) inform(key);
}

async function refreshChat() {
  if (localMode || catalogState !== 'ready' || (!isAdmin && !$('#chat-thread'))) return;
  if (chatBusy) { chatRefreshQueued = true; return; }
  chatBusy = true;
  try {
    if (isAdmin) {
      const next = await catalogRequest('chat-staff-inbox', {});
      if (inbox) {
        const previous = new Set([...inbox.threads,...inbox.recent].map(item => item.id));
        const hasNew = [...next.threads,...next.recent].some(item => !previous.has(item.id) &&
          Date.now() - Date.parse(item.created_at) < 300000);
        if (hasNew) {
          inform('newChat');
          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              const alert = new Notification('M Gold', {body:t('newChat'),tag:'m-gold-chat'});
              alert.onclick = () => { window.focus(); location.hash = 'admin/chat'; };
            } catch { /* Keep the in-page alert when desktop notifications are unavailable. */ }
          }
        }
      }
      inbox = next;
      updateUnreadChats();
    }

    const id = isAdmin ? currentStaffThread : visitorThread?.id;
    showChatList(isAdmin ? inbox.threads : visitorThreads, id);
    if (!$('#chat-thread')) return;
    if (!id) {
      chatUpdate($('#chat-thread'), `<p>${t('chooseChat')}</p>`);
      return;
    }
    const access = isAdmin ? {id} : visitorThread;
    const {thread,messages} = await catalogRequest(isAdmin ? 'chat-staff-read' : 'chat-read',access);
    if (id !== (isAdmin ? currentStaffThread : visitorThread?.id)) return;
    const target = $('#chat-thread');
    if (!target) return;
    chatUpdate(target, `<p><strong>#${thread.id.slice(0,8)} · ${money(thread.total)}</strong></p><h3>${t('reservationItems')}</h3><ul class="chat-products">${chatItems(thread)}</ul>
      <p class="muted">${t('chatHelp')}</p>
      <div class="stack chat-messages">${messages.map(message => `<p><strong>${t(message.sender === 'staff' ? 'store' : 'visitor')}</strong><br>${escapeHtml(message.body)}</p>`).join('')}</div>`);
    $('#chat-message').hidden = false;
    if (isAdmin && !document.hidden) {
      markChatRead(thread,messages);
      showChatList(inbox.threads,id);
    }
  } catch (error) {
    if (isAdmin && error.message === 'login') {
      inbox = null;
      currentStaffThread = null;
      catalogState = 'login';
      render();
    } else chatError('chatError');
  } finally {
    chatBusy = false;
    if (chatRefreshQueued) {
      chatRefreshQueued = false;
      refreshChat();
    }
  }
}

document.addEventListener('click', async event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.id === 'enable-alerts') {
    try {
      const granted = 'Notification' in window && await Notification.requestPermission() === 'granted';
      inform(granted ? 'alertsEnabled' : 'alertsUnavailable');
    } catch { inform('alertsUnavailable'); }
  }
  if (button.dataset.thread) {
    if (isAdmin) currentStaffThread = button.dataset.thread;
    else visitorThread = visitorThreads.find(thread => thread.id === button.dataset.thread) ?? visitorThread;
    chatUpdate($('#chat-thread'),`<p>${t('loading')}</p>`);
    $('#chat-message').reset();
    $('#chat-message').hidden = true;
    chatError('');
    refreshChat();
  }
  if (button.id !== 'start-chat' || startingChat) return;
  startingChat = true;
  button.disabled = true;
  const products = cartItems();
  const items = products.map(product => ({id:product.id,qty:basket[product.id]}));
  const fingerprint = JSON.stringify(items);
  if (!startAttempt || startAttempt.fingerprint !== fingerprint) {
    startAttempt = {fingerprint,id:crypto.randomUUID(),secret:crypto.randomUUID()};
  }
  const {id,secret} = startAttempt;
  try {
    await catalogRequest('chat-start',{id,secret,items});
    visitorThread = {id,secret,items:products.map(({uz,ru}) => ({uz,ru})),created_at:new Date().toISOString()};
    visitorThreads = [visitorThread,...visitorThreads.filter(thread => thread.id !== id)];
    try { localStorage.setItem('mg-visitor-threads',JSON.stringify(visitorThreads)); } catch {}
    for (const item of items) setCart(item, (basket[item.id] ?? 0) - item.qty);
    startAttempt = null;
    location.hash = 'chat';
  } catch (error) {
    inform(error.message === 'cartUnavailable' ? 'cartUnavailable' : 'chatError');
  } finally {
    startingChat = false;
    button.disabled = false;
  }
});

document.addEventListener('submit', async event => {
  const form = event.target;
  if (form.id !== 'chat-message') return;
  event.preventDefault();
  const access = isAdmin ? {id:currentStaffThread} : visitorThread;
  const body = form.elements.body.value.trim();
  const button = form.querySelector('button');
  if (!access?.id || !body || button.disabled) return;
  if (!pendingMessage || pendingMessage.body !== body || pendingMessage.id !== access.id) {
    pendingMessage = {id:access.id,body,messageId:crypto.randomUUID()};
  }
  button.disabled = true;
  const attempt = pendingMessage;
  chatError('');
  try {
    await catalogRequest(isAdmin ? 'chat-staff-send' : 'chat-send',{...access,body,messageId:attempt.messageId});
    if (pendingMessage === attempt) pendingMessage = null;
    if (form.elements.body.value.trim() === body) form.reset();
    refreshChat();
  } catch { chatError('chatError'); }
  finally { button.disabled = false; }
});
