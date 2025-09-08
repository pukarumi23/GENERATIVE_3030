import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let mentionedJid = [who]
  let pp = await conn.profilePictureUrl(who, 'image').catch((_) => 'https://files.catbox.moe/neim8e.jpeg')
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)
  if (user.registered === true) return m.reply(`
⚠️ YA REGISTRADO ⚠️ 


🔶 Ya estás registrado en el sistema 🔶

🔄 ¿Quieres registrarte de nuevo?
📝 Usa: *${usedPrefix}unreg* para eliminar tu registro actual`)
  if (!Reg.test(text)) return m.reply(`
📝 FORMATO INCORRECTO 📝

🔶🖥 Uso correcto del comando 🖥🔶

📋 *Formato:* ${usedPrefix + command} nombre.edad
✨ *Ejemplo:* ${usedPrefix + command} ${name2}.18

🔌 ¡Regístrate para acceder a todas las funciones! 🔌`)
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) return m.reply(`
❌ NOMBRE VACÍO ❌

🔶 El nombre no puede estar vacío 🔶
📝 Por favor ingresa tu nombre`)
  if (!age) return m.reply(`
❌ EDAD VACÍA ❌

🔶 La edad no puede estar vacía 🔶
🎂 Por favor ingresa tu edad`)
  if (name.length >= 100) return m.reply(`
  📏 NOMBRE MUY LARGO 📏 

🔶 El nombre es demasiado largo 🔶
✂️ Usa un nombre más corto (máximo 100 caracteres)`)
  age = parseInt(age)
  if (age > 1000) return m.reply(`
  👴 ¡WOW ABUELO! 👴

🔶 ¡Increíble edad! 🔶
🎉 ¿En serio tienes más de 1000 años?
😄 Usa una edad más realista`)
  if (age < 5) return m.reply(`
  👶 MUY PEQUEÑO 👶  

🔶 ¡Eres muy pequeño para usar el bot! 🔶
🍼 Los bebés necesitan supervisión
😊 Usa una edad mayor a 5 años`)
  user.name = name + '✓'.trim()
  user.age = age
  user.regTime = + new Date      
  user.registered = true
  global.db.data.users[m.sender].coin += 40
  global.db.data.users[m.sender].exp += 300
  global.db.data.users[m.sender].joincount += 20
  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)
let regbot = `
🔶 𝙄́𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊 𝙀𝙓𝙄𝙏𝙊𝙎𝙊! 🔶

📋 𝘿𝘼𝙏𝙊𝙎 𝙋𝙀𝙍𝙎𝙊𝙉𝘼𝙇𝙀𝙎        
👤 Nombre: ${name}
🎂 Edad: ${age} años
✅ Estado: Verificado ✓
🆔 ID: ${sn}

🎁 𝙍𝙀𝘾𝙊𝙈𝙋𝙀𝙉𝙎𝘼𝙎 𝙄𝙉𝙄𝘾𝙄𝘼𝙇𝙀𝙎 
💰 ${moneda}: +40
✨ Experiencia: +300 XP
🎟️ Tokens: +20

🌿 ¡Ahora puedes usar todos los comandos del bot! 🌿
🔶 Usa *#menu* para ver todas las funciones disponibles 🔶

${dev}`
await m.react('🧡')

await conn.sendMessage(m.chat, {
        text: regbot,
        contextInfo: {
            externalAdReply: {
                title: '🔶 ¡Registro Exitoso en el Bot ! 🔶',
                body: '🌱 Bienvenido al mundo del conocimiento🌱',
                thumbnailUrl: pp,
                sourceUrl: channel,
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });    
}; 
handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'] 

export default handler
