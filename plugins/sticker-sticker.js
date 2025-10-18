import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, args }) => {
  let stiker = false
  let userId = m.sender
  let packstickers = global.db.data.users[userId] || {}
  let texto1 = packstickers.text1 || global.packsticker
  let texto2 = packstickers.text2 || global.packsticker2
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    let txt = args.join(' ')

    // Estilo femenino, con personalidad tipo Marin Kitagawa: alegre, coqueta, entusiasta y cercana.
    await conn.reply(m.chat, '🌸 ¡Hola! Soy Marin~ 💖 Estoy preparando tu sticker, espera un momentito, ¿sí? ✨', m, rcanal)

    if (/webp|image|video/g.test(mime) && q.download) {
      if (/video/.test(mime) && (q.msg || q).seconds > 16)
        return conn.reply(
          m.chat,
          '🥺 Oh... el video es demasiado largo. Mándame uno de hasta *15 segundos* y lo convertiré en un sticker super lindo, ¡prometido! 🎬💕',
          m,
          rcanal
        )
      let buffer = await q.download()
      await m.react('🌟')

      let marca = txt ? txt.split(/[\u2022|]/).map(part => part.trim()) : [texto1, texto2]
      stiker = await sticker(buffer, false, marca[0], marca[1])
    } else if (args[0] && isUrl(args[0])) {
      let buffer = await sticker(false, args[0], texto1, texto2)
      stiker = buffer
    } else {
      return conn.reply(
        m.chat,
        '📸 ¡Uy! No veo una imagen o video para transformar. Porfa envía o responde con una *imagen*, *webp* o *video* (máx. 15s). También puedes pasar una URL directa a una imagen~ ✨',
        m,
        rcanal
      )
    }
  } catch (e) {
    await conn.reply(
      m.chat,
      '😵‍💫 ¡Ay no! Algo falló mientras hacía tu sticker.\nDetalles: ' + (e?.message || e) + '\nTrata de nuevo en un ratito o dime qué estabas enviando, yo te ayudo 💪💖',
      m,
      rcanal
    )
    await m.react('❌')
  } finally {
    if (stiker) {
      conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
      await m.react('✔️')
      // Un pequeño mensaje final con el toque coqueto de Marin
      await conn.reply(m.chat, '¡Listo! ✨ Tu sticker quedó precioso, ¿quieres crear otro? 🥰', m, rcanal)
    }
  }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['s', 'sticker']

export default handler

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)(jpe?g|gif|png)/, 'gi'))
}
