const xppercoin = 350;

const handler = async (m, {conn, command, args}) => {
  let count = command.replace(/^buy/i, '');
  count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].exp / xppercoin) : parseInt(count) : args[0] ? parseInt(args[0]) : 1;
  count = Math.max(1, count);
  
  if (global.db.data.users[m.sender].exp >= xppercoin * count) {
    global.db.data.users[m.sender].exp -= xppercoin * count;
    global.db.data.users[m.sender].coin += count;
    
    conn.reply(m.chat, `
╔━━━━━━━━━━━━━━━━━━╗
║ 💳 *COMPRA EXITOSA* 💳
╠━━━━━━━━━━━━━━━━━━╣
║
║  ✨ *Detalles:*
║  ├─ Monedas: +${count} 💸
║  ├─ XP gastado: -${xppercoin * count}
║  └─ Estado: ¡Completado~! 💕
║
║  💖 ¡Qué buena decisión! 
║     Te ves increíble ✨
║
╚━━━━━━━━━━━━━━━━━━╝`, m);
  } else {
    const xpNeeded = (xppercoin * count) - global.db.data.users[m.sender].exp;
    conn.reply(m.chat, `
╔━━━━━━━━━━━━━━━━━━╗
║ 😔 *COMPRA RECHAZADA* 😔
╠━━━━━━━━━━━━━━━━━━╣
║
║  ❌ Lo siento... 💔
║  
║  Te faltan:
║  └─ ${xpNeeded} XP más
║
║  Sigue jugando y lo
║  lograrás~ ✨ 💪
║
╚━━━━━━━━━━━━━━━━━━╝`, m);
  }
};

handler.help = ['Buy', 'Buyall'];
handler.tags = ['economy'];
handler.command = ['buy', 'buyall'];
handler.group = true;
handler.register = true;

export default handler;
