import { canLevelUp } from '../lib/levelling.js'

const roles = {
'*🌸 Novata V 🌸*': 0,
'*🌸 Novata IV 🌸*': 2,
'*🌸 Novata III 🌸*': 4,
'*🌸 Novata II 🌸*': 6,
'*🌸 Novata I 🌸*': 8,
'*💕 Aprendiz V 💕*': 10,
'*💕 Aprendiz IV 💕*': 12,
'*💕 Aprendiz III 💕*': 14,
'*💕 Aprendiz II 💕*': 16,
'*💕 Aprendiz I 💕*': 18,
'*✨ Aventurera V ✨*': 20,
'*✨ Aventurera IV ✨*': 22,
'*✨ Aventurera III ✨*': 24,
'*✨ Aventurera II ✨*': 26,
'*✨ Aventurera I ✨*': 28,
'*🌟 Exploradora V 🌟*': 30,
'*🌟 Exploradora IV 🌟*': 32,
'*🌟 Exploradora III 🌟*': 34,
'*🌟 Exploradora II 🌟*': 36,
'*🌟 Exploradora I 🌟*': 38,
'*💖 Guerrera V 💖*': 40,
'*💖 Guerrera IV 💖*': 42,
'*💖 Guerrera III 💖*': 44,
'*💖 Guerrera II 💖*': 46,
'*💖 Guerrera I 💖*': 48,
'*🎀 Campeona V 🎀*': 50,
'*🎀 Campeona IV 🎀*': 52,
'*🎀 Campeona III 🎀*': 54,
'*🎀 Campeona II 🎀*': 56,
'*🎀 Campeona I 🎀*': 58,
'*💫 Heroína V 💫*': 60,
'*💫 Heroína IV 💫*': 62,
'*💫 Heroína III 💫*': 64,
'*💫 Heroína II 💫*': 66,
'*💫 Heroína I 💫*': 68,
'*💎 Élite V 💎*': 70,
'*💎 Élite IV 💎*': 72,
'*💎 Élite III 💎*': 74,
'*💎 Élite II 💎*': 76,
'*💎 Élite I 💎*': 78,
'*🌺 Maestra V 🌺*': 80,
'*🌺 Maestra IV 🌺*': 85,
'*🌺 Maestra III 🌺*': 90,
'*🌺 Maestra II 🌺*': 95,
'*🌺 Maestra I 🌺*': 99,
'*🌷 Leyenda V 🌷*': 100,
'*🌷 Leyenda IV 🌷*': 110,
'*🌷 Leyenda III 🌷*': 120,
'*🌷 Leyenda II 🌷*': 130,
'*🌷 Leyenda I 🌷*': 140,
'*👑 Soberana V 👑*': 150,
'*👑 Soberana IV 👑*': 160,
'*👑 Soberana III 👑*': 170,
'*👑 Soberana II 👑*': 180,
'*👑 Soberana I 👑*': 199,
'*✨💫 Titana V 💫✨*': 200,
'*✨💫 Titana IV 💫✨*': 225,
'*✨💫 Titana III 💫✨*': 250,
'*✨💫 Titana II 💫✨*': 275,
'*✨💫 Titana I 💫✨*': 299,
'*🌸💎 Guardiana V 💎🌸*': 300,
'*🌸💎 Guardiana IV 💎🌸*': 325,
'*🌸💎 Guardiana III 💎🌸*': 350,
'*🌸💎 Guardiana II 💎🌸*': 375,
'*🌸💎 Guardiana I 💎🌸*': 399,
'*💖✨ Gran Maestra V ✨💖*': 400,
'*💖✨ Gran Maestra IV ✨💖*': 425,
'*💖✨ Gran Maestra III ✨💖*': 450,
'*💖✨ Gran Maestra II ✨💖*': 475,
'*💖✨ Gran Maestra I ✨💖*': 499,
'*🎀💫 Señora V 💫🎀*': 500,
'*🎀💫 Señora IV 💫🎀*': 525,
'*🎀💫 Señora III 💫🎀*': 550,
'*🎀💫 Señora II 💫🎀*': 575,
'*🎀💫 Señora I 💫🎀*': 599,
'*🌟👑 Heroína Inmortal V 👑🌟*': 600,
'*🌟👑 Heroína Inmortal IV 👑🌟*': 625,
'*🌟👑 Heroína Inmortal III 👑🌟*': 650,
'*🌟👑 Heroína Inmortal II 👑🌟*': 675,
'*🌟👑 Heroína Inmortal I 👑🌟*': 699,
'*💕🌸 Maestra Suprema V 🌸💕*': 700,
'*💕🌸 Maestra Suprema IV 🌸💕*': 725,
'*💕🌸 Maestra Suprema III 🌸💕*': 750,
'*💕🌸 Maestra Suprema II 🌸💕*': 775,
'*💕🌸 Maestra Suprema I 🌸💕*': 799,
'*💎✨ Sabia V ✨💎*': 800,
'*💎✨ Sabia IV ✨💎*': 825,
'*💎✨ Sabia III ✨💎*': 850,
'*💎✨ Sabia II ✨💎*': 875,
'*💎✨ Sabia I ✨💎*': 899,
'*🌺💫 Viajera V 💫🌺*': 900,
'*🌺💫 Viajera IV 💫🌺*': 925,
'*🌺💫 Viajera III 💫🌺*': 950,
'*🌺💫 Viajera II 💫🌺*': 975,
'*🌺💫 Viajera I 💫🌺*': 999,
'*💖👑 Diosa Eterna V 👑💖*': 1000,
'*💖👑 Diosa Eterna IV 👑💖*': 2000,
'*💖👑 Diosa Eterna III 👑💖*': 3000,
'*💖👑 Diosa Eterna II 👑💖*': 4000,
'*💖👑 Diosa Eterna I 👑💖*': 5000,
'*🌸✨💫 Gran Emperatriz del Infinito 💫✨🌸*': 10000,
}

let handler = m => m
handler.before = async function (m, { conn }) {
    
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let user = global.db.data.users[m.sender]
    
    let level = user.level
    let before = user.level * 1
    
    while (canLevelUp(user.level, user.exp, global.multiplier)) 
        user.level++
    
    if (before !== user.level) {
        let especial = 'coin'
        let especial2 = 'exp'
        let especialCant = Math.floor(Math.random() * (100 - 10 + 1)) + 10
        let especialCant2 = Math.floor(Math.random() * (100 - 10 + 1)) + 10

        if (user.level % 5 === 0) {
            user[especial] += especialCant
            user[especial2] += especialCant2
        }
    }

    let role = (Object.entries(roles).sort((a, b) => b[1] - a[1]).find(([, minLevel]) => level >= minLevel) || Object.entries(roles)[0])[0]
    user.role = role

    return !0
}

export default handler
