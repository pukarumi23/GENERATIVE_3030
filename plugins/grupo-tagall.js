const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix == 'a' || usedPrefix == 'A') return;

  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '🍫';
  await m.react(customEmoji);

  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const pesan = args.join` `;
  const oi = `*🔶 ANUNCIO:* ${pesan} 🔶`;
  let teks = `*╔═══════════════*\n`;
  teks += `*║* 🍀 *Participantes:* ${participants.length}\n`;
  teks += `*╠═══════════════*\n`;
  teks += `*║*\n`;
  teks += `*║* ${oi}\n`;
  teks += `*║*\n`;
  for (const mem of participants) {
    teks += `*║* ➤ @${mem.id.split('@')[0]}\n`;
  }
  teks += `*║*\n`;
  teks += `*╚═══════════════*`;

  await conn.sendMessage(m.chat, { 
    text: teks, 
    mentions: participants.map(a => a.id) 
  });
};

handler.help = ['todos <mensaje>'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall'];
handler.admin = true;
handler.group = true;

export default handler;
