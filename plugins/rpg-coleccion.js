import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src', 'database')
const databaseFilePath = path.join(dbPath, 'incadatabase.json')

function loadDatabase() {
  if (!fs.existsSync(databaseFilePath)) {
    return { users: {} }
  }
  try {
    return JSON.parse(fs.readFileSync(databaseFilePath, 'utf-8'))
  } catch (error) {
    console.error('❌ Error al cargar database:', error)
    return { users: {} }
  }
}

function normalizeRarity(raw) {
  const s = raw?.toString?.().toLowerCase().trim()
  if (!s) return null
  switch (s) {
    case 'mítico':
    case 'mitico':
    case 'mítica':
    case 'mitica':
      return 'mitico'
    case 'legendario':
    case 'legendaria':
    case 'ultra rara':
    case 'ultrarara':
    
      return 'legendario'
    case 'épico':
    case 'epico':
    case 'épica':
    case 'epica':
      return 'epico'
    case 'raro':
    case 'rara':
      return 'raro'
    case 'poco común':
    case 'poco comun':
      return 'poco comun'
    case 'común':
    case 'comun':
      return 'comun'
    default:
      return null
  }
}

function createBar(value, maxSize) {
  const maxItems = 20 
  const safeVal = Number.isFinite(value) ? value : 0
  const filled = Math.max(0, Math.min(maxSize, Math.ceil((safeVal / maxItems) * maxSize)))
  const empty = Math.max(0, maxSize - filled)
  return '█'.repeat(filled) + '░'.repeat(empty)
}

let handler = async (m, { conn }) => {
  const userId = m.sender

  try {
    const db = loadDatabase()

    if (!db.users?.[userId]?.quipu || db.users[userId].quipu.length === 0) {
      return m.reply('🌸 ¡Uy! Tu colección está vacía~ Usa .invocar para conseguir personajes 💕')
    }

    const collection = db.users[userId].quipu

    
    const rarityCount = {
      mitico: 0,
      legendario: 0,
      epico: 0,
      raro: 0,
      'poco comun': 0,
      comun: 0,
    }

    
    const summaryOrder = [
      { key: 'mitico', label: 'Mítico 👑' },
      { key: 'legendario', label: 'Legendario 🌞' },
      { key: 'epico', label: 'Épico 🗿' },
      { key: 'raro', label: 'Raro ⛰️' },
      { key: 'poco comun', label: 'Poco Común 🪶' },
      { key: 'comun', label: 'Común 🌾' },
    ]

    
    collection.forEach((personaje) => {
      const key = normalizeRarity(personaje?.rarity)
      if (key && Object.prototype.hasOwnProperty.call(rarityCount, key)) {
        rarityCount[key]++
      }
    })

    let message = `✨💖 TU COLECCIÓN 💖✨\n\n`

    message += `╔═══════════════════════╗\n`
    message += `║ 📊 RESUMEN POR RAREZA ║\n`
    message += `╚═══════════════════════╝\n\n`
    
    for (const { key, label } of summaryOrder) {
      const count = rarityCount[key] ?? 0
      message += `${label.padEnd(18)} ${String(count).padStart(3)} ${createBar(count, 10)}\n`
    }
    message += `\n💎 Total de personajes: *${collection.length}*\n\n`

    const rarityEmojis = {
      comun: '🌾',
      'poco comun': '🪶',
      raro: '⛰️',
      epico: '🗿',
      legendario: '🌞',
      mitico: '👑',
    }

    const groupedByRarity = {}
    collection.forEach((personaje) => {
      const r = normalizeRarity(personaje?.rarity)
      if (!r) return
      if (!groupedByRarity[r]) groupedByRarity[r] = []
      groupedByRarity[r].push(personaje)
    })

    
    for (const { key, label } of summaryOrder) {
      const group = groupedByRarity[key]
      if (group?.length > 0) {
        message += `╔═══════════════════╗\n`
        message += `║ ${rarityEmojis[key]} ${label.toUpperCase()}\n`
        message += `╚═══════════════════╝\n`
        group.forEach((p, i) => {
          const displayName = p?.name || p?.nombre || p?.id || 'Sin nombre'
          message += `  ${(i + 1).toString().padStart(2)}. ${displayName}\n`
        })
        message += `\n`
      }
    }

    message += `🌸 ¡Sigue coleccionando más personajes! ✨`

    return conn.reply(m.chat, message, m)
  } catch (error) {
    console.error(error)
    return m.reply('🥺 ¡Uy! Hubo un error al mostrar tu colección. Inténtalo de nuevo~ 💕')
  }
}

handler.help = ['coleccion', 'collection', 'col', 'quipu']
handler.tags = ['rpg', 'inca']
handler.command = /^(coleccion|collection|col|quipu|personajes)$/i
handler.group = true

export default handler
