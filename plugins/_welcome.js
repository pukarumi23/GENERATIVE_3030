import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN[...]` } } }
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://files.catbox.moe/wm4w1x.jpg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  let txt = '🌟 ¡Nuevo miembro se ha unido! 🌟'
  let txt1 = '👋 ¡Hasta pronto! 👋'
  let groupSize = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `👋 *¡Bienvenido/a!* Te damos la bienvenida al grupo *${groupMetadata.subject}*.\n\n🌟 @${m.messageStubParameters[0].split`@`[0]} 🌟\n\nEsperamos que disfrutes tu estadía y participes con todos nosotros.\n\nActualmente somos ${groupSize} miembros.`
    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak, m, rcanal)
  }
  
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `👋 *¡Hasta luego!* El grupo *${groupMetadata.subject}* te extrañará.\n\n🌟 @${m.messageStubParameters[0].split`@`[0]} 🌟\n\nEsperamos verte de vuelta algún día.\n\nAhora somos ${groupSize} miembros.`
    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, fkontak, m, rcanal)
  }
}
