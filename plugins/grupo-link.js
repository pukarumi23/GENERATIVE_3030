var handler = async (m, { conn, args }) => {
let group = m.chat
let groupMetadata = await conn.groupMetadata(group)
let link = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(group)

let pp
try {
pp = await conn.profilePictureUrl(group, 'image')
} catch {
pp = 'https://i.pinimg.com/736x/d6/e9/cf/d6e9cf798c396f01e8136a5d8eaf0a6e.jpg'
}

let texto = `
◤━━━━━━━━━━━━━━━━━━━━━━━━◥
✨💖 *𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊* 💖✨
◣━━━━━━━━━━━━━━━━━━━━━━━━◢

꧁♡═══════════════════════♡꧂
🌸 *${groupMetadata.subject}* 🌸
꧁♡═══════════════════════♡꧂

▬▬ι═══════ﺤ *✧ « ✦ » ✧* ﺤ═══════ι▬▬

📝 *𝘿𝙚𝙨𝙘𝙧𝙞𝙥𝙘𝙞𝙤́𝙣:*
${groupMetadata.desc || 'Sin descripción'}

▬▬ι═══════ﺤ *✧ « ✦ » ✧* ﺤ═══════ι▬▬

╰⊱♡⊱╮ *◈ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊́𝙉 ◈* ╭⊱♡⊱╯

👥 *𝙈𝙞𝙚𝙢𝙗𝙧𝙤𝙨:* ${groupMetadata.participants.length}
🔗 *𝙀𝙣𝙡𝙖𝙘𝙚:* 

${link}

꧁♡━━━━━━━━━━━━━━━━━━━━━♡꧂

༺♡═────────────────═♡༻
💖✨ *¡𝙐́𝙣𝙚𝙩𝙚 𝙖 𝙣𝙤𝙨𝙤𝙩𝙧𝙤𝙨!* ✨💖
༺♡═────────────────═♡༻

･ ｡ﾟ☆: *.☽ *🌸 𝙂𝙧𝙪𝙥𝙤 𝙊𝙛𝙞𝙘𝙞𝙖𝙡 🌸* .* :☆ﾟ. ･
`

await conn.sendFile(m.chat, pp, 'group.jpg', texto, m)
}
handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link','linkgroup']
handler.botAdmin = true
export default handler
