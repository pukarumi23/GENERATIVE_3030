let cooldowns = {};

let handler = async (m, { conn }) => {
  let users = global.db.data.users;
  let senderId = m.sender;

  let tiempoEspera = 10 * 60;

  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[senderId] + tiempoEspera * 1000 - Date.now()) / 1000));
    return conn.reply(m.chat, `⏳ *Descansa un poquito~* 💔\nAún necesitas esperar *${tiempoRestante}* antes de aceptar otra misión ✨`, m);
  }

  cooldowns[senderId] = Date.now();

  if (!users[senderId]) {
    users[senderId] = { health: 100, coin: 0, exp: 0 };
  }

  const eventos = [
    { nombre: 'Batalla contra los Goblins', tipo: 'victoria', coin: randomNumber(20, 40), exp: randomNumber(10, 20), health: 0, mensaje: `🏆 ¡Derrotaste a los Goblins! Dejaron caer un montón de ${moneda}. ¡Excelente trabajo~!` },
    { nombre: 'Enfrentamiento con el Orco', tipo: 'derrota', coin: randomNumber(-30, -10), exp: randomNumber(5, 10), health: randomNumber(-15, -5), mensaje: `⚠️ Un Orco te atacó... Lograste escapar, pero perdiste dinero y salud. ¡Sigue adelante! 💪` },
    { nombre: 'Desafío del Dragón', tipo: 'victoria', coin: randomNumber(100, 150), exp: randomNumber(50, 80), health: 0, mensaje: `🔥 ¡Venciste al Dragón! Encontraste un tesoro antiguo lleno de ${moneda}. ¡Eres increíble~! 💖` },
    { nombre: 'Confrontación con el Esqueleto', tipo: 'derrota', coin: randomNumber(-20, -10), exp: randomNumber(5, 10), health: randomNumber(-10, -5), mensaje: `💀 El Esqueleto fue muy fuerte... Perdiste dinero y salud, pero ganaste experiencia. 💕` },
    { nombre: 'Combate contra la Manticora', tipo: 'victoria', coin: randomNumber(80, 120), exp: randomNumber(40, 60), health: 0, mensaje: `🦁 ¡Derrotaste a la Manticora! Su tesoro oculto es tuyo ahora. ¡Qué valiente eres~! ✨` },
    { nombre: 'Confrontación con el Troll', tipo: 'derrota', coin: randomNumber(-50, -20), exp: randomNumber(10, 20), health: randomNumber(-20, -10), mensaje: `🧌 El Troll fue abrumador... Perdiste mucho, pero sobreviviste. ¡Ten cuidado! 💔` },
    { nombre: 'Duelo con el Licántropo', tipo: 'victoria', coin: randomNumber(60, 100), exp: randomNumber(30, 50), health: 0, mensaje: `🐺 ¡Ganaste el duelo contra el Licántropo! Obtuviste un botín espectacular. ¡Bravo~! 🎉` },
    { nombre: 'Enfrentamiento con el Minotauro', tipo: 'derrota', coin: randomNumber(-40, -15), exp: randomNumber(10, 20), health: randomNumber(-15, -5), mensaje: `🪓 El Minotauro fue demasiado fuerte... Escapaste, pero perdiste dinero y salud. 💪` },
    { nombre: 'Batalla contra el Fantasma', tipo: 'victoria', coin: randomNumber(30, 50), exp: randomNumber(20, 40), health: 0, mensaje: `👻 ¡Venciste al Fantasma! La aldea está a salvo gracias a ti. ¡Eres heroína~! 💖` },
    { nombre: 'Lucha contra el Dragón de Hielo', tipo: 'derrota', coin: randomNumber(-60, -20), exp: randomNumber(15, 30), health: randomNumber(-25, -10), mensaje: `❄️ El Dragón de Hielo fue brutal... Perdiste bastante, pero aprendiste mucho. ¡Vuelve pronto! 💕` },
    { nombre: 'Combate con la Hidra', tipo: 'victoria', coin: randomNumber(90, 130), exp: randomNumber(50, 80), health: 0, mensaje: `🐉 ¡Derrotaste a la Hidra! Un tesoro legendario es tuyo ahora. ¡Eres la mejor~! ✨` },
    { nombre: 'Desafío del Caballero Caído', tipo: 'derrota', coin: randomNumber(-30, -10), exp: randomNumber(5, 10), health: randomNumber(-15, -5), mensaje: `⚔️ El Caballero Caído era formidable... Perdiste, pero ganaste experiencia. ¡Inténtalo de nuevo! 💪` },
    { nombre: 'Encuentro con la Bruja', tipo: 'troll', coin: 0, exp: randomNumber(20, 40), health: randomNumber(-10, -5), mensaje: `🧙 Una bruja te lanzó un hechizo... Lograste resistir, ganas experiencia pero pierdes salud. ✨` },
    { nombre: 'Emboscada de los Bandidos', tipo: 'troll', coin: 0, exp: randomNumber(15, 30), health: randomNumber(-5, -3), mensaje: `🗡️ ¡Te emboscaron unos bandidos! Escapaste, pero perdiste un poco de salud. ¡Fuerte eres~! 💖` },
    { nombre: 'Caza de la Serpiente Gigante', tipo: 'victoria', coin: randomNumber(50, 80), exp: randomNumber(30, 50), health: 0, mensaje: `🐍 ¡Cazaste a la Serpiente Gigante! Su piel es valiosa. ¡Excelente cazadora~! 🎯` },
  ];

  let evento = eventos[Math.floor(Math.random() * eventos.length)];

  if (evento.tipo === 'victoria') {
    users[senderId].coin += evento.coin;
    users[senderId].exp += evento.exp;
    users[senderId].health += evento.health;
  } else if (evento.tipo === 'derrota') {
    users[senderId].coin += evento.coin;
    users[senderId].exp += evento.exp;
    users[senderId].health -= evento.health;
  } else if (evento.tipo === 'troll') {
    users[senderId].exp += evento.exp;
    users[senderId].health -= evento.health;
  }

  let img = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745557967796.jpeg';
  let info = `╔═══════════════════════════╗
║ ⚔️ *¡MISIÓN COMPLETADA!* ⚔️
╠═══════════════════════════╣
║
║ 📋 *Misión:* ${evento.nombre}
║
║ 📖 *Lo que pasó:*
║ ${evento.mensaje}
║
║ 💰 *Recompensa:* ${evento.coin > 0 ? '+' : ''}${evento.coin} ${moneda}
║ ⭐ *Experiencia:* +${evento.exp} XP
║ ❤️ *Salud Actual:* ${users[senderId].health}%
║
║ 💖 ¡Eres cada vez
║ más fuerte~! 💪✨
║
╚═══════════════════════════╝`;

  await conn.sendFile(m.chat, img, 'gremio.jpg', info, fkontak);

  await global.db.write();
};

handler.tags = ['rpg'];
handler.help = ['gremio'];
handler.command = ['gremio', 'mision'];
handler.register = true;
handler.group = true;

export default handler;

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function segundosAHMS(segundos) {
  let minutos = Math.floor(segundos / 60);
  let segundosRestantes = segundos % 60;
  return `${minutos} minutos y ${segundosRestantes} segundos`;
}
