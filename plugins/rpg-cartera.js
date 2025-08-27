let handler = async (m, {conn, usedPrefix}) => {
    let who = m.mentionedJid && m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.quoted 
            ? m.quoted.sender 
            : m.sender
    if (who == conn.user.jid) return // Puedes dejar vacío o poner un mensaje especial

    if (!(who in global.db.data.users)) {
        return conn.reply(
            m.chat, 
            `☠️ 𝕰𝖘𝖙𝖊 𝖆𝖑𝖒𝖆 𝖓𝖔 𝖊𝖘𝖙𝖆́ 𝖆𝖙𝖆𝖉𝖆 𝖊𝖓 𝖑𝖔𝖘 𝖗𝖊𝖌𝖎𝖘𝖙𝖗𝖔𝖘 𝖉𝖊 𝕮𝖆𝖗𝖙𝖊𝖗𝖆𝖘. ☠️\n\n✨ Invoca tu existencia con \`${usedPrefix}registrar\``, 
            m
        )
    }

    let user = global.db.data.users[who]
    let moneda = global.db.data?.settings?.moneda || "🜲"

    // Elementos barrocos/góticos y emojis
    let borderTop = "╔═━━━━━━༺༻━━━━━━═╗"
    let borderBot = "╚═━━━━━━༺༻━━━━━━═╝"
    let userTag = who == m.sender ? "𝔘𝔰𝔲𝔞𝔯𝔦𝔬:" : `𝔘𝔰𝔲𝔞𝔯𝔦𝔬: @${who.split('@')[0]}`
    let walletTitle = "𝕮𝖆𝖗𝖙𝖊𝖗𝖆:"
    let coinArt = `${moneda}${skull}${rose}`

    let walletMsg =
        `${borderTop}\n` +
        ` ${bat} ${cross} ${gothicFrame} ${cross} ${bat}\n` +
        ` ${candle} ${stars} *𝔅𝔞𝔯𝔯𝔬𝔠𝔬 𝔏𝔢𝔤𝔢𝔫𝔡𝔞𝔯𝔦𝔞* ${stars} ${candle}\n` +
        `\n` +
        ` ${userTag}\n` +
        ` ${walletTitle}\n` +
        `   ${skull} ${rose} *${user.coin}* ${coinArt} ${rose} ${skull}\n` +
        `\n` +
        ` ${bat} ${cross} ${gothicFrame} ${cross} ${bat}\n` +
        `${borderBot}\n` +
        `\n` +
        `🕯️ 𝔏𝔞𝔰 𝔪𝔬𝔫𝔢𝔡𝔞𝔰 𝔰𝔬𝔫 𝔢𝔩 𝔢𝔰𝔭𝔦𝔯𝔦𝔱𝔲 𝔡𝔢 𝔩𝔬𝔰 𝔞𝔳𝔦𝔡𝔬𝔰... 🕯️`

    await conn.reply(
        m.chat,
        walletMsg,
        m,
        { mentions: [who] }
    )
}

handler.help = ['wallet','cartera']
handler.tags = ['economy']
handler.command = ['wallet', 'cartera']
handler.group = true
handler.register = true

export default handler
