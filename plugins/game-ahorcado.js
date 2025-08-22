const palabras = [
    "gato", "perro", "pájaro", "elefante", "tigre", "ballena", "mariposa", "tortuga", 
    "conejo", "rana", "pulpo", "ardilla", "jirafa", "cocodrilo", "pingüino", "delfín", 
    "serpiente", "hámster", "mosquito", "abeja", "televisión", "computadora", "botsito", 
    "reggaeton", "economía", "electrónica", "facebook", "whatsapp", "instagram", "tiktok", 
    "milanesa", "presidente", "películas", "aventura", "chocolate", "guitarra", "océano",
    "montaña", "estrella", "ciudad", "jardín", "biblioteca", "hospital", "escuela"
]

const intentosMaximos = 6
const gam = new Map()

function elegirPalabraAleatoria() {
    return palabras[Math.floor(Math.random() * palabras.length)]
}

function ocultarPalabra(palabra, letrasAdivinadas) {
    let palabraOculta = ""
    for (const letra of palabra.toLowerCase()) {
        if (letrasAdivinadas.includes(letra.toLowerCase())) {
            palabraOculta += letra + " "
        } else {
            palabraOculta += "_ "
        }
    }
    return palabraOculta.trim()
}

function mostrarAhorcado(intentos) {
    const dibujos = [
        
        `
  ╔═══════════╗
  ║           ║
  ║     😵    ║
  ║    /|\\    ║
  ║    / \\    ║
  ║           ║
  ╚═══════════╝`,
       
        `
  ╔═══════════╗
  ║           ║
  ║     😰    ║
  ║    /|\\    ║
  ║    /      ║
  ║           ║
  ╚═══════════╝`,
        
        `
  ╔═══════════╗
  ║           ║
  ║     😨    ║
  ║    /|\\    ║
  ║           ║
  ║           ║
  ╚═══════════╝`,
        
        `
  ╔═══════════╗
  ║           ║
  ║     😟    ║
  ║    /|     ║
  ║           ║
  ║           ║
  ╚═══════════╝`,
        
        `
  ╔═══════════╗
  ║           ║
  ║     😐    ║
  ║     |     ║
  ║           ║
  ║           ║
  ╚═══════════╝`,
        
        `
  ╔═══════════╗
  ║           ║
  ║     😊    ║
  ║           ║
  ║           ║
  ║           ║
  ╚═══════════╝`,
        
        `
  ╔═══════════╗
  ║           ║
  ║           ║
  ║           ║
  ║           ║
  ║           ║
  ╚═══════════╝`
    ]
    
    return "```" + dibujos[intentos] + "```"
}

function juegoTerminado(sender, mensaje, palabra, letrasAdivinadas, intentos) {
    
    if (intentos === 0) {
        gam.delete(sender)
        return `╔═══════════════════════════════╗
║          💀 GAME OVER 💀        ║
╚═══════════════════════════════╝

😵 ¡Has perdido! La palabra era: *${palabra.toUpperCase()}*

${mostrarAhorcado(intentos)}

💡 ¡Inténtalo de nuevo con .ahorcado!`
    }
    
    
    if (!mensaje.includes("_")) {
        let expGanada = Math.floor(Math.random() * 200) + 100 
        if (palabra.length >= 8) {
            expGanada = Math.floor(Math.random() * 400) + 300 
        }
        
       
        if (global.db && global.db.data && global.db.data.users && global.db.data.users[sender]) {
            global.db.data.users[sender].exp = (global.db.data.users[sender].exp || 0) + expGanada
        }
        
        gam.delete(sender)
        return `╔═══════════════════════════════╗
║        🎉 ¡VICTORIA! 🎉        ║
╚═══════════════════════════════╝

🥳 ¡Felicitaciones! Adivinaste: *${palabra.toUpperCase()}*

💎 *Recompensa obtenida:* ${expGanada} EXP

🏆 ¡Sigue jugando para conseguir más puntos!`
    }
    
    
    return `╔═══════════════════════════════╗
║         🎯 AHORCADO 🎯         ║
╚═══════════════════════════════╝

${mostrarAhorcado(intentos)}

📝 Palabra: ${mensaje}
❤️ Vidas restantes: ${intentos}
📚 Letras usadas: ${letrasAdivinadas.join(', ').toUpperCase() || 'Ninguna'}

💡 Envía una letra para continuar`
}

let handler = async (m, { conn }) => {
    
    if (gam.has(m.sender)) {
        return conn.reply(m.chat, `╔═══════════════════════════════╗
║        ⚠️ ADVERTENCIA ⚠️        ║
╚═══════════════════════════════╝

🎮 Ya tienes un juego activo en curso
⏳ Debes terminar el juego actual primero

💡 Envía una letra para continuar o usa .rendirse para abandonar`, m)
    }

    
    if (!global.db) global.db = { data: { users: {} } }
    if (!global.db.data) global.db.data = { users: {} }
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = { exp: 0 }
    }

    
    let palabra = elegirPalabraAleatoria()
    let letrasAdivinadas = []
    let intentos = intentosMaximos
    let mensaje = ocultarPalabra(palabra, letrasAdivinadas)
    
    gam.set(m.sender, { palabra, letrasAdivinadas, intentos })
    
    let text = `╔═══════════════════════════════╗
║         🎯 AHORCADO 🎯         ║
╚═══════════════════════════════╝

🎮 ¡Nuevo juego iniciado!

${mostrarAhorcado(intentos)}

📝 Palabra: ${mensaje}
❤️ Vidas: ${intentos}/${intentosMaximos}

🎯 *Objetivo:* Adivina la palabra letra por letra
💡 *Instrucciones:* Envía una letra para jugar
⚠️ *Advertencia:* Cada letra incorrecta te quitará una vida

¡Buena suerte! 🍀`
    
    await conn.reply(m.chat, text, m)
}

handler.before = async (m, { conn }) => {
    if (!m.text || m.text.startsWith('.') || m.text.startsWith('#') || m.text.startsWith('!')) return
    
    let juego = gam.get(m.sender)
    if (!juego) return true
    
    let { palabra, letrasAdivinadas, intentos } = juego
    
   
    if (m.text.length === 1 && /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(m.text)) {
        let letra = m.text.toLowerCase()
        
        
        if (letrasAdivinadas.includes(letra)) {
            await conn.reply(m.chat, `╔═════════════════════╗
║ ⚠️ LETRA REPETIDA ⚠️║
╚══════════════════════╝

🔄 Ya usaste la letra: *${letra.toUpperCase()}*
📚 Letras usadas: ${letrasAdivinadas.join(', ').toUpperCase()}

💡 Intenta con otra letra`, m)
            return false
        }
        
       
        letrasAdivinadas.push(letra)
        
        
        if (!palabra.toLowerCase().includes(letra)) {
            intentos--
            await conn.reply(m.chat, `❌ La letra *${letra.toUpperCase()}* no está en la palabra.`, m)
        } else {
            await conn.reply(m.chat, `✅ ¡Bien! La letra *${letra.toUpperCase()}* está en la palabra.`, m)
        }
        
        
        let mensaje = ocultarPalabra(palabra, letrasAdivinadas)
        
       
        gam.set(m.sender, { palabra, letrasAdivinadas, intentos })
        
       
        let respuesta = juegoTerminado(m.sender, mensaje, palabra, letrasAdivinadas, intentos)
        await conn.reply(m.chat, respuesta, m)
        
        return false 
        
    } else if (m.text.toLowerCase() === 'rendirse' || m.text.toLowerCase() === '.rendirse') {
       
        gam.delete(m.sender)
        await conn.reply(m.chat, `╔══════════════╗
║  🏳️ RENDIRSE 🏳️║
╚═════════════════╝

😔 Te has rendido del juego
🔤 La palabra era: *${palabra.toUpperCase()}*

💡 ¡Inténtalo de nuevo con .ahorcado!`, m)
        return false
        
    } else {
       
        await conn.reply(m.chat, `╔═══════════════════════╗
║ ⚠️ ENTRADA INVÁLIDA ⚠️ ║
╚═════════════════════════╝

❌ Solo puedes enviar:
🔤 Una letra para adivinar
🏳️ "rendirse" para abandonar el juego

💡 Intenta de nuevo`, m)
        return false
    }
}


handler.rendirse = async (m, { conn }) => {
    if (!gam.has(m.sender)) {
        return conn.reply(m.chat, '❌ No tienes ningún juego activo.', m)
    }
    
    let { palabra } = gam.get(m.sender)
    gam.delete(m.sender)
    
    await conn.reply(m.chat, `╔═══════════════════════════════╗
║         🏳️ RENDIRSE 🏳️         ║
╚═══════════════════════════════╝

😔 Te has rendido del juego
🔤 La palabra era: *${palabra.toUpperCase()}*

💡 ¡Inténtalo de nuevo con .ahorcado!`, m)
}

handler.help = ['ahorcado', 'rendirse']
handler.tags = ['game']
handler.command = /^(ahorcado|rendirse)$/i
handler.group = true
handler.register = true

export default handler
