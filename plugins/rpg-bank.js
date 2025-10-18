import db from '../lib/database.js'
let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
    if (who == conn.user.jid) return m.react('💖')
    if (!(who in global.db.data.users)) return m.reply(`🌸 ¡Uy! Ese usuario no está en mi base de datos~`)
  
    let user = global.db.data.users[who]
    let total = (user.coin || 0) + (user.bank || 0);
    const texto = `✨💖 INFO ECONÓMICA 💖✨

╭━━━━━━━━━━━━━━╮
┃ 👤 USUARIO
╰━━━━━━━━━━━━━━╯
💕 ${conn.getName(who)}

╭━━━━━━━━━━━━━━╮
┃ 💰 TU DINERO
╰━━━━━━━━━━━━━━╯

👛 Cartera: *${user.coin} ${moneda}*
🏦 Banco: *${user.bank} ${moneda}*
💎 Total: *${total} ${moneda}*

╭━━━━━━━━━━━━━━╮
┃ 💡 CONSEJO
╰━━━━━━━━━━━━━━╯
🌸 Usa *#deposit* para guardar tu dinero en el banco de forma segura~ ✨`;
    await conn.reply(m.chat, texto, m)
}
handler.help = ['bal']
handler.tags = ['rpg']
handler.command = ['bal', 'balance', 'bank'] 
handler.register = true 
handler.group = true 
export default handler
