/* 
🎤💙 Código creado por Brauliovh3 
✧ https://github.com/Brauliovh3/HATSUNE-MIKU.git 
💙 Hatsune Miku Bot - Virtual Concert Experience 🎵✨
*/

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid.length > 0 ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    let name = conn.getName(who)
    let name2 = conn.getName(m.sender)

    let str = m.mentionedJid.length > 0 || m.quoted 
        ? `💙 \`${name2}\` está mostrando su lado más molesto con \`${name || who}\` en el escenario virtual 😤` 
        : `💙 \`${name2}\` está expresando su sentimiento en el concierto virtual 😤`
    
    if (m.isGroup) {
        let pp = 'https://files.catbox.moe/9fmjzk.mp4'
        let pp2 = 'https://tenor.com/es-419/view/anime-gif-25126004'
        let pp3 = 'https://tenor.com/es-419/view/anime-angry-anime-acomu414-shupogaki-tachibana-nozomi-gif-5692302699521259097'
        let pp4 = 'https://files.catbox.moe/kg3fti.mp4'
        let pp5 = 'https://files.catbox.moe/vpb0rg.mp4'
        let pp6 = 'https://files.catbox.moe/7eltxa.mp4'
        let pp7 = 'https://tenor.com/es-419/view/cute-anime-angry-gif-23459377'
        let pp8 = 'https://tenor.com/es-419/view/akemi-homura-anime-girl-glasses-happy-gif-18350357010296982258'
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8]
        const video = videos[Math.floor(Math.random() * videos.length)]
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, ptt: true, mentions: [who] }, { quoted: m })
    }
}

handler.help = ['angry']
handler.tags = ['anime']
handler.command = ['angry', 'enojado','molesto', 'enojada', 'molesta']
handler.group = true

export default handler


