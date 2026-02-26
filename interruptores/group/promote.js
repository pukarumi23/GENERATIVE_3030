export default {
  command: ['promote'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    const mentioned = await m.mentionedJid
    const who = mentioned.length > 0 ? mentioned[0] : m.quoted ? await m.quoted.sender : false
    if (!who) return m.reply('💙 Menciona al usuario que deseas promover a administrador.', m, global.miku)
    try {
      const groupMetadata = await client.groupMetadata(m.chat)
      const participant = groupMetadata.participants.find((p) => p.phoneNumber === who || p.id === who || p.lid === who || p.jid === who)
      if (participant?.admin)
        return client.sendMessage(m.chat, { text: `💙 *@${who.split('@')[0]}* ya es administrador del grupo!`, mentions: [who] }, { quoted: m })
      await client.groupParticipantsUpdate(m.chat, [who], 'promote')
      await client.sendMessage(m.chat, { text: `💙 *@${who.split('@')[0]}* ha sido promovido a administrador del grupo!`, mentions: [who] }, { quoted: m })
    } catch (e) {
      await m.reply(`💙 An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
};
