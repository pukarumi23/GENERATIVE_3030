import { delay } from "@whiskeysockets/baileys";

const handler = async (m, { args, usedPrefix, command, conn }) => {
  const fa = `╔════════════════════════════╗
║ ✨ *Hola~ ¿Quieres jugar?* ✨ ║
║ Debes apostar una cantidad   ║
╚════════════════════════════╝`.trim();
  
  if (!args[0] || isNaN(args[0]) || parseInt(args[0]) <= 0) throw fa;
  
  const apuesta = parseInt(args[0]);
  const users = global.db.data.users[m.sender];
  const time = users.lastslot + 10000;
  
  if (new Date() - users.lastslot < 10000) {
    throw `⏰ *Espera un poco...* Todavía necesitas esperar ${msToTime(time - new Date())} para jugar de nuevo ✌️`;
  }
  
  if (apuesta < 100) {
    throw `😒 Vamos~ Al menos apuesta *100 XP*. ¿O es muy para ti? 💁‍♀️`;
  }
  
  if (users.exp < apuesta) {
    throw `🤐 Jajaja~ No tienes suficiente XP. Te faltan *${apuesta - users.exp} XP* 💸`;
  }
  
  const emojis = ['🌸', '🎀', '💖', '⭐', '🎯', '👑', '🎨', '🦋'];
  
  const getRandomEmojis = () => {
    const x = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
    const y = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
    const z = Array.from({ length: 3 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
    return { x, y, z };
  };
  
  const initialText = `
╔══════════════════════════╗
║   💫 *¡VAMOS A GIRAR!* 💫  ║
╠══════════════════════════╣
║ Apostando: *${apuesta} XP*      ║
║ Buena suerte~ ✨          ║
╚══════════════════════════╝

🌀 Girando...
`.trim();
  
  let { key } = await conn.sendMessage(m.chat, { text: initialText }, { quoted: m });
  
  const animateSlots = async () => {
    for (let i = 0; i < 8; i++) {
      const { x, y, z } = getRandomEmojis();
      const animationText = `
╔══════════════════════════╗
║   💫 *¡VAMOS A GIRAR!* 💫  ║
╠══════════════════════════╣
║    ${x[0]} │ ${y[0]} │ ${z[0]}         ║
║    ${x[1]} │ ${y[1]} │ ${z[1]}         ║
║    ${x[2]} │ ${y[2]} │ ${z[2]}         ║
╚══════════════════════════╝
`.trim();
      
      await conn.sendMessage(m.chat, { text: animationText, edit: key }, { quoted: m });
      await delay(250);
    }
  };
  
  await animateSlots();
  
  const { x, y, z } = getRandomEmojis();
  let end, resultado;
  
  if (x[0] === y[0] && y[0] === z[0]) {
    resultado = 'jackpot';
    end = `🎊 *¡WOW! ¡GANASTE!* 🎊\n💖 Obtuviste *${apuesta * 2} XP*\n¡Qué suerte tienes~! 😘`;
    users.exp += apuesta;
  } else if (x[0] === y[0] || x[0] === z[0] || y[0] === z[0]) {
    resultado = 'semi';
    end = `✨ *¡Casi lo logras!* ✨\n💝 +10 XP\nLa próxima será... promete 💕`;
    users.exp += 10;
  } else {
    resultado = 'lose';
    end = `😏 *Ay, perdiste...* 😏\n💔 -${apuesta} XP\n¿Quieres intentar de nuevo? 🎀`;
    users.exp -= apuesta;
  }
  
  users.lastslot = Date.now();
  
  const finalResult = `
╔══════════════════════════╗
║   💫 *¡RESULTADO!* 💫    ║
╠══════════════════════════╣
║    ${x[0]} │ ${y[0]} │ ${z[0]}         ║
║    ${x[1]} │ ${y[1]} │ ${z[1]}         ║
║    ${x[2]} │ ${y[2]} │ ${z[2]}         ║
╠══════════════════════════╣
║                          ║
║  ${end}  ║
║                          ║
╚══════════════════════════╝
`.trim();
  
  await conn.sendMessage(m.chat, { text: finalResult, edit: key }, { quoted: m });
};

handler.help = ['slot <apuesta>'];
handler.tags = ['economy'];
handler.group = true;
handler.register = true;
handler.command = ['slot'];

export default handler;

function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;
  
  return minutes + ' min ' + seconds + ' seg';
}
