let users = {};
let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [eleccion, cantidad] = text.split(' ');
    if (!eleccion || !cantidad) {
        return m.reply(`💖 ¡Ey! Necesito que elijas *cara* o *cruz* y cuántos ${moneda} quieres apostar~\n\n✨ Ejemplo: *${usedPrefix + command} cara 50*`);
    }
    eleccion = eleccion.toLowerCase();
    cantidad = parseInt(cantidad);
    if (eleccion !== 'cara' && eleccion !== 'cruz') {
        return m.reply(`🌸 ¡Uy! Esa opción no es válida. Elige *cara* o *cruz*~\n\n✨ Ejemplo: *${usedPrefix + command} cara 50*`);
    }
    if (isNaN(cantidad) || cantidad <= 0) {
        return m.reply(`🥺 ¡Espera! Esa cantidad no es válida. Dime cuántos ${moneda} quieres apostar~\n\n✨ Ejemplo: *${usedPrefix + command} cara 50*`);
    }
    let userId = m.sender;
    if (!users[userId]) users[userId] = { coin: 100 };
    let user = global.db.data.users[m.sender];
    if (user.coin < cantidad) {
        return m.reply(`😢 ¡Ay no! No tienes suficientes ${moneda} para apostar. Solo tienes *${user.coin} ${moneda}*~\n\n💡 Usa comandos como *#work* o *#daily* para ganar más 💕`);
    }
    let resultado = Math.random() < 0.5 ? 'cara' : 'cruz';
    
    if (resultado === eleccion) {
        user.coin += cantidad; 
        await conn.reply(m.chat, `🪙✨ ¡Lanzando la moneda! ✨🪙

╔══════════════╗
║ 🎲 RESULTADO ║
╚══════════════╝

La moneda cayó en: *${resultado.toUpperCase()}*

╔══════════════╗
║ 🎉 ¡GANASTE! ║
╚══════════════╝

💰 Has ganado: *${cantidad} ${moneda}*
💎 Total ahora: *${user.coin} ${moneda}*

💖 ¡Increíble! ¡Sigue así! ✨`, m);
    } else {
        user.coin -= cantidad;
        await conn.reply(m.chat, `🪙✨ ¡Lanzando la moneda! ✨🪙

╔══════════════╗
║ 🎲 RESULTADO ║
╚══════════════╝

La moneda cayó en: *${resultado.toUpperCase()}*

╔══════════════╗
║ 😢 PERDISTE  ║
╚══════════════╝

💸 Has perdido: *${cantidad} ${moneda}*
💰 Te quedan: *${user.coin} ${moneda}*

🌸 ¡No te desanimes! Inténtalo otra vez~ ✨`, m);
    }
};
handler.help = ['cf'];
handler.tags = ['economy'];
handler.command = ['cf', 'suerte', 'caracruz'];
handler.group = true;
handler.register = true;
export default handler;
