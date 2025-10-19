import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*


global.botNumber = '' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
// <-- Número @s.whatsapp.net -->
  ['51939508653', '✧･ﾟCHASKI･ﾟ✧', true],
  ['51939508653', '𝘾𝙃𝘼𝙎𝙆𝙄', true],
  
// <-- Número @lid -->
  ['54873039089749', '✧･ﾟCHASKI･ﾟ✧', true]
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = ['51939508653'] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.17' 
global.vs = '2.2.5'
global.nameqr = '💗𝓚𝓲𝓽𝓪𝓰𝓪𝔀𝓪_𝓑𝓸𝓽🌸'
global.namebot = '🌷Ｋ𝓲𝓽𝓪𝓰𝓪𝔀𝓪_ʙᴏᴛ💞'
global.sessions = 'Sessions'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '💖Ｋ𝓲𝓽𝓪𝓰𝓪𝔀𝓪_ʙᴏᴛ🎀'
global.botname ='꧁✨𝒦𝒾𝓉𝒶𝑔𝒶𝓌𝒶_𝒝𝑜𝓉✨꧂'
global.wm = '🌸𝓚𝓲𝓽𝓪𝓰𝓪𝔀𝓪♡ʙᴏᴛ💗'
global.author = '✧･ﾟCHASKI･ﾟ✧'
global.dev = '© 🄿🄾🅆🄴🅁🄴🄳✧･ﾟCHASKI･ﾟ✧'
global.textbot = '💞𝘬𝘪𝘵𝘢𝘨𝘢𝘸𝘢_𝘣𝘰𝘵🌷'
global.etiqueta = '◇🌷𝒦𝒾𝓉𝒶𝑔𝒶𝓌𝒶_ʙᴏᴛ💖◈'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = '🪙 Intis'
global.welcom1 = '💖 ¡Konnichiwaa~! 💖 🎀 Bienvenid@ a este rinconcito súper kawaii~ 🌸Aquí se viene a brillar, divertirse y mostrar tu mejor estilo, ¿ok~? 💅✨ 🌸 Relájate, sé tú mism@ y disfruta como protagonista de anime~ 🎀'
global.welcom2 = '🌸✨ ¡Sayonaraa~! ✨🌸 💖 Gracias por estar aquí, fue súper lindo tener tu presencia, ¡le diste un toque especial al lugar! 💖 🎀 El escenario queda esperando por ti, así que no tardes en volver, ¿ok~? 🎀'
global.banner = 'https://files.catbox.moe/psffj2.jpg'
global.avatar = 'https://files.catbox.moe/psffj2.jpg'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://chat.whatsapp.com/K0Bl5ktWIFE5rMKrKDEOtk?mode=ac_t'
global.comunidad1 = 'https://chat.whatsapp.com/K0Bl5ktWIFE5rMKrKDEOtk?mode=ac_t'
global.channel = 'https://whatsapp.com/channel/0029Vb5rzPf3rZZXl2DI830G'
global.channel2 = 'https://whatsapp.com/channel/0029Vb5rzPf3rZZXl2DI830G'
global.md = 'https://github.com/pukarumi23/GENERATIVE_3030'
global.correo = 'independentebot@gmail.com'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/menu78.jpg');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363418348675041@newsletter',
}
global.multiplier = 60

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
