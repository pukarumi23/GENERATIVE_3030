import yts from 'yt-search';
import {getBuffer} from '../../lib/message.js';

export default {
  command: ['ytsearch', 'search'],
  category: 'internet',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args || !args[0]) {
      return m.reply('💙 Por favor, Ingrese el título de un vídeo.')
    }
    
    await m.react('⏳')
    
    try {
      const ress = await yts(`${args[0]}`)
      const armar = ress.all
      const Ibuff = await getBuffer(armar[0].image)
      let teks2 = armar.map((v) => {
          switch (v.type) {
            case 'video':
              return `💙 *Título:* ${v.title}

🌱 *Duración:* ${v.timestamp}
💙 *Subido:* ${v.ago}
🌱 *Vistas:* ${v.views}
💙 *Url:* ${v.url}`.trim()
            case 'channel':
              return `💙 *Canal:* ${v.name}
🌱 *Url:* ${v.url}
💙 *Subscriptores:* ${v.subCountLabel} (${v.subCount})
🌱 *Videos totales:* ${v.videoCount}`.trim()
          }}).filter((v) => v).join('\n\n💙🌱💙🌱💙🌱💙🌱💙🌱💙🌱\n\n')
      
      const caption = `💙 *YOUTUBE SEARCH* 💙\n\n${teks2}\n\n💙 *HATSUNE MIKU* 💙`
      
      await client.sendMessage(m.chat, { image: Ibuff, caption }, { quoted: m })
      await m.react('✅')
    } catch (e) {
      await m.react('❌')
      m.reply(`💙🌱 *ERROR* 🌱💙

💙 Ocurrió un error al ejecutar *${usedPrefix + command}*

🌱 *Error:* ${e.message}

💙 Inténtalo de nuevo o contacta soporte.`)
    }
  },
};
