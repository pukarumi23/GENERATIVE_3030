import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `💋 *Necesito un enlace~* 🎵\n\nPasa el link de TikTok que quieres descargar.\nEjemplo: *${usedPrefix}${command} https://...*`, m);
    }
    
    try {
        await conn.reply(m.chat, `⏳ *Un momentito~* ✨\n\nEstoy descargando tu video... Casi listo 💫`, m);
        
        const tiktokData = await tiktokdl(args[0]);
        
        if (!tiktokData || !tiktokData.data || !tiktokData.data.play) {
            return conn.reply(m.chat, `❌ *Ay no...* 💔\n\nNo pude descargar ese video. Verifica que el enlace sea válido~ 😔`, m);
        }
        
        const videoURL = tiktokData.data.play;
        
        if (videoURL) {
            await conn.sendFile(m.chat, videoURL, "tiktok.mp4", `╔═══════════════════╗
║ 🎵 *¡VIDEO DESCARGADO!* 🎵
╠═══════════════════╣
║
║ ✨ Aquí tienes tu video~
║ ¡Que lo disfrutes! 💖
║
╚═══════════════════╝`, m);
        } else {
            return conn.reply(m.chat, `❌ *Algo salió mal...* 💔\n\nNo pude obtener el video. Intenta de nuevo~ ✨`, m);
        }
    } catch (error1) {
        return conn.reply(m.chat, `⚠️ *Error en la descarga* 💔\n\n${error1.message}\n\nIntenta con otro enlace~ ✨`, m);
    }
};

handler.help = ['tiktok'].map((v) => v + ' *<link>*');
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];
handler.group = false;
handler.register = true;
handler.coin = 2;
handler.limit = true;

export default handler;

async function tiktokdl(url) {
    let tikwm = `https://www.tikwm.com/api/?url=${url}?hd=1`;
    let response = await (await fetch(tikwm)).json();
    return response;
}
