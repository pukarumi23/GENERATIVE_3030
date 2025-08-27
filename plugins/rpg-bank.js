import db from '../lib/database.js'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
    if (who == conn.user.jid) return m.react('🎤')
    if (!(who in global.db.data.users)) return m.reply(`🔶 El usuario no se encuentra en la base de datos 🌿`)
  
    let user = global.db.data.users[who]
    let total = (user.coin || 0) + (user.bank || 0);

    const texto = `𐌔⟦ 🔶 𝕀ℕ𝔽𝕆 𝔼ℂ𝕆ℕ𝕆́𝕄𝕀ℂ𝔸 🔶 ⟧𐌔 

༺❀༻═══•❖•═══༺❀༻
👤 usuario: *${conn.getName(who)}*  
✠════════════✠
💳cartera: *${user.coin} ${moneda}*
✠════════════✠
🏦 Banco: *${user.bank} ${moneda}*
✠════════════✠
📊 Total: *${total} ${moneda}*
༺❀༻═══•❖•═══༺❀༻

𐌔⟦ 🌿 Deposita tus Intis con #deposit ⟧𐌔`;

    await conn.reply(m.chat, texto, m)
}

handler.help = ['bal']
handler.tags = ['rpg']
handler.help = ['bal']
handler.tags = ['rpg']
handler.command = ['bal', 'balance', 'bank'] 
handler.register = true 
handler.group = true 

export default handler
