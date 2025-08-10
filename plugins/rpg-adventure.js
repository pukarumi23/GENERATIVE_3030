import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
let user = global.db.data.users[m.sender];
let img = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745557963353.jpeg';
if (!user) {
return conn.reply(m.chat, `🎤💙 El fanático no se encuentra en la base de datos del concierto virtual ✨`, m);
}
if (user.health < 80) {
return conn.reply(m.chat, '🎤� No tienes suficiente energía para aventurarte en el mundo virtual. Usa el comando .heal para recuperar tu energía ✨💫', m);
}
if (user.lastAdventure && new Date() - user.lastAdventure <= 1500000) {
let timeLeft = 1500000 - (new Date() - user.lastAdventure);
return conn.reply(m.chat, `🎤💙 Debes esperar ${msToTime(timeLeft)} antes de aventurarte de nuevo en el concierto virtual ✨🎵`, m);
}
let kingdoms = [
'Reino Virtual de Eldoria',
'Reino Cibernético de Drakonia',
'Reino Digital de Arkenland',
'Reino Musical de Valoria',
'Reino Mágico de Mystara',
'Reino Virtual de Ferelith',
'Reino Cibernético de Thaloria',
'Reino Digital de Nimboria',
'Reino Musical de Galadorn',
'Reino Virtual de Elenaria'
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
let info = `🎤� Te has aventurado en el *<${randomKingdom}>* ✨\n` +
`� *Aventura Virtual Finalizada* �\n` +
`� *Notas Musicales Ganadas:* ${coin}\n` +
`♦️ *Esmeralda Virtual:* ${emerald}\n` +
`🔩 *Hierro Cibernético:* ${iron}\n` +
`🏅 *Oro Digital:* ${gold}\n` +
`🕋 *Carbón Virtual:* ${coal}\n` +
`🪨 *Piedra del Concierto:* ${stone}\n` +
`💎 *Diamantes del Mundo Virtual:* ${diamonds}\n` +
`✨ *Experiencia Musical Ganada:* ${exp}\n` +
`❤️ *Energía Virtual Actual:* ${user.health}`;
await conn.sendFile(m.chat, img, 'miku.jpg', info, fkontak);
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
