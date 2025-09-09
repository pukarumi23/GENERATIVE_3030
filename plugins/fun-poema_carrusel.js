import { proto, generateWAMessageFromContent } from "@whiskeysockets/baileys"

let handler = async (message, { conn }) => {
  try {
    conn.reply(message.chat, '✧ *CREANDO TU CARRUSEL DE POEMAS..*', message)

    // Lista de poemas + imágenes (puedes ampliar esta lista)
    let tarjetas = [
      {
        poema: "🤖 En la mente digital despierta la razón,\nsoñando futuros con pura creación.",
        imagen: "https://files.catbox.moe/57prnv.jpg"
      },
      {
        poema: "🌌 Estrellas de datos guían la verdad,\ncódigos infinitos en la eternidad.",
        imagen: "https://files.catbox.moe/bgvfdm.jpeg"
      }
    ]

    // Construcción de tarjetas
    let results = []
    for (let t of tarjetas) {
      results.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: t.poema
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: "✧ Torre del Conocimiento ✧"
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: "📖 Poema",
          hasMediaAttachment: true,
          imageMessage: { url: t.imagen }
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: []
        })
      })
    }

    // Construcción del carrusel completo
    const messageContent = generateWAMessageFromContent(message.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: "✧ COLECCIÓN DE POEMAS ✧"
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: "Independiente Bot"
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards: results
            })
          })
        }
      }
    }, { quoted: message })

    // Enviar mensaje
    await conn.relayMessage(message.chat, messageContent.message, {
      messageId: messageContent.key.id
    })

  } catch (error) {
    conn.reply(message.chat, `⚠︎ *OCURRIÓ UN ERROR:* ${error.message}`, message)
  }
}

handler.help = ["poemas"]
handler.tags = ["literatura"]
handler.command = ["poemas"]

export default handler
