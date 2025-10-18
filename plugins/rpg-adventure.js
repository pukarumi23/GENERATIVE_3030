import fetch from 'node-fetch';
let handler = async (m, { conn }) => {
let user = global.db.data.users[m.sender];
let img = 'https://us.123rf.com/450wm/artcuboy/artcuboy2304/artcuboy230402593/203429490-caminante-de-pie-en-la-cima-de-una-monta%C3%B1a-ilustraci%C3%B3n-de-arte-digital-ai-generativo.jpg?ver=6';
if (!user) {
return conn.reply(m.chat, `💕 ¡Uy! Parece que no estás registrado en mi base de datos~`, m);
}
if (user.health < 80) {
return conn.reply(m.chat, '🥺 ¡Ay no! No tienes suficiente energía para ir de aventura. Usa .heal para recuperarte, ¿sí? 💖✨', m);
}
if (user.lastAdventure && new Date() - user.lastAdventure <= 1500000) {
let timeLeft = 1500000 - (new Date() - user.lastAdventure);
return conn.reply(m.chat, `🌸 ¡Espera un poquito! Necesitas descansar ${msToTime(timeLeft)} antes de tu próxima aventura~ 💕`, m);
}
let kingdoms = [
  'Mercado de Shibuya en Tokio',
  'Festival de Comiket en Odaiba',
  'Tienda de Cosplay en Akihabara',
  'Distrito de Moda en Harajuku',
  'Estudio de Fotografía en Shinjuku',
  'Centro Comercial de Ikebukuro',
  'Convención de Anime en Yokohama',
  'Boutique Vintage en Nakano',
  'Cafetería Temática en Roppongi',
  'Pasarela de Moda en Ginza'
];
let randomKingdom = pickRandom(kingdoms);
let coin = pickRandom([20, 5, 7, 8, 88, 40, 50, 70, 90, 999, 300]);
let emerald = pickRandom([1, 5, 7, 8]);
let iron = pickRandom([5, 6, 7, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]);
let gold = pickRandom([20, 5, 7, 8, 88, 40, 50]);
let coal = pickRandom([20, 5, 7, 8, 88, 40, 50, 80, 70, 60, 100, 120, 600, 700, 64]);
let stone = pickRandom([200, 500, 700, 800, 900, 4000, 300]);
let diamonds = pickRandom([1, 2, 3, 4, 5]);
let exp = pickRandom([10, 20, 30, 40, 50]);
user.coin += coin;
user.emerald += emerald;
user.iron += iron;
user.gold += gold;
user.coal += coal;
user.stone += stone;
user.diamonds += diamonds;
user.exp += exp;
user.health -= 50;
user.lastAdventure = new Date();
if (user.health < 0) {
user.health = 0;
}
let info = `✨💖 ¡Aventura Completada! 💖✨

🌸 Has explorado el *${randomKingdom}* y encontraste cosas increíbles~

╭━━━━━━━━━━━━━━━╮
┃ 🎁 RECOMPENSAS 🎁
╰━━━━━━━━━━━━━━━╯

💰 Intis: ${coin}
💎 Esmeralda: ${emerald}
⚙️ Hierro: ${iron}
🏆 Oro: ${gold}
🪨 Carbón: ${coal}
🗿 Piedras: ${stone}
💍 Diamantes: ${diamonds}
✨ Experiencia: +${exp}

╭━━━━━━━━━━━━━━╮
┃ 💕 TU ESTADO 💕
╰━━━━━━━━━━━━━━╯

❤️ Energía: ${user.health}/100

¡Estuvo genial! ¿Vamos por otra aventura cuando descanses? 🌟`;
await conn.sendFile(m.chat, img, 'aventura.jpg', info, fkontak);
}
handler.help = ['aventura', 'adventure'];
handler.tags = ['rpg'];
handler.command = ['adventure', 'aventura'];
handler.group = true;
handler.register = true;
handler.cooldown = 1500000;
export default handler;
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)];
}
function msToTime(duration) {
let minutes = Math.floor((duration / (1000 * 60)) % 60);
let seconds = Math.floor((duration / 1000) % 60);
return `${minutes} m y ${seconds} s`;
}
