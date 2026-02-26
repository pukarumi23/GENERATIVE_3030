import fetch from 'node-fetch'

export default {
  command: ['drive', 'gdrive'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args[0]) {
      return m.reply('💙 Por favor, ingresa un link de Google Drive..')
    }
    const url = args[0]
    if (!url.match(/drive\.google\.com\/(file\/d\/|open\?id=|uc\?id=)/)) {
      return m.reply('💙 La URL no parece válida de Google Drive.')
    }
    
    await m.react('⏳')
    
    try {
      const result = await gdriveScraper(url)
      if (!result.status) {
        await m.react('❌')
        return m.reply('💙 No se pudo obtener el archivo. Intenta con otro enlace.')
      }
      const { fileName, fileSize, mimetype, downloadUrl } = result.data
      const caption = `💙 *GOOGLE DRIVE DOWNLOAD* 💙

💙 *Nombre:* ${fileName}
🌱 *Tamaño:* ${fileSize}
💙 *Tipo:* ${mimetype}
🌱 *Enlace:* ${url}

💙 *HATSUNE MIKU BOT* 💙`
     await client.sendMessage(m.chat, { document: { url: downloadUrl }, mimetype, fileName, caption }, { quoted: m })
     await m.react('✅')
    } catch (e) {
      await m.react('❌')
      return m.reply(`🌱 *ERROR* 💙

💙 Ocurrió un error al ejecutar *${usedPrefix + command}*

🌱 *Error:* ${e.message}

💙 Inténtalo de nuevo o contacta soporte.`, m. global.miku)
    }
  }
}

async function gdriveScraper(url) {
  try {
    let id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1]
    if (!id) throw new Error('No se encontró ID de descarga')
    let res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`,
      { method: 'post', headers: { 'accept-encoding': 'gzip, deflate, br', 'content-length': 0, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', origin: 'https://drive.google.com', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36', 'x-client-data': 'CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=', 'x-drive-first-party': 'DriveWebUi', 'x-json-requested': 'true' }
      }
    )
    let { fileName, sizeBytes, downloadUrl } = JSON.parse((await res.text()).slice(4))
    if (!downloadUrl) throw new Error('Se excedió el número de descargas del link')
    let data = await fetch(downloadUrl)
    if (data.status !== 200) throw new Error(data.statusText)
    return {
      status: true,
      data: { downloadUrl, fileName, fileSize: `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`, mimetype: data.headers.get('content-type') }
    }
  } catch (error) {
    return { status: false, message: error.message }
  }
}
