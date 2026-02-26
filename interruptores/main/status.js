import fs from 'fs'
import os from 'os'
import { sizeFormatter } from 'human-readable'

function getDefaultHostId() {
  if (process.env.HOSTNAME) {
    return process.env.HOSTNAME.split('-')[0]
  }
  return 'default_host_id'
}

const format = sizeFormatter({ std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B` })

export default {
  command: ['status', 'estado'],
  category: 'info',
  run: async (client, m) => {
    const hostId = getDefaultHostId()
    const registeredGroups = global.db.data.chats ? Object.keys(global.db.data.chats).length : 0
    const botId = client.user.id.split(':')[0] + "@s.whatsapp.net" || false
    const botSettings = global.db.data.settings[botId] || {}
    const botname = botSettings.botname
    const userCount = Object.keys(global.db.data.users).length || '0'
    const totalCommands = Object.values(global.db.data.users).reduce((acc, user) => acc + (user.usedcommands || 0), 0)
    const estadoBot = `💙🎵 *Estado de ${botname}* 🎵💙
🌱 *Usuarios registrados ›* ${userCount.toLocaleString()}
💙 *Grupos registrados ›* ${registeredGroups.toLocaleString()}
🌱 *Comandos ejecutados ›* ${toNum(totalCommands)}

✨ *HATSUNE MIKU BOT*`
    const sistema = os.type()
    const cpu = os.cpus().length
    const ramTotal = format(os.totalmem())
    const ramUsada = format(os.totalmem() - os.freemem())
    const arquitectura = os.arch()
    const estadoServidor = `💙🎵 *Estado del Servidor* 🎵💙

🌱 *Sistema ›* ${sistema}
💙 *CPU ›* ${cpu} cores
🌱 *RAM Total ›* ${ramTotal}
💙 *RAM Usado ›* ${ramUsada}
🌱 *Arquitectura ›* ${arquitectura}
💙 *Host ID ›* ${hostId}

🎵 *Uso de Memoria NODEJS* 🎵

💙 *Ram Utilizada* › ${format(process.memoryUsage().rss)}
🌱 *Heap Reservado* › ${format(process.memoryUsage().heapTotal)}
💙 *Heap Usado* › ${format(process.memoryUsage().heapUsed)}
🌱 *Módulos Nativos* › ${format(process.memoryUsage().external)}
💙 *Buffers de Datos* › ${format(process.memoryUsage().arrayBuffers)}

✨ *HATSUNE MIKU BOT*`
    const mensajeEstado = `${estadoBot}\n\n${estadoServidor}`
    await client.reply(m.chat, mensajeEstado, m)
  }
}

function toNum(number) {
  if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1) + 'k'
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else {
    return number.toString()
  }
}