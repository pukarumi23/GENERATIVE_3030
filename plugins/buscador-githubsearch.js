/* 🎤💙 Github Search by Brauliovh3
- Virtual Concert Experience  
- https://github.com/Brauliovh3/HATSUNE-MIKU
*/

// 🎤💙 Búsqueda GitHub Virtual

import fetch from 'node-fetch';

let handler = async(m, { conn, text, usedPrefix, command }) => {

if (!text) return conn.reply(m.chat, `🎤💙 Por favor ingresa el nombre de un repositorio GitHub para buscar en el ciberespacio virtual ✨🎵`, m, rcanal);

try {
let api = `https://dark-core-api.vercel.app/api/search/github?key=api&text=${text}`;

let response = await fetch(api);
let json = await response.json();
let result = json.results[0];

let txt = `�💙 *Repositorio Virtual:* ${result.name}\n👑 *Creador:* ${result.creator}\n🌟 *Estrellas del Concierto:* ${result.stars}\n🔖 *Bifurcaciones Virtuales:* ${result.forks}\n📜 *Descripción Musical:* ${result.description}\n📆 *Creado en el Ciberespacio:* ${result.createdAt}\n🔗 *Link Virtual:* ${result.cloneUrl}`;

let img = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745610598914.jpeg';

conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: fkontak });

} catch (error) {
console.error(error)
m.reply(`🎤💙 ¡Gomen! Error en la búsqueda virtual: ${error.message} ✨💫`);
m.react('💙');
 }
};

handler.command = ['githubsearch', 'gbsearch'];

export default handler;
