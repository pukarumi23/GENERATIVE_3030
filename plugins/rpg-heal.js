let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    
    if (!user) {
        return conn.reply(m.chat, `💔 No te encuentro en mi base de datos... ¡Qué raro! ✨`, m);
    }
    
    if (user.coin < 50) {
        return conn.reply(m.chat, `❤️ *Ay no~* No tienes suficientes ${moneda}\n\nNecesitas al menos *50 ${moneda}* para curarte 💔\nActualmente tienes: *${user.coin} ${moneda}*`, m);
    }
    
    let healAmount = 50; 
    user.health += healAmount;
    user.coin -= 50; 
    
    if (user.health > 100) {
        user.health = 100; 
    }
    
    user.lastHeal = new Date();
    
    let info = `╔═══════════════════════════╗
║ 💊 *¡CURACIÓN EXITOSA!* 💊 ║
╠═══════════════════════════╣
║                           ║
║ ❤️ Sanaste: +${healAmount} HP
║ 💸 Gastaste: -50 ${moneda}
║ 
║ 📊 *TU ESTADO:*
║ ├─ Salud actual: ${user.health}% ❤️
║ └─ ${moneda} restantes: ${user.coin}
║
║ 💖 ¡Te ves mejor ahora~!
║ Ten cuidado en tus 
║ aventuras 🗡️✨
║                           ║
╚═══════════════════════════╝`;
    
    await conn.sendMessage(m.chat, { text: info }, { quoted: m });
};

handler.help = ['heal'];
handler.tags = ['rpg'];
handler.command = ['heal', 'curar']
handler.group = true;
handler.register = true;

export default handler;
