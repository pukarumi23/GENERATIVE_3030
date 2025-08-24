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
await conn.reply(m.chat, `⫸ ${pickRandom(trabajo)} *${toNum(rsl)}* intis \n\n 💳se agregaran a tu billetera ( *${rsl}* ) ${moneda} `, m)
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
    "🏺 Horneas vasijas para un mercader fenicio y ganas",
    "⛏️ Extraes minerales para el Faraón en una mina egipcia y te pagan",
    "📜 Eres escriba en Sumeria y transcribes tablillas por",
    "🛡️ Sirves como hoplita mercenario en Grecia y te pagan",
    "🍇 Pisas uvas para hacer vino en la Antigua Roma y obtienes",
    "🐫 Guías una caravana por la Ruta de la Seda y ganas",
    "🏛️ Esculpes capiteles para un templo griego y recibes",
    "🥖 Horneas pan para una legión romana y ganas",
    "🧭 Ayudas a un cartógrafo a dibujar mapas y te dan",
    "⚔️ Forjas espadas para los vikingos y te pagan",
    "☕ Recoges granos de café en un monasterio etíope y ganas",
    "🧮 Eres contable en la dinastía Ming y calculas impuestos por",
    "🏹 Fabricas arcos largos para el ejército inglés y ganas",
    "🧪 Mezclas pigmentos para un maestro renacentista y obtienes",
    "🌶️ Comercias especias en el mercado de Estambul y ganas",
    "📜 Iluminas manuscritos en un scriptorium medieval y recibes",
    "⛵ Calafateas un barco en el puerto de Venecia y ganas",
    "🕰️ Construyes un mecanismo de relojería suizo y te pagan",
    "💍 Tallas joyas para la realeza francesa y ganas",
    "🍫 Cultivas cacao para los aztecas y te pagan con",
    "🧵 Tejes seda en un telar tradicional chino y ganas",
    "🛶 Tallas una canoa para un jefe polinesio y recibes",
    "🎭 Actúas en una obra de teatro en el Globe de Shakespeare y ganas",
    "🗿 Transportas un moái en la Isla de Pascua y te dan",
    "☀️ Eres astrónomo en Chichén Itzá y predicen el eclipse por",
    "🛡️ Forjas la armadura de un samurái y ganas",
    "🍵 Preparas el té para una ceremonia japonesa y recibes",
    "🏺 Encuentras una vasija antigua mientras excavas y la vendes por",
    "📿 Creas abalorios para comerciar en el Sahara y ganas",
    "⛲ Diseñas un acueducto romano y el emperador te premia con",
    "🦅 Adiestras halcones para un noble medieval y ganas",
    "🧴 Mezclas perfumes en la Provenza francesa y vendes por",
    "🍯 Cosechas miel en la antigua Grecia y obtienes",
    "🎻 Construyes un violín en Cremona y lo vendes por",
    "🧊 Cortas bloques de hielo en un fiordo noruego y los vendes por",
    "🛶 Pescas con red en el Nilo y vendes la pesca del día por",
    "📜 Traduces textos árabes en la Toledo medieval y ganas",
    "🏹 Cazas mamuts para una tribu prehistórica y compartes una recompensa de",
    "🧩 Resuelves un acertijo para la Esfinge y ganas",
    "🛕 Tallas un dios en un templo Khmer y recibes",
    "📿 Eres monje copista en un monasterio tibetano y transcribes sutras por",
    "🍎 Vendes manzanas en el mercado de Londres del siglo XVII y ganas",
    "⚗️ Destilas elixires para un alquimista y te paga",
    "🗡️ Afilas cuchillos como ambulante en el Medievo y ganas",
    "🏺 Subastas antigüedades en Roma y ganas una comisión de",
    "🧵 Bordas el tapiz de Bayeux y te pagan",
    "🌾 Trillas el trigo en una villa medieval y ganas",
    "🛶 Remas en una galera romana y te pagan el sueldo de",
    "🍶 Fabricas sake en un pueblo japonés y vendes un lote por",
    "🗿 Vendes recuerdos a turistas en Stonehenge y ganas"
    "🚗 Conduces Uber durante el fin de semana y ganas",
    "📦 Haces entregas con Rappi y recibes",
    "💻 Desarrollas una app móvil y ganas",
    "🎬 Produces videos para TikTok y obtienes",
    "🍳 Participas en MasterChef y ganas el premio de",
    "🏠 Administras propiedades por Airbnb y recibes",
    "📊 Eres community manager y ganas",
    "🎮 Eres streamer en Twitch y donan",
    "📱 Probas apps como tester y te pagan",
    "🛍️ Haces compras por encargo y ganas",
    "🎨 Diseñas NFTs y vendes uno por",
    "🤝 Eres asistente virtual y ganas",
    "📝 Escribes artículos como freelance y recibes",
    "🌱 Creas un huerto urbano y vendes cosechas por",
    "🚴 Trabajas de mensajero en bicicleta y ganas",
    "🎤 Eres locutor de podcast y ganas patrocinios por",
    "📸 Haces sesiones de fotos y ganas",
    "🧹 Ofreces servicios de limpieza y ganas",
    "🐶 Paseas perros y recibes",
    "👶 Cuidas niños y ganas",
    "💄 Eres maquillista profesional y ganas",
    "✂️ Cortas el cabello a domicilio y ganas",
    "📚 Das clases particulares online y ganas",
    "🎹 Enseñas música por Zoom y ganas",
    "🏋️ Eres entrenador personal y ganas",
    "🌎 Traduces documentos y ganas",
    "🔧 Reparas celulares y ganas",
    "🎯 Eres organizador de eventos y ganas",
    "📡 Instalas internet y ganas",
    "🍕 Repartes pizza y ganas propinas de",
    "🛒 Eres personal shopper y ganas",
    "🎭 Participas en obras de teatro y ganas",
    "📞 Trabajas en call center y ganas",
    "🚚 Mudas casas y ganas",
    "🌳 Plantas árboles y te pagan",
    "🎲 Repartes juegos de mesa y ganas",
    "📌 Trabajas como promotor en eventos y ganas",
    "🍎 Vendes productos orgánicos y ganas",
    "🎪 Animas fiestas infantiles y ganas",
    "🔍 Eres detective privado y ganas",
    "💵 Inviertes en criptomonedas y ganas",
    "🧘 Enseñas yoga online y ganas",
    "🎨 Pintas murales y ganas",
    "📺 Editas videos para YouTube y ganas",
    "🚗 Lavas autos y ganas",
    "🍯 Vendes miel artesanal y ganas",
    "📦 Empaquetas regalos y ganas",
    "🎳 Trabajas en una bolera y ganas",
    "🧵 Haces ropa personalizada y ganas",
    "🌶️ Vendes salsa picante casera y ganas"
] 
