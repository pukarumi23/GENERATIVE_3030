export default {
  command: ['bot'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args) => {
    const chat = global.db.data.chats[m.chat]
    const estado = chat.isBanned ?? false

    if (args[0] === 'off') {
      if (estado) return m.reply('💙 El *Bot* ya estaba *desactivado* en este grupo.', m, global.miku)
      chat.isBanned = true
      return m.reply(`💙 Has *Desactivado* a *${global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].namebot}* en este grupo.`, m, global.miku)
    }

    if (args[0] === 'on') {
      if (!estado) return m.reply(`💙 *${global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].namebot}* ya estaba *activado* en este grupo.`, m, global.miku)
      chat.isBanned = false
      return m.reply(`💙 Has *Activado* a *${global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].namebot}* en este grupo.`, m, global.miku)
    }

    return m.reply(`*💙 Estado de ${global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].namebot} (｡•́‿•̀｡)*\n✐ *Actual ›* ${estado ? '✗ Desactivado' : '✓ Activado'}\n\n✎ Puedes cambiarlo con:\n> ● _Activar ›_ *bot on*\n> ● _Desactivar ›_ *bot off*`, m, global.miku)
  },
};
