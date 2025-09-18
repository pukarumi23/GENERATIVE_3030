import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  const fkontak = { 
    "key": { 
      "participants": "0@s.whatsapp.net", 
      "remoteJid": "status@broadcast", 
      "fromMe": false, 
      "id": "Halo" 
    }, 
    "message": { 
      "contactMessage": { 
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:;Bot;;;\nFN:Bot\nTEL;waid=59100000000:59100000000\nEND:VCARD` 
      } 
    } 
  }
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://files.catbox.moe/neim8e.jpeg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]

  let groupSize = participants.length
  if (m.messageStubType == 27) {
    groupSize++;
  } else if (m.messageStubType == 28 || m.messageStubType == 32) {
    groupSize--;
  }

  // BIENVENIDA barroca y decorativa TODO EN UN SOLO MENSAJE
  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `
╔═════════════════ ༺☆༻ ═════════════════╗
        🌟✨ 𝒝𝒊𝒆𝒏𝒗𝒆𝒏𝒊𝒅𝒐 ✨🌟
╚═════════════════ ༺☆༻ ═════════════════╝

🎊✨ ¡Un nuevo compañero ha llegado! ¡Que su estancia sea legendaria! ✨🎊

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🎉  *@${m.messageStubParameters[0].split`@`[0]}*  🎉
┃ Se une al noble grupo: 
┃ 『 *${groupMetadata.subject}* 』
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

★彡  ${global.welcom1 || "¡Esperamos tus aportes y buena vibra!"}  彡★

╔═════════════════════════╗
┃  Ahora somos 👥: *${groupSize}* miembros
╚═════════════════════════╝

┏━═━═━═━═━═━═━═━═━═━═━═━┓
┃  𝑺í𝒆𝒏𝒕𝒆𝒕𝒆 𝒄𝒐𝒎𝒐 𝒆𝒏 𝒄𝒂𝒔𝒂  👑
┗━═━═━═━═━═━═━═━═━═━═━═━┛
`
    await conn.sendMini(m.chat, bienvenida, dev, '', img, img, redes, fkontak, m, rcanal)
  }
  
  // DESPEDIDA barroca y decorativa TODO EN UN SOLO MENSAJE
  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `
╔═══ ༺☆༻ ═══╗
    🕊️ 𝒉𝒂𝒔𝒕𝒂 𝒑𝒓𝒐𝒏𝒕𝒐 🕊️
╚═══ ༺☆༻ ═══╝

🌙💫 Un amigo parte, pero deja huella dorada en nuestro grupo 💫🌙

┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 😢 *@${m.messageStubParameters[0].split`@`[0]}* 
┃ Deja el grupo: 
┃ 『 *${groupMetadata.subject}* 』
┗━━━━━━━━━━━━━━━━━━━━━━━┛

✾✦  ${global.welcom2 || "¡Éxitos en tu camino! No olvides que aquí tienes amigos."}  ✦✾

╔═══════════════════════╗
┃  Ahora somos 👥: *${groupSize}* miembros
╚═══════════════════════╝

┏━═━═━═━═━═━═━═━═━═━┓
┃  𝑳𝒂 𝒑𝒖𝒆𝒓𝒕𝒂 𝒒𝒖𝒆𝒅𝒂 𝒂𝒃𝒊𝒆𝒓𝒕𝒂  🌹
┗━═━═━═━═━═━═━═━═━═━┛
`
    await conn.sendMini(m.chat, bye, dev, '', img, img, redes, fkontak, m, rcanal)
  }
}
