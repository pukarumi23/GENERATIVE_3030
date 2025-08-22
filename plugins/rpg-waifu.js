import { promises as fs } from 'fs';

global.db = global.db || {};
global.db.inca = global.db.inca || {
    cooldowns: {},
    personajes: {},
    collection: {}
};

const personajesIncas = [
    // COMÚN - Habitantes comunes del Tahuantinsuyu
    {
        name: "Campesino Quechua",
        rarity: "común",
        probability: 5,  
        img: "https://files.catbox.moe/example1.png", //reemplazar con imágenes 
        description: "Trabajador de los andenes sagrados"
    },
    {
        name: "Tejedora Inca",
        rarity: "común",
        probability: 5,  
        img: "https://files.catbox.moe/example2.png",
        description: "Maestra en el arte del cumbi"
    },
    {
        name: "Chasqui Joven",
        rarity: "común",
        probability: 5,  
        img: "https://files.catbox.moe/example3.png",
        description: "Mensajero de los caminos del Inca"
    },
    {
        name: "Pastor de Llamas",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/example4.png",
        description: "Guardián de los rebaños sagrados"
    },
    {
        name: "Alfarero del Cusco",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/example5.png",
        description: "Artesano de la cerámica imperial"
    },
    {
        name: "Agricultor de Quinua",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/example6.png",
        description: "Cultivador del grano de oro"
    },
    {
        name: "Pescador del Titicaca",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/example7.png",
        description: "Navegante de las aguas sagradas"
    },
    {
        name: "Minero de Potosí",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/example8.png",
        description: "Extractor de la plata del Cerro Rico"
    },
    {
        name: "Cuidadora de Vicuñas",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/example9.png",
        description: "Protectora de la fibra más fina"
    },
    {
        name: "Constructor Inca",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/example10.png",
        description: "Maestro de la piedra perfecta"
    },

    // RARA - Nobles y especialistas del imperio
    {
        name: "Curaca Regional",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/example11.png",
        description: "Gobernador de una región del imperio"
    },
    {
        name: "Quipucamayoc",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/example12.png",
        description: "Maestro contador de los quipus"
    },
    {
        name: "Amautas Sabio",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/example13.png",
        description: "Educador y filósofo del Cusco"
    },
    {
        name: "Chasqui Veterano",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/example14.png",
        description: "Corredor élite del Qhapaq Ñan"
    },
    {
        name: "Sacerdotisa de la Luna",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/example15.png",
        description: "Servidora de Mama Quilla"
    },
    {
        name: "Guerrero Antis",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/example16.png",
        description: "Defensor de la selva oriental"
    },
    {
        name: "Arquiteco de Sacsayhuamán",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/example17.png",
        description: "Constructor de la fortaleza sagrada"
    },
    {
        name: "Coya Noble",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/example18.png",
        description: "Princesa del linaje real"
    },
    {
        name: "Hatun Runa Distinguido",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/example19.png",
        description: "Ciudadano honorable del imperio"
    },
    {
        name: "Médico Kallawaya",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/example20.png",
        description: "Curandero de las montañas sagradas"
    },

    // ÉPICA - Personajes históricos importantes
    {
        name: "🌟 Princesa Chuya Occllo 🌟",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/example21.png",
        description: "Hija del Sol, hermana del Inca"
    },
    {
        name: "⚔️ Rumiñahui el Valiente ⚔️",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/example22.png",
        description: "General que resistió a los conquistadores"
    },
    {
        name: "🏔️ Capac Yupanqui 🏔️",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/example23.png",
        description: "Príncipe conquistador de Chinchasuyu"
    },
    {
        name: "🌙 Mama Anahuarque 🌙",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/example24.png",
        description: "Coya, esposa de Tupac Inca Yupanqui"
    },
    {
        name: "⚡ Quisquis el Estratega ⚡",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/example25.png",
        description: "General de la guerra civil inca"
    },
    {
        name: "🦅 Challcuchima 🦅",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/example26.png",
        description: "Gran General de Atahualpa"
    },
    {
        name: "💫 Mama Raua Occllo 💫",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/example27.png",
        description: "Coya fundadora del Cusco"
    },
    {
        name: "🌋 Tupac Amaru I 🌋",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/example28.png",
        description: "Último Inca de Vilcabamba"
    },
    {
        name: "⭐ Capac Raymi ⭐",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/example29.png",
        description: "Príncipe del solsticio sagrado"
    },
    {
        name: "🏺 Sinchi Roca 🏺",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/example30.png",
        description: "Segundo Inca del Cusco"
    },

    // ULTRA RARA - Grandes Incas históricos
    {
        name: "☀️ MANCO CAPAC ☀️",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/example31.png",
        description: "Primer Inca, Hijo del Sol, Fundador del Cusco"
    },
    {
        name: "⚔️ PACHACUTEC INCA YUPANQUI ⚔️",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/example32.png",
        description: "El Transformador del Mundo, Constructor del Imperio"
    },
    {
        name: "🌟 TUPAC INCA YUPANQUI 🌟",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/example33.png",
        description: "Gran Conquistador, Expandió el Tahuantinsuyu"
    },
    {
        name: "👑 HUAYNA CAPAC 👑",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/example34.png",
        description: "Último Gran Inca, Emperador del Apogeo"
    },
    {
        name: "🦎 LLOQUE YUPANQUI 🦎",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/example35.png",
        description: "Tercer Inca, El Zurdo Memorable"
    },
    {
        name: "🌸 MAMA OCCLLO 🌸",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/example36.png",
        description: "Primera Coya, Esposa de Manco Capac"
    },
    {
        name: "⚡ CAPAC YUPANQUI ⚡",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/example37.png",
        description: "Quinto Inca, Conquistador del Norte"
    },
    {
        name: "🏔️ MAYTA CAPAC 🏔️",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/example38.png",
        description: "Cuarto Inca, Guerrero de las Montañas"
    },
    {
        name: "⚰️ ATAHUALPA ⚰️",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/example39.png",
        description: "Último Inca Soberano, Víctima de Cajamarca"
    },
    {
        name: "🗿 INCA ROCA 🗿",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/example40.png",
        description: "Sexto Inca, Fundador de los Hanan Cusco"
    },

    // LEGENDARIA - Deidades y seres míticos
    {
        name: "☀️🔥 INTI - DIOS SOL 🔥☀️",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://files.catbox.moe/example41.png",
        description: "Padre de todos los Incas, Dios supremo del Tahuantinsuyu"
    },
    {
        name: "🌙✨ MAMA QUILLA ✨🌙",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://files.catbox.moe/example42.png",
        description: "Diosa Luna, Esposa de Inti, Protectora de las mujeres"
    },
    {
        name: "⚡🌩️ ILLAPA - DIOS RAYO 🌩️⚡",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://files.catbox.moe/example43.png",
        description: "Señor del Trueno y la Lluvia, Controlador del Tiempo"
    },
    {
        name: "🌍⛰️ PACHAMAMA ⛰️🌍",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://files.catbox.moe/example44.png",
        description: "Madre Tierra, Diosa de la Fertilidad y la Naturaleza"
    },
    {
        name: "🌊🐍 MAMA COCHA 🐍🌊",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://files.catbox.moe/example45.png",
        description: "Diosa del Mar y los Lagos, Madre de las Aguas"
    },
    {
        name: "🔥👁️ VIRACOCHA 👁️🔥",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://files.catbox.moe/example46.png",
        description: "Creador del Universo, Dios Supremo Anterior a los Incas"
    }
];

const totalProbability = personajesIncas.reduce((sum, personaje) => sum + personaje.probability, 0);
console.log(`Probabilidad total calculada: ${totalProbability}%`);

const cumulativeProbabilities = [];
let accumulated = 0;
for (const personaje of personajesIncas) {
    accumulated += personaje.probability;
    cumulativeProbabilities.push({ personaje, threshold: accumulated });
}

let handler = async (m, { conn }) => {
    const userId = m.sender;
    const currentTime = Date.now();
    
    
    if (global.db.inca.cooldowns[userId]) {
        const timeDiff = currentTime - global.db.inca.cooldowns[userId];
        if (timeDiff < 900000) {
            const remainingTime = 900000 - timeDiff;
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            return m.reply(`⏰ El oráculo del Inca dice que debes esperar ${minutes}m ${seconds}s para consultar nuevamente los designios del Tahuantinsuyu.`);
        }
    }

    
    const roll = Math.random() * totalProbability;
    let selectedPersonaje = null;
    
    for (const { personaje, threshold } of cumulativeProbabilities) {
        if (roll <= threshold) {
            selectedPersonaje = personaje;
            break;
        }
    }
    
  
    if (!selectedPersonaje) {
        selectedPersonaje = personajesIncas[personajesIncas.length - 1];
    }

    
    const rarityColors = {
        'común': '🤎', // Marrón como la tierra
        'rara': '🔵', // Azul como el cielo
        'épica': '🟣', // Púrpura real
        'ultra rara': '🟡', // Oro como el Sol
        'Legendaria': '🔴' // Rojo como el fuego sagrado
    };

    const rarityProbs = {
        'común': '50%',
        'rara': '30%',
        'épica': '15%',
        'ultra rara': '4%',
        'Legendaria': '1%'
    };

    const rarityNames = {
        'común': 'HATUN RUNA',
        'rara': 'CURACA',
        'épica': 'AUQUI',
        'ultra rara': 'INCA',
        'Legendaria': 'HUACA DIVINA'
    };

    
    let message = `🏔️ ¡ORÁCULO DEL TAHUANTINSUYU! 🏔️\n\n`;
    message += `👤 Consultante: @${userId.split('@')[0]}\n`;
    message += `${rarityColors[selectedPersonaje.rarity]} Rango: ${rarityNames[selectedPersonaje.rarity]} (${rarityProbs[selectedPersonaje.rarity]})\n`;
    message += `⚱️ Los dioses han hablado...\n\n`;
    message += `🌟 ¡Has invocado a:\n`;
    message += `${selectedPersonaje.name}\n\n`;
    message += `📜 "${selectedPersonaje.description}"\n\n`;
    message += `💎 Usa .guardar o .coleccion para preservar este encuentro sagrado en tu ushnu personal!`;

   
    await conn.sendMessage(m.chat, { 
        image: { url: selectedPersonaje.img },
        caption: message,
        mentions: [userId]
    });

   
    global.db.inca.cooldowns[userId] = currentTime;
    global.db.inca.personajes[userId] = selectedPersonaje;
}


handler.before = async (m, { conn }) => {
    if (m.text.toLowerCase() === '.guardar' || m.text.toLowerCase() === '.coleccion') {
        const userId = m.sender;
        
        if (!global.db.inca.personajes[userId]) {
            return m.reply('🏺 No tienes ningún personaje reciente para guardar. Usa .invocar primero.');
        }

        if (!global.db.inca.collection[userId]) {
            global.db.inca.collection[userId] = [];
        }

        const personaje = global.db.inca.personajes[userId];
        
        
        const yaExiste = global.db.inca.collection[userId].some(p => p.name === personaje.name);
        
        if (yaExiste) {
            return m.reply(`🏺 Ya tienes a ${personaje.name} en tu colección sagrada.`);
        }

        global.db.inca.collection[userId].push({
            ...personaje,
            fechaObtencion: new Date().toLocaleDateString('es-PE'),
            timestamp: Date.now()
        });

        delete global.db.inca.personajes[userId]; 

        return m.reply(`✅ ${personaje.name} ha sido añadido a tu colección del Tahuantinsuyu!\n🏺 Colección actual: ${global.db.inca.collection[userId].length} personajes`);
    }
}

handler.help = ['invocar', 'inca', 'tahuantinsuyu']
handler.tags = ['rpg', 'inca']
handler.command = /^(invocar|inca|tahuantinsuyu|ri)$/i
handler.register = true
handler.group = true
handler.cooldown = 900000

export default handler
