import db from '../lib/database.js'
let handler = async (m, { args }) => {
let user = global.db.data.users[m.sender]
if (!args[0]) return m.reply(`💖 ¡Ey! Dime cuántos *${moneda}* quieres depositar en el banco~\n\n✨ Ejemplo: *#d 1000* o *#d all*`)
if ((args[0]) < 1) return m.reply(`🌸 ¡Uy! Esa cantidad no es válida. Ingresa un número positivo~`)
if (args[0] == 'all') {
let count = parseInt(user.coin)
user.coin -= count * 1
user.bank += count * 1
await m.reply(`✨💖 ¡DEPÓSITO EXITOSO! 💖✨

╔═══════════════════╗
║ 🏦 BANCO          ║
╚═══════════════════╝

💰 Depositaste: *${count} ${moneda}*

╔═══════════════════╗
║ 💕 TU DINERO      ║
╚═══════════════════╝

👛 Cartera: *${user.coin} ${moneda}*
🏦 Banco: *${user.bank} ${moneda}*

🌸 ¡Tu dinero está seguro ahora! Nadie podrá robártelo~ ✨`)
return !0
}
if (!Number(args[0])) return m.reply(`🥺 ¡Espera! Debes ingresar una cantidad válida~\n\n📝 Ejemplos:\n> *#d 25000*\n> *#d all*`)
let count = parseInt(args[0])
if (!user.coin) return m.reply(`😢 ¡Ay no! No tienes suficientes *${moneda}* en tu cartera~`)
if (user.coin < count) return m.reply(`💕 Solo tienes *${user.coin} ${moneda}* en tu cartera. ¡Deposita una cantidad menor! ✨`)
user.coin -= count * 1
user.bank += count * 1
await m.reply(`✨💖 ¡DEPÓSITO EXITOSO! 💖✨

╔═══════════════════╗
║ 🏦 BANCO          ║
╚═══════════════════╝

💰 Depositaste: *${count} ${moneda}*

╔═══════════════════╗
║ 💕 TU DINERO      ║
╚═══════════════════╝

👛 Cartera: *${user.coin} ${moneda}*
🏦 Banco: *${user.bank} ${moneda}*

🌸 ¡Tu dinero está seguro ahora! Nadie podrá robártelo~ ✨`)}
handler.help = ['depositar']
handler.tags = ['rpg']
handler.command = ['deposit', 'depositar', 'd', 'aguardar']
handler.group = true
handler.register = true
export default handler
