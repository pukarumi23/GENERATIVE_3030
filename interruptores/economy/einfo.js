export default {
  command: ['infoeconomy', 'cooldowns', 'economyinfo', 'einfo'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + "@s.whatsapp.net"
    const chatData = db.chats[chatId]
    if (chatData.adminonly || !chatData.economy) return m.reply(`💙 Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`)
    const user = chatData.users[m.sender]
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000
    const cooldowns = {
      crime: Math.max(0, (user.lastcrime || 0) - now),
      mine: Math.max(0, (user.lastmine || 0) - now),
      ritual: Math.max(0, (user.lastinvoke || 0) - now),
      work: Math.max(0, (user.lastwork || 0) - now),
      slut: Math.max(0, (user.lastslut || 0) - now),
      steal: Math.max(0, (user.laststeal || 0) - now),
      daily: Math.max(0, (user.lastdaily || 0) + oneDay - now),
      weekly: Math.max(0, (user.lastweekly || 0) + 7 * oneDay - now),
      monthly: Math.max(0, (user.lastmonthly || 0) + 30 * oneDay - now)
    }
    const formatTime = (ms) => {
      const totalSeconds = Math.floor(ms / 1000)
      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      const parts = []
      if (days > 0) parts.push(`${days} d`)
      if (hours > 0) parts.push(`${hours} h`)
      if (minutes > 0) parts.push(`${minutes} m`)
      if (seconds > 0) parts.push(`${seconds} s`)
      return parts.length ? parts.join(', ') : 'Ahora.'
    }
    const coins = user.coins || 0
    const name = db.users[m.sender]?.name || m.sender.split('@')[0]
    const mensaje = `💙🎵 *Usuario* 🎵💙
🌱 \`<${name}>\`

💙 Work » *${formatTime(cooldowns.work)}*
🌱 Slut » *${formatTime(cooldowns.slut)}*
💙 Crime » *${formatTime(cooldowns.crime)}*
🌱 Mine » *${formatTime(cooldowns.mine)}*
💙 Ritual » *${formatTime(cooldowns.ritual)}*
🌱 Steal » *${formatTime(cooldowns.steal)}*
💙 Daily » *${formatTime(cooldowns.daily)}*
🌱 Weekly » *${formatTime(cooldowns.weekly)}*
💙 Monthly » *${formatTime(cooldowns.monthly)}*

🌱 Cebollines totales  ${coins.toLocaleString()} ${global.db.data.settings[botId].currency}

✨ *HATSUNE MIKU BOT*`
    await client.sendMessage(chatId, { text: mensaje }, { quoted: m })
  }
}