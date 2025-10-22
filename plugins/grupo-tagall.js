const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;
  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '💖';
  m.react(customEmoji);
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }
  const pesan = args.join` `;
  const oi = `${pesan ? `「 ${pesan} 」` : '¡Atención a todos!'}`;
  
  let teks = `
◤━━━━━━━━━━━━━━━━━━━━━━━━◥
    ✨💖 INVOCACIÓN GRUPAL 💖✨
◣━━━━━━━━━━━━━━━━━━━━━━━━◢

꧁═══════════════════════════꧂
      📢 ¡ATENCIÓN TODOS! 📢
꧁═══════════════════════════꧂

▬▬ι═══════ﺤ « ✦ » ﺤ═══════ι▬▬

         ${oi}

▬▬ι═══════ﺤ « ✦ » ﺤ═══════ι▬▬

╰⊱♡⊱╮◈ LISTA DE MIEMBROS ◈╭⊱♡⊱╯

✧･ﾟ: *✧･ﾟ:* 📊 Total: ${participants.length} personas *:･ﾟ✧*:･ﾟ✧

꧁━━━━━━━━━━━━━━━━━━━━━━━━꧂

`;
  for (const mem of participants) {
    teks += `ஐ═══►💕 @${mem.id.split('@')[0]}\n`;
  }
  teks += `
꧁━━━━━━━━━━━━━━━━━━━━━━━━꧂

▂▃▅▇█▓▒░۩۞۩ ${vs} ۩۞۩░▒▓█▇▅▃▂

◥꧁д꧂◤══════════════◥꧁д꧂◤

༺═──────────────═༻
   💖✨ ¡TODOS CONVOCADOS! ✨💖
༺═──────────────═༻

◣━━━━━━━━━━━━━━━━━━━━━━━━◢
     ･ ｡ﾟ☆: *.☽ 🌸 FIN 🌸 .* :☆ﾟ. ･
◤━━━━━━━━━━━━━━━━━━━━━━━━◥
`;
  conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) });
};
handler.help = ['todos *<mensaje opcional>*'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall'];
handler.admin = true;
handler.group = true;
export default handler;
