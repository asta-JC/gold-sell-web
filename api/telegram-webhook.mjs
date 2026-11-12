import { timingSafeEqual } from 'node:crypto';
import { saveTelegramSubscription } from '../lib/telegram.mjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ok:false});
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  const supplied = req.headers['x-telegram-bot-api-secret-token'];
  if (!expected || typeof supplied !== 'string') return res.status(403).json({ok:false});
  const secret = Buffer.from(expected);
  const header = Buffer.from(supplied);
  if (header.length !== secret.length || !timingSafeEqual(header,secret)) {
    return res.status(403).json({ok:false});
  }
  const {message,update_id:updateId} = req.body ?? {};
  const chatId = message?.chat?.id;
  const command = typeof message?.text === 'string' && message.text.trim().match(/^\/(start|stop)(?:\s|$)/)?.[1];
  if (message?.chat?.type === 'private' && Number.isSafeInteger(chatId) &&
      Number.isSafeInteger(updateId) && command) {
    try {
      await saveTelegramSubscription(chatId,updateId,command === 'start');
    } catch {
      return res.status(503).json({ok:false});
    }
  }
  return res.json({ok:true});
}
