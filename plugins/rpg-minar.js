let cooldowns = {}

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  
  if (!user) return;
  
  let coin = pickRandom([20, 5, 7, 8, 88, 40, 50, 70, 90, 999, 300]);
  let emerald = pickRandom([1, 5, 7, 8]);
  let iron = pickRandom([5, 6, 7, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]);
  let gold = pickRandom([20, 5, 7, 8, 88, 40, 50]);
  let coal = pickRandom([20, 5, 7, 8, 88, 40, 50, 80, 70, 60, 100, 120, 600, 700, 64]);
  let stone = pickRandom([200, 500, 700, 800, 900, 4000, 300]);
  
  let img = 'https://img.freepik.com/foto-gratis/renderizacion-personaje-anime-abeja_23-2150963630.jpg?semt=ais_hybrid&w=740&q=80';
  let time = user.lastmiming + 600000;
  
  if (new Date() - user.lastmiming < 600000) {
    return conn.reply(m.chat, `⏳ *Descansa un poquito~* 💔\nTodavía necesitas esperar ${msToTime(time - new Date())} para minar de nuevo ⛏️✨`, m, global.rcanal);
  }
  
  let hasil = Math.floor(Math.random() * 1000);
  
  let info = `╔═══════════════════════════╗
║ ⛏️ *¡MINERÍA EXITOSA!* ⛏️  ║
╠═══════════════════════════╣
║                           ║
║ 💪 ¡Bajaste a las cuevas!
║ ¡Te has esforzado mucho~!
║
║ 📊 *TUS RECURSOS:*
║
║ 🌟 Experiencia: +${hasil} XP
║ 💸 Monedas: +${coin} ${moneda}
║ 💎 Esmeralda: +${emerald} ✨
║ 🔩 Hierro: +${iron}
║ 🏅 Oro: +${gold}
║ ⬛ Carbón: +${coal}
║ 🗻 Piedra: +${stone}
║
║ ⚠️ Salud: -50 HP
║ 🔧 Pico: -30 Durabilidad
║
║ ¡Eres muy trabajadora~! 👏
║ Descansa y vuelve pronto 💕
║                           ║
╚═══════════════════════════╝`;

  await conn.sendFile(m.chat, img, 'yuki.jpg', info, fkontak);
  await m.react('⛏️');
  
  user.health -= 50;
  user.pickaxedurability -= 30;
  user.coin += coin;
  user.iron += iron;
  user.gold += gold;
  user.emerald += emerald;
  user.coal += coal;
  user.stone += stone;
  user.lastmiming = new Date() * 1;
}

handler.help = ['minar'];
handler.tags = ['economy'];
handler.command = ['minar', 'miming', 'mine'];
handler.register = true;
handler.group = true;

export default handler;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
  seconds = Math.floor((duration / 1000) % 60),
  minutes = Math.floor((duration / (1000 * 60)) % 60),
  hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;
  
  return minutes + ' m y ' + seconds + ' s ';
}
