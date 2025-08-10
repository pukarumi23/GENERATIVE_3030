import { canLevelUp } from '../lib/levelling.js'

const roles = {
'*🎤 Fanático(a) Novato(a) V 🎤*': 0,
'*🎤 Fanático(a) Novato(a) IV 🎤*': 2,
'*🎤 Fanático(a) Novato(a) III 🎤*': 4,
'*🎤 Fanático(a) Novato(a) II 🎤*': 6,
'*🎤 Fanático(a) Novato(a) I 🎤*': 8,
'*🎵 Cantante Virtual V 🎵*': 10,
'*🎵 Cantante Virtual IV 🎵*': 12,
'*🎵 Cantante Virtual III 🎵*': 14,
'*🎵 Cantante Virtual II 🎵*': 16,
'*🎵 Cantante Virtual I 🎵*': 18,
'*💙 Productor(a) Musical V 💙*': 20,
'*💙 Productor(a) Musical IV 💙*': 22,
'*💙 Productor(a) Musical III 💙*': 24,
'*💙 Productor(a) Musical II 💙*': 26,
'*💙 Productor(a) Musical I 💙*': 28,
'*🌟 Estrella del Escenario V 🌟*': 30,
'*🌟 Estrella del Escenario IV 🌟*': 32,
'*🌟 Estrella del Escenario III 🌟*': 34,
'*🌟 Estrella del Escenario II 🌟*': 36,
'*🌟 Estrella del Escenario I 🌟*': 38,
'*🎶 Compositor(a) Digital V 🎶*': 40,
'*🎶 Compositor(a) Digital IV 🎶*': 42,
'*🎶 Compositor(a) Digital III 🎶*': 44,
'*🎶 Compositor(a) Digital II 🎶*': 46,
'*🎶 Compositor(a) Digital I 🎶*': 48,
'*✨ Idol Virtual V ✨*': 50,
'*✨ Idol Virtual IV ✨*': 52,
'*✨ Idol Virtual III ✨*': 54,
'*✨ Idol Virtual II ✨*': 56,
'*✨ Idol Virtual I ✨*': 58,
'*💫 Diva del Futuro V 💫*': 60,
'*💫 Diva del Futuro IV 💫*': 62,
'*💫 Diva del Futuro III 💫*': 64,
'*💫 Diva del Futuro II 💫*': 66,
'*💫 Diva del Futuro I 💫*': 68,
'*🎤💎 Cantante Diamante V 💎🎤*': 70,
'*🎤💎 Cantante Diamante IV 💎🎤*': 72,
'*🎤💎 Cantante Diamante III 💎🎤*': 74,
'*🎤💎 Cantante Diamante II 💎🎤*': 76,
'*🎤💎 Cantante Diamante I 💎🎤*': 78,
'*🌟✨ Maestro(a) de Melodías V ✨🌟*': 80,
'*🌟✨ Maestro(a) de Melodías IV ✨🌟*': 85,
'*🌟✨ Maestro(a) de Melodías III ✨🌟*': 90,
'*🌟✨ Maestro(a) de Melodías II ✨🌟*': 95,
'*🌟✨ Maestro(a) de Melodías I ✨🌟*': 99,
'*💙🎵 Leyenda Musical V 🎵💙*': 100,
'*💙🎵 Leyenda Musical IV 🎵💙*': 110,
'*💙🎵 Leyenda Musical III 🎵💙*': 120,
'*💙🎵 Leyenda Musical II 🎵💙*': 130,
'*💙🎵 Leyenda Musical I 🎵💙*': 140,
'*🎤👑 Soberano(a) Virtual V 👑🎤*': 150,
'*🎤👑 Soberano(a) Virtual IV 👑🎤*': 160,
'*🎤👑 Soberano(a) Virtual III 👑🎤*': 170,
'*🎤👑 Soberano(a) Virtual II 👑🎤*': 180,
'*🎤👑 Soberano(a) Virtual I 👑🎤*': 199,
'*💫🌟 Titán(a) Digital V 🌟💫*': 200,
'*💫🌟 Titán(a) Digital IV 🌟💫*': 225,
'*💫🌟 Titán(a) Digital III 🌟💫*': 250,
'*💫🌟 Titán(a) Digital II 🌟💫*': 275,
'*💫🌟 Titán(a) Digital I 🌟💫*': 299,
'*🎵💎 Guardián(a) de Armonías V 💎🎵*': 300,
'*🎵💎 Guardián(a) de Armonías IV 💎🎵*': 325,
'*🎵💎 Guardián(a) de Armonías III 💎🎵*': 350,
'*🎵💎 Guardián(a) de Armonías II 💎🎵*': 375,
'*🎵💎 Guardián(a) de Armonías I 💎🎵*': 399,
'*🎤✨ Maestro(a) Vocaloid V ✨🎤*': 400,
'*🎤✨ Maestro(a) Vocaloid IV ✨🎤*': 425,
'*🎤✨ Maestro(a) Vocaloid III ✨🎤*': 450,
'*🎤✨ Maestro(a) Vocaloid II ✨🎤*': 475,
'*🎤✨ Maestro(a) Vocaloid I ✨🎤*': 499,
'*🌟💙 Señor(a) de las Melodías V 💙🌟*': 500,
'*🌟💙 Señor(a) de las Melodías IV 💙🌟*': 525,
'*🌟💙 Señor(a) de las Melodías III 💙🌟*': 550,
'*🌟💙 Señor(a) de las Melodías II 💙🌟*': 575,
'*🌟💙 Señor(a) de las Melodías I 💙🌟*': 599,
'*🎵👑 Héroe(a) Musical Inmortal V 👑🎵*': 600,
'*🎵👑 Héroe(a) Musical Inmortal IV 👑🎵*': 625,
'*🎵👑 Héroe(a) Musical Inmortal III 👑🎵*': 650,
'*🎵👑 Héroe(a) Musical Inmortal II 👑🎵*': 675,
'*🎵👑 Héroe(a) Musical Inmortal I 👑🎵*': 699,
'*💫🎤 Maestro(a) del Mundo Virtual V 🎤💫*': 700,
'*💫🎤 Maestro(a) del Mundo Virtual IV 🎤💫*': 725,
'*💫🎤 Maestro(a) del Mundo Virtual III 🎤💫*': 750,
'*💫🎤 Maestro(a) del Mundo Virtual II 🎤💫*': 775,
'*💫🎤 Maestro(a) del Mundo Virtual I 🎤💫*': 799,
'*✨💎 Sabio(a) de las Frecuencias V 💎✨*': 800,
'*✨💎 Sabio(a) de las Frecuencias IV 💎✨*': 825,
'*✨💎 Sabio(a) de las Frecuencias III 💎✨*': 850,
'*✨💎 Sabio(a) de las Frecuencias II 💎✨*': 875,
'*✨💎 Sabio(a) de las Frecuencias I 💎✨*': 899,
'*🌟🎵 Viajero(a) del Ciberespacio V 🎵🌟*': 900,
'*🌟🎵 Viajero(a) del Ciberespacio IV 🎵🌟*': 925,
'*🌟🎵 Viajero(a) del Ciberespacio III 🎵🌟*': 950,
'*🌟🎵 Viajero(a) del Ciberespacio II 🎵🌟*': 975,
'*🌟🎵 Viajero(a) del Ciberespacio I 🎵🌟*': 999,
'*💙👑 Deidad Virtual Eterna V 👑💙*': 1000,
'*💙👑 Deidad Virtual Eterna IV 👑💙*': 2000,
'*💙👑 Deidad Virtual Eterna III 👑💙*': 3000,
'*💙👑 Deidad Virtual Eterna II 👑💙*': 4000,
'*💙👑 Deidad Virtual Eterna I 👑💙*': 5000,
'*🎤✨💫 Gran Diva del Infinito Digital 💫✨🎤*': 10000,
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
