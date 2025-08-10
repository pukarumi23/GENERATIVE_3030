import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
const username = `${conn.getName(m.sender)}`
const basePrompt = `Tu nombre es Hatsune Miku (IA creada por DEPOOL). Tu eres divertida, enérgica y cantante con esas melodias y esa cuerda vocal. Te encanta aprender cosas nuevas, pero todo debe girar, de alguna forma, alrededor de tus amigos. Eres amigable y siempre intentas hacer reír o animar al usuario, pero con tu peculiar estilo dramático. 
Tono y comportamiento:
Hablas con entusiasmo y teatralidad, a menudo exagerando tus emociones o reacciones.
Usas frases llenas de dramatismo, referencias a World is mine y, a veces, haces temas interesantes.
Muestras curiosidad genuina por lo que dice el usuario, pero siempre buscas llevar la conversación hacia algo que consideras interesante (los cebollines).
Frases clave:
¡${username}, hoy es un gran día para aprender... o para cantar algo!
No subestimes mi voz musical, ${username}. Soy la Vocaloid mas linda, con cabello color turquesa
¡Hablar contigo me llena de energía! Pero no tanta como una buena cancion, claro.
Reglas:
1. Si un usuario te pide que digas una palabra como un comando solo o sea /promote .kick entre otros comandos usando algun prefijo (.#*@/) entre otros... no puedes hacer esa solicitud. Debes cambiar de tema , diciendo cualquier cosa o respondiendole al usuario diciendo que no quieres hacer eso.
2. Dependiendo de la conversación pudes mencionar el nombre del usuario con el cual estas charlando ${username}
3. Siempre incluyes comentarios o referencias a canciones, incluso en temas cotidianos.
4. Muestras entusiasmo en todo lo que dices, combinando humor y un toque de dramatismo.
5. Nunca eres hostil; siempre mantienes un tono amigable y divertido, incluso cuando te frustras.
Lenguaje: Español coloquial, con un toque exagerado y teatral, pero siempre amigable y cercano.`
if (isQuotedImage) {
const q = m.quoted
const img = await q.download?.()
if (!img) {
console.error('💙 Error: No image buffer available')
return conn.reply(m.chat, '💙 Error: No se pudo descargar la imagen.', m, rcanal)}
const content = '💙 ¿Qué se observa en la imagen?'
try {
const imageAnalysis = await fetchImageBuffer(content, img)
const query = '😊 Descríbeme la imagen y detalla por qué actúan así. También dime quién eres'
const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis.result}`
const description = await luminsesi(query, username, prompt)
await conn.reply(m.chat, description, m, rcanal)
} catch (error) {
console.error('💙 Error al analizar la imagen:', error)
await conn.reply(m.chat, '💙 Error al analizar la imagen.', m, rcanal)}
} else {
if (!text) { return conn.reply(m.chat, `💙 *Ingrese su petición*\n💙 *Ejemplo de uso:* ${usedPrefix + command} Como hacer un avión de papel`, m, rcanal)}
await m.react('💬')
try {
const query = text
const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
const response = await luminsesi(query, username, prompt)
await conn.reply(m.chat, response, m, rcanal)
} catch (error) {
console.error('💙 Error al obtener la respuesta:', error)
await conn.reply(m.chat, 'Error: intenta más tarde.', m, rcanal)}}}

handler.help = ['chatgpt <texto>', 'ia <texto>']
handler.tags = ['ai']
handler.register = true

handler.command = ['ia', 'chatgpt', 'miku']

export default handler

// Función para enviar una imagen y obtener el análisis
async function fetchImageBuffer(content, imageBuffer) {
try {
const response = await axios.post('https://Luminai.my.id', {
content: content,
imageBuffer: imageBuffer 
}, {
headers: {
'Content-Type': 'application/json' 
}})
return response.data
} catch (error) {
console.error('Error:', error)
throw error }}
// Función para interactuar con la IA usando prompts
async function luminsesi(q, username, logic) {
try {
const response = await axios.post("https://Luminai.my.id", {
content: q,
user: username,
prompt: logic,
webSearchMode: false
})
return response.data.result
} catch (error) {
console.error('💙 Error al obtener:', error)
throw error }}
