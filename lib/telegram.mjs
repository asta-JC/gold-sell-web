function subscriberRequest(path, options = {}) {
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  return fetch(process.env.SUPABASE_URL + '/rest/v1/' + path, {
    ...options,
    headers: {
      apikey:key,
      ...(key.startsWith('eyJ') ? {Authorization:'Bearer ' + key} : {}),
      ...options.headers
    },
    signal:AbortSignal.timeout(2500)
  });
}

export async function saveTelegramSubscription(chatId, updateId, active) {
  const response = await subscriberRequest('rpc/set_telegram_subscription', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({subscriber_id:chatId,telegram_update_id:updateId,subscribed:active})
  });
  if (!response.ok) throw new Error('Telegram subscription update failed');
}

const amount = new Intl.NumberFormat('uz-Latn-UZ');
const dateTime = new Intl.DateTimeFormat('uz-Latn-UZ', {
  dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Tashkent'
});

export async function notifyTelegram({title,id,items,total,createdAt,photo,message,contact}) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return;
  try {
    const details = items.map(item => [
      item.uz || item.ru || 'Taqinchoq',
      `${amount.format(item.price)} so‘m`,
      item.purity && `${item.purity} proba`,
      item.weight && `${amount.format(item.weight)} g`,
      item.size && `O‘lcham ${item.size}`,
      item.sku && `Kod ${item.sku}`
    ].filter(Boolean).map(detail => `· ${detail}`).join('\n'));
    const adminLink = 'https://mgold-uz.vercel.app/admin.html#admin/chat';
    const heading = `🆕 ${title} · #${id.slice(0,8)}\n\n⏰ ${dateTime.format(new Date(createdAt))}`;
    const customer = [
      ['Ism',contact?.firstName],
      ['Familiya',contact?.lastName],
      ['Telefon raqami',contact?.phone]
    ].filter(([,value]) => value).map(([label,value]) => `${label}: ${value}`).join('\n');
    const staffChats = new Set((process.env.TELEGRAM_STAFF_CHAT_IDS ?? '').split(',')
      .map(value => value.trim()).filter(value => /^[1-9]\d*$/.test(value)));
    const quote = message ? '\n\n' + message : '';
    const summary = [heading,...details].join('\n\n');
    async function send(method, body) {
      return fetch('https://api.telegram.org/bot' + token + '/' + method, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(body),
        signal:AbortSignal.timeout(2500)
      });
    }
    let cursor = '';
    for (;;) {
      const response = await subscriberRequest('telegram_subscribers?select=chat_id&active=eq.true&order=chat_id.asc&limit=100' +
        (cursor ? '&chat_id=gt.' + cursor : ''));
      if (!response.ok) throw new Error('Telegram subscriptions unavailable');
      const subscribers = await response.json();
      for (let offset = 0; offset < subscribers.length; offset += 20) {
        const results = await Promise.allSettled(subscribers.slice(offset,offset + 20).map(async ({chat_id}) => {
          const footer = '\n\n' + [`💰 Jami ${amount.format(total)} so‘m`,
            staffChats.has(String(chat_id)) ? customer : '',adminLink].filter(Boolean).join('\n\n');
          const limit = 4096 - footer.length - quote.length;
          const shortened = summary.length > limit
            ? summary.slice(0,limit - 1).replace(/[\uD800-\uDBFF]$/u,'').trimEnd() + '…'
            : summary;
          const prefix = shortened + footer;
          const text = prefix + quote;
          const entities = message ? [{type:'blockquote',offset:prefix.length + 2,length:message.length}] : undefined;
          const fitsCaption = text.length <= 1024;
          if (photo) {
            const result = await send('sendPhoto',{
              chat_id,photo,caption:fitsCaption ? text : heading,
              caption_entities:fitsCaption ? entities : undefined
            });
            if (result.ok && fitsCaption) return;
          }
          const result = await send('sendMessage',{
            chat_id,text,entities,
            link_preview_options:{is_disabled:true}
          });
          if (!result.ok) throw new Error('Telegram rejected notification');
        }));
        const failures = results.filter(result => result.status === 'rejected').length;
        if (failures) console.warn('Telegram notifications failed', failures);
      }
      if (subscribers.length < 100) return;
      cursor = subscribers.at(-1).chat_id;
    }
  } catch {
    console.warn('Telegram notification delivery unavailable');
  }
}
