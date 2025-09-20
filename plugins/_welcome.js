import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net"}  
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://files.catbox.moe/8vk6hb.jpg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  let txt = '❤️ ¡Un nuevo estudiante ah llegado! ❤️'
  let txt1 = '🎓 ¡Esperamos verte pronto! 🎓'
  let groupSize = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `✨ Bienvenido a la academia musical de ${groupMetadata.subject}✨\n\n❤️ @${m.messageStubParameters[0].split`@`[0]} ❤️\n\n🎓 ${global.welcom1} 🎓\n\n🌟 ¡Ahora somos ${groupSize} Estudiantes de Teto! 🌟\n\n💥 ¡Prepárate para aprender con nosotros! (⁠≧⁠▽⁠≦⁠) 💥\n\n> 🌹 Usa *#help* para ver todos los comandos permitidos de Teto! 🌹\n SIGUE NUESTRO CANAL \n https://whatsapp.com/channel/0029Vb6Wxwa3mFY1RdeE9K1c\n> 𝙏𝙀𝙏𝙊 𝙂𝙊𝙍𝘿𝘼`    
    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak, m, rcanal)
  }
  
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `🎓 *¡Un estudiante se ah graduado!* ${groupMetadata.subject} te extrañará 🎓\n\n❤️ @${m.messageStubParameters[0].split`@`[0]} ❤️\n\n🥖 ${global.welcom2} 🥖\n\n🌟 Ahora somos ${groupSize} estudiantes esperándote 🌟\n\n🌹 ¡Esperamos verte pronto en nuestra academia! (⁠✿⁠^⁠‿⁠^⁠) 🌹\n\n> 💫 Las enseñanzas de Teto siempre te acompañará! 🎓\n SIGUE NUESTRO CANAL \n https://whatsapp.com/channel/0029Vb6Wxwa3mFY1RdeE9K1c\n> 𝙏𝙀𝙏𝙊 𝙂𝙊𝙍𝘿𝘼`
    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, fkontak, m, rcanal)
  }}
