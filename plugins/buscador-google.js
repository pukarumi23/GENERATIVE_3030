import fetch from 'node-fetch';

let handler = async (m, { text }) => {
  if (!text) {
    m.reply(`🎤💙 Por favor, proporciona el término de búsqueda que deseas que busque en el ciberespacio de Google ✨`);
    return;
  }

  const apiUrl = `https://delirius-apiofc.vercel.app/search/googlesearch?query=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (!result.status) {
      m.reply('🎵💫 Error al realizar la búsqueda en el mundo virtual 💫🎵');
      return;
    }

    let replyMessage = `🎤💙 Resultados de búsqueda virtual:\n\n`;
    result.data.slice(0, 1).forEach((item, index) => {
      replyMessage += `🌟 *${index + 1}. ${item.title}*\n`;
      replyMessage += `🎵 *${item.description}*\n`;
      replyMessage += `� URL Virtual: ${item.url}`;
    });

m.react('🎤')

    m.reply(replyMessage);
  } catch (error) {
    console.error(`🎵💙 Error al realizar la solicitud a la API virtual:`, error);
    m.reply(`🎤✨ ¡Gomen! Ocurrió un error al obtener los resultados del ciberespacio ✨`);
  }
};

handler.command = ['google'];

export default handler;