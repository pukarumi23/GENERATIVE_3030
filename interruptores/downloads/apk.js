import { search, download } from 'aptoide-scraper'
import { getBuffer } from "../../lib/message.js"

export default {
  command: ['apk', 'aptoide', 'apkdl'],
  category: 'download',
  run: async (client, m, args, usedPrefix, command) => {
    if (!args || !args.length) {
      return m.reply('🧡 Por favor, ingresa el nombre de la aplicación.', m. global.miku)
    }
    
    await m.react('⏳')
    
    const query = args.join(' ').trim()
    try {
      const searchA = await search(query)
      if (!searchA || searchA.length === 0) {
        await m.react('❌')
        return m.reply('🧡 No se encontraron resultados.', m. global.miku)
      }
      const apkInfo = await download(searchA[0].id)
      if (!apkInfo) {
        await m.react('❌')
        return m.reply('🧡 No se pudo obtener la información de la aplicación.', m. global.miku)
      }
      const { name, package: id, size, icon, dllink: downloadUrl, lastup } = apkInfo
      const caption = `🧡 *APTOIDE DOWNLOAD* 🧡

🧡 *Nombre:* ${name}
🔥 *Paquete:* ${id}
🧡 *Última actualización:* ${lastup}
🔥 *Tamaño:* ${size}

🧡 *KITAGAWA BOT* 🧡`
      const sizeBytes = parseSize(size)
      if (sizeBytes > 524288000) {
        await m.react('❌')
        return m.reply(`🧡 El archivo es demasiado grande (${size}).\n\n🔥 Descárgalo directamente desde aquí:\n${downloadUrl}`, m. global.miku)
      }
      await client.sendMessage(m.chat, { document: { url: downloadUrl }, mimetype: 'application/vnd.android.package-archive', fileName: `${name}.apk`, caption }, { quoted: m })
      await m.react('✅')
     } catch (e) {
      await m.react('❌')
      await m.reply(`🧡🔥 *ERROR* 🔥🧡

🧡 Ocurrió un error al ejecutar *${usedPrefix + command}*

🔥 *Error:* ${e.message}

🧡 Inténtalo de nuevo o contacta soporte.`, m. global.miku)
    }
  },
}

function parseSize(sizeStr) {
  if (!sizeStr) return 0
  const parts = sizeStr.trim().toUpperCase().split(' ')
  const value = parseFloat(parts[0])
  const unit = parts[1] || 'B'
  switch (unit) {
    case 'KB': return value * 1024
    case 'MB': return value * 1024 * 1024
    case 'GB': return value * 1024 * 1024 * 1024
    default: return value
  }
}
