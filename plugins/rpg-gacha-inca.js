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
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqMMCKkNvJblbsnAOxtdOfdXZ2L03MIB0DGg&s", 
        description: "Trabajador de los andenes sagrados"
    },
    {
        name: "Tejedora Inca",
        rarity: "común",
        probability: 5,  
        img: "https://blog.viajesmachupicchu.travel/wp-content/uploads/2025/05/poblador-paracas-tejiendo-manto-1024x683.jpg",
        description: "Maestra en el arte del cumbi"
    },
    {
        name: "Chasqui Joven",
        rarity: "común",
        probability: 5,  
        img: "https://fesofi.es/wp-content/uploads/2021/02/Imagen3.jpg",
        description: "Mensajero de los caminos del Inca"
    },
    {
        name: "Pastor de Llamas",
        rarity: "común",
        probability: 5,
        img: "https://i.pinimg.com/474x/a2/c4/f8/a2c4f8aca25ac131429476b4beb2281b.jpg",
        description: "Guardián de los rebaños sagrados"
    },
    {
        name: "Alfarero del Cusco",
        rarity: "común",
        probability: 5,
        img: "https://micromuseo.org.pe/wp-content/uploads/1988/09/URTEAGA-OBRAS-ALFARERO-1937-O%CC%81leo-sobre-tela-48.5-x-34.5-cm-Coleccio%CC%81n-particular-Lima-100-DPI-800-PX-w.jpg",
        description: "Artesano de la cerámica imperial"
    },
    {
        name: "Agricultor de Quinua",
        rarity: "común",
        probability: 5,
        img: "https://antipode-peru.com/info/-quel-est-l-origine-du-quinoa--1.jpeg",
        description: "Cultivador del grano de oro"
    },
    {
        name: "Pescador del Titicaca",
        rarity: "común",
        probability: 5,
        img: "https://www.artmajeur.com/medias/standard/r/o/rolando/artwork/1682701_LAGO_TITICACA.jpg",
        description: "Navegante de las aguas sagradas"
    },
    {
        name: "Minero de Potosí",
        rarity: "común",
        probability: 5,
        img: "https://artwork.art-cdn.com/551131/gabrielapgarciayahoocomar-pintura-paisaje-minero-de-potosi.jpg",
        description: "Extractor de la plata del Cerro Rico"
    },
    {
        name: "Cuidadora de Vicuñas",
        rarity: "común",
        probability: 5,
        img: "https://img.eldefinido.cl/portadas/1200/2018-10-19-7944KW8005.jpg",
        description: "Protectora de la fibra más fina"
    },
    {
        name: "Constructor Inca",
        rarity: "común",
        probability: 5,
        img: "https://trexperienceperu.com/sites/default/files/ayllus-constructores-machu-picchu.webp",
        description: "Maestro de la piedra perfecta"
    },

    // RARA - Nobles y especialistas del imperio
    {
        name: "Curaca Regional",
        rarity: "rara",
        probability: 3,
        img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhPsfcAxgN9AJdUqAoN3k1VLfobvMz-Pc6dN8Wuuu7WrMmWQ_JXQwJZKK9mz852Y-aCro0iI-DPunz0LW5SelpiapLGTrsS7cdanTaSdT5Hum_plHpZi95QICBgK7eP1vSZ0Zi5wx5pvYo/s400/Imagen112.jpg",
        description: "Gobernador de una región del imperio"
    },
    {
        name: "Quipucamayoc",
        rarity: "rara",
        probability: 3,
        img: "https://portal.andina.pe/EDPfotografia3/Thumbnail/2019/11/09/000631869W.jpg",
        description: "Maestro contador de los quipus"
    },
    {
        name: "Amautas Sabio",
        rarity: "rara",
        probability: 3,
        img: "https://www.ecured.cu/images/c/ca/Amautas.jpg",
        description: "Educador y filósofo del Cusco"
    },
    {
        name: "Chasqui Veterano",
        rarity: "rara",
        probability: 3,
        img: "https://i.pinimg.com/564x/37/b0/f2/37b0f2648de9a869f3d5336dd652293e.jpg",
        description: "Corredor élite del Qhapaq Ñan"
    },
    {
        name: "Sacerdotisa de la Luna",
        rarity: "rara",
        probability: 3,
        img: "https://freewalkingtoursperu.com/wp-content/uploads/2018/11/Templo-de-la-Luna-en-Cusco-3.webp",
        description: "Servidora de Mama Quilla"
    },
    {
        name: "Guerrero Antis",
        rarity: "rara",
        probability: 3,
        img: "https://i.pinimg.com/474x/a0/99/a8/a099a8af3f76450f63e031d8dcd3ca5c.jpg",
        description: "Defensor de la selva oriental"
    },
    {
        name: "Arquiteco de Sacsayhuamán",
        rarity: "rara",
        probability: 3,
        img: "https://www.ktperutravel.com/images/blog/trono-de-inca-sacsayhuaman.jpg",
        description: "Constructor de la fortaleza sagrada"
    },
    {
        name: "Coya Noble",
        rarity: "rara",
        probability: 3,
        img: "https://i.pinimg.com/736x/7b/2e/27/7b2e27fb3a9a4716520ecfe005bd49c9.jpg",
        description: "Princesa del linaje real"
    },
    {
        name: "Hatun Runa Distinguido",
        rarity: "rara",
        probability: 3,
        img: "https://carpetapedagogica.com/img/articulos/organizacion-economica-inca.jpg",
        description: "Ciudadano honorable del imperio"
    },
    {
        name: "Médico Kallawaya",
        rarity: "rara",
        probability: 3,
        img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1hoV4XbuBOVIgh953-5DorLhyphenhyphenwAl7b-3l6XBWU7q3Fw30NuniGchgVa-85FFqq_Gtj2O9_U6kUbx55bq9FPLdT3q8TD4fpI-quF-8KFqJHZvs-PvQAifBbdkvJwmCV1y5UcPojQrV09hf/w1200-h630-p-k-no-nu/Jos%25C3%25A9+Manuel+Vald%25C3%25A9s+y+la+historia+de+la+medicina+peruana..jpg",
        description: "Curandero de las montañas sagradas"
    },

    // ÉPICA - Personajes históricos importantes
    {
        name: "🌟 Princesa Chuya Occllo 🌟",
        rarity: "épica",
        probability: 1.5,
        img: "https://imgmedia.larepublica.pe/640x761/larepublica/migration/images/GWESE6CSFVGIPAMVRJUFGC6VU4.webp",
        description: "Hija del Sol, hermana del Inca"
    },
    {
        name: "⚔️ Rumiñahui el Valiente ⚔️",
        rarity: "épica",
        probability: 1.5,
        img: "https://i.pinimg.com/736x/01/5d/2f/015d2f89101ecb2768e4aba078de68b4.jpg",
        description: "General que resistió a los conquistadores"
    },
    {
        name: "🏔️ Capac Yupanqui 🏔️",
        rarity: "épica",
        probability: 1.5,
        img: "https://perumillastravel.com/wp-content/uploads/2024/12/Imagen1.jpg",
        description: "Príncipe conquistador de Chinchasuyu"
    },
    {
        name: "🌙 Mama Anahuarque 🌙",
        rarity: "épica",
        probability: 1.5,
        img: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Peru_-_Inca_Princess_-_Google_Art_Project.jpg",
        description: "Coya, esposa de Tupac Inca Yupanqui"
    },
    {
        name: "⚡ Quisquis el Estratega ⚡",
        rarity: "épica",
        probability: 1.5,
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/%22El_General_Quisquis%22_%28s._XIX%29%2C_%C3%B3leo_sobre_lienzo_de_autor_an%C3%B3nimo._MuNa%2C_Quito.jpg/250px-%22El_General_Quisquis%22_%28s._XIX%29%2C_%C3%B3leo_sobre_lienzo_de_autor_an%C3%B3nimo._MuNa%2C_Quito.jpg",
        description: "General de la guerra civil inca"
    },
    {
        name: "🦅 Challcuchima 🦅",
        rarity: "épica",
        probability: 1.5,
        img: "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/WT24X5MBHRFWXJMRU6JZUN67GM.png",
        description: "Gran General de Atahualpa"
    },
    {
        name: "💫 Mama Raua Occllo 💫",
        rarity: "épica",
        probability: 1.5,
        img: "https://as2.ftcdn.net/jpg/05/74/43/35/1000_F_574433515_ylqNjZTg4fQ6MdRQv6r9FwhqDv5ZVmmW.jpg",
        description: "Coya fundadora del Cusco"
    },
    {
        name: "🌋 Tupac Amaru I 🌋",
        rarity: "épica",
        probability: 1.5,
        img: "https://images.ctfassets.net/bv5rnjawitjg/4fXH7eUWK9SqzcPOmQ4WI2/ceed36cb9dbada5927504b7d99c84ae7/foto_01.jpg",
        description: "Último Inca de Vilcabamba"
    },
    {
        name: "⭐ Capac Raymi ⭐",
        rarity: "épica",
        probability: 1.5,
        img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhKUYqXjHtl6Xx_QK_H_N2tLE8LRWljVAt3PvosFS2T85DztA8J5qyx7pJIdLOcSfOaMsZSOBclg9H2IVqerTLlyGi5IDzJzjILhmMTnJJPGuX0_-ti3FGOkelEZjS0ionKqjDNApdW_iY/s680/festividad-inca-del-capac-raymi-diciembre.jpg",
        description: "Príncipe del solsticio sagrado"
    },
    {
        name: "🏺 Sinchi Roca 🏺",
        rarity: "épica",
        probability: 1.5,
        img: "https://historiadelperu.info/wp-content/uploads/2019/07/inca-sinchi-roca.jpg",
        description: "Segundo Inca del Cusco"
    },

    // ULTRA RARA - Grandes Incas históricos
    {
        name: "☀️ MANCO CAPAC ☀️",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://www.incamachupicchutours.com/wp-content/uploads/2020/12/manco-capac-mama-ocllo.jpg",
        description: "Primer Inca, Hijo del Sol, Fundador del Cusco"
    },
    {
        name: "⚔️ PACHACUTEC INCA YUPANQUI ⚔️",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://www.topalpakatravel.com/wp-content/uploads/inca-pachacutec-911x1024.webp",
        description: "El Transformador del Mundo, Constructor del Imperio"
    },
    {
        name: "🌟 TUPAC INCA YUPANQUI 🌟",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://escuela-gestion.syf.pe/wp-content/uploads/2019/07/Viaje-a-Polinesia-2.jpg",
        description: "Gran Conquistador, Expandió el Tahuantinsuyu"
    },
    {
        name: "👑 HUAYNA CAPAC 👑",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://reinadelaselva.pe/wp-content/uploads/2025/06/huayna.jpg",
        description: "Último Gran Inca, Emperador del Apogeo"
    },
    {
        name: "🦎 LLOQUE YUPANQUI 🦎",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://blog.viajesmachupicchu.travel/wp-content/uploads/2025/05/lloque-yupanqui-portada-1-1170x550.jpg",
        description: "Tercer Inca, El Zurdo Memorable"
    },
    {
        name: "🌸 MAMA OCCLLO 🌸",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://i.pinimg.com/736x/07/9c/de/079cde4a3d7e7a0688dfa4d0c6d528bd.jpg",
        description: "Primera Coya, Esposa de Manco Capac"
    },
    {
        name: "⚡ CAPAC YUPANQUI ⚡",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://www.biografiasyvidas.com/biografia/t/fotos/tupac_yupanki.jpg",
        description: "Quinto Inca, Conquistador del Norte"
    },
    {
        name: "🏔️ MAYTA CAPAC 🏔️",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://i.pinimg.com/474x/a3/b0/02/a3b0025131b7481a6c50cac9c548df3f.jpg",
        description: "Cuarto Inca, Guerrero de las Montañas"
    },
    {
        name: "⚰️ ATAHUALPA ⚰️",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjNJZXFhKclrkIVT_wtnAV9MRqGNEveWONa4trzMzSjtSkFYQRa9wtErkVgZIL9SM0PE880m3ewtPLoH_Wd8k_XWYeQTHcCE05Y2KgwwoBW99A76ennFKTgbBef_sZSSau8vG2DHFmOZbQ/s680/vida-y-muerte-de-atahualpa-portada.jpg",
        description: "Último Inca Soberano, Víctima de Cajamarca"
    },
    {
        name: "🗿 INCA ROCA 🗿",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://museochanchan.pe/wp-content/uploads/Inca-Roca-El-Soberano-Oculto-en-la-Historia-del-Peru-Antiguo-392x550.jpg",
        description: "Sexto Inca, Fundador de los Hanan Cusco"
    },

    // LEGENDARIA - Deidades y seres míticos
    {
        name: "☀️🔥 INTI - DIOS SOL 🔥☀️",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://www.infobae.com/new-resizer/ECoyAKAajc5MGkrJL3-jjBOM4RQ=/arc-anglerfish-arc2-prod-infobae/public/SS45JY2VNJBWZLZBP7PP4BO7CA.png",
        description: "Padre de todos los Incas, Dios supremo del Tahuantinsuyu"
    },
    {
        name: "🌙✨ MAMA QUILLA ✨🌙",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://i.pinimg.com/736x/c2/60/ae/c260aea87e1ee766f898dd01a6f87228.jpg",
        description: "Diosa Luna, Esposa de Inti, Protectora de las mujeres"
    },
    {
        name: "⚡🌩️ ILLAPA - DIOS RAYO 🌩️⚡",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://mitosymas.com/content/images/size/w1200/2023/05/David_gar_Illapa_inca_god_of_thunder_and_war_16.png",
        description: "Señor del Trueno y la Lluvia, Controlador del Tiempo"
    },
    {
        name: "🌍⛰️ PACHAMAMA ⛰️🌍",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://media.urgente24.com/p/59683a100955a8f15c5a26b3eee53bc0/adjuntos/319/imagenes/003/090/0003090786/1200x0/smart/3-14jpg.jpg",
        description: "Madre Tierra, Diosa de la Fertilidad y la Naturaleza"
    },
    {
        name: "🌊🐍 MAMA COCHA 🐍🌊",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://i.pinimg.com/736x/cf/cd/5b/cfcd5b7d63b6b768c749f7382e187344.jpg",
        description: "Diosa del Mar y los Lagos, Madre de las Aguas"
    },
    {
        name: "🔥👁️ VIRACOCHA 👁️🔥",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhjcoRPaU_669nQ9Of8nQXTux7WcfqAV7Gr4Hx6iPZMf4W0s53l70Ujp6yCuouLer334RDIiOQgcPiY9mPJHDAUL69ns-oq-Qr9ZPNx05-mtidLb3jBLrcOpnYe8563qdPcI5VKbOKAygjj/s1600/viracocha-god-inca-mythology-500x696.jpg",
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
         'comun': '🌾',
         'poco comun': '🪶', 
         'raro': '⛰️',       
         'epico': '🗿',       
         'legendario': '🌞',  
         'mitico': '👑' 
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
handler.command = /^(inca|ri)$/i
handler.register = true
handler.group = true
handler.cooldown = 900000

export default handler


