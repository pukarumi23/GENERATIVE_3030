import db from '../lib/database.js';
import moment from 'moment-timezone';

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    
    if (!(who in global.db.data.users)) {
        return conn.reply(m.chat, `💔 Este usuario no está en mi base de datos... ¡Qué pena! ✨`, m);
    }
    
    let img = 'https://i.pinimg.com/736x/eb/b6/71/ebb6714af14d500c73ffa9ede2e47197.jpg';
    let user = global.db.data.users[who];
    let name = conn.getName(who);
    let premium = user.premium ? '✅ Sí~ 💖' : '❌ No';
    
    let text = `╔═══════════════════════════╗
║ 🎀 *INVENTARIO DE ${name}* 🎀
╠═══════════════════════════╣
║
║ 💰 *DINERO:*
║ ├─ Cartera: ${user.coin || 0} ${moneda}
║ ├─ Banco: ${user.bank || 0} ${moneda}
║ └─ Total: ${(user.coin || 0) + (user.bank || 0)} ${moneda}
║
║ 💎 *RECURSOS:*
║ ├─ Esmeraldas: ${user.emerald || 0} ♦️
║ ├─ Hierro: ${user.iron || 0} 🔩
║ ├─ Oro: ${user.gold || 0} 🏅
║ ├─ Carbón: ${user.coal || 0} ⬛
║ └─ Piedra: ${user.stone || 0} 🪨
║
║ ⭐ *ESPECIALES:*
║ ├─ Diamantes: ${user.diamond || 0} 💎
║ ├─ Dulces: ${user.candies || 0} 🍬
║ ├─ Regalos: ${user.gifts || 0} 🎁
║ └─ Tokens: ${user.joincount || 0} 🎟️
║
║ 📊 *ESTADÍSTICAS:*
║ ├─ Experiencia: ${user.exp || 0} ✨
║ ├─ Salud: ${user.health || 100} ❤️
║ ├─ Premium: ${premium}
║ └─ Última aventura: ${user.lastAdventure ? moment(user.lastAdventure).fromNow() : 'Nunca'}
║
║ 📅 ${new Date().toLocaleString('es-PE')}
║
╚═══════════════════════════╝`;

    await conn.sendFile(m.chat, img, 'yuki.jpg', text, fkontak);
}

handler.help = ['inventario', 'inv'];
handler.tags = ['rpg'];
handler.command = ['inventario', 'inv']; 
handler.group = true;
handler.register = true;

export default handler;
