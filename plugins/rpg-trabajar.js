let cooldowns = {}

let handler = async (m, { conn, isPrems }) => {
let user = global.db.data.users[m.sender]
let tiempo = 5 * 60
if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
const tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
conn.reply(m.chat, `🔶 Necesitas descansar despues de mucha camba... 🔶\n\n⫸ Debes esperar *${tiempo2}* para trabajar en tu proxima chamba.`, m)
return
}
let rsl = Math.floor(Math.random() * 500)
cooldowns[m.sender] = Date.now()
await conn.reply(m.chat, `⫸ ${pickRandom(trabajo)} *${toNum(rsl)}* intis \n 💳se agregaran a tu billetera ( *${rsl}* ) ${moneda} ◊`, m)
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
   "💼 Trabajas como redactora freelance y ganas",
   "🏢 Trabajas en una oficina como asistente administrativa, ganando",
   "📦 Organizas el inventario de un almacén y obtienes",
   "🔧 Ayudas en un taller mecánico y encuentras",
   "💻 Desarrollas páginas web y ganas",
   "🕒 Trabajaste horas extras en la tienda por",
   "📊 Trabajas como analista de datos y ganas",
   "👥 Ayudas a un cliente a resolver un problema. Por tu ayuda te dieron",
   "🛒 Compraste y vendiste artículos de segunda mano y ganaste",
   "☕ Trabajas en una cafetería como barista y ganas",
   "⏱️ Trabajas 10 minutos extra en tu turno. Ganaste",
   "📝 Trabajas como correctora de textos y ganas",
   "📚 Revisas tu casa y decides vender algunos libros viejos. Resulta que valían",
   "📱 Diseñas aplicaciones móviles y ganas",
   "🏭 Trabajas todo el día en la fábrica por",
   "🎨 Diseñaste un folleto publicitario por",
   "⭐ ¡Trabajaste lo mejor que pudiste en un proyecto especial y ganaste tu bien merecido bono!",
   "🏠 Trabajas como organizadora profesional y ganas",
   "🎙️ Trabajas de recepcionista y te las arreglaste para ganar",
   "🔍 Encuentras un error importante en un documento y la empresa te premia con",
   "📈 Trabajas como trader desde casa y ganas",
   "📋 Trabajas como encuestadora y ganas",
   "🤲 ¡Hiciste trabajo voluntario en un banco de alimentos! Por tu buena causa recibiste",
   "🛠️ Reparaste una cerradura. El propietario te pagó",
   "🌳 Trabajas como jardinera y ganas",
   "🎪 Trabajas en una feria local y ganas",
   "🔩 Reparas electrodomésticos pequeños y recibes",
   "👷 Hiciste algunos trabajos de pintura y ganaste",
   "🧹 Limpias una casa y ganas",
   "🏆 Solucionaste un problema complejo y tu jefe te recompensó con una suma de",
   "📖 Trabajas como tutora académica y ganas"
] 
