let cooldowns = {}
let handler = async (m, { conn, text, command, usedPrefix }) => {
let users = global.db.data.users
let senderId = m.sender
let senderName = conn.getName(senderId)
let tiempo = 5 * 60
if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
let tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
m.reply(`🌸 ¡Ey! Ya cometiste un crimen hace poco~ Espera ⏱️ *${tiempo2}* antes de intentarlo otra vez para no ser atrapada 💕`)
return
}
cooldowns[m.sender] = Date.now()
let senderCoin = users[senderId].coin || 0
let randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
while (randomUserId === senderId) {
randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]}
let randomUserCoin = users[randomUserId].coin || 0
let minAmount = 15
let maxAmount = 50
let amountTaken = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount
let randomOption = Math.floor(Math.random() * 3)
switch (randomOption) {
case 0:
users[senderId].coin += amountTaken
users[randomUserId].coin -= amountTaken
conn.sendMessage(m.chat, {
text: `✨💖 ¡CRIMEN EXITOSO! 💖✨

╔═══════════════════╗
║ 🎉 ¡LO LOGRASTE!  ║
╚═══════════════════╝

🥷 Acabas de robar *${amountTaken} ${moneda} 💸* a @${randomUserId.split("@")[0]}

╔═══════════════════╗
║ 💰 RECOMPENSA     ║
╚═══════════════════╝

💕 *${senderName}* ganó *+${amountTaken} ${moneda} 💸*

🌸 ¡Qué astuta! Pero ten cuidado~ ✨`,
contextInfo: { 
mentionedJid: [randomUserId],
}}, { quoted: m })
break
case 1:
let amountSubtracted = Math.min(Math.floor(Math.random() * (senderCoin - minAmount + 1)) + minAmount, maxAmount)
users[senderId].coin -= amountSubtracted
conn.reply(m.chat, `😢💔 ¡OH NO! 💔😢

╔═══════════════════╗
║ 🚨 TE ATRAPARON   ║
╚═══════════════════╝

🥺 ¡Ay no! No fuiste cuidadosa y te atraparon~

╔═══════════════════╗
║ 💸 MULTA          ║
╚═══════════════════╝

😭 *${senderName}* perdió *-${amountSubtracted} ${moneda} 💸*

🌸 ¡La próxima ten más cuidado! ✨`, m)
break
case 2:
let smallAmountTaken = Math.min(Math.floor(Math.random() * (randomUserCoin / 2 - minAmount + 1)) + minAmount, maxAmount)
users[senderId].coin += smallAmountTaken
users[randomUserId].coin -= smallAmountTaken
conn.sendMessage(m.chat, {
text: `⚠️💕 ¡CRIMEN PARCIAL! 💕⚠️

╔═══════════════════╗
║ 😰 CASI TE ATRAPAN║
╚═══════════════════╝

🥷 Lograste robar algo, pero casi te descubren~

Solo tomaste *${smallAmountTaken} ${moneda} 💸* de @${randomUserId.split("@")[0]}

╔═══════════════════╗
║ 💰 RECOMPENSA     ║
╚═══════════════════╝

💕 *${senderName}* ganó *+${smallAmountTaken} ${moneda} 💸*

🌸 ¡Uff! Estuvo cerca~ ✨`,
contextInfo: { 
mentionedJid: [randomUserId],
}}, { quoted: m })
break
}
global.db.write()}
handler.tags = ['economy']
handler.help = ['crimen']
handler.command = ['crimen', 'crime']
handler.register = true
handler.group = true
export default handler
function segundosAHMS(segundos) {
let horas = Math.floor(segundos / 3600)
let minutos = Math.floor((segundos % 3600) / 60)
let segundosRestantes = segundos % 60
return `${minutos} minutos y ${segundosRestantes} segundos`
}
