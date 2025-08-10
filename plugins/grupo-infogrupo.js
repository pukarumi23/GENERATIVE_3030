const handler = async (m, {conn, participants, groupMetadata}) => {
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => global.icono);
  const { antiLink, detect, welcome, modoadmin, autoRechazar, nsfw, autoAceptar, reaction, isBanned, antifake } = global.db.data.chats[m.chat]
  const groupAdmins = participants.filter((p) => p.admin)
  const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
  const owner = groupMetadata.owner || groupAdmins.find((p) => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'
  const text = `🎤💙 *✧･ﾟ INFO DEL CONCIERTO VIRTUAL ﾟ･✧* 💙🎤
🎵 *ID del Escenario:* ${groupMetadata.id}
✨ *Nombre del Concierto:* ${groupMetadata.subject}
🌟 *Fanáticos:* ${participants.length} Participantes
💫 *Organizador Principal:* @${owner.split('@')[0]}
🎶 *Staff del Concierto:*
${listAdmin}

🎤˚₊· ͟͟͞͞➳❥ *CONFIGURACIÓN DEL ESCENARIO VIRTUAL*

💙 *${botname}* » ${isBanned ? 'Desactivado' : 'Activado'}
✨ *Bienvenida Musical:* ${welcome ? 'Activado' : 'Desactivado'}
🎵 *Detección Virtual:* ${detect ? 'Activado' : 'Desactivado'}  
🌟 *Anti-Enlaces:* ${antiLink ? 'Activado' : 'Desactivado'} 
💫 *Auto-Aceptar Fans:* ${autoAceptar ? 'Activado' : 'Desactivado'}
🎶 *Auto-Rechazar:* ${autoRechazar ? 'Activado' : 'Desactivado'}
🎤 *Contenido +18:* ${nsfw ? 'Activado' : 'Desactivado'}
✨ *Modo Admin Virtual:* ${modoadmin ? 'Activado' : 'Desactivado'}
💙 *Reacciones Miku:* ${reaction ? 'Activado' : 'Desactivado'}
🌟 *Anti-Fake Fans:* ${antifake ? 'Activado' : 'Desactivado'}

🎵 *Descripción del Concierto:*
${groupMetadata.desc?.toString() || 'Sin Descripción Musical'}`.trim();
  conn.sendFile(m.chat, pp, 'img.jpg', text, m, false, {mentions: [...groupAdmins.map((v) => v.id), owner]});
};
handler.help = ['infogrupo'];
handler.tags = ['grupo'];
handler.command = ['infogrupo', 'gp'];
handler.register = true
handler.group = true;

export default handler;
