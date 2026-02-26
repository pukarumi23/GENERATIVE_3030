import chalk from 'chalk';

export default async function welcomeHandler(client) {
  if (!client || !client.ev) {
    console.log(chalk.red('Welcome: Cliente no válido'));
    return;
  }

  client.ev.on('group-participants.update', async (anu) => {
    try {
      
      if (!anu || !anu.id || !anu.participants || !Array.isArray(anu.participants)) {
        return;
      }

    
      if (client.ws?.socket?.readyState !== 1) {
        return;
      }

     
      let metadata = {};
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );
        metadata = await Promise.race([
          client.groupMetadata(anu.id),
          timeoutPromise
        ]);
      } catch (err) {
        
        metadata = { subject: 'Grupo', participants: [] };
      }

      const participants = anu.participants;
      const memberCount = metadata.participants?.length || 0;
      const botId = client.user.id.split(':')[0] + '@s.whatsapp.net';
      const botSettings = global.db.data.settings[botId] || {};
      
      for (const jid of participants) {
        
        let validJid = jid;
        
        
        if (typeof jid === 'object' && jid !== null) {
          validJid = jid.phoneNumber || jid.id || jid;
        }
        
        
        if (typeof validJid === 'number') {
          validJid = `${validJid}@s.whatsapp.net`;
        }
        
        
        if (typeof validJid === 'string' && !validJid.includes('@')) {
          validJid = `${validJid}@s.whatsapp.net`;
        }
        
        if (!validJid || typeof validJid !== 'string' || !validJid.includes('@')) {
          continue;
        }
        
        const phone = validJid.split('@')[0];
        
        let pp = 'https://i.pinimg.com/736x/0c/1e/f8/0c1ef8e804983e634fbf13df1044a41f.jpg';
        try {
          pp = await client.profilePictureUrl(validJid, 'image');
        } catch {
          try {
            pp = await client.profilePictureUrl(anu.id, 'image');
          } catch {}
        }
        
        const contextInfo = {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: botSettings.id || '120363315369913363@newsletter',
            serverMessageId: '0',
            newsletterName: botSettings.nameid || '💙 HATSUNE MIKU CHANNEL💙'
          },
          externalAdReply: {
            title: botSettings.namebot || 'HATSUNE MIKU',
            body: global.dev || '© 🄿🄾🅆🄴🅁🄴🄳 (ㅎㅊDEPOOLㅊㅎ)',
            mediaUrl: null,
            description: null,
            previewType: 'PHOTO',
            thumbnailUrl: botSettings.icon || 'https://i.pinimg.com/736x/30/42/b8/3042b89ced13fefda4e75e3bc6dc2a57.jpg',
            sourceUrl: botSettings.link || 'https://www.whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o',
            mediaType: 1,
            renderLargerThumbnail: false
          },
          mentionedJid: [validJid]
        };
        
        if (anu.action === 'add') {
          try {
            const caption = `╭━━━🌸━━━💙━━━🌸━━━╮
┃  🎵 *¡ Bienvenid${phone.endsWith('a') ? 'a' : 'o'} al grupo !* 🎵
╰━━━🌸━━━💙━━━🌸━━━╯
│
├◦ 🌸 *Usuario* ⟶ @${phone}
├◦ 💙 *Grupo* ⟶ ${metadata.subject || 'Grupo'}
├◦ 🌱 *Miembros* ⟶ Ahora somos ${memberCount}
│
├━━━━━━━━━━━━━━━━━━╮
│ 🌱 Usa */menu* para ver comandos.
│ 💙 ¡Que disfrutes tu estancia! ✨
╰━━━🌸━━━💙━━━🌸━━━╯`;
            
            await client.sendMessage(anu.id, { 
              image: { url: pp }, 
              caption,
              contextInfo
            });
            console.log(chalk.green(`💙 Bienvenida enviada a ${phone}`));
          } catch (err) {
            
            if (!err.message?.includes('Connection') && !err.message?.includes('Timeout')) {
              console.log(chalk.yellow(`💙 Welcome: Error enviando bienvenida - ${err.message}`));
            }
          }
        }
        
        if (anu.action === 'remove' || anu.action === 'leave') {
          try {
            const caption = `╭━━━🌸━━━💙━━━🌸━━━╮
┃  🎵 *¡ Hasta pronto !* 🎵
╰━━━🌸━━━💙━━━🌸━━━╯
│
├◦ 🌸 *Usuario* ⟶ @${phone}
├◦ 💙 *Grupo* ⟶ ${metadata.subject || 'Grupo'}
├◦ 🌱 *Miembros* ⟶ Ahora somos ${memberCount}
│
├━━━━━━━━━━━━━━━━━━╮
│ 🌸 Fue un placer tenerte aquí.
│ 💙 ¡Esperamos verte de nuevo! ✨
╰━━━🌸━━━💙━━━🌸━━━╯`;
            
            await client.sendMessage(anu.id, { 
              image: { url: pp }, 
              caption,
              contextInfo
            });
            console.log(chalk.blue(`💙 Despedida enviada a ${phone}`));
          } catch (err) {
            
            if (!err.message?.includes('Connection') && !err.message?.includes('Timeout')) {
              console.log(chalk.yellow(`💙 Welcome: Error enviando despedida - ${err.message}`));
            }
          }
        }
      }
    } catch (err) {
     
      if (!err.message?.includes('Connection Closed') && !err.message?.includes('Timeout')) {
        console.log(chalk.gray(`💙 Welcome Error → ${err.message}`));
      }
    }
  });
}
