let cooldowns = {}
let handler = async (m, { conn, isPrems }) => {
let user = global.db.data.users[m.sender]
let tiempo = 5 * 60
if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
const tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
conn.reply(m.chat, `🌸 ¡Ey! Necesitas descansar un poquito~ 💕\n\n⏰ Espera *${tiempo2}* para trabajar de nuevo ✨`, m, rcanal)
return
}
let rsl = Math.floor(Math.random() * 500)
cooldowns[m.sender] = Date.now()
await conn.reply(m.chat, `✨💖 ¡TRABAJO COMPLETADO! 💖✨

╔═══════════════════╗
║ 💼 TU TRABAJO     ║
╚═══════════════════╝

${pickRandom(trabajo)} *${toNum(rsl)}* ( *${rsl}* ) ${moneda}

╔═══════════════════╗
║ 💕 ¡BIEN HECHO!   ║
╚═══════════════════╝

🌸 ¡Sigue trabajando duro! ✨`, m, rcanal)
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
   "👗 Trabajaste como diseñadora de moda y ganaste",
   "📸 Hiciste una sesión de fotos profesional y recibes",
   "🎨 Creaste un cosplay increíble y obtuviste",
   "💄 Trabajaste como maquilladora y ganaste",
   "✨ Modelaste en una pasarela y recibes",
   "🎭 Participaste en un evento de anime y consigues",
   "🛍️ Vendiste accesorios kawaii y ganaste",
   "📱 Creaste contenido para redes sociales y recibes",
   "🎀 Diseñaste pelucas para cosplay y obtuviste",
   "💅 Trabajaste en un salón de uñas y ganaste",
   "🌸 Decoraste un evento temático y recibes",
   "🎪 Participaste como jurado en un concurso y ganaste",
   "🧵 Cosiste trajes personalizados y obtuviste",
   "💖 Organizaste una convención y recibes",
   "🎬 Grabaste un video de unboxing y ganaste",
   "🏪 Trabajaste en una tienda de anime y obtuviste",
   "✂️ Hiciste alteraciones de ropa y ganaste",
   "🎨 Pintaste fanart por comisión y recibes",
   "📷 Editaste fotos de cosplayers y obtuviste",
   "🎤 Participaste en un karaoke y ganaste",
   "💐 Decoraste con flores un photoshoot y recibes",
   "🎪 Organizaste un meet & greet y ganaste",
   "🌟 Fuiste invitada especial a un evento y obtuviste",
   "👘 Trabajaste en una tienda de kimonos y recibes",
   "🎭 Actuaste en una obra teatral y ganaste",
   "💕 Vendiste merchandising hecho a mano y obtuviste",
   "📚 Trabajaste en una librería de manga y recibes",
   "🎨 Diste clases de dibujo anime y ganaste",
   "🎬 Hiciste streaming en vivo y obtuviste",
   "✨ Colaboraste con una marca de cosméticos y recibes",
   "🎀 Vendiste accesorios de pelo y ganaste",
   "💄 Trabajaste como estilista y obtuviste",
   "🌸 Participaste en un desfile de moda y recibes",
   "📱 Hiciste reseñas de productos y ganaste",
   "💖 Trabajaste vendiendo ropa kawaii y obtuviste"
]
