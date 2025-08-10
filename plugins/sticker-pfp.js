/* 🎤💙 Código creado por Brauliovh3 
✧ https://github.com/Brauliovh3/HATSUNE-MIKU.git 
💙 Hatsune Miku Bot - Virtual Concert Experience 🎵✨ */

let handler = async (m, { conn }) => {
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let name = conn.getName(who);
    let pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745522645448.jpeg');
    await conn.sendFile(m.chat, pp, 'profile.jpg', `*Foto de perfil virtual de ${name}* 🎤💙`, m);
}

handler.help = ['pfp @user'];
handler.tags = ['sticker'];
handler.command = ['pfp', 'getpic'];

export default handler;
