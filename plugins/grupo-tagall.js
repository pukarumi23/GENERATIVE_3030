const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '💖';
  m.react(customEmoji);
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }
  const pesan = args.join` `;
  const oi = `${pesan ? pesan : '¡Atención a todos!'}`;
  
  let teks = `
◤━━━━━━━━━━━━━━━━━━━━━━━━◥
✨💖 *𝙄𝙉𝙑𝙊𝘾𝘼𝘾𝙄𝙊́𝙉 𝙂𝙍𝙐𝙋𝘼𝙇* 💖✨
◣━━━━━━━━━━━━━━━━━━━━━━━━◢

꧁♡═══════════════════════♡꧂
🌸 *¡𝘼𝙏𝙀𝙉𝘾𝙄𝙊́𝙉 𝙏𝙊𝘿𝙊𝙎!* 🌸
꧁♡═══════════════════════♡꧂

▬▬ι═══════ﺤ *✧ « ✦ » ✧* ﺤ═══════ι▬▬

💕 *${oi}* 💕

▬▬ι═══════ﺤ *✧ « ✦ » ✧* ﺤ═══════ι▬▬

╰⊱♡⊱╮ *◈ 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎 ◈* ╭⊱♡⊱╯

✧･ﾟ: *✧･ﾟ:*🌸 📊 *𝙏𝙤𝙩𝙖𝙡: ${participants.length} 𝙗𝙚𝙡𝙡𝙚𝙯𝙖𝙨* 📊 🌸 *:･ﾟ✧*:･ﾟ✧

꧁♡━━━━━━━━━━━━━━━━━━━━━♡꧂

`;
  for (const mem of participants) {
    teks += `╰►✦ 💕 *@${mem.id.split('@')[0]}* ✨\n`;
  }
  teks += `
꧁♡━━━━━━━━━━━━━━━━━━━━━♡꧂

▂▃▅▇█▓▒░ 💖 ۩۞۩ *${vs}* ۩۞۩ 💖 ░▒▓█▇▅▃▂

◥꧁♡꧂◤═══════════════◥꧁♡꧂◤

༺♡═────────────────═♡༻
💖✨ *¡𝙏𝙊𝘿𝙊𝙎 𝘾𝙊𝙉𝙑𝙊𝘾𝘼𝘿𝙊𝙎!* ✨💖
༺♡═────────────────═♡༻

◣━━━━━━━━━━━━━━━━━━━━━━━━◢
･ ｡ﾟ☆: *.☽ *🌸 ✨ 𝙁𝙄𝙉 ✨ 🌸* .* :☆ﾟ. ･
◤━━━━━━━━━━━━━━━━━━━━━━━━◥

💕 *¡𝙂𝙧𝙖𝙘𝙞𝙖𝙨 𝙥𝙤𝙧 𝙨𝙪 𝙖𝙩𝙚𝙣𝙘𝙞𝙤́𝙣, 𝙡𝙞𝙣𝙙𝙪𝙧𝙖𝙨!* 💕
`;
  conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) });
};
handler.help = ['todos *<mensaje opcional>*'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall'];
handler.admin = true;
handler.group = true;
export default handler;
