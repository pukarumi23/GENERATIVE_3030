let cooldowns = {}

let handler = async (m, { conn, isPrems }) => {
let user = global.db.data.users[m.sender]
let tiempo = 5 * 60
if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
const tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
conn.reply(m.chat, `🔶 Necesitas descansar ... 🔶\n\n🌿 Debes esperar *${tiempo2}* para trabajar en tu proxima chamba.`, m, rcanal)
return
}
let rsl = Math.floor(Math.random() * 500)
cooldowns[m.sender] = Date.now()
await conn.reply(m.chat, ` ${pickRandom(trabajo)} *${toNum(rsl)}* ( *${rsl}* ) ${moneda} `, m, rcanal)
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


const trabajo = [
   "🛠️ Trabajas como artesano y ganas",
   "🏛️ Colaboras en la construcción de un templo antiguo y recibes",
   "🌾 Cultivas la tierra todo el día y obtienes",
   "🪙 Comerciante en el mercado local, ganaste",
   "🛡️ Ayudaste a un guerrero en su entrenamiento y recibes",
   "🔥 Pasaste horas fundiendo metales y al final consigues",
   "🧵 Te dedicas a tejer mantos coloridos y ganas",
   "🌟 Acompañaste a un sabio en sus rituales y recibes",
   "🪓 Fuiste a cortar leña en el bosque y regresas con",
   "🍂 Trabajas en el campo cosechando maíz y obtienes",
   "📜 Copias antiguos manuscritos y recibes",
   "🧱 Ayudaste a levantar murallas de piedra y ganas",
   "💧 Transportas agua desde el río y por tu esfuerzo recibes",
   "⚒️ Realizas trabajos de minería y obtienes",
   "🐚 Intercambias caracoles sagrados en el trueque y ganas",
   "🌄 Guías a viajeros por los caminos antiguos y te pagan con",
   "🪙 Reparaste herramientas de los aldeanos y ganaste",
   "🌿 Recolectas hierbas medicinales y las vendes por",
   "🛶 Remaste todo el día transportando mercancías y ganas",
   "🍖 Preparaste un banquete para la comunidad y recibes",
   "🏹 Practicaste con el arco y por tu destreza te premiaron con",
   "🪵 Construiste chozas para la aldea y te recompensaron con",
   "🐟 Pescaste en el lago y vendiste tu captura por",
   "⛰️ Exploraste montañas peligrosas y encontraste",
   "🪙 Custodiaste el mercado local y recibiste",
   "🌽 Participaste en la gran cosecha y ganaste",
   "🧭 Resolviste un problema en la aldea y te recompensaron con",
   "⚒️ Arreglaste herramientas rotas y recibiste",
   "🐎 Cuidaste caballos de los viajeros y obtuviste",
   "🏞️ Cazaste en el bosque y regresaste con",
   "🛡️ Fuiste guardián del poblado por un día y recibes",
   "🪶 Tallaste figuras en piedra y las vendiste por",
   "🍃 Recolectaste frutos silvestres y ganaste",
   "🔥 Encendiste el fuego ceremonial y fuiste recompensado con",
   "💥 Trabajaste vendiendo fruna y ganaste"
] 
