const handler = async (m, { isPrems, conn }) => {
  if (!global.db.data.users[m.sender]) {
    throw `✨ ¡Oya oya! Parece que no estás registrado en mi mundo, senpai~ 💫`;
  }

  const lastCofreTime = global.db.data.users[m.sender].lastcofre;
  const timeToNextCofre = lastCofreTime + 86400000;

  if (Date.now() < timeToNextCofre) {
    const tiempoRestante = timeToNextCofre - Date.now();
    const mensajeEspera = `🎀 ¡Ufufu~ Ya reclamaste tu tesoro especial hoy, senpai! 🎀\n⏰ Vuelve en: *${msToTime(tiempoRestante)}* para más sorpresas divertidas ✨\n💕 ¡Mientras tanto, podríamos pasar el rato juntos!`;
    await conn.sendMessage(m.chat, { text: mensajeEspera }, { quoted: m });
    return;
  }

  const img = '.src/menu78.jpg';
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
╭━━〔 🎀 𝗖𝗼𝗳𝗿𝗲 𝗘𝘀𝗽𝗲𝗰𝗶𝗮𝗹 𝗱𝗲 𝗠𝗮𝗿𝗶𝗻 🎀 〕━━⬣
┃ 🎮 *¡Kyaaa~ Encontraste un tesoro increíble!* 🎮
┃ 💫 *¡Senpai, mira todas estas cosas maravillosas!*
╰━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━〔 🌸 𝗧𝗲𝘀𝗼𝗿𝗼𝘀 𝗘𝗻𝗰𝗮𝗻𝘁𝗮𝗱𝗼𝘀 🌸 〕━━⬣
┃ 🎴 *${dia} Monedas Brillantes* 💰
┃ 🎭 *${tok} Tickets Dorados* 🎫
┃ 💎 *${ai} Cristales Relucientes* ✨
┃ 📚 *${expp} EXP de Aventura* 🎨
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🎀 *¡Ufufu~ Con esto podremos comprar muchas cosas divertidas, senpai!* 💕
✨ *¿No te emociona? ¡Es como encontrar un tesoro escondido!* 🎮`;

  try {
    await conn.sendFile(m.chat, img, 'yuki.jpg', texto, fkontak);
  } catch (error) {
    throw `🎀 ¡Oya! Algo salió mal al enviar el cofre especial, senpai~ 💫`;
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
