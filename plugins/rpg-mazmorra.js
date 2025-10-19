let cooldowns = {};

let handler = async (m, { conn, usedPrefix, command }) => {
  let users = global.db.data.users;
  let senderId = m.sender;

  let tiempoEspera = 8 * 60;

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
    let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000));
    return conn.reply(m.chat, `⏳ *Descansa un poquito~* 💔\nAún necesitas esperar *${tiempoRestante}* antes de aventurarte de nuevo en las mazmorras ✨`, m);
  }

  cooldowns[m.sender] = Date.now();

  if (!users[senderId]) {
    users[senderId] = { health: 100, coin: 0, exp: 0 };
  }

  const eventos = [
    { nombre: 'Mazmorras de los Caídos', tipo: 'victoria', coin: randomNumber(150, 300), exp: randomNumber(50, 100), health: 0, mensaje: `🏆 ¡Lo hiciste! Derrotaste al guardián y encontraste un cofre lleno de ${moneda}. ¡Qué valiente eres~!` },
    { nombre: 'Cámara de los Espectros', tipo: 'derrota', coin: randomNumber(-70, -40), exp: randomNumber(10, 20), health: randomNumber(-15, -5), mensaje: `👻 Un espectro te atrapó... Perdiste algunas ${moneda} mientras escapabas. ¡Pero sobreviviste! 💪` },
    { nombre: 'Cripta del Olvido', tipo: 'victoria', coin: randomNumber(250, 400), exp: randomNumber(100, 150), health: 0, mensaje: `💎 ¡Increíble! Descubriste un tesoro antiguo lleno de gemas y ${moneda} brillantes. ¡Eres la mejor~!` },
    { nombre: 'Trampa del Laberinto', tipo: 'trampa', coin: 0, exp: randomNumber(5, 10), health: 0, mensaje: `🚧 Activaste una trampa oculta... Afortunadamente saliste ileso, pero sin recompensas esta vez 😔` },
    { nombre: 'Cámara de los Demonios', tipo: 'derrota', coin: randomNumber(-150, -80), exp: randomNumber(20, 40), health: randomNumber(-30, -20), mensaje: `🐉 Un demonio feroz te atacó... Lograste escapar, pero no sin perder dinero y salud. ¡Sigue adelante! 💕` },
    { nombre: 'Santuario de la Luz', tipo: 'victoria', coin: randomNumber(100, 200), exp: randomNumber(30, 60), health: 0, mensaje: `🌟 ¡Encontraste un lugar sagrado! Un cofre lleno de riquezas que brillan intensamente. ¡Qué suerte tienes~!` },
    { nombre: 'Laberinto de los Perdidos', tipo: 'trampa', coin: 0, exp: randomNumber(5, 15), health: 0, mensaje: `🌀 Un laberinto confuso... Saliste, pero sin obtener recompensas. ¡Al menos ganaste experiencia! ✨` },
    { nombre: 'Ruinas de los Caídos', tipo: 'victoria', coin: randomNumber(150, 300), exp: randomNumber(70, 120), health: 0, mensaje: `🏺 ¡Descubriste artefactos antiguos! Brillan con magia y te recompensan generosamente. ¡Excelente trabajo~! 💖` },
    { nombre: 'Guarida del Dragón', tipo: 'derrota', coin: randomNumber(-200, -100), exp: randomNumber(20, 40), health: randomNumber(-30, -20), mensaje: `🔥 ¡Un dragón! Lanzó una llamarada hacia ti... Escapaste, pero perdiste dinero y salud. ¡Ten cuidado! 💔` },
    { nombre: 'Sabio de la Mazmora', tipo: 'victoria', coin: randomNumber(50, 100), exp: randomNumber(30, 50), health: 0, mensaje: `👴 Un sabio misterioso te compartió historias y te recompensó por tu atención. ¡Qué encuentro tan especial~! ✨` },
  ];

  let evento = eventos[Math.floor(Math.random() * eventos.length)];

  if (evento.tipo === 'victoria') {
    users[senderId].coin += evento.coin;
    users[senderId].exp += evento.exp;
    users[senderId].health += evento.health;
  } else if (evento.tipo === 'derrota') {
    users[senderId].coin += evento.coin;
    users[senderId].exp += evento.exp;
    users[senderId].health += evento.health;
  } else if (evento.tipo === 'trampa') {
    users[senderId].exp += evento.exp;
  }

  let img = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745558209798.jpeg';
  let info = `╔═══════════════════════════╗
║ 🗡️ *¡AVENTURA EN MAZMORRAS!* 🗡️
╠═══════════════════════════╣
║
║ 📍 *Ubicación:* ${evento.nombre}
║ 📖 *Lo que pasó:*
║ ${evento.mensaje}
║
║ 💰 *Recompensa:* ${evento.coin > 0 ? '+' : ''}${evento.coin} ${moneda}
║ ⭐ *Experiencia:* +${evento.exp} XP
║ ❤️ *Salud:* ${evento.health !== 0 ? evento.health > 0 ? '+' + evento.health : evento.health : 'Sin cambios'}
║
║ 💪 ¡Sigue así! Eres increíble~
║
╚═══════════════════════════╝`;

  await conn.sendFile(m.chat, img, 'mazmorras.jpg', info, fkontak);

  global.db.write();
};

handler.tags = ['rpg'];
handler.help = ['explorar'];
handler.command = ['dungeon', 'mazmorra', 'cueva'];
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
