import axios from 'axios'
import FormData from 'form-data'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

function generateUniqueFilename(mime) {
  const ext = mime.split('/')[1] || 'bin'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${id}.${ext}`
}

async function uploadToCatbox(buffer, mime) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, { filename: generateUniqueFilename(mime) })

  const res = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })

  if (!res.data || typeof res.data !== 'string' || !res.data.startsWith('https://')) {
    throw new Error('Respuesta inválida de Catbox')
  }
  return res.data.trim()
}

async function uploadToAdonix(buffer, mime) {
  const filename = generateUniqueFilename(mime)
  const base64Content = buffer.toString('base64')

  const res = await axios.post('https://adofiles.i11.eu/api/upload', {
    filename: filename,
    content: base64Content,
    apiKey: 'Ado&'
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': 'Ado&'
    }
  })

  if (res.status !== 201 || !res.data.files || res.data.files.length === 0) {
    throw new Error('Respuesta inválida de AdonixFiles')
  }

  return res.data.files[0].publicUrl
}

export default {
  command: ['tourl'],
  category: 'utils',
  run: async (client, m, args, usedprefix, command, text) => {
    const q = m.quoted || m
    const mime = (q.msg || q).mimetype || ''
    if (!mime) {
      return client.reply(
        m.chat,
        `💙 Por favor, responde a una imagen o video con el comando *${usedprefix + command}* para convertirlo en una URL.`,
        m, global.miku
      )
    }

    try {
      const media = await q.download()

      const [catboxLink, adonixLink] = await Promise.all([
        uploadToCatbox(media, mime),
        uploadToAdonix(media, mime)
      ])

      const userName = global.db.data.users[m.sender]?.name || 'Usuario'
      const upload = `💌 *Upload Success*\n\n` +
        `ׅ🌱 *URL [1] ›* ${catboxLink}\n` +
        `ׅ🌱 *URL [2]›* ${adonixLink}\n` +
        `ׅ🌱 *Peso ›* ${formatBytes(media.length)}\n` +
        `ׅ🌱 *Solicitado por ›* ${userName}\n\n${dev}`

      await client.reply(m.chat, upload, m)
    } catch (e) {
      console.error(e)
      await m.reply(`💙 Fail: ${e.message}`)
    }
  }
}