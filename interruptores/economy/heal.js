import { resolveLidToRealJid } from "../../lib/utils.js"

export default {
  command: ['heal', 'curar'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const db = global.db.data
    const chatData = db.chats[m.chat]
    if (chatData.adminonly || !chatData.economy) return m.reply(`💙 Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const bot = db.settings[botId]
    const currency = bot.currency
    const mentioned = m.mentionedJid || []
    const who2 = mentioned[0] || (m.quoted ? m.quoted.sender : null)
    const who = await resolveLidToRealJid(who2, client, m.chat)
    const healer = chatData.users[m.sender]
    const target = who ? chatData.users[who] : healer
    if (!target) return m.reply(`🌱 El usuario no se encuentra en la base de Datos.`)
    if (target.health >= 100) {
      const maximo = who ? `💙 La salud de *${db.users[who]?.name || who.split('@')[0]}* ya está al máximo, Salud actual: ${target.health}` : `💙 Tu salud ya está al máximo, Salud actual: ${target.health}`
      return m.reply(maximo)
    }
    const faltante = 100 - target.health
    const bloques = Math.ceil(faltante / 10)
    const costo = bloques * 500
    const totalFondos = healer.coins + (healer.bank || 0)
    if (totalFondos < costo) {
      const fondos = who ? `🌱 No tienes suficientes ${currency} para curar a *${db.users[who]?.name || who.split('@')[0]}*.\n> Necesitas *¥${costo.toLocaleString()} ${currency}* para curar ${faltante} puntos de salud.` : `🌱 No tienes suficientes ${currency} para curarte.\n> Necesitas *¥${costo.toLocaleString()} ${currency}* para curar ${faltante} puntos de salud.`
      return m.reply(fondos)
    }
    if (healer.coins >= costo) {
      healer.coins -= costo
    } else {
      const restante = costo - healer.coins
      healer.coins = 0
      healer.bank = Math.max(0, (healer.bank || 0) - restante)
    }
    target.health = 100
    const info = who ? `💙 Has curado a *${db.users[who]?.name || who.split('@')[0]}* hasta el máximo nivel de salud.` : `🌱 ${global.miku || 'HATSUNE MIKU'} Te has curado hasta el máximo nivel de salud.`
    m.reply(info)
  },
}