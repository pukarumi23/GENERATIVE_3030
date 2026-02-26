export default {
  command: ['kick'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    if (!m.mentionedJid[0] && !m.quoted) {
      return m.reply('💙 Etiqueta o responde al *mensaje* de la *persona* que quieres eliminar', m, global.miku)
    }
    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender
    const groupInfo = await client.groupMetadata(m.chat)
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net'
    const participant = groupInfo.participants.find((p) => p.phoneNumber === user || p.jid === user || p.id === user || p.lid === user)
    if (!participant) {
      return client.reply(m.chat, `💙 *@${user.split('@')[0]}* ya no está en el grupo.`, m, { mentions: [user] })
    }
    const botJid = client.user?.jid || (client.user?.id ? client.decodeJid(client.user.id) : null)
    if (user === botJid) {
      return m.reply('💙 No puedo eliminar al *bot* del grupo', m, global.miku)
    }
    if (user === ownerGroup) {
      return m.reply('💙 No puedo eliminar al *propietario* del grupo', m, global.miku)
    }
    if (user === ownerBot) {
      return m.reply('💙 No puedo eliminar al *propietario* del bot', m, global.miku)
    }
    try {
      await client.groupParticipantsUpdate(m.chat, [user], 'remove')
      client.reply(m.chat, `💮 @${user.split('@')[0]} *eliminado* correctamente`, m, { mentions: [user] })
    } catch (e) {
      return m.reply(`💙 An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
};
