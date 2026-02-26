export default {
  command: ['toimg', 'toimage'],
  category: 'tools',
  run: async (client, m, args, usedPrefix, command, text) => {
    if (!m.quoted) return client.reply(m.chat, `💙 Debes citar un sticker para convertir a imagen.`, m, global.miku)
    await m.react('🕒')
    let xx = m.quoted
    let imgBuffer = await xx.download()
    if (!imgBuffer) {
      await m.react('✖️')
      return client.reply(m.chat, `💙 No se pudo descargar el sticker.`, m, global.miku)
    }
    await client.sendMessage(m.chat, { image: imgBuffer, caption: '🌱 *Aquí tienes ฅ^•ﻌ•^ฅ*' }, { quoted: m })
    await m.react('✔️')
  }
}