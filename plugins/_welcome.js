import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  try {
    
    if (m.message?.interactiveResponseMessage || m.message?.templateButtonReplyMessage || m.message?.buttonsResponseMessage) {
      let buttonId = null
      
      if (m.message.templateButtonReplyMessage) {
        buttonId = m.message.templateButtonReplyMessage.selectedId
      } else if (m.message.buttonsResponseMessage) {
        buttonId = m.message.buttonsResponseMessage.selectedButtonId
      } else if (m.message.interactiveResponseMessage) {
        try {
          const paramsJson = m.message.interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson
          if (paramsJson) {
            const params = JSON.parse(paramsJson)
            buttonId = params.id
          }
        } catch (e) {}
      }
      
      if (buttonId === 'ver_canal_button') {
        console.log('💖 Botón de canal detectado en welcome')
        const canalUrl = 'https://whatsapp.com/channel/0029Vb5rzPf3rZZXl2DI830G'
        await conn.reply(m.chat, `💖 *¡Únete a nuestro canal oficial!*\n\n${canalUrl}\n\n✨ ¡Te esperamos para más contenido increíble!`, m)
        return true
      }
    }
    
    if (!m.messageStubType || !m.isGroup) return true
    
    
    if (m._welcProcessed) return true
    m._welcProcessed = true

    
    if (!global.db) global.db = { data: { chats: {} } }
    if (!global.db.data) global.db.data = { chats: {} }
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    const chat = global.db.data.chats[m.chat]
    if (chat.welcome === undefined) chat.welcome = true
    if (!chat.welcome) return true

    
    const canalUrl = 'https://whatsapp.com/channel/0029Vb5rzPf3rZZXl2DI830G'
    const channelId = global.canalIdM?.[0] || '120363315369913363@newsletter'
    const channelName = global.canalNombreM?.[0] || '💖✨ KITAGAWA CHANNEL ✨💖'
    const groupSize = (participants || []).length

    
    const sendSingleWelcome = async (jid, text, user, quoted) => {
      try {
        
        let ppBuffer = null
        try {
          const ppUrl = await conn.profilePictureUrl(user, 'image').catch(() => null)
          if (ppUrl) {
            const response = await fetch(ppUrl)
            ppBuffer = await response.buffer()
          }
        } catch (e) {
          console.log('Error obteniendo foto de perfil:', e)
        }

       
        if (!ppBuffer) {
          try {
            const defaultResponse = await fetch('https://i.pinimg.com/736x/e7/a1/e4/e7a1e45b061ec73eb163770c750497cd.jpg')
            ppBuffer = await defaultResponse.buffer()
          } catch (e) {
            ppBuffer = null
          }
        }

       
        console.log('📤 Enviando welcome con imagen GRANDE...')
        await conn.sendMessage(jid, {
          image: ppBuffer,
          caption: text,
          mentions: [user]
        }, { quoted })

      
        console.log('💖 Enviando botón del canal con rcanal completo...')
        return await conn.sendMessage(jid, {
          text: '💖 *¡Únete a nuestro canal oficial para más contenido!* ✨'
        }, { quoted, ...global.rcanal })

      } catch (err) {
        console.log('sendSingleWelcome error:', err)
        
        return await conn.reply(jid, `${text}\n\n💖 *Ver Canal:* ${canalUrl}`, quoted, { mentions: [user] })
      }
    }

    
    if (m.messageStubType === 27) {
      if (!m.messageStubParameters || !m.messageStubParameters[0]) return true
      
      const user = m.messageStubParameters[0]
      const userName = user.split('@')[0]
      const welcomeText = `✨💖 ¡BIENVENIDA/O! 💖✨

◤━━━━━━━━━━━━━━━━━━━━━━━━◥
    👋 ¡Hola @${userName}!
◣━━━━━━━━━━━━━━━━━━━━━━━━◢
꧁═══════════════════════꧂
   🎉 BIENVENIDA AL GRUPO
꧁═══════════════════════꧂
▬▬ι═══════ﺤ « ✦ » ﺤ═══════ι▬▬
📍 Grupo: *${groupMetadata?.subject || 'el grupo'}*
👥 Somos: *${groupSize} miembros*
▬▬ι═══════ﺤ « ✦ » ﺤ═══════ι▬▬
.   ╰⊱♡⊱╮ INFORMACIÓN ╭⊱♡⊱╯
💕 ${global.welcom1 || 'Disfruta tu estancia aquí'}
✨ Prepárate para compartir momentos increíbles con todos nosotros~
━━━━━━━━━━━━━━━━━━━━━━━━
╰⊱♡⊱╮ MENSAJE ╭⊱♡⊱╯
📝 Para ayuda escribe: *#help*
༺═──────────────═༻
   💖 ¡DIVIÉRTETE! 💖
༺═──────────────═༻
🌸 Canal oficial:
${canalUrl}`

      await sendSingleWelcome(m.chat, welcomeText, user, m)
      console.log('✅ Welcome: Imagen grande + botón canal separado enviados')
      return true
    }

    
    if (m.messageStubType === 28 || m.messageStubType === 32) {
      if (!m.messageStubParameters || !m.messageStubParameters[0]) return true
      
      const user = m.messageStubParameters[0]
      const userName = user.split('@')[0]
      const byeText = `💔✨ ¡ADIÓS! ✨💔

◤━━━━━━━━━━━━━━━━━━━━━━━━◥
    👋 Hasta luego @${userName}
◣━━━━━━━━━━━━━━━━━━━━━━━━◢
꧁═══════════════════════꧂
   😢 DESPEDIDA DEL GRUPO
꧁═══════════════════════꧂
▬▬ι═══════ﺤ « ✦ » ﺤ═══════ι▬▬
📍 Grupo: *${groupMetadata?.subject || 'el grupo'}*
▬▬ι═══════ﺤ « ✦ » ﺤ═══════ι▬▬
.      ╰⊱♡⊱╮ MENSAJE ╭⊱♡⊱╯
🥺 ${global.welcom2 || 'Gracias por haber sido parte de nuestra comunidad'}
💕 Te extrañaremos muchísimo~
✨ ¡Cuídate y hasta la próxima!
༺═──────────────═༻
   🌸 ¡VUELVE PRONTO! 🌸
༺═──────────────═༻
💖 Canal oficial:
${canalUrl}`

      await sendSingleWelcome(m.chat, byeText, user, m)
      console.log('✅ Goodbye: Imagen grande + botón canal separado enviados')
      return true
    }

    return true
  } catch (e) {
    console.error('plugins/_welcome error', e)
    return true
  }
}
