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
global.nameqr = '🔶𝕀ℕ𝔻𝔼ℙ𝔼ℕ𝔻𝕀𝔼ℕ𝕋𝔼🔶'
global.namebot = '�🔶𝕀ℕ𝔻𝔼ℙ𝔼ℕ𝔻𝕀𝔼ℕ𝕋𝔼 🔶 �'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.yukiJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '🔶𝕀ℕ𝔻𝔼ℙ𝔼ℕ𝔻𝕀𝔼ℕ𝕋𝔼 🔶'
global.botname = '🄸🄽🄳🄴🄿🄴🄽🄳🄸🄴🄽🅃🄴'
global.wm = '🔶𝕀ℕ𝔻𝔼ℙ𝔼ℕ𝔻𝕀𝔼ℕ𝕋𝔼 🔶'
global.author = '✧･ﾟCHASKI･ﾟ✧'
global.dev = '© 🄿🄾🅆🄴🅁🄴🄳 ✧･ﾟCHASKI･ﾟ✧'
global.textbot = '✦ 𝓘𝓷𝓭𝓮𝓹𝓮𝓷𝓭𝓲𝓮𝓷𝓽𝓮 ✦'
global.etiqueta = '◇𝙄𝙉𝘿𝙀𝙋𝙀𝙉𝘿𝙄𝙀𝙉𝙏𝙀 ◈'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = '🪙 Intis'
global.welcom1 = 'bienvenido'
global.welcom2 = 'adios '
global.banner = 'https://files.catbox.moe/bgvfdm.jpeg'
global.avatar = 'https://files.catbox.moe/bgvfdm.jpeg'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://chat.whatsapp.com/K0Bl5ktWIFE5rMKrKDEOtk?mode=ac_t'
global.comunidad1 = 'https://chat.whatsapp.com/K0Bl5ktWIFE5rMKrKDEOtk?mode=ac_t'
global.channel = 'https://whatsapp.com/channel/0029Vb5rzPf3rZZXl2DI830G'
global.channel2 = 'https://whatsapp.com/channel/0029Vb5rzPf3rZZXl2DI830G'
global.md = 'https://github.com/pukarumi23/GENERATIVE_3030'
global.correo = 'independentebot@gmail.com'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpeg');
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
