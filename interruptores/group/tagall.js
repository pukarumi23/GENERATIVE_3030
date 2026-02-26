export default {
  command: ['todos', 'invocar', 'tagall'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args) => {
    const groupInfo = await client.groupMetadata(m.chat)
    const participants = groupInfo.participants
    const pesan = args.join(' ')
    let teks =
      `🩵 💙 ꒰ *HATSUNE MIKU* ꒱ 💙🩵\n` +
      `🎵 初音ミク • *VOCALOID* • ミクミク 🎵\n\n` +
      `🌊💙 *${pesan || '『 Miku Miku ni Shite Ageru~ 』'}* 💙🌊\n\n` +
      `🎧 *Miembros:* ${participants.length} 👥\n` +
      `🎀 *Solicitado por:* @${m.sender.split('@')[0]} ✨\n\n` +
      `╭✦ ꒰ 🩵🎤 *Lista de Usuarios* 🎤🩵 ꒱ ✦╮\n`

    for (const mem of participants) {
      teks += `│ 🩵🎵 @${mem.id.split('@')[0]}\n`
    }

    teks += `╰✦──────────────────✦╯\n` +
      `💙✨ *39!* • ミクミク • 初音ミク ✨💙`

    return client.reply(m.chat, teks, m, { mentions: [m.sender, ...participants.map(p => p.id)] })
  }
}