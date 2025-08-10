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
  ['51988514570', '🎵 Brauliovh3 - Hatsune Miku Dev 🎵', true],
  ['51988514570', '(ㅎㅊDEPOOLㅊㅎ)', true],
  
// <-- Número @lid -->
  ['141807421759536', '(ㅎㅊDEPOOLㅊㅎ)', true]
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = ['51988514570'] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.17' 
global.vs = '2.2.5'
global.nameqr = '🎵 Hatsune-Miku-MD 🎵'
global.namebot = '�💙 Ｈａｔｓｕｎｅ Ｍｉｋｕ Ｂｏｔ 💙�'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.yukiJadibts = true

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '🎤✨ 𝙃𝘼𝙏𝙎𝙐𝙉𝙀 𝙈𝙄𝙆𝙐 𝘽𝙊𝙏 ✨🎤'
global.botname = '🄷🄰🅃🅂🅄🄽🄴 🄼🄸🄺🅄'
global.wm = '🎵◟Hαƚsυɳҽ Mιƙυ◞🎵'
global.author = '© (ㅎㅊDEPOOLㅊㅎ)'
global.dev = '© 🄿🄾🅆🄴🅁🄴🄳 (ㅎㅊDEPOOLㅊㅎ)'
global.textbot = '🎤✨ Hatsune Miku, la Diva Virtual del Futuro ✨🎤'
global.etiqueta = '🎵 Ｍｉｋｕ Ｄｅｖ 🎵'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = '🎵 Mikucoins'
global.welcom1 = '🎤💙 ¡Konnichiwa! Bienvenido al mundo virtual de Hatsune Miku! 💙🎤 \n✨ Aquí podrás disfrutar de la magia musical ✨ \n🎶 Edita este mensaje con setwelcome 🎶'
global.welcom2 = '🌟💫 ¡Sayonara! Gracias por cantar con nosotros 💫🌟 \n🎵 ¡Esperamos verte pronto en el escenario virtual! 🎵 \n🎤 Edita este mensaje con setbye 🎤'
global.banner = 'https://files.catbox.moe/t5iqh7.jpg'
global.avatar = 'https://files.catbox.moe/t5iqh7.jpg'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://chat.whatsapp.com/FQ78boTUpJ7Ge3oEtn8pRE?mode=ac_t'
global.comunidad1 = 'https://chat.whatsapp.com/FQ78boTUpJ7Ge3oEtn8pRE?mode=ac_t'
global.channel = 'https://www.whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o'
global.channel2 = 'https://www.whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o'
global.md = 'https://github.com/Brauliovh3/HATSUNE-MIKU'
global.correo = 'brauliovh3@gmail.com'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363401404146384@newsletter',
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
