const baseCoinReward = 10000;

var handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender] || {};
    user.halloween = user.halloween || 0;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const isOctober = currentDate.getMonth() === 9;
    const cooldown = 365 * 24 * 60 * 60 * 1000; // 1 año en milisegundos
    let timeRemaining = user.halloween + cooldown - currentDate.getTime();
    
    if (!isOctober) {
        return m.reply(`🎃 *¡Solo en octubre~!* 🎃

❌ Lo siento cariño... Solo tengo regalos de Halloween en octubre 👻

📅 Vuelve en octubre de ${currentYear} para tu sorpresa especial ✨`);
    }
    
    if (timeRemaining > 0) {
        return m.reply(`⏳ *¡Ya reclamaste tu regalo!* ⏳

👻 Ya disfrutaste de la magia de Halloween este año...

${msToTime(timeRemaining)} para volver a intentar 🎃✨`);
    }
    
    let coinReward = pickRandom([5, 10, 15, 20]);
    let candyReward = pickRandom([5, 10, 15, 20]);
    let expReward = pickRandom([2000, 3000, 4000, 5000]);
    let giftReward = pickRandom([2, 3, 4, 5]);
    
    user.coin = (user.coin || 0) + coinReward;
    user.candies = (user.candies || 0) + candyReward;
    user.exp = (user.exp || 0) + expReward;
    user.gifts = (user.gifts || 0) + giftReward;
    
    m.reply(`╔═══════════════════════════╗
║ 🎃 *¡FELIZ HALLOWEEN!* 🎃  ║
╠═══════════════════════════╣
║                           ║
║ 👻 ¡Tu noche especial~!
║ Aquí está tu sorpresa...
║
║ 💸 Monedas: +${coinReward} ${moneda}
║ 🍬 Dulces: +${candyReward}
║ 🌟 Experiencia: +${expReward} XP
║ 🎃 Regalos: +${giftReward}
║
║ 💖 ¡Qué suerte tienes~!
║ La noche de brujas es 
║ especial para ti ✨
║                           ║
╚═══════════════════════════╝`);
    
    user.halloween = new Date().getTime();
}

handler.help = ['halloween'];
handler.tags = ['rpg'];
handler.command = ['halloween'];
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
