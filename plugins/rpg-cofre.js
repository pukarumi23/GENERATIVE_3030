const handler = async (m, { isPrems, conn }) => {
  if (!global.db.data.users[m.sender]) {
    throw `💙 ¡Ara ara! Usuario no encontrado en mi base de datos virtual. ✨`;
  }

  const lastCofreTime = global.db.data.users[m.sender].lastcofre;
  const timeToNextCofre = lastCofreTime + 86400000;

  if (Date.now() < timeToNextCofre) {
    const tiempoRestante = timeToNextCofre - Date.now();
    const mensajeEspera = `💙 ¡Ya reclamaste tu cofre virtual de Miku hoy! 💙\n⏰️ Regresa en: *${msToTime(tiempoRestante)}* para obtener más tesoros musicales. ✨`;
    await conn.sendMessage(m.chat, { text: mensajeEspera }, { quoted: m });
    return;
  }

  const img = '.src/catalogo.jpg';
  const dia = Math.floor(Math.random() * 100);
  const tok = Math.floor(Math.random() * 10);
  const ai = Math.floor(Math.random() * 40);
  const expp = Math.floor(Math.random() * 5000);

  global.db.data.users[m.sender].coin += dia;
  global.db.data.users[m.sender].diamonds += ai;
  global.db.data.users[m.sender].joincount += tok;
  global.db.data.users[m.sender].exp += expp;
  global.db.data.users[m.sender].lastcofre = Date.now();

  const texto = `
╭━〔 💙 Cofre Musical de Miku 💙 〕⬣
┃🎵 *¡Obtienes Tesoros Virtuales!*
┃✨ ¡Felicidades, fanático de Miku!
╰━━━━━━━━━━━━⬣

╭━〔 🎶 Nuevos Recursos Musicales 🎶 〕⬣
┃ *${dia} ${moneda}* 🎤
┃ *${tok} Tokens Virtuales* ⚜️
┃ *${ai} Cristales de Sonido* 💎
┃ *${expp} Experiencia Musical* ✨
╰━━━━━━━━━━━━⬣`;

  try {
    await conn.sendFile(m.chat, img, 'yuki.jpg', texto, fkontak);
  } catch (error) {
    throw `${msm} Ocurrió un error al enviar el cofre.`;
  }
};

handler.help = ['cofre'];
handler.tags = ['rpg'];
handler.command = ['cofre'];
handler.level = 5;
handler.group = true;
handler.register = true;

export default handler;

function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  return `${hours} Horas ${minutes} Minutos`;
}
