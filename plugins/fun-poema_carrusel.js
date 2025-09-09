import { proto, generateWAMessageFromContent } from "@whiskeysockets/baileys";

let handler = async (message, { conn }) => {
  try {
    conn.reply(message.chat, '✧ *ENVIANDO SUS POEMAS..*', message);

    // Poemas de ejemplo
    let poemas = [
      "🌙 En la luna se esconde el sueño,\nallí nace el eterno empeño.",
      "🌹 La rosa canta en silencio,\nperfume guardado en el tiempo.",
      "🔥 El fuego arde sin miedo,\nilumina senderos de credo.",
      "🌊 El mar murmura al viento,\ncanta historias del pensamiento.",
      "🌳 Árbol viejo de raíces profundas,\ncuentas memorias que nunca se esfuman."
    ];

    // Armamos las tarjetas
    let results = poemas.map(poema => ({
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
    }));

    // Construimos el carrusel
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
    }, { quoted: message });

    // Enviamos
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
