const we = 5000;
let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender] || {};
    user.weekly = user.weekly || 0;
    const cooldown = 604800000; // 1 semana
    if (new Date - user.weekly < cooldown) {
        return m.reply(`🌸 ¡Ey! Ya reclamaste tu regalo semanal~ 💕\n\n⏰ Vuelve en: *${msToTime((user.weekly + cooldown) - new Date())}* para reclamar otro ✨`);
    }
    let coinReward = pickRandom([1, 2, 3]);
    let expReward = pickRandom([100, 200, 300]);
    user.coin = (user.coin || 0) + coinReward;
    user.exp = (user.exp || 0) + expReward;
    m.reply(`✨💖 ¡REGALO SEMANAL! 💖✨

╔═══════════════════╗
║ 🎁 ¡UNA SEMANA!   ║
╚═══════════════════╝

🎉 ¡Wooow! Ha pasado una semana completa~

╔═══════════════════╗
║ 🎁 TUS PREMIOS    ║
╚═══════════════════╝

💰 ${moneda}: *+${coinReward}*
✨ Experiencia: *+${expReward}*

╔═══════════════════╗
║ 💕 ¡FELICIDADES!  ║
╚═══════════════════╝

🌸 ¡Nos vemos la próxima semana! ✨`);
    user.weekly = new Date * 1;
}
handler.help = ['weekly'];
handler.tags = ['rpg'];
handler.command = ['semanal', 'weekly'];
handler.group = true;
handler.register = true;
export default handler;
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}
function msToTime(duration) {
    var days = Math.floor(duration / (1000 * 60 * 60 * 24));
    var hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days} días ${hours} horas ${minutes} minutos`;
}
