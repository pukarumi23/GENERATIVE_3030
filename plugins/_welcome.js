import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN[...]` } } }
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://files.catbox.moe/neim8e.jpeg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  let txt = '🎉 ¡Un nuevo compañero acaba de llegar! ¿Listos para la acción? 🎉'
  let txt1 = '😢 Alguien se despide, pero las puertas siempre estarán abiertas 😢'
  let groupSize = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `🙌 *¡Bienvenido!* Te sumas a ${groupMetadata.subject}. \n\n✨ @${m.messageStubParameters[0].split`@`[0]} ✨\n\n${global.welcom1}\n\nSomos ${groupSize} personas únicas, ¡comparte tus ideas, haz amigos y disfruta la experiencia! 🚀`
    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak, m, rcanal)
  }
  
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `👋 *¡Hasta pronto!* El grupo ${groupMetadata.subject} siempre recordará tus aportes.\n\n💬 @${m.messageStubParameters[0].split`@`[0]} 💬\n\n${global.welcom2}\n\nAhora somos ${groupSize}. ¡No olvides que puedes regresar cuando quieras! 🌟`
    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, fkontak, m, rcanal)
  }
}
