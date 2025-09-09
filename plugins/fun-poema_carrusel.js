import axios from 'axios';
const {
  proto,
  generateWAMessageFromContent
} = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text }) => {
  if (!text) {
    return conn.reply(message.chat, "❀ Por favor, ingrese un texto para generar poemas en el carrusel.", message);
  }

  try {
    conn.reply(message.chat, '✧ *ENVIANDO SUS POEMAS..*', message);

    // Ejemplos de poemas (puedes reemplazarlos o cargarlos dinámicamente)
    let poemas = [
      "🌙 En la luna se esconde el sueño,\nallí nace el eterno empeño.",
      "🌹 La rosa canta en silencio,\nperfume guardado en el tiempo.",
      "🔥 El fuego arde sin miedo,\nilumina senderos de credo.",
      "🌊 El mar murmura al viento,\ncanta historias del pensamiento.",
      "🌳 Árbol viejo de raíces profundas,\ncuentas memorias que nunca se esfuman."
    ];

    let results = [];
    for (let poema of poemas) {
      results.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ 
          text: poema 
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ 
          text: "✧ Torre del Conocimiento ✧" 
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: "📖 Poema",
          hasMediaAttachment: false
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ 
          buttons: [] 
        })
      });
    }

    const messageContent = generateWAMessageFromContent(message.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
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
              cards: [...results]
            })
          })
        }
      }
    }, {
      quoted: message
    });

    await conn.relayMessage(message.chat, messageContent.message, {
      messageId: messageContent.key.id
    });

  } catch (error) {
    conn.reply(message.chat, `⚠︎ *OCURRIÓ UN ERROR:* ${error.message}`, message);
  }
};

handler.help = ["poemacarrusel"];
handler.tags = ["literatura"];
handler.command = ["poemacarrusel"];

export default handler;
