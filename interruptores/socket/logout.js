import fs from 'fs';
import path from 'path';
import {jidDecode} from '@whiskeysockets/baileys';

export default {
  command: ['logout'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    const rawId = client.user?.id || ''
    const decoded = jidDecode(rawId)
    const cleanId = decoded?.user || rawId.split('@')[0]
    const sessionTypes = ['Subs']
    const basePath = 'Sessions'
    const sessionPath = sessionTypes.map((type) => path.join(basePath, type, cleanId)).find((p) => fs.existsSync(p))
    if (!sessionPath) {
      return m.reply('💙 Este comando solo puede ser usado desde una instancia de Sub-Bot.')
    }
    try {
      await m.reply('💙🎵 *Cerrando Sesión* 🎵💙\n\n🌱 Desconectando socket...\n💙 Eliminando archivos de sesión...\n\n✨ *HATSUNE MIKU BOT*')
      
      setTimeout(async () => {
        try {
          await client.logout()
        } catch {}
        
        setTimeout(() => {
          if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true })
            console.log(`💙 Sesión de ${cleanId} eliminada de ${sessionPath}`)
          }
        }, 1000)
      }, 1000)
      
    } catch (e) {
      await m.reply(`💙🌱 *ERROR* 🌱💙\n\n🌱 Ocurrió un error al cerrar sesión\n\n💙 *Error:* ${e.message}`)
    }
  },
};
