export default {
  command: ['setgpname'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, usedPrefix, command) => {
    const newName = args.join(' ').trim()
    if (!newName)
      return m.reply('💙 Por favor, ingrese el nuevo nombre que desea ponerle al grupo.', m, global.miku)
    try {
      await client.groupUpdateSubject(m.chat, newName)
      m.reply(`💙 El nombre del grupo se modificó correctamente.`, m, global.miku)
    } catch (e) {
     return m.reply(`> An unexpected error occurred while executing command *${usedPrefix + command}*. Please try again or contact support if the issue persists.\n> [Error: *${e.message}*]`)
    }
  },
};
