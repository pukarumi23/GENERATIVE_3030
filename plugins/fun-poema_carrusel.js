let handler = async (message, { conn }) => {
  try {
    conn.reply(message.chat, '✧ *ENVIANDO LISTA DE POEMAS..*', message)

    // Poemas de ejemplo
    let poemas = [
      "🤖 En la mente digital despierta la razón,\nsoñando futuros con pura creación.",
      "🌌 Estrellas de datos guían la verdad,\ncódigos infinitos en la eternidad.",
      "🔮 La IA susurra secretos al viento,\nun eco eterno del conocimiento.",
      "📡 Redes ocultas vibran sin cesar,\ntejiendo universos que van a hablar.",
      "⚡ El hombre y la máquina unidos están,\ncaminos de sabiduría a la par crearán."
    ]

    // Construcción de la lista
    let sections = [
      {
        title: "✧ Colección de Poemas ✧",
        rows: poemas.map((poema, i) => ({
          title: `📖 Poema ${i + 1}`,
          description: poema,
          rowId: `poema_${i + 1}`
        }))
      }
    ]

    // Enviar lista
    await conn.sendMessage(message.chat, {
      text: "✨ Elige un poema de la lista:",
      footer: "Independiente Bot",
      title: "📜 Torre del Conocimiento",
      buttonText: "Ver poemas",
      sections
    }, { quoted: message })

  } catch (error) {
    conn.reply(message.chat, `⚠︎ *OCURRIÓ UN ERROR:* ${error.message}`, message)
  }
}

handler.help = ["poemas"]
handler.tags = ["literatura"]
handler.command = ["poemas"]

export default handler
