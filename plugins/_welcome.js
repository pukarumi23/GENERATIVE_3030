/*import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Hola" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Explorador;;;\nFN:Explorador\nTEL;waid=0:0\nEND:VCARD`}}}
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://files.catbox.moe/4vtid8.jpeg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  let txt = '🚀 ¡Nueva Estrella en la Tripulación! 🚀'
  let txt1 = '🌌 ¡Hasta pronto, Astronauta! 🌌'
  let groupSize = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `🛰️ *¡Bienvenido/a a la comunidad de exploradores de* ${groupMetadata.subject} *!* 🛰️\n\n🌠 @${m.messageStubParameters[0].split`@`[0]} 🌠\n\n🌟 Esperamos que tu viaje por este grupo sea increíble y encuentres nuevos compañeros de aventura. 🌟\n\nActualmente somos ${groupSize} exploradores. 🚀`
    await conn.sendMini(m.chat, txt, 'Explorador', bienvenida, img, img, '¡Únete a la misión!', fkontak, m, 'canal')
  }
  
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `🌌 *¡Hasta pronto, astronauta!* ${groupMetadata.subject} te echará de menos. 🌌\n\n🪐 @${m.messageStubParameters[0].split`@`[0]} 🪐\n\nRecuerda que las estrellas siempre brillan para quienes se atreven a explorar. ✨\n\nAhora somos ${groupSize} exploradores.`
    await conn.sendMini(m.chat, txt1, 'Explorador', bye, img, img, '¡Sigue explorando!', fkontak, m, 'canal')
  }
}
*/
