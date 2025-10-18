import db from '../lib/database.js'
let buatall = 1
let cooldowns = {}
let handler = async (m, { conn, args, usedPrefix, command, DevMode }) => {
let user = global.db.data.users[m.sender]
let randomaku = `${Math.floor(Math.random() * 101)}`.trim()
let randomkamu = `${Math.floor(Math.random() * 55)}`.trim()
let Aku = (randomaku * 1)
let Kamu = (randomkamu * 1)
let count = args[0]
let who = m.fromMe ? conn.user.jid : m.sender
let username = conn.getName(who)
let tiempoEspera = 15
if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
conn.reply(m.chat, `🌸 ¡Ey, espera! Ya apostaste hace poco~ Espera *⏱️ ${tiempoRestante}* para volver a jugar 💕`, m)
return
}
cooldowns[m.sender] = Date.now()
count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].limit / buatall) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
count = Math.max(1, count)
if (args.length < 1) return conn.reply(m.chat, `💖 ¡Oye! Dime cuántos ` + `💸 *${moneda}*` + ' quieres apostar contra' + ` *${botname}*~` + `\n\n` + '`Ejemplo:`\n' + `> *${usedPrefix + command}* 100\n\n✨ ¡Suerte!`, m)
if (user.coin >= count * 1) {
user.coin -= count * 1
if (Aku > Kamu) {
conn.reply(m.chat, `🎰✨ ¡Veamos los números! ✨🎰

╭━━━━━━━━━━━━━━╮
┃ 🎲 RESULTADOS
╰━━━━━━━━━━━━━━╯

🤖 *${botname}*: ${Aku}
💕 *${username}*: ${Kamu}

╭━━━━━━━━━━━━━━╮
┃ 😢 RESULTADO
╰━━━━━━━━━━━━━━╯

¡Ay no! *${username}*, perdiste *${formatNumber(count)} 💸 ${moneda}*

🌸 ¡No te rindas! Inténtalo de nuevo~ ✨`.trim(), m)
} else if (Aku < Kamu) {
user.coin += count * 2
conn.reply(m.chat, `🎰✨ ¡Veamos los números! ✨🎰

╭━━━━━━━━━━━━━━╮
┃ 🎲 RESULTADOS
╰━━━━━━━━━━━━━━╯

🤖 *${botname}*: ${Aku}
💕 *${username}*: ${Kamu}

╭━━━━━━━━━━━━━━╮
┃ 🎉 RESULTADO
╰━━━━━━━━━━━━━━╯

¡Wooow! *${username}*, ganaste *${formatNumber(count * 2)} 💸 ${moneda}*

💖 ¡Eres increíble! ¡Felicidades! 🎊✨`.trim(), m)
} else {
user.coin += count * 1
conn.reply(m.chat, `🎰✨ ¡Veamos los números! ✨🎰

╭━━━━━━━━━━━━━━╮
┃ 🎲 RESULTADOS
╰━━━━━━━━━━━━━━╯

🤖 *${botname}*: ${Aku}
💕 *${username}*: ${Kamu}

╭━━━━━━━━━━━━━━╮
┃ 🤝 RESULTADO
╰━━━━━━━━━━━━━━╯

¡Empate! *${username}*, recuperas *${formatNumber(count * 1)} 💸 ${moneda}*

🌸 ¡Estuvo cerca! Inténtalo otra vez~ ✨`.trim(), m)}
} else conn.reply(m.chat, `🥺 ¡Uy! No tienes *${formatNumber(count)} 💸 ${moneda}* para apostar~\n\n💡 Trabaja o juega para conseguir más dinero 💕`.trim(), m)}
handler.help = ['apostar *<cantidad>*']
handler.tags = ['economy']
handler.command = ['apostar','casino']
handler.group = true;
handler.register = true
handler.fail = null
export default handler
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}
function segundosAHMS(segundos) {
let segundosRestantes = segundos % 60
return `${segundosRestantes} segundos`
}
function formatNumber(number) {
return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
