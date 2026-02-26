import { promises as fs } from 'fs'

const charactersFilePath = './lib/characters.json'
async function loadCharacters() {
  const data = await fs.readFile(charactersFilePath, 'utf-8')
  return JSON.parse(data)
}

function getCharacterById(id, structure) {
  return Object.values(structure).flatMap(s => s.characters).find(c => String(c.id) === String(id))
}

export default {
  command: ['claim', 'c', 'reclamar'],
  category: 'gacha',
  run: async (client, m, args, usedPrefix, command) => {
    try {
      const chat = global.db.data.chats[m.chat]
      if (!chat.users) chat.users = {}
      if (!chat.users[m.sender]) chat.users[m.sender] = {}
      if (!chat.characters) chat.characters = {}
      chat.rolls ||= {}
      if (chat.adminonly || !chat.gacha) {
        return m.reply(`🎤 Los comandos de *Gacha* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con:\n» *${usedPrefix}gacha on*`, m, global.miku)
      }
      const me = chat.users[m.sender]
      const now = Date.now()
      const claimCooldown = 30 * 60 * 1000
      if (me.lastClaim && now < me.lastClaim) {
        const remaining = Math.ceil((me.lastClaim - now) / 1000)
        const minutes = Math.floor(remaining / 60)
        const seconds = remaining % 60
        let timeText = ''
        if (minutes > 0) timeText += `${minutes} minuto${minutes !== 1 ? 's' : ''} `
        if (seconds > 0 || timeText === '') timeText += `${seconds} segundo${seconds !== 1 ? 's' : ''}`
        return m.reply(`💙 Debes esperar *${timeText.trim()}* para usar *${command}* de nuevo.`, m, global.miku)
      }
      const quotedId = m.quoted?.id
      if (!quotedId || !chat.rolls[quotedId]) {
        return m.reply(`🎤 Debes citar un personaje válido para reclamar.`, m, global.miku)
      }
      const rollData = chat.rolls[quotedId]
      const id = rollData.id
      const structure = await loadCharacters()
      const sourceData = getCharacterById(id, structure)
      if (!sourceData) return m.reply(`🎤 Personaje no encontrado en characters.json`, m, global.miku)
      if (!chat.characters[id]) chat.characters[id] = {}
      const record = chat.characters[id]
      const globalRec = global.db.data.characters?.[id] || {}
      record.name = record.name || sourceData.name
      record.value = typeof globalRec.value === 'number' ? globalRec.value : (sourceData.value || 0)
      record.votes = record.votes || 0
      if (record.reservedBy && record.reservedBy !== m.sender && now < record.reservedUntil) {
        const reserverName = global.db.data.users[record.reservedBy]?.name || record.reservedBy.split('@')[0]
        const remaining = ((record.reservedUntil - now) / 1000).toFixed(1)
        return m.reply(`💙 Este personaje está protegido por *${reserverName}* durante *${remaining}s.*`)
      }
      if (record.expiresAt && now > record.expiresAt && !record.user && !(record.reservedBy && now < record.reservedUntil)) {
        const expiredTime = ((now - record.expiresAt) / 1000).toFixed(1)
        return m.reply(`🎤 El personaje ha expirado » ${expiredTime}s.`)
      }
      if (record.user) {
        const ownerName = global.db.data.users[record.user]?.name || `@${record.user.split('@')[0]}`
        return m.reply(`💙 El personaje *${record.name}* ya ha sido reclamado por *${ownerName}*`)
      }
      record.user = m.sender
      record.claimedAt = now
      delete record.reservedBy
      delete record.reservedUntil
      me.lastClaim = now + claimCooldown
      if (!Array.isArray(me.characters)) me.characters = []
      if (!me.characters.includes(id)) me.characters.push(id)
      const displayName = global.db.data.users[m.sender]?.name || m.sender.split('@')[0]
      const custom = global.db.data.users?.[m.sender]?.claimMessage
      const duration = ((now - record.expiresAt + 60000) / 1000).toFixed(1)
      const finalMessage = custom ? custom.replace(/€user/g, `*${displayName}*`).replace(/€character/g, `*${record.name}*`) : `*${record.name}* ha sido reclamado por *${displayName}*`
      await client.sendMessage(m.chat, { text: `🎤 ${finalMessage} (${duration}s)` }, { quoted: m })
      chat.rolls[quotedId].claimed = true
    } catch (e) {
      await m.reply(`🎤 An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> � [Error: *${e.message}*]`)
    }
  },
}