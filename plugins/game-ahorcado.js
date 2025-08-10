const palabras = ["gato", "perro", "pájaro", "elefante", "tigre", "ballena", "mariposa", "tortuga", "conejo", "rana", "pulpo", "ardilla", "jirafa", "cocodrilo", "pingüino", "delfín", "serpiente", "hámster", "mosquito", "abeja", "Porno", "negro", "television", "computadora", "botsito", "reggaeton", "economía", "electrónica", "facebook", "WhatsApp", "Instagram", "tiktok", "milanesa", "presidente", "bot", "películas", 
]

const intentosMaximos = 6

const gam = new Map()

function elegirPalabraAleatoria() {
return palabras[Math.floor(Math.random() * palabras.length)]
}

function ocultarPalabra(palabra, letrasAdivinadas) {
    let palabraOculta = "";
    for (const letra of palabra) {
        if (letrasAdivinadas.includes(letra)) {
            palabraOculta += letra + " "; 
        } else {
            palabraOculta += "_ "; 
        }
    }
    return palabraOculta.trim(); 
}


function mostrarAhorcado(intentos) {
const dibujo = [
"```",
"  ╔═══════════╗",
"  ║           ║",
"  ║           ║",
intentos < 6 ? "  ║     😵    ║" : "  ║           ║",
intentos < 5 ? "  ║     |     ║" : "  ║           ║",
intentos < 4 ? "  ║    /|     ║" : intentos < 5 ? "  ║     |     ║" : "  ║           ║",
intentos < 3 ? "  ║    /|\\    ║" : intentos < 4 ? "  ║    /|     ║" : intentos < 5 ? "  ║     |     ║" : "  ║           ║",
intentos < 2 ? "  ║    /      ║" : "  ║           ║",
intentos < 1 ? "  ║    / \\    ║" : intentos < 2 ? "  ║    /      ║" : "  ║           ║",
"  ║           ║",
"  ╚═══════════╝",
"```"
]
return dibujo.join("\n")
}

function juegoTerminado(sender, mensaje, palabra, letrasAdivinadas, intentos) {
    if (intentos === 0) {
        gam.delete(sender);
        return `╔═══════════════════════════════╗
║          💀 GAME OVER 💀        ║
╚═══════════════════════════════╝

😵 ¡Has perdido! La palabra era: *${palabra.toUpperCase()}*

${mostrarAhorcado(intentos)}

💡 ¡Inténtalo de nuevo con .ahorcado!`;
    } else if (!mensaje.includes("_")) {
        let expGanada = Math.floor(Math.random() * 300); //fáciles
        if (palabra.length >= 8) {
            expGanada = Math.floor(Math.random() * 3500); //difíciles
        }
        global.db.data.users[sender].exp += expGanada;
        gam.delete(sender);
        return `╔═══════════════════════════════╗
║        🎉 ¡VICTORIA! 🎉        ║
╚═══════════════════════════════╝

🥳 ¡Felicitaciones! Adivinaste: *${palabra.toUpperCase()}*

💎 *Recompensa obtenida:* ${expGanada} EXP

🏆 ¡Sigue jugando para conseguir más puntos!`;
    } else {
        return `╔═══════════════════════════════╗
║         🎯 AHORCADO 🎯         ║
╚═══════════════════════════════╝

${mostrarAhorcado(intentos)}

📝 Palabra: ${mensaje}
❤️ Vidas restantes: ${intentos}
📚 Letras usadas: ${letrasAdivinadas.join(', ').toUpperCase() || 'Ninguna'}

💡 Envía una letra para continuar`;
    }
}

let handler = async (m, { conn }) => {
let users = global.db.data.users[m.sender]
if (gam.has(m.sender)) {
return conn.reply(m.chat, `╔═══════════════════════════════╗
║        ⚠️ ADVERTENCIA ⚠️        ║
╚═══════════════════════════════╝

🎮 Ya tienes un juego activo en curso
⏳ Debes terminar el juego actual primero

💡 Envía una letra para continuar o escribe cualquier palabra para rendirte`, m)
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
conn.reply(m.chat, text, m)
}

handler.before = async (m, { conn }) => {
let users = global.db.data.users[m.sender]
let juego = gam.get(m.sender)
if (!juego) return
let { palabra, letrasAdivinadas, intentos } = juego
if (m.text.length === 1 && m.text.match(/[a-zA-Z]/)) {
let letra = m.text.toLowerCase()
if (!letrasAdivinadas.includes(letra)) {
letrasAdivinadas.push(letra)
if (!palabra.includes(letra)) {
intentos--
}
}
let mensaje = ocultarPalabra(palabra, letrasAdivinadas)
let respuesta = juegoTerminado(m.sender, mensaje, palabra, letrasAdivinadas, intentos)
if (respuesta.includes("💀 GAME OVER 💀") || respuesta.includes("🎉 ¡VICTORIA! 🎉")) {
conn.reply(m.chat, respuesta, m)
} else {
gam.set(m.sender, { palabra, letrasAdivinadas, intentos })
conn.reply(m.chat, respuesta, m)
}
} else {
let mensaje = ocultarPalabra(palabra, letrasAdivinadas);
let respuesta = `╔═══════════════════════════════╗
║         🏳️ RENDIRSE 🏳️         ║
╚═══════════════════════════════╝

😔 Te has rendido del juego
🔤 La palabra era: *${palabra.toUpperCase()}*

💡 ¡Inténtalo de nuevo con .ahorcado!`
conn.reply(m.chat, respuesta, m)
gam.delete(m.sender)
}
}
handler.help = ['ahorcado']
handler.tags = ['game']
handler.command = ['ahorcado']
handler.group = true
handler.register = true

export default handler