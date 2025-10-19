import db from '../lib/database.js'

let handler = async (m, { args }) => {
  let user = global.db.data.users[m.sender]
  
  if (!args[0]) {
    return m.reply(`💳 *¿Cuánto deseas retirar~?* 💸\n\nEscribe la cantidad de ${moneda} que quieres sacar del banco\n✨ Ejemplo: *#retirar 50000* o *#retirar all*`)
  }
  
  if (args[0] == 'all') {
    let count = parseInt(user.bank)
    
    if (!count || count <= 0) {
      return m.reply(`💔 *¡Ay no!* No tienes nada en el banco para retirar...`)
    }
    
    user.bank -= count * 1
    user.coin += count * 1
    
    await m.reply(`╔════════════════════════════╗
║ 💰 *¡RETIRO COMPLETADO!* 💰 ║
╠════════════════════════════╣
║                            ║
║ ✨ Retiraste: +${count} ${moneda}
║ 📊 Banco: ${user.bank} ${moneda}
║ 💸 Cartera: ${user.coin} ${moneda}
║
║ ⚠️ Ten cuidado~
║ ¡Ahora pueden robarte! 😏
║                            ║
╚════════════════════════════╝`)
    return !0
  }
  
  if (!Number(args[0])) {
    return m.reply(`😒 Debes ingresar una cantidad válida cariño...\n\n📌 *Ejemplos:*\n > *#retirar 25000*\n > *#retirar all*`)
  }
  
  let count = parseInt(args[0])
  
  if (!user.bank || user.bank <= 0) {
    return m.reply(`💔 *Tu banco está vacío~* 🏧\n\n¡No tienes dinero guardado!\nIntenta ganar más primero 💸✨`)
  }
  
  if (user.bank < count) {
    return m.reply(`💸 *¡No tienes suficiente!* 💔\n\nSólo tienes: *${user.bank} ${moneda}*\nIntentaste retirar: *${count} ${moneda}*\n\n¡Sé más realista~! 😏`)
  }
  
  user.bank -= count * 1
  user.coin += count * 1
  
  await m.reply(`╔════════════════════════════╗
║ 💰 *¡RETIRO COMPLETADO!* 💰 ║
╠════════════════════════════╣
║                            ║
║ ✨ Retiraste: +${count} ${moneda}
║ 📊 Banco: ${user.bank} ${moneda}
║ 💸 Cartera: ${user.coin} ${moneda}
║
║ ⚠️ Ten cuidado~
║ ¡Ahora pueden robarte! 😏
║                            ║
╚════════════════════════════╝`)
}

handler.help = ['retirar']
handler.tags = ['rpg']
handler.command = ['withdraw', 'retirar', 'with']
handler.group = true
handler.register = true

export default handler
