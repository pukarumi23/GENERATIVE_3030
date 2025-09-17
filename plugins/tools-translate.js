import translate from '@vitalets/google-translate-api';
import fetch from 'node-fetch';
const handler = async (m, {args, usedPrefix, command}) => {
  const msg = `🔶Por favor, proporciona el (idioma) (texto) para que pueda traducirlo \n\n🌱 Ejemplo: #traducir en ¡Hola mundo! 🌿`;
  if (!args || !args[0]) return m.reply(msg);
  let lang = args[0];
  let text = args.slice(1).join(' ');
  const defaultLang = 'es';
  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }
  if (!text && m.quoted && m.quoted.text) text = m.quoted.text;
  try {
   const result = await translate(`${text}`, {to: lang, autoCorrect: true});
    await conn.reply(m.chat, result.text, m);
  } catch {
    try {
    conn.reply(m.chat, wait, m, {
    contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, showAdAttribution: true }}})
      const lol = await fetch(`https://api.lolhuman.xyz/api/translate/auto/${lang}?apikey=${lolkeysapi}&text=${text}`);
      const loll = await lol.json();
      const result2 = loll.result.translated;
      await conn.reply(m.chat, result2, m);
    } catch {
      await m.reply(`🔶Ocurrió un error al traducir✨\n\n◆Intenta de nuevo con otro idioma o texto 🌱`);
    }
  }
};
handler.command = ['translate','traducir','trad'];
handler.register = true
export default handler;
