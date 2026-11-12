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

export async function notifyTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return;
  try {
    let cursor = '';
    for (;;) {
      const response = await subscriberRequest('telegram_subscribers?select=chat_id&active=eq.true&order=chat_id.asc&limit=100' +
        (cursor ? '&chat_id=gt.' + cursor : ''));
      if (!response.ok) throw new Error('Telegram subscriptions unavailable');
      const subscribers = await response.json();
      for (let offset = 0; offset < subscribers.length; offset += 20) {
        const results = await Promise.allSettled(subscribers.slice(offset,offset + 20).map(async ({chat_id}) => {
          const result = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({chat_id,text}),
            signal:AbortSignal.timeout(2500)
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
