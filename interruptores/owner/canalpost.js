export default {
  command: ['canalpost', 'postcanal', 'canalmsg'],
  category: 'owner',
  isOwner: true,
  run: async (client, m, args, usedPrefix, command) => {
    const channelId = '120363315369913363@newsletter'
    const channelName = '💙HATSUNE MIKU CHANNEL💙'
    
    try {
      let quoted = m.quoted ? m.quoted : m
      let mime = quoted?.msg?.mimetype || quoted?.mediaType || ''
      let texto = args.join(' ')
      
      if (!quoted && !texto) {
        return client.reply(m.chat, `💙 *Uso del comando*\n\n${usedPrefix}${command} [texto]\n${usedPrefix}${command} [texto] (responde a imagen/video)\n\n📝 *Ejemplos:*\n• ${usedPrefix}${command} ¡Hola a todos! 💙\n• ${usedPrefix}${command} Nueva actualización disponible (responde a imagen)\n• ${usedPrefix}${command} Video del día (responde a video)\n\n📺 *Canal destino:* ${channelName}`, m, global.miku)
      }
      
      await m.react('📤')
      
      try {
        if (quoted && mime.includes('image')) {
          let buffer = await quoted.download()
          await client.sendMessage(channelId, {
            image: buffer,
            caption: texto || `💙 *${channelName}* 💙\n\n📅 ${new Date().toLocaleString('es-MX')}`
          })
        }
        else if (quoted && (mime.includes('video') || mime.includes('mp4'))) {
          let buffer = await quoted.download()
          if (!buffer || buffer.length === 0) {
            return client.reply(m.chat, `💙 ❌ *No se pudo descargar el video.*`, m, global.miku)
          }
          await client.sendMessage(channelId, {
            video: buffer,
            caption: texto || `💙 *${channelName}* 💙\n\n📅 ${new Date().toLocaleString('es-MX')}`
          })
        }
        else if (quoted && mime.includes('audio')) {
          let buffer = await quoted.download()
          if (!buffer || buffer.length === 0) {
            return client.reply(m.chat, `💙 ❌ *No se pudo descargar el audio.*`, m, global.miku)
          }
          await client.sendMessage(channelId, {
            audio: buffer,
            mimetype: 'audio/mp4'
          })
        }
        else {
          await client.sendMessage(channelId, { text: texto })
        }
        
        await m.react('✅')
        client.reply(m.chat, `✅ *Enviado al canal*\n\n📺 ${channelName}`, m, global.miku)
        
      } catch (error) {
        await m.react('❌')
        client.reply(m.chat, `💙 ❌ *Error: ${error.message}*\n\n💡 Verifica que el bot sea admin del canal`, m, global.miku)
      }
      
    } catch (error) {
      await m.react('❌')
      client.reply(m.chat, `💙 ❌ *Error: ${error.message}*`, m, global.miku)
    }
  }
};
