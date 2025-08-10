import {toAudio, toPTT} from '../lib/converter.js'

const handler = async (m, {conn, usedPrefix, command}) => {
const q = m.quoted ? m.quoted : m
const mime = (q || q.msg).mimetype || q.mediaType || ''
  
if (!/video|audio/.test(mime)) {
return conn.reply(m.chat, `🎤💙 Por favor, responde al video o nota de voz que desees convertir a Audio/MP3 virtual ✨🎵`, m, rcanal)
}
  
const media = await q.download()
if (!media) {
return conn.reply(m.chat, `🎤💙 ¡Gomen! Ocurrió un error al descargar tu video en el mundo virtual ✨💫`, m, rcanal)
}
  
const audio = await toPTT(media, 'mp4')
if (!audio.data) {
return conn.reply(m.chat, `🎤💙 ¡Gomen! Ocurrió un error al convertir tu nota de voz a Audio/MP3 virtual ✨🎵`, m, rcanal)
}
conn.sendMessage(m.chat, {audio: media || audio.data, mimetype: 'audio/mpeg'}, {quoted: m})
}

handler.help = ['tomp3', 'toaudio']
handler.command = ['tomp3', 'toaudio']
handler.group = true
handler.register = true

export default handler
