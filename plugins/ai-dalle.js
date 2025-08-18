import axios from 'axios';

const handler = async (m, { conn, args }) => {
    if (!args[0]) {
        await conn.reply(m.chat, `🔶 Por favor, proporciona una descripción para generar la imagen.`, m, rcanal);
        return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://eliasar-yt-api.vercel.app/api/ai/text2img?prompt=${prompt}`;

    try {
        conn.reply(m.chat, `🔶 ¡Generando tu imagen! Por favor espera un momento 🍀`, m)

        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        await conn.sendMessage(m.chat, { image: Buffer.from(response.data) }, { quoted: m });
    } catch (error) {
        console.error('Error al generar la imagen:', error);
        await conn.reply(m.chat, `🔶 No se pudo generar la imagen. ¡Inténtalo de nuevo más tarde! 💫`, m, rcanal);
    }
};

handler.command = ['dalle'];
handler.help = ['dalle'];
handler.tags = ['tools'];

export default handler;
