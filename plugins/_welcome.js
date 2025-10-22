import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Hola" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Marin;;;\nFN:Marin\nTEL;waid=0:0\nEND:VCARD`}}}
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://i.pinimg.com/736x/e7/a1/e4/e7a1e45b061ec73eb163770c750497cd.jpg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  let txt = '💖 ¡Nueva persona en el grupo! 💖'
  let txt1 = '🌸 ¡Adiós! 🌸'
  let groupSize = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }
  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `✨ *¡Hola, hola! Bienvenido/a a* ${groupMetadata.subject} *~* ✨\n\n💕 @${m.messageStubParameters[0].split`@`[0]} 💕\n\n🌸 ¡Qué emoción! Espero que te diviertas un montón aquí y hagamos muchos amigos juntos~ 🎀\n\n¡Ahora somos ${groupSize} personas! 💖`
    await conn.sendMini(m.chat, txt, 'Marin', bienvenida, img, img, '¡Diviértete! ✨', fkontak, m, 'canal')
  }
  
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `🌸 *¡Ay no! Se fue* @${m.messageStubParameters[0].split`@`[0]} *de* ${groupMetadata.subject} 🌸\n\n💫 Esperamos que vuelvas pronto~ ¡Te vamos a extrañar! 🥺\n\nAhora quedamos ${groupSize} personas 💕`
    await conn.sendMini(m.chat, txt1, 'Marin', bye, img, img, '¡Vuelve pronto! 💖', fkontak, m, 'canal')
  }
}
