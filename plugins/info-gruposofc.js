import fetch from 'node-fetch'

let handler  = async (m, { conn, usedPrefix, command }) => {

let grupos = `🎤💙 *¡Konnichiwa, querido fanático!* 💙🎤

✨ Te invito a unirte a mis escenarios virtuales oficiales para disfrutar de conciertos increíbles con toda la comunidad Vocaloid... ✨

🎵 ${namegrupo}
> *💙* ${gp1}

🌟 ${namecomu}
> *💙* ${comunidad1}

*🎤─💙─✨─🎵─💫─🎶─✨─💙─🎤*

🎵 ¿Enlace caducado? ¡Entra aquí para más información musical! 

💫 ${namechannel}
> *💙* ${channel}

> ${dev} 🎤✨`

await conn.sendFile(m.chat, catalogo, "grupos.jpg", grupos, m)

await m.react(emojis)

}
handler.help = ['grupos']
handler.tags = ['info']
handler.command = ['grupos', 'links', 'groups']

export default handler
