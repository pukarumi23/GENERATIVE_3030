import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'

export default {
  command: ['delai', 'dsowner', 'clearallsession'],
  category: 'owner',
  isOwner: true,
  run: async (client, m, args, usedPrefix) => {

    const globalClientJid = global.client.user?.jid || (global.client.user?.id ? global.client.user.id.split(':')[0] + '@s.whatsapp.net' : null)
    const currentClientJid = client.user?.jid || (client.user?.id ? client.user.id.split(':')[0] + '@s.whatsapp.net' : null)
    
    if (globalClientJid !== currentClientJid) {
      return client.reply(m.chat, `💙 Utiliza este comando directamente en el número principal del Bot.`, m, global.miku)
    }
    
    await client.reply(m.chat, `💙 Iniciando proceso de eliminación de todos los archivos de sesión, excepto el archivo creds.json...`, m, global.miku)
    await m.react('⏳')

    let sessionPath = `./${global.sessionName}/`

    try {
      if (!existsSync(sessionPath)) {
        return await client.reply(m.chat, `💙 La carpeta está vacía.`, m, global.miku)
      }

      async function deleteRecursively(dirPath) {
        let filesDeleted = 0
        const items = await fs.readdir(dirPath)
        for (const item of items) {
          const itemPath = path.join(dirPath, item)
          const stat = await fs.stat(itemPath)
          if (stat.isDirectory()) {
            filesDeleted += await deleteRecursively(itemPath)
            await fs.rmdir(itemPath)
          } else if (item !== 'creds.json') {
            await fs.unlink(itemPath)
            filesDeleted++
          }
        }
        return filesDeleted
      }

      let filesDeleted = await deleteRecursively(sessionPath)
      
      if (filesDeleted === 0) {
        await m.react('❌')
        await client.reply(m.chat, `💙 La carpeta está vacía.`, m, global.miku)
      } else {
        await m.react('✅')
        await client.reply(m.chat, `💙 *Limpieza Completada* 💙\n\n🌱 Se eliminaron ${filesDeleted} archivos de sesión\n💙 El archivo creds.json se mantuvo intacto\n\n✨ *HATSUNE MIKU BOT*`, m, global.miku)
        await client.reply(m.chat, `💙 *¡Hola! ¿logras verme?*`, m, global.miku)
      }
      
    } catch (err) {
      console.error('Error al leer la carpeta o los archivos de sesión:', err)
      await m.react('❌')
      await client.reply(m.chat, `💙 *ERROR* 🌱\n\n🌱 Ocurrió un fallo al eliminar archivos\n\n💙 *Error:* ${err.message}`, m, global.miku)
    }
  }
}