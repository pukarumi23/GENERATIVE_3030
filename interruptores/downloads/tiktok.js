import fetch from 'node-fetch';

export default {
  command: ['tiktok', 'tt', 'tiktoksearch', 'ttsearch', 'tts'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args.length) {
      return m.reply(`💙 Por favor, ingresa un término de búsqueda o enlace de TikTok.`)
    }
    
    await m.react('⏳')
    
    const text = args.join(" ")
    const isUrl = /(?:https:?\/{2})?(?:w{3}|vm|vt|t)?\.?tiktok.com\/([^\s&]+)/gi.test(text)
    const endpoint = isUrl  ? `${global.APIs.stellar.url}/dl/tiktok?url=${encodeURIComponent(text)}&key=${global.APIs.stellar.key}` : `${global.APIs.stellar.url}/search/tiktok?query=${encodeURIComponent(text)}&key=${global.APIs.stellar.key}`
    try {
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(`El servidor respondió con ${res.status}`)
      const json = await res.json()
      if (!json.status) {
        await m.react('❌')
        return m.reply('💙 No se encontró contenido válido en TikTok.')
      }
      if (isUrl) {
        const { title, duration, dl, author, stats, created_at, type } = json.data
        if (!dl || (Array.isArray(dl) && dl.length === 0)) {
          await m.react('❌')
          return m.reply('💙 Enlace inválido o sin contenido descargable.')
        }
        const caption = `💙🌱 *TIKTOK DOWNLOAD* 🌱💙

💙 *Título:* ${title || 'Sin título'}
🌱 *Autor:* ${author?.nickname || author?.unique_id || 'Desconocido'}
💙 *Duración:* ${duration || 'N/A'}
🌱 *Likes:* ${(stats?.likes || 0).toLocaleString()}
💙 *Comentarios:* ${(stats?.comments || 0).toLocaleString()}
🌱 *Vistas:* ${(stats?.views || stats?.plays || 0).toLocaleString()}
💙 *Compartidos:* ${(stats?.shares || 0).toLocaleString()}
🌱 *Fecha:* ${created_at || 'N/A'}

💙🌱 *HATSUNE MIKU BOT* 🌱💙`.trim()
        if (type === 'image') {
          const medias = dl.map(url => ({ type: 'image', data: { url }, caption }))
          await client.sendAlbumMessage(m.chat, medias, { quoted: m })
          const audioRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}&hd=1`)
          const audioJson = await audioRes.json()
          const audioUrl = audioJson?.data?.play
          if (audioUrl) {
            await client.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: 'audio/mp4', fileName: 'tiktok_audio.mp4' }, { quoted: m })
          }
        } else {
          let videoUrl = null
          
         
          try {
            const tikwmApi = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}&hd=1`)
            const tikwmData = await tikwmApi.json()
            if (tikwmData?.data?.hdplay) {
              videoUrl = tikwmData.data.hdplay
            } else if (tikwmData?.data?.play) {
              videoUrl = tikwmData.data.play
            }
          } catch {}
          
          
          if (!videoUrl) {
            try {
              const hdApi = await fetch(`https://rest.alyabotpe.xyz/dl/tiktok?url=${encodeURIComponent(text)}&key=DEPOOL-key60015`)
              if (hdApi.ok) {
                const hdData = await hdApi.json()
                if (hdData.status && hdData.data?.dl) {
                  videoUrl = hdData.data.dl
                }
              }
            } catch {}
          }
          
          
          if (!videoUrl) {
            videoUrl = Array.isArray(dl) ? dl[0] : dl
          }
          
          await client.sendMessage(m.chat, { 
            video: { url: videoUrl }, 
            caption,
            jpegThumbnail: null,
            gifPlayback: false
          }, { 
            quoted: m,
            mediaUploadTimeoutMs: 120000
          })
        }
        await m.react('✅')
      } else {
        const validResults = json.data?.filter(v => v.dl)
        if (!validResults || validResults.length < 2) {
          await m.react('❌')
          return m.reply('💙 Se requieren al menos 2 resultados válidos con contenido.')
        }
        const medias = validResults.filter(v => typeof v.dl === 'string' && v.dl.startsWith('http')).map(v => {
            const caption = `💙🌱 *TIKTOK SEARCH* 🌱💙

💙 *Título:* ${v.title || 'Sin título'}
🌱 *Autor:* ${v.author?.nickname || 'Desconocido'} ${v.author?.unique_id ? `@${v.author.unique_id}` : ''}
💙 *Duración:* ${v.duration || 'N/A'}
🌱 *Likes:* ${(v.stats?.likes || 0).toLocaleString()}
💙 *Comentarios:* ${(v.stats?.comments || 0).toLocaleString()}
🌱 *Vistas:* ${(v.stats?.views || 0).toLocaleString()}
💙 *Compartidos:* ${(v.stats?.shares || 0).toLocaleString()}
🌱 *Audio:* ${v.music?.title || `[${v.author?.nickname || 'No disponible'}] original sound - ${v.author?.unique_id || 'unknown'}`}

💙🌱 *HATSUNE MIKU BOT* 🌱💙`.trim()
            return { type: 'video', data: { url: v.dl }, caption }
          }).slice(0, 10)
        await client.sendAlbumMessage(m.chat, medias, { quoted: m })
        await m.react('✅')
      }
    } catch (e) {
      await m.react('❌')
      await m.reply(`💙🌱 *ERROR* 🌱💙

💙 Ocurrió un error al ejecutar *${usedPrefix + command}*

🌱 *Error:* ${e.message}

💙 Inténtalo de nuevo o contacta soporte.`)
    }
  },
}
