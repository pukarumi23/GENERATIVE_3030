let handler = async (m, {conn, usedPrefix}) => {
let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
if (who == conn.user.jid) return error 
if (!(who in global.db.data.users)) return conn.reply(m.chat, `🌸 ¡Uy! Este usuario no está registrado en mi base de datos~ ✨`, m , rcanal)
let user = global.db.data.users[who]
await m.reply(`${who == m.sender ? `✨💖 TU CARTERA 💖✨

╭━━━━━━━━━━━━━━╮
┃ 👛 DINERO
╰━━━━━━━━━━━━━━╯

💰 ${user.coin} ${moneda}

🌸 ¡Guárdalo bien! ✨` : `✨💖 CARTERA 💖✨

╭━━━━━━━━━━━━━━╮
┃ 👤 USUARIO
╰━━━━━━━━━━━━━━╯
💕 @${who.split('@')[0]}

╭━━━━━━━━━━━━━━╮
┃ 👛 DINERO
╰━━━━━━━━━━━━━━╯

💰 ${user.coin} ${moneda}

🌸 ¡Qué bien! ✨`}`, null, { mentions: [who] })}
handler.help = ['wallet']
handler.tags = ['economy']
handler.command = ['wallet', 'cartera']
handler.group = true
handler.register = true
export default handler
