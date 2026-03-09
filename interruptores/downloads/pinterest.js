import fetch from 'node-fetch'

export default {
  command: ['pinterest', 'pin'],
  category: 'search',
  run: async (client, m, args, usedPrefix, command) => {
    const text = args.join(' ')
    const isPinterestUrl = /^https?:\/\//.test(text)
    if (!text) {
      return m.reply('💙 Por favor, ingresa un término de búsqueda o un enlace de Pinterest.', m, global.miku)
    }
    
    await m.react('⏳')
    
    try {
      if (isPinterestUrl) {
        const data = await getPinterestDownload(text)
        if (!data) {
          await m.react('❌')
          return m.reply('💙 No se pudo obtener el contenido.')
        }
        const caption = `💙 *PINTEREST DOWNLOAD* 💙

${data.title ? `💙 *Título:* ${data.title}\n` : ''}${data.description ? `🌱 *Descripción:* ${data.description}\n` : ''}${data.author ? `💙 *Autor:* ${data.author}\n` : ''}${data.username ? `🌱 *Usuario:* ${data.username}\n` : ''}${data.followers ? `💙 *Seguidores:* ${data.followers}\n` : ''}${data.uploadDate ? `🌱 *Fecha:* ${data.uploadDate}\n` : ''}${data.likes ? `💙 *Likes:* ${data.likes}\n` : ''}${data.comments ? `🌱 *Comentarios:* ${data.comments}\n` : ''}${data.views ? `💙 *Vistas:* ${data.views}\n` : ''}${data.saved ? `🌱 *Guardados:* ${data.saved}\n` : ''}${data.format ? `💙 *Formato:* ${data.format}\n` : ''}🌱 *Enlace:* ${text}

💙 *HATSUNE MIKU* 💙`
        if (data.type === 'video') {
          await client.sendMessage(m.chat, { video: { url: data.url }, caption, mimetype: 'video/mp4', fileName: 'pin.mp4' }, { quoted: m })
        } else if (data.type === 'image') {
          await client.sendMessage(m.chat, { image: { url: data.url }, caption }, { quoted: m })
        } else {
          throw new Error('Contenido no soportado.')
        }
        await m.react('✅')
      } else {
        const results = await getPinterestSearch(text)
        if (!results || results.length === 0) {
          await m.react('❌')
          return m.reply(`💙 No se encontraron resultados para *${text}*.`)
        }
        const medias = results.slice(0, 10).map(r => ({ type: r.type === 'video' ? 'video' : 'image', data: { url: r.image }, caption: `💙🌱 *PINTEREST SEARCH* 🌱💙

${r.title ? `💙 *Título:* ${r.title}\n` : ''}${r.description ? `🌱 *Descripción:* ${r.description}\n` : ''}${r.name ? `💙 *Autor:* ${r.name}\n` : ''}${r.username ? `🌱 *Usuario:* ${r.username}\n` : ''}${r.followers ? `💙 *Seguidores:* ${r.followers}\n` : ''}${r.likes ? `🌱 *Likes:* ${r.likes}\n` : ''}${r.created_at ? `💙 *Fecha:* ${r.created_at}\n` : ''}
💙 *HATSUNE MIKU BOT* 💙` }))
        await client.sendAlbumMessage(m.chat, medias, { quoted: m })
        await m.react('✅')
      }
    } catch (e) {
      await m.react('❌')
      await m.reply(`💙 *ERROR* 💙

💙 Ocurrió un error al ejecutar *${usedPrefix + command}*

🌱 *Error:* ${e.message}

💙 Inténtalo de nuevo o contacta soporte.`)
    }
  }
}

async function getPinterestDownload(url) {
  const apis = [
  { endpoint: `${global.APIs.stellar.url}/dl/pinterest?url=${encodeURIComponent(url)}&key=${global.APIs.stellar.key}`, extractor: res => {
        if (!res.status || !res.data?.dl) return null
        return { type: res.data.type, title: res.data.title || null, author: res.data.author || null, username: res.data.username || null, uploadDate: res.data.uploadDate || null, format: res.data.type === 'video' ? 'mp4' : 'jpg', url: res.data.dl, thumbnail: res.data.thumbnail || null }
      }
    },
    { endpoint: `${global.APIs.vreden.url}/api/v1/download/pinterest?url=${encodeURIComponent(url)}`, extractor: res => {
        if (!res.status || !res.result?.media_urls?.length) return null
        const media = res.result.media_urls.find(m => m.quality === 'original') || res.result.media_urls[0]
        if (!media?.url) return null
        return { type: media.type, title: res.result.title || null, description: res.result.description || null, author: res.result.uploader?.full_name || null, username: res.result.uploader?.username || null, uploadDate: res.result.created_at || null, likes: res.result.statistics?.likes || null, views: res.result.statistics?.views || null, saved: res.result.statistics?.saved || null, format: media.type, url: media.url }
      }
    },
    { endpoint: `${global.APIs.nekolabs.url}/downloader/pinterest?url=${encodeURIComponent(url)}`, extractor: res => {
        if (!res.success || !res.result?.medias?.length) return null
        const media = res.result.medias.find(m => m.extension === 'mp4' || m.extension === 'jpg')
        if (!media?.url) return null
        return { type: media.extension === 'mp4' ? 'video' : 'image', title: res.result.title || null, description: null, format: media.extension, url: media.url, thumbnail: res.result.thumbnail || null, duration: res.result.duration || null }
      }
    },
    { endpoint: `${global.APIs.delirius.url}/download/pinterestdl?url=${encodeURIComponent(url)}`, extractor: res => {
        if (!res.status || !res.data?.download?.url) return null
        return { type: res.data.download.type, title: res.data.title || null, description: res.data.description || null, author: res.data.author_name || null, username: res.data.username || null, followers: res.data.followers || null, uploadDate: res.data.upload || null, likes: res.data.likes || null, comments: res.data.comments || null, format: res.data.download.type, url: res.data.download.url, thumbnail: res.data.thumbnail || null, source: res.data.source || null }
      }
    },
    { endpoint: `${global.APIs.ootaizumi.url}/downloader/pinterest?url=${encodeURIComponent(url)}`, extractor: res => {
        if (!res.status || !res.result?.download) return null
        return { type: res.result.download.includes('.mp4') ? 'video' : 'image', title: res.result.title || null, description: null, author: res.result.author?.name || null, username: res.result.author?.username || null, uploadDate: res.result.upload || null, format: res.result.download.includes('.mp4') ? 'mp4' : 'jpg', url: res.result.download, thumbnail: res.result.thumb || null, source: res.result.source || null }
      }
    }
  ]

  for (const { endpoint, extractor } of apis) {
    try {
      const res = await fetch(endpoint).then(r => r.json())
      const result = extractor(res)
      if (result) return result
    } catch {}
    await new Promise(r => setTimeout(r, 500))
  }
  return null
}

async function getPinterestSearch(query) {
  const apis = [`${global.APIs.stellar.url}/search/pinterest?query=${encodeURIComponent(query)}&key=${global.APIs.stellar.key}`, `${global.APIs.stellar.url}/search/pinterestv2?query=${encodeURIComponent(query)}&key=${global.APIs.stellar.key}`, `${global.APIs.delirius.url}/search/pinterestv2?text=${encodeURIComponent(query)}`, `${global.APIs.vreden.url}/api/v1/search/pinterest?query=${encodeURIComponent(query)}`, `${global.APIs.vreden.url}/api/v2/search/pinterest?query=${encodeURIComponent(query)}&limit=10&type=videos`, `${global.APIs.delirius.url}/search/pinterest?text=${encodeURIComponent(query)}`, `${global.APIs.siputzx.url}/api/s/pinterest?query=${encodeURIComponent(query)}&type=image`]

  for (const endpoint of apis) {
    try {
      const res = await fetch(endpoint).then(r => r.json())
      if (res?.data?.length) {
        return res.data.map(d => ({ type: 'image', title: d.title || null, description: d.description || null, name: d.full_name || d.name || null, username: d.username || null, followers: d.followers || null, likes: d.likes || null, created_at: d.created || d.created_at || null, image: d.hd || d.image || null }))
      }
      if (res?.response?.pins?.length) {
        return res.response.pins.map(p => ({ type: p.media?.video ? 'video' : 'image', title: p.title || null, description: p.description || null, name: p.uploader?.full_name || null, username: p.uploader?.username || null, followers: p.uploader?.followers || null, likes: null, created_at: null, image: p.media?.images?.orig?.url || null }))
      }
      if (res?.results?.length) {
        return res.results.map(url => ({ type: 'image', title: null, description: null, name: null, username: null, followers: null, likes: null, created_at: null, image: url }))
      }
      if (res?.result?.search_data?.length) {
        return res.result.search_data.map(url => ({ type: 'image', title: null, description: null, name: null, username: null, followers: null, likes: null, created_at: null, image: url }))
      }
      if (res?.result?.result?.length) {
        return res.result.result.map(d => ({ type: d.media_urls?.[0]?.type || 'video', title: d.title || null, description: d.description || null, name: d.uploader?.full_name || null, username: d.uploader?.username || null, followers: d.uploader?.followers || null, likes: null, created_at: null, image: d.media_urls?.[0]?.url || null }))
      }
      if (res?.data?.length && res.data[0]?.image_url) {
        return res.data.map(d => ({ type: d.type || 'image', title: d.grid_title || null, description: d.description || null, name: d.pinner?.full_name || null, username: d.pinner?.username || null, followers: d.pinner?.follower_count || null, likes: d.reaction_counts?.[1] || null, created_at: d.created_at || null, image: d.image_url || null }))
      }
    } catch {}
  }
  return []
}
