import fetch from 'node-fetch'
var handler = async (m, { text,  usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, `🔶 Ingresa una petición para que Gemini responda.`, m, rcanal)
try {
await m.react('🎤')
conn.sendPresenceUpdate('composing', m.chat)
var apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${text}`)
var res = await apii.json()
await m.reply(res.result)
} catch {
await m.react('🍀')
await conn.reply(m.chat, `🔶 Gemini no puede responder en este momento 💫`, m, rcanal)
}}
handler.command = ['gemini']
handler.help = ['gemini']
handler.tags = ['ai']
handler.group = true

export default handler
