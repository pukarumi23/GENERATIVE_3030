export default {
  command: ['link'],
  category: 'grupo',
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const code = await client.groupInviteCode(m.chat)
      const link = `https://chat.whatsapp.com/${code}`
      const teks = `💙🛠 Aquí tienes el link del grupo:\n\nGROUP LINK !\n🔌 \`Solicitado por :\` @${m.sender.split('@')[0]}\n\n🌱 \`Enlace :\`\n${link}`
      await client.reply(m.chat, teks, m, { mentions: [m.sender] })
    } catch (e) {
      await m.reply(`💙 An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
}