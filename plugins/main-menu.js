let handler = async (m, { conn, args }) => {
let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
let user = global.db.data.users[userId]
let name = conn.getName(userId)
let _uptime = process.uptime() * 1000
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    
let txt = `╔════════════════╗
║ 💙 ¡HATSUNE MIKU BOT! 💙 ║
║  🎤 ¡Konnichiwa! 🎤      ║
╚══════════════╝

💙🖥🔌 ¡Bienvenido al mundo virtual de Miku! 🔌🖥💙

┏━━━━━━━━━━━━━━━┓
┃ 📊 ESTADO DEL BOT┃
┣━━━━━━━━━━━━━━━┫
┃ � Usuario: @${userId.split('@')[0]}
┃ 💙 Modo: Público en Línea
┃ 🤖 Estado: ${(conn.user.jid == global.conn.user.jid ? 'Bot Principal �️' : 'Sub-Bot �️')}
┃ ⏰ Tiempo Activo: ${uptime}
┃ 👥 Usuarios: ${totalreg}
┃ 🔧 Comandos: ${totalCommands}
┃ 🖥️ Sistema: Multi-Device
┗━━━━━━━━━━━━━━━━━━━┛

🔌💙 ¿Quieres tu propio bot? Usa *#qr* o *#code* 💙🔌

┏━━━━━━━━━━━━━━━━━━━┓
┃ 📋 INFORMACIÓN DEL BOT ┃
┗━━━━━━━━━━━━━━━━━━━┛

💙🖥 Comandos para ver el estado e información de Miku-chan 🖥💙
🔌 *#help • #menu*
   ┗ 📱 Ver la lista completa de comandos disponibles
⏰ *#uptime • #runtime*
   ┗ 🕐 Ver tiempo de actividad del bot
📂 *#sc • #script*
   ┗ 🔗 Link del repositorio oficial
👥 *#staff • #colaboradores*
   ┗ 👨‍💻 Ver la lista de desarrolladores
🔌 *#serbot • #serbot code*
   ┗ 🤖 Crear una sesión de Sub-Bot
🌐 *#bots • #sockets*
   ┗ 📊 Ver lista de Sub-Bots activos
📊 *#status • #estado*
   ┗ 💙 Ver el estado actual del bot
🔗 *#links • #grupos*
   ┗ 📱 Ver enlaces oficiales del bot
ℹ️ *#infobot*
   ┗ 📋 Ver información completa del bot
💡 *#sug • #newcommand*
   ┗ 🆕 Sugerir un nuevo comando
📶 *#p • #ping*
   ┗ ⚡ Ver velocidad de respuesta
📢 *#reporte • #reportar*
   ┗ 🐛 Reportar errores o problemas
🖥️ *#sistema • #system*
   ┗ 💻 Ver estado del sistema de hosting
🚀 *#speed • #speedtest*
   ┗ 📈 Ver estadísticas de velocidad
👤 *#views • #usuarios*
   ┗ 👥 Ver cantidad de usuarios registrados
⚙️ *#funciones • #totalfunciones*
   ┗ 🔧 Ver todas las funciones disponibles
🧹 *#ds • #fixmsgespera*
   ┗ 🗑️ Eliminar archivos de sesión innecesarios
🎛️ *#editautoresponder*
   ┗ 🤖 Configurar respuesta automática personalizada

┏━━━━━━━━━━━━┓
┃ 🔍 BUSCADORES ┃
┗━━━━━━━━━━━━┛

💙🔍 Comandos para buscar en diferentes plataformas 🔍💙
🎵 *#tiktoksearch • #tiktoks*
   ┗ 📱 Buscador de videos de TikTok
🐦 *#tweetposts*
   ┗ 🔵 Buscador de posts de Twitter/X
📺 *#ytsearch • #yts*
   ┗ 🔴 Realizar búsquedas en YouTube
👨‍💻 *#githubsearch*
   ┗ 🖥️ Buscador de usuarios de GitHub
🎬 *#cuevana • #cuevanasearch*
   ┗ 🍿 Buscador de películas y series
🌐 *#google*
   ┗ 🔍 Realizar búsquedas en Google
📌 *#pin • #pinterest*
   ┗ 📷 Buscador de imágenes Pinterest
🖼️ *#imagen • #image*
   ┗ 🎨 Buscador de imágenes Google
📚 *#infoanime*
   ┗ 🎌 Información de anime y manga
🔞 *#hentaisearch • #searchhentai*
   ┗ 🌸 Buscador de contenido hentai
🔞 *#xnxxsearch • #xnxxs*
   ┗ 🔴 Buscador de videos Xnxx
🔞 *#xvsearch • #xvideossearch*
   ┗ 🟠 Buscador de videos Xvideos
🔞 *#pornhubsearch • #phsearch*
   ┗ 🟡 Buscador de videos Pornhub
📦 *#npmjs*
   ┗ 🔧 Buscador de paquetes NPM

┏━━━━━━━━━━━━━┓
┃  📥 DESCARGAS ┃
┗━━━━━━━━━━━━━┛

💙📥 Comandos para descargar todo tipo de contenido 📥💙
🎵 *#tiktok • #tt*
   ┗ 📱 Descargar videos de TikTok
📁 *#mediafire • #mf*
   ┗ 💾 Descargar archivos de MediaFire
📌 *#pinvid • #pinvideo*
   ┗ 🎥 Descargar videos de Pinterest
☁️ *#mega • #mg*
   ┗ 💎 Descargar archivos de MEGA
🎶 *#play • #play2*
   ┗ 🔴 Descargar música/video de YouTube
📺 *#ytmp3 • #ytmp4*
   ┗ 🎵 Descargar por URL de YouTube
📘 *#fb • #facebook*
   ┗ 🔵 Descargar videos de Facebook
🐦 *#twitter • #x*
   ┗ ⚡ Descargar videos de Twitter/X
📸 *#ig • #instagram*
   ┗ 💜 Descargar contenido de Instagram
🎪 *#tts • #tiktoks*
   ┗ 🎭 Buscar y descargar TikToks
📂 *#terabox • #tb*
   ┗ 🗂️ Descargar archivos de Terabox
🖼️ *#ttimg • #ttmp3*
   ┗ 🎨 Descargar fotos/audios TikTok
👨‍💻 *#gitclone*
   ┗ 🔧 Clonar repositorios de GitHub
🔞 *#xvideosdl*
   ┗ 🟠 Descargar videos de Xvideos
🔞 *#xnxxdl*
   ┗ 🔴 Descargar videos de Xnxx
📱 *#apk • #modapk*
   ┗ 🤖 Descargar APKs de Aptoide
🎲 *#tiktokrandom • #ttrandom*
   ┗ 🎰 TikTok aleatorio
📦 *#npmdl • #npmdownloader*
   ┗ 🛠️ Descargar paquetes NPM

┏━━━━━━━━━━┓
┃ 💰 ECONOMÍA ┃
┗━━━━━━━━━━┛

💙💰 Sistema de economía y RPG para ganar recursos 💰💙
💼 *#w • #work • #trabajar*
   ┗ 👔 Trabajar para ganar ${moneda}
🔞 *#slut • #prostituirse*
   ┗ 💄 Trabajar como prostituta
🎰 *#cf • #suerte*
   ┗ 🪙 Apostar a cara o cruz
🦹 *#crime • #crimen*
   ┗ 🔫 Trabajar como ladrón
🎡 *#ruleta • #roulette • #rt*
   ┗ 🔴 Apostar al rojo o negro
🎲 *#casino • #apostar*
   ┗ 🃏 Apostar en el casino
🎰 *#slot*
   ┗ 🍒 Máquina tragamonedas
👛 *#cartera • #wallet*
   ┗ 💳 Ver dinero en cartera
🏦 *#banco • #bank*
   ┗ 🏛️ Ver dinero en el banco
💳 *#deposit • #depositar • #d*
   ┗ ⬇️ Depositar al banco
💸 *#with • #retirar • #withdraw*
   ┗ ⬆️ Retirar del banco
🔄 *#transfer • #pay*
   ┗ 💸 Transferir dinero/XP
⛏️ *#mining • #minar • #mine*
   ┗ ⚡ Trabajar como minero
🛒 *#buyall • #buy*
   ┗ 💎 Comprar dinero con XP
📅 *#daily • #diario*
   ┗ 🎁 Recompensa diaria
📦 *#cofre*
   ┗ 🗃️ Cofre diario de recursos
📆 *#weekly • #semanal*
   ┗ 🎊 Regalo semanal
📊 *#monthly • #mensual*
   ┗ 🏆 Recompensa mensual
🥷 *#steal • #robar • #rob*
   ┗ 💰 Robar dinero a alguien
🎯 *#robarxp • #robxp*
   ┗ ✨ Robar XP a usuarios
📈 *#eboard • #baltop*
   ┗ 🏅 Ranking de millonarios
🗺️ *#aventura • #adventure*
   ┗ 🏔️ Aventurarse por recursos
💊 *#curar • #heal*
   ┗ ❤️ Curar tu salud
🏹 *#cazar • #hunt • #berburu*
   ┗ 🦌 Cazar animales
🎒 *#inv • #inventario*
   ┗ 📋 Ver tu inventario
🏰 *#mazmorra • #explorar*
   ┗ ⚔️ Explorar mazmorras
🎃 *#halloween*
   ┗ 🍭 Dulce o truco (Halloween)
🎄 *#christmas • #navidad*
   ┗ 🎅 Regalo navideño (Navidad)

┏━━━━━━━━━━┓
┃ 🎯 GACHA ┃
┗━━━━━━━━━━┛

💙🎯 Sistema de gacha para coleccionar personajes 🎯💙
🎲 *#rollwaifu • #rw • #roll*
   ┗ 🌟 Waifu o husbando aleatorio
💎 *#claim • #c • #reclamar*
   ┗ ✨ Reclamar un personaje
👥 *#harem • #waifus • #claims*
   ┗ 💝 Ver personajes reclamados
🖼️ *#charimage • #waifuimage • #wimage*
   ┗ 📸 Imagen aleatoria de personaje
ℹ️ *#charinfo • #winfo • #waifuinfo*
   ┗ 📋 Información de personaje
🎁 *#givechar • #givewaifu • #regalar*
   ┗ 💌 Regalar personaje a usuario
🗳️ *#vote • #votar*
   ┗ ⭐ Votar para subir valor
🏆 *#waifusboard • #waifustop • #topwaifus*
   ┗ 👑 Top personajes más valiosos

┏━━━━━━━━━━━┓
┃ 🎨 STICKERS ┃
┗━━━━━━━━━━━┛

💙🎨 Comandos para crear y editar stickers 🎨💙
✨ *#sticker • #s*
   ┗ 🖼️ Crear stickers de imagen/video
⚙️ *#setmeta*
   ┗ 📝 Establecer pack y autor
🗑️ *#delmeta*
   ┗ ❌ Eliminar pack de stickers
👤 *#pfp • #getpic*
   ┗ 📷 Obtener foto de perfil
💬 *#qc*
   ┗ 🎭 Crear stickers con texto
🖼️ *#toimg • #img*
   ┗ 🔄 Convertir stickers a imagen
🎪 *#brat • #ttp • #attp*
   ┗ 📝 Crear stickers con texto
🎨 *#emojimix*
   ┗ 😊 Fusionar 2 emojis en sticker
🏷️ *#wm*
   ┗ ✏️ Cambiar nombre de stickers

┏━━━━━━━━━━━━━━━┓
┃ 🛠️ HERRAMIENTAS ┃
┗━━━━━━━━━━━━━━━┛

💙🛠️ Comandos de herramientas útiles 🛠️💙
🧮 *#calcular • #cal*
   ┗ 🔢 Calculadora matemática
🌤️ *#tiempo • #clima*
   ┗ 🌍 Ver clima de países
🕐 *#horario*
   ┗ ⏰ Horario global de países
💭 *#fake • #fakereply*
   ┗ 🎭 Crear mensajes falsos
✨ *#enhance • #remini • #hd*
   ┗ 📸 Mejorar calidad de imagen
🔤 *#letra*
   ┗ ✍️ Cambiar fuente de letras
👁️ *#read • #readviewonce • #ver*
   ┗ 🔍 Ver imágenes de una vista
🎵 *#whatmusic • #shazam*
   ┗ 🎶 Identificar canciones
🌐 *#ss • #ssweb*
   ┗ 📱 Screenshot de páginas web
📏 *#length • #tamaño*
   ┗ 📐 Cambiar tamaño archivos
🗣️ *#say • #decir*
   ┗ 💬 Repetir mensajes
📄 *#todoc • #todocument*
   ┗ 📁 Crear documentos
🌍 *#translate • #traducir • #trad*
   ┗ 🔄 Traducir idiomas

┏━━━━━━━━━┓
┃ 👤 PERFIL ┃
┗━━━━━━━━━┛

💙👤 Comandos para gestionar tu perfil 👤💙
📝 *#reg • #verificar • #register*
   ┗ ✅ Registrar nombre y edad
🗑️ *#unreg*
   ┗ ❌ Eliminar registro del bot
👤 *#profile*
   ┗ 📋 Mostrar perfil de usuario
💒 *#marry*
   ┗ 💍 Proponer matrimonio
💔 *#divorce*
   ┗ 🚫 Divorciarse de pareja
⚥ *#setgenre • #setgenero*
   ┗ 👫 Establecer género
🚫 *#delgenre • #delgenero*
   ┗ ❌ Eliminar género del perfil
🎂 *#setbirth • #setnacimiento*
   ┗ 📅 Establecer fecha nacimiento
🗑️ *#delbirth • #delnacimiento*
   ┗ ❌ Eliminar fecha nacimiento
📝 *#setdescription • #setdesc*
   ┗ ✍️ Establecer descripción
🗑️ *#deldescription • #deldesc*
   ┗ ❌ Eliminar descripción
🏆 *#lb • #lboard*
   ┗ 🥇 Top usuarios con más XP
⭐ *#level • #lvl*
   ┗ 📊 Ver nivel y experiencia
💎 *#comprarpremium • #premium*
   ┗ 👑 Comprar pase premium
💌 *#confesiones • #confesar*
   ┗ 💕 Confesar sentimientos anónimos

┏━━━━━━━━━┓
┃ 👥 GRUPOS ┃
┗━━━━━━━━━┛

💙👥 Comandos para gestión de grupos 👥💙
📢 *#hidetag*
   ┗ 🔔 Mencionar a todos oculto
ℹ️ *#gp • #infogrupo*
   ┗ 📋 Ver información del grupo
🟢 *#linea • #listonline*
   ┗ 👀 Ver usuarios en línea
👋 *#setwelcome*
   ┗ 🎉 Mensaje bienvenida personalizado
👋 *#setbye*
   ┗ 😢 Mensaje despedida personalizado
🔗 *#link*
   ┗ 📎 Enviar enlace del grupo
🆘 *#admins • #admin*
   ┗ 🚨 Mencionar administradores
🔄 *#restablecer • #revoke*
   ┗ 🆕 Restablecer enlace grupo
🔓 *#grupo • #group* [open]
   ┗ 💬 Abrir grupo para todos
🔒 *#grupo • #group* [close]
   ┗ 🚫 Cerrar grupo solo admins
❌ *#kick*
   ┗ 🦵 Eliminar usuario del grupo
➕ *#add • #añadir • #agregar*
   ┗ 👋 Invitar usuario al grupo
⬆️ *#promote*
   ┗ 👑 Dar administrador a usuario
⬇️ *#demote*
   ┗ 👤 Quitar administrador
🖼️ *#gpbanner • #groupimg*
   ┗ 🎨 Cambiar imagen del grupo
📝 *#gpname • #groupname*
   ┗ ✏️ Cambiar nombre del grupo
📄 *#gpdesc • #groupdesc*
   ┗ 📝 Cambiar descripción grupo
⚠️ *#advertir • #warn • #warning*
   ┗ 🚨 Dar advertencia a usuario
✅ *#unwarn • #delwarn*
   ┗ 🗑️ Quitar advertencias
📋 *#advlist • #listadv*
   ┗ 📊 Ver usuarios advertidos
🟢 *#bot on*
   ┗ ✅ Encender bot en grupo
🔴 *#bot off*
   ┗ ❌ Apagar bot en grupo
🔇 *#mute*
   ┗ 🚫 Silenciar usuario
🔊 *#unmute*
   ┗ ✅ Quitar silencio a usuario
📊 *#encuesta • #poll*
   ┗ 🗳️ Crear encuesta
🗑️ *#delete • #del*
   ┗ ❌ Eliminar mensaje
👻 *#fantasmas*
   ┗ 😴 Ver usuarios inactivos
👻 *#kickfantasmas*
   ┗ 🦵 Eliminar usuarios inactivos
📢 *#invocar • #tagall • #todos*
   ┗ 🔔 Invocar todos los usuarios
😊 *#setemoji • #setemo*
   ┗ 🎭 Cambiar emoji invitación
🌍 *#listnum • #kicknum*
   ┗ 🚫 Eliminar por prefijo país

┏━━━━━━━━┓
┃ 🎌 ANIME ┃
┗━━━━━━━━┛

💙🎌 Comandos de reacciones anime 🎌💙
😠 *#angry • #enojado*
   ┗ 💢 Expresar enojo
🦷 *#bite*
   ┗ 😋 Morder a alguien
😛 *#bleh*
   ┗ 👅 Sacar la lengua
😊 *#blush*
   ┗ 😳 Sonrojarse
😴 *#bored • #aburrido*
   ┗ 🥱 Estar aburrido
😭 *#cry*
   ┗ 💧 Llorar por algo
🤗 *#cuddle*
   ┗ 🫂 Acurrucarse
💃 *#dance*
   ┗ 🕺 Bailar con estilo
🍺 *#drunk*
   ┗ 🥴 Estar borracho
🍽️ *#eat • #comer*
   ┗ 😋 Comer algo delicioso
🤦 *#facepalm*
   ┗ 😤 Palmada en la cara
😄 *#happy • #feliz*
   ┗ 🎉 Saltar de felicidad
🤗 *#hug*
   ┗ 💕 Dar un abrazo
🤰 *#impregnate • #preg*
   ┗ 👶 Embarazar a alguien
🔪 *#kill*
   ┗ ⚔️ Matar con estilo
💋 *#kiss • #besar • #kiss2*
   ┗ 😘 Dar un beso
😂 *#laugh*
   ┗ 🤣 Reírse de algo
👅 *#lick*
   ┗ 😋 Lamer a alguien
💕 *#love • #amor*
   ┗ 💖 Sentirse enamorado
🤚 *#pat*
   ┗ 😌 Acariciar a alguien
👉 *#poke*
   ┗ 😄 Picar a alguien
😤 *#pout*
   ┗ 😠 Hacer pucheros
👊 *#punch*
   ┗ 💥 Dar un puñetazo
🏃 *#run*
   ┗ 💨 Correr rápido
😢 *#sad • #triste*
   ┗ 💔 Expresar tristeza
😨 *#scared*
   ┗ 👻 Estar asustado
😏 *#seduce*
   ┗ 💋 Seducir a alguien
😳 *#shy • #timido*
   ┗ 🙈 Sentir timidez
✋ *#slap*
   ┗ 💥 Dar una bofetada
🌅 *#dias • #days*
   ┗ ☀️ Buenos días
🌙 *#noches • #nights*
   ┗ 🌛 Buenas noches
😴 *#sleep*
   ┗ 💤 Irse a dormir
🚬 *#smoke*
   ┗ 💨 Fumar
🤔 *#think*
   ┗ 💭 Pensar en algo

┏━━━━━━━━━┓
┃ 🎮 JUEGOS ┃
┗━━━━━━━━━┛

💙🎮 Comandos para jugar y divertirse con amigos 🎮💙
🎯 *#ahorcado*
   ┗ 🎪 Juego del ahorcado
🧮 *#mates • #matematicas*
   ┗ 🔢 Preguntas de matemáticas
✂️ *#ppt*
   ┗ ✊ Piedra, papel o tijeras
🔤 *#sopa • #buscarpalabra*
   ┗ 📝 Sopa de letras
⚔️ *#pvp • #suit*
   ┗ 🥊 PvP contra otro usuario
🎯 *#ttt*
   ┗ ❌ Tres en raya (Tic Tac Toe)

╔═══════════════════════════╗
║ 💙🖥🔌 ¡GRACIAS POR USAR! 🔌🖥💙║
╚═══════════════════════════╝`.trim()

await conn.sendMessage(m.chat, { 
text: txt,
contextInfo: {
mentionedJid: [userId],
externalAdReply: {                
title: botname,
body: textbot,
mediaType: 1,
mediaUrl: redes,
sourceUrl: redes,
thumbnail: await (await fetch(banner)).buffer(),
showAdAttribution: false,
containsAutoReply: true,
renderLargerThumbnail: true
}}}, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']

export default handler

function clockString(ms) {
let seconds = Math.floor((ms / 1000) % 60)
let minutes = Math.floor((ms / (1000 * 60)) % 60)
let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
return `${hours}h ${minutes}m ${seconds}s`
}
