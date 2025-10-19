import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'database');
const databaseFilePath = path.join(dbPath, 'incadatabase.json');  

function loadDatabase() {
    try {
        if (!fs.existsSync(dbPath)) {
            fs.mkdirSync(dbPath, { recursive: true });
        }
        if (!fs.existsSync(databaseFilePath)) {
            const data = { users: {} };
            fs.writeFileSync(databaseFilePath, JSON.stringify(data, null, 2));
            return data;
        }
        return JSON.parse(fs.readFileSync(databaseFilePath, 'utf-8'));
    } catch (error) {
        console.error('Error DB:', error);
        return { users: {} };
    }
}

function saveDatabase(data) {
    try {
        fs.writeFileSync(databaseFilePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving:', error);
        return false;
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender;
    let userName = 'Sumaq Runa';

    try {
        userName = (await conn.getName(userId)) || 'Sumaq Runa';
    } catch {}

    if (!global.db) global.db = {};
    if (!global.db.inca) global.db.inca = { personajes: {}, collection: {}, cooldowns: {} };

    try {
        let currentPersonaje = null;
        let personajeKey = null;

        const personajeKeys = Object.keys(global.db.inca.personajes);

        if (personajeKeys.length === 0) {
            return m.reply('✨ No tienes personajes invocados... Llama a alguien especial con .invocar 💫');
        }

        if (global.db.inca.personajes[userId]) {
            currentPersonaje = global.db.inca.personajes[userId];
            personajeKey = userId;
        } else if (personajeKeys.length > 0) {
            personajeKey = personajeKeys[0];
            currentPersonaje = global.db.inca.personajes[personajeKey];
        }

        if (!currentPersonaje || !currentPersonaje.name) {
            return m.reply('💔 No encontré a nadie para guardar... intenta de nuevo~');
        }

        let db = loadDatabase();

        if (!db.users[userId]) {
            db.users[userId] = {
                name: userName,
                quipu: []
            };
        }

        const exists = db.users[userId].quipu.find(
            char => char.name === currentPersonaje.name && char.rarity === currentPersonaje.rarity
        );

        if (exists) {
            delete global.db.inca.personajes[personajeKey];
            return m.reply(`💖 **${currentPersonaje.name}** ya está en tu colección sagrada... ¡No la olvides~! 😘`);
        }

        db.users[userId].quipu.push({
            ...currentPersonaje,
            fechaObtencion: new Date().toLocaleDateString('es-PE'),
            timestamp: Date.now()
        });

        if (!saveDatabase(db)) {
            return m.reply('❌ Ay no... algo salió mal al guardar 💔');
        }

        delete global.db.inca.personajes[personajeKey];

        const rarityEmojis = {
             'comun': '🌾',       
             'poco comun': '🪶', 
             'raro': '⛰️',       
             'epico': '🗿',       
             'legendario': '🌞',  
             'mitico': '👑'
        };

        const rarityTitles = {
            'común': 'BELLA MUSA',
            'rara': 'PRINCESA',
            'epico': 'REINA',
            'ultra rara': 'DIOSA',
            'mitico': 'DEIDAD SAGRADA'
        };

        const emoji = rarityEmojis[currentPersonaje.rarity.toLowerCase()] || '🦋';
        const rarityTitle = rarityTitles[currentPersonaje.rarity.toLowerCase()] || currentPersonaje.rarity;

        let msg = `╔═══════════════════════╗\n`;
        msg += `║ 💫 *¡GUARDADO!* 💫    ║\n`;
        msg += `╠═══════════════════════╣\n\n`;
        msg += `✨ *${currentPersonaje.name}*\n`;
        msg += `${emoji} *Rango: ${rarityTitle}*\n`;
        msg += `👤 Guardada por: ${userName}\n`;
        msg += `💎 Total coleccionados: *${db.users[userId].quipu.length}* 💕\n\n`;
        msg += `📜 Mira tu colección con *.coleccion*\n`;
        msg += `¡Qué hermoso~ 🌸\n`;
        msg += `╚═══════════════════════╝`;

        return m.reply(msg);

    } catch (error) {
        console.error('Error en save:', error);
        return m.reply(`❌ Oops... error: ${error.message}`);
    }
};

handler.help = ['guardar', 'save', 'claim', 'c', 'reclamar'];
handler.tags = ['rpg', 'inca'];
handler.command = /^(guardar|save|claim|c|reclamar)$/i;
handler.group = true;

export default handler;
