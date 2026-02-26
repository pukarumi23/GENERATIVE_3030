import fetch from 'node-fetch'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import chalk from 'chalk'

export default async (client, m) => {
  client.ev.on('group-participants.update', async (anu) => {
    try {
      const metadata = await client.groupMetadata(anu.id).catch(() => null)
      const groupAdmins = metadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
      const chat = global?.db?.data?.chats?.[anu.id]
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
      const primaryBotId = chat?.primaryBot
      const memberCount = metadata.participants.length      
      const isSelf = global.db.data.settings[botId]?.self ?? false
      if (isSelf) return
      for (const p of anu.participants) {
        const jid = p.phoneNumber
        const phone = p.phoneNumber?.split('@')[0] || jid.split('@')[0]
        const pp = await client.profilePictureUrl(jid, 'image').catch(_ => 'https://i.pinimg.com/736x/0c/1e/f8/0c1ef8e804983e634fbf13df1044a41f.jpg')       
        const mensajes = { add: chat.sWelcome ? `\n💙 ${chat.sWelcome.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '🌸 Sin Desc 🌸')}` : '', remove: chat.sGoodbye ? `\n💙 ${chat.sGoodbye.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '🌸 Sin Desc 🌸')}` : '', leave: chat.sGoodbye ? `\n💙 ${chat.sGoodbye.replace(/{usuario}/g, `@${phone}`).replace(/{grupo}/g, `*${metadata.subject}*`).replace(/{desc}/g, metadata?.desc || '🌸 Sin Desc 🌸')}` : '' }
        const fakeContext = {
          contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: global.db.data.settings[botId].id,
              serverMessageId: '0',
              newsletterName: global.db.data.settings[botId].nameid
            },
            externalAdReply: {
              title: global.db.data.settings[botId].namebot,
              body: dev,
              mediaUrl: null,
              description: null,
              previewType: 'PHOTO',
              thumbnailUrl: global.db.data.settings[botId].icon,
              sourceUrl: global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].link,
              mediaType: 1,
              renderLargerThumbnail: false
            },
            mentionedJid: [jid]
          }
        }
        
        if (anu.action === 'promote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, { text: `╭━━━━━━━━━╮\n┃ 🌟 *Promoción*\n╰━━━━━━━━━╯\n├◦ 🌱 *@${phone}* fue promovido a Admin\n╰◦ 💙 Por *@${usuario.split('@')[0]}*`, mentions: [jid, usuario, ...groupAdmins.map(v => v.id)] })
        }
        if (anu.action === 'demote' && chat?.alerts && (!primaryBotId || primaryBotId === botId)) {
          const usuario = anu.author
          await client.sendMessage(anu.id, { text: `╭━━━━━━━━━╮\n┃ 🌸 *Degradación*\n╰━━━━━━━━━╯\n├◦ 🌱 *@${phone}* fue removido de Admin\n╰◦ 💙 Por *@${usuario.split('@')[0]}*`, mentions: [jid, usuario, ...groupAdmins.map(v => v.id)] })
        }
      }
    } catch (err) {
      console.log(chalk.gray(`💙 BOT   → ${err}`))
    }
  })
  client.ev.on('messages.upsert', async ({ messages }) => {
  const m = messages[0]
  if (!m.messageStubType) return
  const id = m.key.remoteJid
  const chat = global.db.data.chats[id]
  const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
  const primaryBotId = chat?.primaryBot
  if (!chat?.alerts || (primaryBotId && primaryBotId !== botId)) return
  const isSelf = global.db.data.settings[botId]?.self ?? false
  if (isSelf) return
  const actor = m.key?.participant || m.participant || m.key?.remoteJid
  const phone = actor.split('@')[0]
  const groupMetadata = await client.groupMetadata(id).catch(() => null)
  const groupAdmins = groupMetadata?.participants.filter(p => (p.admin === 'admin' || p.admin === 'superadmin')) || []
  if (m.messageStubType == 21) {
    await client.sendMessage(id, { text: `🌸 ┃ @${phone} cambió el nombre del grupo a *${m.messageStubParameters[0]}* ✨`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
  }
  if (m.messageStubType == 22) {
    await client.sendMessage(id, { text: `🌱 ┃ @${phone} cambió el icono del grupo. ✨`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
  }
  if (m.messageStubType == 23) {
    await client.sendMessage(id, { text: `💙 ┃ @${phone} restableció el enlace del grupo. ✨`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
  }
  if (m.messageStubType == 24) {
    await client.sendMessage(id, { text: `🌸 ┃ @${phone} cambió la descripción del grupo. ✨`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
  }
  if (m.messageStubType == 25) {
    await client.sendMessage(id, { text: `🌱 ┃ @${phone} cambió los ajustes ⟶ ${m.messageStubParameters[0] == 'on' ? 'solo admins pueden configurar el grupo.' : 'todos pueden configurar el grupo.'}`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
  }
  if (m.messageStubType == 26) {
    await client.sendMessage(id, { text: `💙 ┃ @${phone} cambió los ajustes ⟶ ${m.messageStubParameters[0] === 'on' ? 'solo admins pueden enviar mensajes.' : 'todos pueden enviar mensajes.'}`, mentions: [actor, ...groupAdmins.map(v => v.id)] })
  }
})
}