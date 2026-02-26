export default {
  command: ['restart'],
  category: 'mod',
  isOwner: true,
  run: async (client, m) => {
    await client.reply(m.chat, `💙 *Reiniciando...* 💙\n\n🌱 Espere un momento...\n\n✨ *HATSUNE MIKU BOT*`, m, global.miku)
    setTimeout(() => {
    if (process.send) {
    process.send("restart")
    } else {
    process.exit(0)
    }}, 3000)
  },
};
