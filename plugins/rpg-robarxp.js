const ro = 3000;

const handler = async (m, {conn, usedPrefix, command}) => {
  const time = global.db.data.users[m.sender].lastrob + 7200000;
  
  if (new Date - global.db.data.users[m.sender].lastrob < 7200000) {
    conn.reply(m.chat, `⏳ *Debes esperar...* 💔\n${msToTime(time - new Date())} para intentar robar de nuevo~ ✨`, m);
    return;
  }
  
  let who;
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
  else who = m.chat;
  
  if (!who) {
    conn.reply(m.chat, `💋 *¡Hey~!* Debes mencionar a alguien para intentar robarle XP 😏\n\nEjemplo: *${usedPrefix}${command} @usuario*`, m)
    return;
  }
  
  if (!(who in global.db.data.users)) { 
    conn.reply(m.chat, `😒 Este usuario no está en mi base de datos... ¡Qué decepción! 💔`, m)
    return;
  }
  
  const users = global.db.data.users[who];
  const rob = Math.floor(Math.random() * ro);
  
  if (users.exp < rob) {
    return conn.reply(m.chat, `╔════════════════════════════╗
║ 😔 *¡ROBO FALLIDO!* 😔    ║
╠════════════════════════════╣
║                            ║
║ @${who.split`@`[0]} no tiene suficiente
║ XP para que valga la pena...
║ 
║ Necesita al menos ${ro} XP 💸
║ Intenta con alguien más~ 💕
║                            ║
╚════════════════════════════╝`, m, {mentions: [who]});
  }
  
  global.db.data.users[m.sender].exp += rob;
  global.db.data.users[who].exp -= rob;
  
  conn.reply(m.chat, `╔════════════════════════════╗
║ 😈 *¡ROBO EXITOSO!* 😈    ║
╠════════════════════════════╣
║                            ║
║ 🎯 Objetivo: @${who.split`@`[0]}      
║ 💰 Robaste: +${rob} XP
║ 
║ ¡Qué mala suerte tiene~! 💔
║ ¡Eres muy hábil! 🖤✨
║                            ║
╚════════════════════════════╝`, m, {mentions: [who]});
  
  global.db.data.users[m.sender].lastrob = new Date * 1;
};

handler.help = ['rob'];
handler.tags = ['economy'];
handler.command = ['robxp', 'robarxp'];
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
  
  return hours + ' hora(s) ' + minutes + ' minuto(s)';
}
