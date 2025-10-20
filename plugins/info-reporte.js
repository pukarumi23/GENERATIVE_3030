let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `${emoji} Por favor, ingrese el error que desea reportar.`, m)
    if (text.length < 10) return conn.reply(m.chat, `${emoji} Especifique bien el error, mínimo 10 caracteres.`, m)
    if (text.length > 1000) return conn.reply(m.chat, `${emoji2} *Máximo 1000 caracteres para enviar el error.`, m)
    const ownerJid = '54873039089749@lid'
    const teks = `*✖️ \`R E P O R T E\` ✖️*

☁️ Número:
• Wa.me/${m.sender.split`@`[0]}

👤 Usuario: 
• ${m.pushName || 'Anónimo'}

🆔 JID:
• ${m.sender}

${m.isGroup ? `👥 Grupo:\n• ${m.chat}` : ''}

💬 Mensaje:
• ${text}`
    await conn.reply(ownerJid, m.quoted ? teks + '\n\n💬 Citado:\n' + m.quoted.text : teks, m, { mentions: conn.parseMention(teks) })

    m.reply(`${emoji} El reporte se envío a mi creador, cualquier informe falso puede ocasionar baneo.`)
}
handler.help = ['reportar']
handler.tags = ['info']
handler.command = ['reporte', 'report', 'reportar', 'bug', 'error']

export default handler