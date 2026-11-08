const chatCopy = {
  customerContact:['Mijoz ma’lumotlari','Данные покупателя'],
  contactFirst:['Ism','Имя'],
  contactLast:['Familiya','Фамилия'],
  contactPhone:['Telefon raqami','Номер телефона'],
  contactRemember:['Shu brauzerda eslab qolish','Запомнить в этом браузере'],
  contactHelp:['Aloqa ma’lumotlarini bron bilan do‘konga yuboramiz.','Магазин получит контактные данные вместе с запросом.'],
  invalidContact:['Ism, familiya va telefon raqamini to‘g‘ri kiriting.','Укажите имя, фамилию и действительный номер телефона.'],
  chatShort:['Xabarlar','Сообщения'],
  deleteChat:['Chatni o‘chirish','Удалить чат'],
  confirmDeleteChat:['Bu chat do‘kon ro‘yxatidan olib tashlanadi va yangi xabar yozib bo‘lmaydi. Mijoz avvalgi yozishmalarini ko‘ra oladi. Davom etasizmi?','Чат исчезнет из списка магазина, отправка сообщений прекратится. Покупатель сохранит доступ к переписке. Продолжить?'],
  chatDeleted:['Chat ro‘yxatdan olib tashlandi.','Чат удалён из списка.'],
  chatClosed:['Suhbat yopildi. Avvalgi xabarlar shu yerda saqlanadi.','Чат закрыт. Предыдущие сообщения остаются доступны.'],
  emptyVisitorChat:['Bron yuborganingizdan keyin do‘kon bilan yozishmalar shu yerda ko‘rinadi.','После отправки запроса здесь появится переписка с магазином.'],
  chat:['Bronlar va chat','Брони и чат'],
  openChat:['Bron suhbatini ochish','Открыть чат брони'],
  startChat:['Bron so‘rovini yuborish','Отправить запрос на бронь'],
  requestReceived:['Bron so‘rovingiz qabul qilindi','Запрос на бронь получен'],
  requestReceivedDetail:['So‘rovingiz M Gold do‘koniga yetib bordi. Do‘kon bronni shu chatda tasdiqlaydi va olib ketish vaqtini siz bilan kelishadi.','Ваш запрос поступил в M Gold. Магазин подтвердит бронь в этом чате и согласует с вами время самовывоза.'],
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
  sendTelegram:['Telegram tugmasini yuborish','Отправить кнопку Telegram'],
  confirmTelegram:['Mijozga Telegram orqali bog‘lanish tugmasini yuborasizmi?','Отправить покупателю кнопку связи в Telegram?'],
  telegramInvite:['Menga Telegram orqali aloqaga chiqing.','Свяжитесь со мной в Telegram.'],
  openTelegram:['Telegram’da yozish','Написать в Telegram'],
  conversation:['Suhbat','Переписка'],
  noMessages:['Hali xabar yozilmagan.','Сообщений пока нет.'],
  chatHistory:['Bron suhbatlari','Чаты бронирования'],
  reservationItems:['Bron qilingan mahsulotlar','Товары в запросе'],
  itemQty:['Soni','Количество'],
  chooseChat:['Suhbatni tanlang.','Выберите чат.']
};

const previousThread = readLocal('mg-visitor-thread',null);
let visitorThreads = readLocal('mg-visitor-threads', previousThread ? [previousThread] : []);
let visitorThread = visitorThreads[0] ?? null;
let startingChat = false;
const contactKey = 'mg-reservation-contact';
let savedContact = readLocal(contactKey,null);
let startAttempt;
let pendingMessage;
const telegramInviteBody = '[m-gold:telegram-invite]';
const telegramIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.7 3.6 2.8 10.9c-.9.4-.9 1 .1 1.3l4.8 1.5 11.2-7c.5-.3.9-.1.5.3l-9.1 8.3-.3 4.9c.5 0 .7-.2 1-.5l2.3-2.2 4.9 3.6c.9.5 1.5.2 1.7-.8l3.1-15.4c.2-1-.4-1.5-1.3-1.3Z"/></svg>';
const telegramAttempts = new Map();
let sendingTelegram = false;
let deletingChat = false;
let inbox = null;
const readChatKey = 'mg-staff-read-chat';
let readChats = readLocal(readChatKey,{});
let unreadChats = new Set();

const visitorReadKey = 'mg-visitor-read-chat';
let visitorReadTimes = readLocal(visitorReadKey,{});
const visitorLatestTimes = new Map();
let visitorUnreadChats = new Set();

function updateVisitorUnread() {
  visitorUnreadChats = new Set(visitorThreads.filter(thread =>
    (visitorLatestTimes.get(thread.id) ?? 0) > (visitorReadTimes[thread.id] ?? 0)
  ).map(thread => thread.id));
  const badge = $('#visitor-chat-badge');
  if (badge) {
    badge.textContent = visitorUnreadChats.size;
    badge.hidden = !visitorUnreadChats.size;
  }
}

function markVisitorChatRead(thread, messages) {
  const latest = Math.max(0, ...messages.filter(message => message.sender === 'staff')
    .map(message => Date.parse(message.created_at)));
  visitorLatestTimes.set(thread.id, Math.max(visitorLatestTimes.get(thread.id) ?? 0, latest));
  if (latest > (visitorReadTimes[thread.id] ?? 0)) {
    visitorReadTimes[thread.id] = latest;
    try { localStorage.setItem(visitorReadKey,JSON.stringify(visitorReadTimes)); } catch {}
  }
  updateVisitorUnread();
}

async function refreshVisitorUnread() {
  await Promise.allSettled(visitorThreads.map(async access => {
    const result = await catalogRequest('chat-unread', {id:access.id,secret:access.secret});
    visitorLatestTimes.set(access.id, result.latest ? Date.parse(result.latest) : 0);
  }));
  updateVisitorUnread();
}

addEventListener('storage', event => {
  if (isAdmin) return;
  if (event.key === visitorReadKey) visitorReadTimes = readLocal(visitorReadKey,{});
  else if (event.key === 'mg-visitor-threads') visitorThreads = readLocal('mg-visitor-threads',[]);
  else return;
  updateVisitorUnread();
  refreshChat();
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refreshChat();
});

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
  if (!isAdmin && (localMode || !visitorThreads.length)) {
    return page(t('chat'), `<section class="panel"><h2 class="chat-icon-heading">${icon('help')}${t('chatHistory')}</h2><div class="chat-welcome">${visitorChatEmpty()}</div></section>`, '#home', 'home');
  }
  return page(t('chat'), `<div class="chat-layout">
    <section class="panel stack"><h2 class="chat-icon-heading">${icon('help')}${t('chatHistory')}</h2>
      ${isAdmin ? `<button type="button" class="button secondary" id="enable-alerts">${icon('bell')}${t('enableAlerts')}</button>` : ''}
      <div id="chat-inbox"></div></section>
    <section class="panel stack chat-panel"><div id="chat-thread" aria-live="polite"></div>
      ${isAdmin ? `<button type="button" id="delete-chat" class="button secondary chat-delete" hidden>${icon('trash')}${t('deleteChat')}</button>` : ''}
      <form id="chat-message" class="stack" hidden>
        ${field('message','<textarea name="body" maxlength="1000" rows="2" required></textarea>')}
        <div class="actions"><button class="button">${icon('send')}${t('send')}</button>
          ${isAdmin ? `<button type="button" id="send-telegram" class="button secondary" ${sendingTelegram ? 'disabled' : ''}>${telegramIcon}${t('sendTelegram')}</button>` : ''}
        </div>
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

function visitorChatEmpty() {
  return `<p class="muted">${t('emptyVisitorChat')}</p><a class="button secondary" href="#catalog">${icon('bag')}${t('shop')}</a>`;
}

function showChatList(threads, selected) {
  chatUpdate($('#chat-inbox'), threads.map(thread => {
    const title = thread.items?.[0] ? local(thread.items[0]) : t('order');
    const date = thread.created_at
      ? new Intl.DateTimeFormat(lang ? 'ru-RU' : 'uz-Latn-UZ', {dateStyle:'short',timeStyle:'short'}).format(new Date(thread.created_at))
      : '';
    return `<button type="button" class="chat-choice" data-thread="${escapeHtml(thread.id)}" aria-pressed="${thread.id === selected}">
      <strong class="chat-icon-heading">${icon('help')}${escapeHtml(title)}</strong><span>#${escapeHtml(thread.id.slice(0,8))}${date ? ' · ' + escapeHtml(date) : ''}</span>${(isAdmin ? unreadChats : visitorUnreadChats).has(thread.id) ? `<span class="unread-badge" aria-label="${t('unreadChat')}">1</span>` : ''}
    </button>`;
  }).join('') || (isAdmin ? `<p>${t('emptyChat')}</p>` : visitorChatEmpty()));
}

function customerContactCard(contact) {
  const name = [contact.firstName, contact.lastName].filter(Boolean).join(' ');
  const phone = String(contact.phone ?? '').trim();
  const dial = phone.replace(/[^0-9+]/g,'');
  return `<section class="customer-contact" aria-label="${t('customerContact')}">
    <h3>${t('customerContact')}</h3>
    <p class="customer-name">${escapeHtml(name)}</p>
    ${phone ? `<div><span class="customer-phone-label">${t('contactPhone')}</span>
      ${/^\+?[0-9]{9,15}$/.test(dial) ? `<a class="customer-phone" href="tel:${dial}">${escapeHtml(phone)}</a>`
        : `<span class="customer-phone">${escapeHtml(phone)}</span>`}</div>` : ''}
  </section>`;
}

function chatBubbles(messages, staffView) {
  const timeFormat = new Intl.DateTimeFormat(lang ? 'ru-RU' : 'uz-Latn-UZ', {
    hour:'2-digit', minute:'2-digit'
  });
  return messages.map(message => {
    const staffMessage = message.sender === 'staff';
    const side = staffMessage === staffView ? 'outgoing' : 'incoming';
    const label = t(staffMessage ? 'store' : 'visitor');
    const content = staffMessage && message.body === telegramInviteBody
      ? `<p>${t('telegramInvite')}</p><a class="button chat-telegram-link" href="${telegramContact}" target="_blank" rel="noopener noreferrer">${telegramIcon}${t('openTelegram')}</a>`
      : `<p>${escapeHtml(message.body)}</p>`;
    return `<div class="chat-bubble chat-bubble--${side}">
      <strong>${label}</strong>${content}
      <time datetime="${escapeHtml(message.created_at)}">${timeFormat.format(new Date(message.created_at))}</time>
    </div>`;
  }).join('') || `<p class="muted chat-empty">${t('noMessages')}</p>`;
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
  if (localMode || catalogState !== 'ready' || (!isAdmin && !visitorThreads.length)) return;
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
      if (currentStaffThread && !next.threads.some(thread => thread.id === currentStaffThread)) currentStaffThread = null;
      updateUnreadChats();
    }

    if (!isAdmin) await refreshVisitorUnread();
    const id = isAdmin ? currentStaffThread : visitorThread?.id;
    showChatList(isAdmin ? inbox.threads : visitorThreads, id);
    if (!$('#chat-thread')) return;
    if (!id) {
      $('#chat-message').hidden = true;
      if (isAdmin) $('#delete-chat').hidden = true;
      chatUpdate($('#chat-thread'), `<p>${t(isAdmin ? 'chooseChat' : 'emptyChat')}</p>`);
      return;
    }
    const access = isAdmin ? {id} : visitorThread;
    const {thread,messages} = await catalogRequest(isAdmin ? 'chat-staff-read' : 'chat-read',access);
    if (id !== (isAdmin ? currentStaffThread : visitorThread?.id)) return;
    const target = $('#chat-thread');
    if (!target) return;
    const receipt = thread.archived_at ? `<p class="chat-closed">${t('chatClosed')}</p>` : isAdmin ? '' : `<div class="reservation-receipt">
      <span class="receipt-icon" aria-hidden="true">✓</span>
      <div><strong>${t('requestReceived')}</strong><p>${t('requestReceivedDetail')}</p></div>
    </div>`;
    const previousMessages = target.querySelector('.chat-messages');
    const followMessages = !previousMessages ||
      previousMessages.scrollHeight - previousMessages.scrollTop - previousMessages.clientHeight < 32;
    chatUpdate(target, `${receipt}<p><strong>#${thread.id.slice(0,8)} · ${money(thread.total)}</strong></p>${isAdmin && thread.contact ? customerContactCard(thread.contact) : ''}<h3 class="chat-icon-heading">${icon('box')}${t('reservationItems')}</h3><ul class="chat-products">${chatItems(thread)}</ul>
      ${isAdmin ? `<p class="muted">${t('chatHelp')}</p>` : ''}
      <section class="chat-conversation" aria-label="${t('conversation')}">
        <h3 class="chat-icon-heading">${icon('help')}${t('conversation')}</h3>
        <div class="chat-messages" tabindex="0" aria-label="${t('conversation')}">${chatBubbles(messages,isAdmin)}</div>
      </section>`);
    const messageList = target.querySelector('.chat-messages');
    if (followMessages) messageList.scrollTop = messageList.scrollHeight;
    $('#chat-message').hidden = Boolean(thread.archived_at);
    if (isAdmin) $('#delete-chat').hidden = Boolean(thread.archived_at);
    if (!isAdmin && !document.hidden) {
      markVisitorChatRead(thread,messages);
      showChatList(visitorThreads,id);
    }
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
  if (button.id === 'delete-chat') {
    const id = currentStaffThread;
    if (!isAdmin || !id || deletingChat || !window.confirm(t('confirmDeleteChat'))) return;
    deletingChat = button.disabled = true;
    chatError('');
    try {
      await catalogRequest('chat-staff-archive',{id});
      if (currentStaffThread === id) {
        currentStaffThread = null;
        $('#chat-message')?.reset();
        if ($('#chat-message')) $('#chat-message').hidden = true;
        if ($('#delete-chat')) $('#delete-chat').hidden = true;
        chatUpdate($('#chat-thread'),`<p>${t('chooseChat')}</p>`);
      }
      inform('chatDeleted');
      refreshChat();
    } catch { chatError('chatError'); }
    finally { deletingChat = button.disabled = false; }
    return;
  }
  if (button.id === 'send-telegram') {
    const id = currentStaffThread;
    if (!isAdmin || !id || sendingTelegram || !window.confirm(t('confirmTelegram'))) return;
    sendingTelegram = button.disabled = true;
    const messageId = telegramAttempts.get(id) ?? crypto.randomUUID();
    telegramAttempts.set(id,messageId);
    chatError('');
    try {
      await catalogRequest('chat-staff-send',{id,body:telegramInviteBody,messageId});
      telegramAttempts.delete(id);
      refreshChat();
    } catch { chatError('chatError'); }
    finally {
      sendingTelegram = false;
      const control = $('#send-telegram');
      if (control) control.disabled = false;
    }
    return;
  }
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
    if (isAdmin) $('#delete-chat').hidden = true;
    $('#chat-message').reset();
    $('#chat-message').hidden = true;
    chatError('');
    refreshChat();
  }
  if (button.id === 'start-chat' && !startingChat) openContactForm(button.dataset.reserveItem);
});

function openContactForm(productId) {
  const products = cartItems().filter(product => !productId || product.id === productId);
  if (!products.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'preview-dialog';
  dialog.setAttribute('aria-labelledby','reservation-contact-title');
  dialog.innerHTML = `<form class="panel stack">
    <h2 id="reservation-contact-title">${t('order')}</h2>
    <p>${t('contactHelp')}</p>
    ${field('contactFirst',`<input name="firstName" required maxlength="60" autocomplete="given-name" value="${escapeHtml(savedContact?.firstName)}">`)}
    ${field('contactLast',`<input name="lastName" required maxlength="60" autocomplete="family-name" value="${escapeHtml(savedContact?.lastName)}">`)}
    ${field('contactPhone',`<input name="phone" type="tel" required maxlength="24" autocomplete="tel" placeholder="+998" value="${escapeHtml(savedContact?.phone)}">`)}
    <label><input name="remember" type="checkbox" checked> ${t('contactRemember')}</label>
    <p class="error" role="alert"></p>
    <div class="actions"><button class="button">${t('startChat')}</button>
      <button type="button" class="button secondary">${t('close')}</button></div>
  </form>`;
  document.body.append(dialog);
  const form = dialog.querySelector('form');
  const cancel = form.querySelector('[type="button"]');
  cancel.addEventListener('click',() => dialog.close());
  dialog.addEventListener('cancel',event => { if (startingChat) event.preventDefault(); });
  dialog.addEventListener('close',() => dialog.remove(),{once:true});
  form.addEventListener('submit',async event => {
    event.preventDefault();
    if (startingChat) return;
    const contact = Object.fromEntries(['firstName','lastName','phone'].map(key => [key,form.elements[key].value.trim()]));
    const items = products.map(product => ({id:product.id,qty:basket[product.id]})).filter(item => item.qty > 0);
    const errorBox = form.querySelector('.error');
    if (!items.length) { errorBox.textContent = t('emptyCart'); return; }
    errorBox.textContent = '';
    startingChat = true;
    const submit = form.querySelector('.button');
    submit.disabled = cancel.disabled = true;
    const fingerprint = JSON.stringify({items,contact});
    if (!startAttempt || startAttempt.fingerprint !== fingerprint) {
      startAttempt = {fingerprint,id:crypto.randomUUID(),secret:crypto.randomUUID()};
    }
    const {id,secret} = startAttempt;
    try {
      await catalogRequest('chat-start',{id,secret,items,contact});
      if (form.elements.remember.checked) {
        savedContact = {...contact,deviceId:savedContact?.deviceId ?? crypto.randomUUID()};
        try { localStorage.setItem(contactKey,JSON.stringify(savedContact)); } catch {}
      } else {
        savedContact = null;
        try { localStorage.removeItem(contactKey); } catch {}
      }
      visitorThread = {id,secret,items:products.map(({uz,ru}) => ({uz,ru})),created_at:new Date().toISOString()};
      visitorThreads = [visitorThread,...visitorThreads.filter(thread => thread.id !== id)];
      try { localStorage.setItem('mg-visitor-threads',JSON.stringify(visitorThreads)); } catch {}
      for (const item of items) setCart(item, (basket[item.id] ?? 0) - item.qty);
      startAttempt = null;
      dialog.close();
      location.hash = 'chat';
    } catch (error) {
      const key = ['invalidContact','cartUnavailable'].includes(error.message) ? error.message : 'chatError';
      errorBox.textContent = t(key);
    } finally {
      startingChat = false;
      submit.disabled = cancel.disabled = false;
    }
  });
  dialog.showModal();
}

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
