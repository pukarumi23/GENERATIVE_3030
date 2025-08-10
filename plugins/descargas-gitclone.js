import fetch from 'node-fetch'

let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
let handler = async (m, { args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `🎤💙 Por favor, ingresa la URL de un repositorio de GitHub que deseas descargar en el mundo virtual ✨🎵`, m, rcanal)
  }
  if (!regex.test(args[0])) {
    return conn.reply(m.chat, `🎤💙 ¡Gomen! Verifica que la *URL* sea de GitHub válida para el concierto virtual ✨💫`, m, rcanal).then(_ => m.react('💙'))
  }
  let [_, user, repo] = args[0].match(regex) || []
  let sanitizedRepo = repo.replace(/.git$/, '')
  let repoUrl = `https://api.github.com/repos/${user}/${sanitizedRepo}`
  let zipUrl = `https://api.github.com/repos/${user}/${sanitizedRepo}/zipball`
  await m.react('🎤')
  try {
  conn.reply(m.chat, '🎤💙 Descargando del ciberespacio virtual... ✨🎵', m, rcanal)
    let [repoResponse, zipResponse] = await Promise.all([
      fetch(repoUrl),
      fetch(zipUrl),
    ])
    let repoData = await repoResponse.json()
    let filename = zipResponse.headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    let type = zipResponse.headers.get('content-type')
    let img = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745610598914.jpeg'
    let txt = `🎤💙 *G I T H U B  -  D O W N L O A D  V I R T U A L* ✨\n\n`
       txt += `🎵  *Nombre* : ${sanitizedRepo}\n`
       txt += `🌟  *Repositorio* : ${user}/${sanitizedRepo}\n`
       txt += `👑  *Creador* : ${repoData.owner.login}\n`
       txt += `💫  *Descripción* : ${repoData.description || 'Sin descripción disponible en el concierto virtual'}\n`
       txt += `🔗  *Url Virtual* : ${args[0]}\n\n`
       txt += `🎤💙 *¡Descarga completada en el mundo virtual de Miku!* ✨🎵`

await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m)
await conn.sendFile(m.chat, await zipResponse.buffer(), filename, null, m)
await m.react('✨')
  } catch {
await m.react('💙')
  }
}
handler.help = ['gitclone *<url git>*']
handler.tags = ['descargas']
handler.command = ['gitclone']
handler.group = true
handler.register = true
handler.coin = 3

export default handler
