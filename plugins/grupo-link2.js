var handler = (m, { conn, args }) => {

  let group = m.chat
  let link = 'htpps://chat.whatsapp.com/' + await conn.groupInvitecode(group)
  conn.reply(m.chat, link, m)

}
handler.help = ['link']
handler.tags = ['grupo']
handler.command = ['link','linkgroup']

handler.batAdmin = true

expor default handler
