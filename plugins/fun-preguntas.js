var handler = async (m, { conn, text, usedPrefix, command }) => {

if (!text) return conn.reply(m.chat, `🎤💙 Por favor, hazme una pregunta para que pueda responderte con mi sabiduría virtual ✨`, m)

await m.react('❔')
await delay(1000 * 1)
await m.react('❓')
await delay(1000 * 1)
await m.react('❔')
await delay(1000 * 1)

await conn.reply(m.chat, + dev + `\n\n🎤💙 *Pregunta Musical:* ` + text + `\n🎵✨ *Respuesta Virtual:* ` + res, m)

}
handler.help = ['pregunta']
handler.tags = ['fun']
handler.command = ['pregunta','preguntas']
handler.group = true
handler.register = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let res = ['¡Hai! Sí ✨','Tal vez sí, nya~ 🎵','Posiblemente, desu 💙','Probablemente no, gomen 🎤','No, lo siento 💫','Imposible en el mundo virtual 🌟','¿Por qué haces estas preguntas musicales? 🎶','Por eso prefiero cantar 🎵','Para que quieres saber, fanático curioso 💙','No te diré la respuesta, es un secreto virtual ✨','Mi intuición Vocaloid dice que sí 🎤','El ciberespacio me dice que no 💫','¡Definitivamente! Como una melodía perfecta 🎵','Ni siquiera mi tecnología puede predecir eso 🌟'].getRandom()