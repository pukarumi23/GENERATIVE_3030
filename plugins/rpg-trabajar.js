let cooldowns = {}

let handler = async (m, { conn, isPrems }) => {
let user = global.db.data.users[m.sender]
let tiempo = 5 * 60
if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
const tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
conn.reply(m.chat, `🎵💙 Necesitas descansar tu voz virtual... 💙🎵\n\n✨ Debes esperar *${tiempo2}* para trabajar en el próximo concierto de nuevo ✨`, m)
return
}
let rsl = Math.floor(Math.random() * 500)
cooldowns[m.sender] = Date.now()
await conn.reply(m.chat, `🎤💙 ${pickRandom(trabajo)} *${toNum(rsl)}* ( *${rsl}* ) ${moneda} 🎵✨`, m)
user.coin += rsl
}

handler.help = ['trabajar']
handler.tags = ['economy']
handler.command = ['w','work','chambear','chamba', 'trabajar']
handler.group = true;
handler.register = true;

export default handler

function toNum(number) {
if (number >= 1000 && number < 1000000) {
return (number / 1000).toFixed(1) + 'k'
} else if (number >= 1000000) {
return (number / 1000000).toFixed(1) + 'M'
} else if (number <= -1000 && number > -1000000) {
return (number / 1000).toFixed(1) + 'k'
} else if (number <= -1000000) {
return (number / 1000000).toFixed(1) + 'M'
} else {
return number.toString()}}

function segundosAHMS(segundos) {
let minutos = Math.floor((segundos % 3600) / 60)
let segundosRestantes = segundos % 60
return `${minutos} minutos y ${segundosRestantes} segundos`
}

function pickRandom(list) {
return list[Math.floor(list.length * Math.random())];
}

// Thanks to FG98
const trabajo = [
   "🎤 Trabajas como compositora virtual y ganas",
   "🎵 Trabajas en un estudio de grabación holográfico, ganando",
   "💫 Organizas un concierto virtual y obtienes",
   "✨ Afinando sintetizadores encuentras",
   "🎶 Desarrollas software musical y ganas",
   "💙 Trabajaste en el estudio horas extras por",
   "🎤 Trabajas como productora musical virtual y ganas",
   "🌟 Alguien vino y representó una sinfonía. Por acompañar te dieron",
   "🎵 Compraste y vendiste instrumentos digitales y ganaste",
   "💫 Trabajas en el café virtual de Miku como DJ y ganas",
   "🎶 Trabajas 10 minutos en un estudio holográfico local. Ganaste",
   "✨ Trabajas como escritora de letras melodiosas y ganas",
   "💙 Revisas tu colección y decides vender algunos samples que no necesitas. Resulta que toda esa música valía",
   "🎤 Desarrollas aplicaciones musicales para ganarte la vida y ganas",
   "🎵 Trabajas todo el día en la empresa discográfica por",
   "🌟 Diseñaste un logo para una banda virtual por",
   "🎶 ¡Trabajó lo mejor que pudo en un estudio que estaba contratando y ganó su bien merecido!",
   "💫 Trabajas como afinadora de pianos digitales y ganas",
   "✨ Trabajas como actriz de voz para animes musicales y te las arreglaste para ganar",
   "💙 Estabas componiendo melodías y Ganaste",
   "🎤 Trabajas como creadora de beats virtuales y ganas",
   "🎵 Trabajas como artista de conciertos holográficos y ganas",
   "🌟 ¡Hiciste trabajo social musical por una buena causa! por tu buena causa Recibiste",
   "🎶 Reparaste un sintetizador averiado en el ciberespacio. El propietario te pagó",
   "💫 Trabajas como ecologista de sonidos digitales y ganas",
   "✨ Trabajas en un parque temático virtual como mascota musical y ganas",
   "💙 Reparas las máquinas de karaoke y recibes",
   "🎤 Hiciste algunos trabajos ocasionales en el mundo virtual y ganaste",
   "🎵 Limpias un poco de ruido digital del audio y ganas",
   "🌟 Resolviste el misterio del glitch musical y el gobierno virtual te recompensó con una suma de",
   "🎶 Trabajas como musicóloga virtual y ganas",
   "💫 Vendiste melodías digitales y obtuviste",
   "✨ Reparas las máquinas de ritmo y recibes",
] 
