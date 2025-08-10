import fs from 'fs';

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`🎤💙 Por favor, ingresa el nombre del plugin virtual que quieres guardar ✨`);
    }

    if (!m.quoted || !m.quoted.text) {
        return m.reply(`🎵💫 Responde al mensaje con el contenido del plugin musical para guardarlo 💫🎵`);
    }

    const ruta = `plugins/${text}.js`;
    
    try {
        await fs.writeFileSync(ruta, m.quoted.text);
        m.reply(`🎶✨ Guardando plugin virtual en ${ruta} 🌟`);
    } catch (error) {
        m.reply(`🎤💙 ¡Gomen! Ocurrió un error al guardar el plugin virtual: ${error.message} ✨`);
    }
};

handler.help = ['saveplugin'];
handler.tags = ['owner'];
handler.command = ["saveplugin"];
handler.owner = true;

export default handler;