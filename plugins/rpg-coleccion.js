import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'database');
const databaseFilePath = path.join(dbPath, 'incadatabase.json'); 

function loadDatabase() {
    if (!fs.existsSync(databaseFilePath)) {
        return { users: {} };
    }
    try {
        return JSON.parse(fs.readFileSync(databaseFilePath, 'utf-8'));
    } catch (error) {
        console.error('❌ Error al cargar database:', error);
        return { users: {} };
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender;

    try {
        const db = loadDatabase();

        if (!db.users[userId] || !db.users[userId].quipu || db.users[userId].quipu.length === 0) {
            return m.reply('📝 Tu quipu está vacío. Usa .invocar para obtener personajes ancestrales.');
        }

        const collection = db.users[userId].quipu;

        
        const rarityCount = {
            'legendaria': 0,
            'ultra rara': 0,
            'épica': 0,
            'rara': 0,
            'común': 0
        };

        collection.forEach(personaje => {
            const r = personaje.rarity.toLowerCase();
            if (rarityCount[r] !== undefined) rarityCount[r]++;
        });

        let message = `╭━━━━『🏔️ *COLECCIÓN DEL TAHUANTINSUYU* 🏔️』━━━━╮\n\n`;

        message += `❯🏺 *RESUMEN DE QUIPU* 🏺 ❮\n\n`;
        message += `┌──『 Rareza 』─────『 Cantidad 』───┐\n`;
        message += `│ 🔴 Legendaria  │ ${rarityCount['legendaria'].toString().padEnd(3)} │ ${createBar(rarityCount['legendaria'], 10)} │\n`;
        message += `│ 🟡 Ultra Rara  │ ${rarityCount['ultra rara'].toString().padEnd(3)} │ ${createBar(rarityCount['ultra rara'], 10)} │\n`;
        message += `│ 🟣 Épica       │ ${rarityCount['épica'].toString().padEnd(3)} │ ${createBar(rarityCount['épica'], 10)} │\n`;
        message += `│ 🔵 Rara        │ ${rarityCount['rara'].toString().padEnd(3)} │ ${createBar(rarityCount['rara'], 10)} │\n`;
        message += `│ 🤎 Común       │ ${rarityCount['común'].toString().padEnd(3)} │ ${createBar(rarityCount['común'], 10)} │\n`;
        message += `└───────────────────────────────┘\n\n`;

        message += `📜 Total de personajes en tu quipu: ${collection.length}\n\n`;

        const rarityEmojis = {
            'legendaria': '🔴',
            'ultra rara': '🟡',
            'épica': '🟣',
            'rara': '🔵',
            'común': '🤎'
        };

        
        const groupedByRarity = {};
        collection.forEach(personaje => {
            const r = personaje.rarity.toLowerCase();
            if (!groupedByRarity[r]) groupedByRarity[r] = [];
            groupedByRarity[r].push(personaje);
        });

        for (const rarity of Object.keys(rarityCount)) {
            if (groupedByRarity[rarity]?.length > 0) {
                message += `╭─『 ${rarityEmojis[rarity]} ${rarity.toUpperCase()} 』\n`;
                groupedByRarity[rarity].forEach((p, i) => {
                    message += `│ ${(i + 1).toString().padStart(2)}. ${p.name}\n`;
                });
                message += `╰────────────\n`;
            }
        }

        message += `\n╰━━━━『 FIN DEL QUIPU SAGRADO 』━━━━╯`;

        return conn.reply(m.chat, message, m);
    } catch (error) {
        console.error(error);
        return m.reply('💙 Error al mostrar la colección. Intenta nuevamente.');
    }
};

function createBar(value, maxSize) {
    const maxItems = 20;  
    const filled = Math.ceil((value / maxItems) * maxSize);
    const empty = maxSize - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

handler.help = ['coleccion', 'collection', 'col', 'quipu'];
handler.tags = ['rpg', 'inca'];
handler.command = /^(coleccion|collection|col|quipu|personajes)$/i;
handler.group = true;

export default handler;

