import fs from 'fs';
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'

global.owner = ['51988514570']
global.botNumber = ''

global.sessionName = 'Sessions/Owner'
global.version = '^2.0 - Latest'
global.dev = "© 🄿🄾🅆🄴🅁🄴🄳 (ㅎㅊDEPOOLㅊㅎ)"
global.links = {
api: 'https://rest.alyabotpe.xyz',
channel: "https://www.whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o",
github: "https://github.com/Brauliovh3/HATSUNE-MIKU",
gmail: "brauliovh3@gmail.com"
}

global.miku = { 
  contextInfo: { 
    isForwarded: true, 
    forwardedNewsletterMessageInfo: { 
      newsletterJid: "120363315369913363@newsletter", 
      serverMessageId: 100, 
      newsletterName: "💙 HATSUNE MIKU CHANNEL💙"
    },
    externalAdReply: {
      mediaUrl: null,
      description: '🎵 Hatsune Miku, la Diva Virtual del Futuro 🎵',
      previewType: "PHOTO",
      thumbnailUrl: global.banner || 'https://i.pinimg.com/736x/30/42/b8/3042b89ced13fefda4e75e3bc6dc2a57.jpg',
      sourceUrl: global.channel || 'https://www.whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o',
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }
}

global.mess = {
socket: '💙 Este comando solo puede ser ejecutado por un Socket.',
admin: '💙 Este comando solo puede ser ejecutado por los Administradores del Grupo.',
botAdmin: '💙 Este comando solo puede ser ejecutado si el Socket es Administrador del Grupo.'
}

global.APIs = {
adonix: { url: "https://api-adonix.ultraplus.click", key: "Yuki-WaBot" },
vreden: { url: "https://api.vreden.web.id", key: null },
nekolabs: { url: "https://api.nekolabs.web.id", key: null },
siputzx: { url: "https://api.siputzx.my.id", key: null },
delirius: { url: "https://api.delirius.store", key: null },
ootaizumi: { url: "https://api.ootaizumi.web.id", key: null },
stellar: { url: "https://api.stellarwa.xyz", key: "YukiWaBot" },
apifaa: { url: "https://api-faa.my.id", key: null },
xyro: { url: "https://api.xyro.site", key: null },
yupra: { url: "https://api.yupra.my.id", key: null }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  import(`${file}?update=${Date.now()}`)
})
