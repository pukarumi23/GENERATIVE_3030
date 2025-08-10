import { promises as fs } from 'fs';

global.db = global.db || {};
global.db.waifu = global.db.waifu || {
    cooldowns: {},
    waifus: {},
    collection: {}
};


const waifuList = [
   
    {
        name: "Hatsune Chibi",
        rarity: "común",
        probability: 5,  
        img: "https://files.catbox.moe/vjkemw.png"
    },
    {
        name: "Aoki Chibi",
        rarity: "común",
        probability: 5,  
        img: "https://files.catbox.moe/ds1rt5.png"
    },
    {
        name: "Defoko Chibi",
        rarity: "común",
        probability: 5,  
        img: "https://files.catbox.moe/r951p2.png"
    },
    {
        name: "Neru Chibi",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/ht6aci.png"
    },
    {
        name: "Rin Chibi",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/2y6wre.png"
    },
    {
        name: "Teto Chibi",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/h9m6ac.webp"
    },
    {
        name: "Gumi Chibi",
        rarity: "común",
        probability: 5,
        img: "./src/chibis/gumi_chibi.png"
    },
    {
        name: "Emu Chibi",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/nrchrb.webp"
    },
    {
        name: "Len Chibi",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/rxvuqq.png"
    },
    {
        name: "Luka Chibi",
        rarity: "común",
        probability: 5,
        img: "https://files.catbox.moe/5cyyis.png"
    },
    
    
    {
        name: "Hatsune Miku 2006",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/id47xr.png"
    },
    {
        name: "Aoki Lapis 2006",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/5m2nw3.png"
    },
    {
        name: "Defoko Utau",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/0ghewm.png"
    },
    {
        name: "Akita Neru 2006",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/zia0tk.png"
    },
    {
        name: "Gumi Megpoid 2006",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/ulvmhk.png"
    },
    {
        name: "Rin",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/wk4sh0.png"
    },
    {
        name: "Teto",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/0cax3r.png"
    },
    {
        name: "Emu Otori",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/vphcvo.png"
    },
    {
        name: "Len",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/x4du11.png"
    },
    {
        name: "Luka Megurine 2006",
        rarity: "rara",
        probability: 3,
        img: "https://files.catbox.moe/3wo3h9.webp"
    },
    
    
    {
        name: "💙Miku💙",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/ishwpi.png"
    },
    {
        name: "🩵Aoki Lapis🩵",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/gje6q7.png"
    },
    {
        name: "💜Defoko Utane💜",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/eb1jy3.png"
    },
    {
        name: "💛Neru💛",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/gj18ti.png"
    },
    {
        name: "💛Rin💛",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/jiefh9.png"
    },
    {
        name: "💚Gumi💚",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/hpalur.png"
    },
    {
        name: "❤Teto❤",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/k5w0ea.png"
    },
    {
        name: "💗Emu💗",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/sygb0h.png"
    },
    {
        name: "Len (gei)",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/pnho83.png"
    },
    {
        name: "💗LUKA🪷",
        rarity: "épica",
        probability: 1.5,
        img: "https://files.catbox.moe/bp2wrg.webp"
    },
   
    
    {
        name: "💙HATSUNE MIKU💙",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/881c3b.png"
    },
    {
        name: "🩵Aoki Lapis🩵",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/fkxvxb.png"
    },
    {
        name: "💜Utane Defoko💜",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/c4uvcy.png"
    },
    {
        name: "💛AKITA NERU💛",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/agw1y1.png"
    },
    {
        name: "💗EMU OTORI💗",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/ekzntn.png"
    },
    {
        name: "💚Megpoid Gumi💚",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/opn7vz.png"
    },
    {
        name: "❤KASANE TETO❤",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/6j9jgl.webp"
    },
    {
        name: "💛KAGAMINE RIN💛",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/lh5sxn.png"
    },
    {
        name: "💥KAGAMINE LEN💢",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/awuecy.png"
    },
    {
        name: "💗MEGUMIRE LUKA💮",
        rarity: "ultra rara",
        probability: 0.4,
        img: "https://files.catbox.moe/jodjln.png"
    },
    
    
    {
        name: "💙Brazilian Miku💛",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://files.catbox.moe/ifl773.jpg" 
    },
    {
        name: "🖤Inabakumori🖤",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://files.catbox.moe/1oiyvv.jpg"
    },
    {
        name: "❤KASANE TETO❤",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://files.catbox.moe/3cb73f.jpg"
    },
    {
        name: "☢️Cyberpunk Edgeruners💫",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://files.catbox.moe/3bl6qe.png"
    },
    {
        name: "❤️🩷VOCALOIDS💛💙",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://files.catbox.moe/g6kfb6.jpg"
    },
    {
        name: "🌌HALO⚕️",
        rarity: "Legendaria",
        probability: 0.167,
        img: "https://files.catbox.moe/h2hvi4.png"
    }
];



const totalProbability = waifuList.reduce((sum, waifu) => sum + waifu.probability, 0);
console.log(`Probabilidad total calculada: ${totalProbability}%`);


const cumulativeProbabilities = [];
let accumulated = 0;
for (const waifu of waifuList) {
    accumulated += waifu.probability;
    cumulativeProbabilities.push({ waifu, threshold: accumulated });
}

let handler = async (m, { conn }) => {
    const userId = m.sender;
    const currentTime = Date.now();
    
    
    if (global.db.waifu.cooldowns[userId]) {
        const timeDiff = currentTime - global.db.waifu.cooldowns[userId];
        if (timeDiff < 900000) {
            const remainingTime = 900000 - timeDiff;
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            return m.reply(`⏰ Debes esperar ${minutes}m ${seconds}s para volver a usar este comando.`);
        }
    }

   
    const roll = Math.random() * totalProbability;
    let selectedWaifu = null;
    
    
    for (const { waifu, threshold } of cumulativeProbabilities) {
        if (roll <= threshold) {
            selectedWaifu = waifu;
            break;
        }
    }
    
   
    if (!selectedWaifu) {
        selectedWaifu = waifuList[waifuList.length - 1];
    }

    
    const rarityColors = {
        'común': '⚪',
        'rara': '🔵',
        'épica': '🟣',
        'ultra rara': '🟡',
        'Legendaria': '🔴'
    };

    const rarityProbs = {
        'común': '50%',
        'rara': '30%',
        'épica': '15%',
        'ultra rara': '4%',
        'Legendaria': '1%'
    };

    
    let message = `🎲 WAIFU GACHA 🎲\n\n`;
    message += `👤 Invocador: @${userId.split('@')[0]}\n`;
    message += `${rarityColors[selectedWaifu.rarity]} Rareza: ${selectedWaifu.rarity.toUpperCase()} (${rarityProbs[selectedWaifu.rarity]})\n`;
    message += `💫 ¡Felicidades! Obtuviste a:\n`;
    message += `💙 ${selectedWaifu.name}\n`;
    message += `\n💫 Usa .save o .c para guardar tu waifu!`;

   
    await conn.sendMessage(m.chat, { 
        image: { url: selectedWaifu.img },
        caption: message,
        mentions: [userId]
    });

    
    global.db.waifu.cooldowns[userId] = currentTime;
    global.db.waifu.waifus[userId] = selectedWaifu;
}

handler.help = ['rw']
handler.tags = ['rpg']
handler.command = /^(rw|rollwaifu)$/i
handler.register = true
handler.group = true
handler.cooldown = 900000

export default handler

