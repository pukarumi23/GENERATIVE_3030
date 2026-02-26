import GraphemeSplitter from 'grapheme-splitter'

export default {
  command: ['setprefix', 'setbotprefix'],
  category: 'socket',
  run: async (client, m, args, usedPrefix, command) => {
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const config = global.db.data.settings[idBot]
    const isOwner2 = [idBot, ...(config.owner ? [config.owner] : []), ...global.owner.map(num => num + '@s.whatsapp.net')].includes(m.sender)
    if (!isOwner2) return client.reply(m.chat, mess.socket, m)
    const value = args.join(' ').trim()
    const defaultPrefix = ["#", "/", "!", "."]
    if (!value) {
    const lista = config.prefix === null ? '`sin prefijos`' : (Array.isArray(config.prefix) ? config.prefix : [config.prefix || '/']).map(p => `\`${p}\``).join(', ')
    return m.reply(`💙 Por favor, elige cualquiera de los siguientes métodos de prefijos.\n\n> *○ Only-Prefix* » ${usedPrefix + command} *.*\n> *○ Multi-Prefix* » ${usedPrefix + command} *!/.#*\n> *○ No-Prefix* » ${usedPrefix + command} *noprefix*\n\nꕥ Actualmente se está usando: ${lista}`)
    }
    if (value.toLowerCase() === 'reset') {
    config.prefix = defaultPrefix
    return client.reply(m.chat, `💙 Se han restaurado los prefijos predeterminados: *${defaultPrefix.join(' ')}*`, m, global.miku)
    }
    if (value.toLowerCase() === 'noprefix') {
    config.prefix = true 
    return m.reply(`💙 Se cambio al modo sin prefijos para el Socket correctamente\n> Ahora el bot responderá a comandos *sin prefijos*.`, m, global.miku)
    }
    const splitter = new GraphemeSplitter()
    const graphemes = splitter.splitGraphemes(value)
    const lista = []
    for (const g of graphemes) {
    if (/^[a-zA-Z]+$/.test(g)) continue
    if (!lista.includes(g)) lista.push(g)
    }
    if (lista.length === 0) return client.reply(m.chat, '💙 No se detectaron prefijos válidos. Debes incluir al menos un símbolo o emoji.', m, global.miku)
    if (lista.length > 6) return client.reply(m.chat, '💙 Máximo 6 prefijos permitidos.', m, global.miku)
    config.prefix = lista
    return client.reply(m.chat, `💙 Se cambió el prefijo del Socket a *${lista.join(' ')}* correctamente.`, m, global.miku)
  },
}
