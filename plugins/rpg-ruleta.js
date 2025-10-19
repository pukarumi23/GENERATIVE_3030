let cooldowns = {}

let handler = async (m, { conn, text, command, usedPrefix }) => {
  let users = global.db.data.users[m.sender]
  let tiempoEspera = 10
  
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
    conn.reply(m.chat, `⏳ *Espera un poquito...* 💔\nAún tienes que esperar *${tiempoRestante}* para volver a jugar~ ✨`, m)
    return
  }
  
  cooldowns[m.sender] = Date.now()
  
  if (!text) return conn.reply(m.chat, `💋 *Vamos a jugar a la ruleta~* 🎡\n\nDebes apostar así:\n*${usedPrefix + command} <cantidad> <color>*\n\n✨ Ejemplo: *${usedPrefix + command} 20 black*\n🎀 Colores: *black* o *red*`, m)
  
  let args = text.trim().split(" ")
  
  if (args.length !== 2) return conn.reply(m.chat, `😒 Formato incorrecto cariño...\n\n*${usedPrefix + command} <cantidad> <black|red>*\n\nEjemplo: *${usedPrefix + command} 50 red*`, m)
  
  let coin = parseInt(args[0])
  let color = args[1].toLowerCase()
  
  if (isNaN(coin) || coin <= 0) return conn.reply(m.chat, `💸 Por favor, ingresa una cantidad válida para apostar~ ✨`, m)
  
  if (coin > 10000) return conn.reply(m.chat, `💰 La apuesta máxima es de *10,000 ${moneda}*\n¡Sé más realista~! 😏`, m)
  
  if (!(color === 'black' || color === 'red')) return conn.reply(m.chat, `🎡 Debes elegir un color válido:\n🖤 *black* (negro)\n❤️ *red* (rojo)\n\n¡Elige cuidadosamente~! 💋`, m)
  
  if (coin > users.coin) return conn.reply(m.chat, `💔 No tienes suficientes ${moneda}...\nTe faltan ${coin - users.coin} para esa apuesta 😔`, m)
  
  const colorEmoji = color === 'black' ? '🖤' : '❤️'
  
  await conn.reply(m.chat, `╔════════════════════╗
║ 🎡 *¡RULETA ACTIVA!* 🎡
╠════════════════════╣
║ Apuesta: *${coin} 💸*
║ Color: ${colorEmoji} *${color.toUpperCase()}*
║ 
║ ⏳ Girando en 10 seg...
╚════════════════════╝`, m)
  
  setTimeout(() => {
    let result = Math.random()
    let win = false
    
    if (result < 0.5) {
      win = color === 'black'
    } else {
      win = color === 'red'
    }
    
    if (win) {
      users.coin += coin
      conn.reply(m.chat, `╔════════════════════╗
║ 🎉 *¡GANASTE!* 🎉
╠════════════════════╣
║ ${colorEmoji} ¡Qué suerte tienes~!
║ 
║ +${coin} 💸 ${moneda}
║ Total: ${users.coin} 💸
║
║ ¡Increíble! 💕✨
╚════════════════════╝`, m)
    } else {
      users.coin -= coin
      conn.reply(m.chat, `╔════════════════════╗
║ 😔 *¡PERDISTE...* 😔
╠════════════════════╣
║ La ruleta no fue 
║ amable esta vez 💔
║ 
║ -${coin} 💸 ${moneda}
║ Total: ${users.coin} 💸
║
║ ¡Intenta de nuevo! 💪
╚════════════════════╝`, m)
    }
  }, 10000)
}

handler.tags = ['economy']
handler.help = ['ruleta *<cantidad> <color>*']
handler.command = ['ruleta', 'roulette', 'rt']
handler.register = true
handler.group = true

export default handler

function segundosAHMS(segundos) {
  let segundosRestantes = segundos % 60
  return `${segundosRestantes} segundos`
}
