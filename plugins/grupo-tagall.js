
const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;

  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '🍫';
  m.react(customEmoji);

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const pesan = args.join` `;
  const oi = `*🔶 ANUNCIO:* ${pesan} 🔶`;
  let teks = `*🔶.╭╭ִ╼࣪━ִﮩ٨ـﮩ⚜️ 𝙄𝙉𝘿𝙀𝙋𝙀𝙉𝘿𝙄𝙀𝙉𝙏𝙀 ⚜️ﮩ٨ـﮩ━ִ╾࣪╮╮.🔶 \n  *🍀CANTIDAD DE INTEGRANTES: ${participants.length} \n\n ${oi}\n\n╭  ┄ 𝅄 ۪꒰ \`⡞᪲=͟͟͞${botname} ≼᳞ׄ\` ꒱ ۟ 𝅄 ┄\n`;
  for (const mem of participants) {
    teks += `┊◈⫸ @${mem.id.split('@')[0]}\n`;
  }
  teks += `╰⸼ ┄ ┄ ┄ ─  ꒰  ׅ୭ *${vs}* ୧ ׅ ꒱  ┄  ─ ┄ ⸼`;

  conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) });
};

handler.help = ['todos *<mensaje opcional>*'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall']
handler.admin = true;
handler.group = true;

export default handler;
