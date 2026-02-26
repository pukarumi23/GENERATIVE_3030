export default {
  command: ['join', 'unir'],
  category: 'socket',
  run: async (client, m, args) => {
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const config = global.db.data.settings[idBot]
    const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
    if (!isOwner2) return m.reply(mess.socket)
    if (!args[0]) return m.reply('💙 Ingresa el enlace del grupo para unir el bot.', m, global.miku)
    const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
    const match = args[0].match(linkRegex)
    if (!match || !match[1]) {
      return m.reply('💙 El enlace ingresado no es válido o está incompleto.', m, global.miku)
    }
    try {
      const inviteCode = match[1]
      await client.groupAcceptInvite(inviteCode)
      await client.reply(m.chat, `💙 ${config.botname} se ha unido exitosamente al grupo.`, m, global.miku)
    } catch (e) {
      const errMsg = String(e.message || e)
      if (errMsg.includes('not-authorized') || errMsg.includes('requires-admin')) {
        await m.reply('💙 La unión requiere aprobación de administrador. Espera a que acepten tu solicitud.', m, global.miku)
      } else if (errMsg.includes('not-in-group') || errMsg.includes('removed')) {
        await m.reply('💙 No se pudo unir al grupo porque el bot fue eliminado recientemente.', m, global.miku)
      } else {
        await m.reply('💙 No se pudo unir al grupo, verifica el enlace o los permisos.', m, global.miku)
      }
    }
  },
}