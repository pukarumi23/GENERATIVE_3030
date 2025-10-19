const baseCoinReward = 10000;

var handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender] || {};
    user.christmas = user.christmas || 0;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const isDecember = currentDate.getMonth() === 11; 
    const cooldown = 365 * 24 * 60 * 60 * 1000; // 1 año en milisegundos
    let timeRemaining = user.christmas + cooldown - currentDate.getTime();
    
    if (!isDecember) {
        return m.reply(`🎄 *¡Solo en diciembre~!* 🎄
        
❌ Lo siento cariño... Solo puedo darte regalos navideños en diciembre 💔

📅 Vuelve en diciembre de ${currentYear} para tu sorpresa especial ✨`);
    }
    
    if (timeRemaining > 0) {
        return m.reply(`⏳ *¡Ya reclamaste tu regalo!* ⏳

💔 Tendrás que esperar hasta el próximo año...

${msToTime(timeRemaining)} para volver a intentar 🎁✨`);
    }
    
    let coinReward = pickRandom([5, 10, 15, 20]);
    let expReward = pickRandom([2000, 3000, 4000, 5000]);
    let giftReward = pickRandom([2, 3, 4, 5]);
    
    user.coin = (user.coin || 0) + coinReward;;
    user.exp = (user.exp || 0) + expReward;
    user.gifts = (user.gifts || 0) + giftReward;
    
    m.reply(`╔═══════════════════════════╗
║ 🎄 *¡FELIZ NAVIDAD~!* 🎄   ║
╠═══════════════════════════╣
║                           ║
║ ✨ ¡Tu regalo especial! ✨
║
║ 💸 Monedas: +${coinReward} ${moneda}
║ 🌟 Experiencia: +${expReward} XP
║ 🎁 Regalos: +${giftReward} 🎀
║
║ 💖 ¡Espero te encante~!
║ ¡Que disfrutes la magia
║ navideña! 🎅✨
║                           ║
╚═══════════════════════════╝`);
    
    user.christmas = new Date().getTime();
}

handler.help = ['navidad', 'christmas'];
handler.tags = ['rpg'];
handler.command = ['navidad', 'christmas'];
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
