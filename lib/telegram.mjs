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

export async function notifyTelegram({title,id,items,total,createdAt,photo}) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return;
  try {
    const details = items.map(item => [
      `${item.uz || item.ru || 'Taqinchoq'} · ${amount.format(item.price)} so‘m`,
      [item.sku && `Kod ${item.sku}`,item.purity && `${item.purity} proba`,
        item.weight && `${amount.format(item.weight)} g`,item.size && `O‘lcham ${item.size}`].filter(Boolean).join(' · ')
    ].filter(Boolean).join('\n'));
    const adminLink = 'https://mgold-uz.vercel.app/admin.html#admin/chat';
    const heading = `${title} · #${id.slice(0,8)}\n${dateTime.format(new Date(createdAt))} (Toshkent vaqti)`;
    const text = [heading,...details,`Jami ${amount.format(total)} so‘m`,adminLink].join('\n\n');
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
          if (photo) {
            const result = await send('sendPhoto',{chat_id,photo,caption:text.length <= 1024 ? text : heading});
            if (result.ok && text.length <= 1024) return;
          }
          const result = await send('sendMessage',{
            chat_id,text:text.length <= 4096 ? text : text.slice(0,3900) + '\n…\n' + adminLink,
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
