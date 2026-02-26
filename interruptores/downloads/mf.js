import axios from 'axios'
import path from 'path'
import { lookup } from 'mime-types'
import { getBuffer } from '../../lib/message.js'
import cheerio from 'cheerio'

export default {
  command: ['mediafire', 'mf'],
  category: 'downloader',
  run: async (client, m, args, usedPrefix, command) => {
    const text = args.join(' ').trim()

    if (!text) {
      return m.reply('💙 Por favor, ingresa el enlace de Mediafire o una palabra clave.', m, global.miku)
    }

    await m.react('⏳')

    try {
      const isUrl = /^https?:\/\/(www\.)?mediafire\.com\/.+/i.test(text)

      if (!isUrl) {
        const res = await axios.get(
          `${global.APIs.stellar.url}/search/mediafire?query=${encodeURIComponent(text)}&key=${global.APIs.stellar.key}`
        )
        const data = res.data

        if (!data?.status || !data.results?.length) {
          await m.react('❌')
          return m.reply('💙 No se encontraron resultados para tu búsqueda.', m, global.miku)
        }

        let caption = `💙 *MEDIAFIRE SEARCH* 💙\n\n`
        caption += `💙 *Resultados encontrados:* ${data.results.length}\n\n`

        data.results.forEach((r, i) => {
          caption += `${i % 2 === 0 ? '💙' : '🌱'} *${i + 1}. Nombre:* ${r.filename}\n`
          caption += `${i % 2 === 0 ? '🌱' : '💙'} *Peso:* ${r.filesize}\n`
          caption += `${i % 2 === 0 ? '💙' : '🌱'} *Enlace:* ${r.url}\n`
          caption += `${i % 2 === 0 ? '🌱' : '💙'} *Fuente:* ${r.source_title}\n\n`
        })

        caption += `💙 *HATSUNE MIKU* 💙`

        await m.react('✅')
        return m.reply(caption)
      }

      const scraped = await mediafireDl(text)
      if (!scraped?.downloadLink) {
        await m.react('❌')
        return m.reply('💙 El enlace ingresado es inválido.', m, global.miku)
      }

      const title = (scraped.filename || 'archivo').trim()
      const ext = path.extname(title) || (scraped.type ? `.${scraped.type}` : '')
      const tipo = lookup((ext || '').toLowerCase()) || 'application/octet-stream'

      const info = `💙🌱 *MEDIAFIRE DOWNLOAD* 🌱💙

💙 *Nombre:* ${title}
🌱 *Tipo:* ${tipo}
${scraped.size ? `💙 *Peso:* ${scraped.size}\n` : ''}${scraped.uploaded ? `🌱 *Subido:* ${scraped.uploaded}\n` : ''}
💙 *HATSUNE MIKU* 💙`

      await client.sendContextInfoIndex(m.chat, info, {}, m, true, null, {
        banner: 'https://i.pinimg.com/736x/0c/1e/f8/0c1ef8e804983e634fbf13df1044a41f.jpg',
        title: '💙 Mediafire 🌱',
        body: '✰ Descarga De MF',
        redes: global.db.data.settings[client.user.id.split(':')[0] + '@s.whatsapp.net'].link
      })

      await client.sendMessage(
        m.chat,
        { document: { url: scraped.downloadLink }, mimetype: tipo, fileName: title },
        { quoted: m }
      )
      
      await m.react('✅')
    } catch (e) {
      await m.react('❌')
      return m.reply(
        `💙 *ERROR* 🌱

💙 Ocurrió un error al ejecutar *${usedPrefix + command}*

🌱 *Error:* ${e.message}

💙 Inténtalo de nuevo o contacta soporte.`, m, global.miku
      )
    }
  }
}

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

function cleanText(x) {
  return String(x || '').replace(/\s+/g, ' ').trim()
}

function normalizeUrl(u) {
  const s = cleanText(u)
  if (!s) return null
  if (/^https?:\/\//i.test(s)) return s
  if (s.startsWith('//')) return 'https:' + s
  if (s.startsWith('/')) return 'https://www.mediafire.com' + s
  return s
}

function pickFilename($) {
  let filename = cleanText($('.intro .filename').text())
  if (!filename) filename = cleanText($('meta[property="og:title"]').attr('content'))
  if (!filename) filename = cleanText($('title').text())
  return filename || null
}

function pickFiletypeText($) {
  const t = cleanText($('.filetype').text())
  return t || null
}

function pickTypeFromFilename(name) {
  if (!name) return null
  const m = String(name).match(/\.([a-z0-9]{1,10})$/i)
  return m?.[1]?.toLowerCase() || null
}

function pickDetails($) {
  let size = null
  let uploaded = null

  $('ul.details li').each((_, el) => {
    const text = cleanText($(el).text())
    if (!size && /File size:/i.test(text)) size = cleanText($(el).find('span').text()) || null
    if (!uploaded && /Uploaded:/i.test(text)) uploaded = cleanText($(el).find('span').text()) || null
  })

  return { size, uploaded }
}

async function mediafireDl(url, timeout = 45000) {
  const mediafireUrl = cleanText(url)
  if (!mediafireUrl) throw new Error('URL requerida')

  const res = await axios.get(mediafireUrl, {
    timeout,
    maxRedirects: 5,
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    },
    validateStatus: () => true
  })

  if (res.status < 200 || res.status >= 400) {
    throw new Error(`MediaFire HTTP ${res.status}`)
  }

  const $ = cheerio.load(String(res.data || ''))

  const downloadLinkRaw = $('#downloadButton').attr('href') || $('a#downloadButton').attr('href') || null
  const downloadLink = normalizeUrl(downloadLinkRaw)

  if (!downloadLink) {
    throw new Error('Download link not found')
  }

  const filename = pickFilename($)
  const filetype = pickFiletypeText($)
  const { size, uploaded } = pickDetails($)
  const type = pickTypeFromFilename(filename) || (filetype ? cleanText(filetype).toLowerCase() : null)

  return { downloadLink, filename, filetype, size, uploaded, type }
}
