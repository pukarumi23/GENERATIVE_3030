import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";
import fs from 'fs';
import path from 'path';
import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);

const handler = async (m, { conn, text, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender];

  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `💙 Ingresa el nombre de la música a descargar.\n\nEjemplo: ${usedPrefix}${command} Coldplay Viva la Vida`, m, fake);
    }

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('No se encontraron resultados para tu búsqueda.');
    }

    const videoInfo = search.all[0];
    if (!videoInfo) {
      return m.reply('No se pudo obtener información del video.');
    }

    const { 
      title = 'Desconocido', 
      thumbnail = '', 
      timestamp = 'Desconocido', 
      views = 0, 
      ago = 'Desconocido', 
      url = '', 
      author = { name: 'Desconocido' } 
    } = videoInfo;

    if (!url) {
      return m.reply('No se pudo obtener la URL del video.');
    }

    const vistas = formatViews(views);
    const canal = author.name || 'Desconocido';
    
    const infoMessage = `
*𖹭.╭╭ִ╼࣪━ִﮩ٨ـﮩ💙𝗠𝗶𝗸𝘂𝗺𝗶𝗻🌱ﮩ٨ـﮩ━ִ╾࣪╮╮.𖹭*
> 💙 *Título:* ${title}
*°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°*
> 🌱 *Duración:* ${timestamp}
*°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°*
> 💙 *Vistas:* ${vistas}
*°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°*
> 🌱 *Canal:* ${canal}
*°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°*
> 💙 *Publicado:* ${ago}
*⏝ּׅ︣︢ۛ۫۫۫۫۫۫ۜ⏝ּׅ︣︢ۛ۫۫۫۫۫۫ۜ⏝ּׅ︣︢ۛ۫۫۫۫۫۫ۜ⏝ּׅ︣︢ۛ۫۫۫۫۫۫ۜ⏝ּׅ︢︣ۛ۫۫۫۫۫۫ۜ⏝ּׅ︢︣ۛ۫۫۫۫۫۫ۜ⏝ּׅ︢︣ۛ۫۫۫۫۫۫ۜ⏝ּׅ︢︣ۛ۫۫۫۫۫۫ۜ⏝ּׅ︢︣ׄۛ۫۫۫۫۫۫ۜ*
> 💌 *Elige un formato:*
> 1️⃣ - MP3 (Audio)
> 2️⃣ - MP4 (Video)
> 3️⃣ - MP3 Documento (archivos grandes)
> 4️⃣ - MP4 Documento (archivos grandes)
> 🈹 Responde a este mensaje con el número`;

    try {
      const thumb = thumbnail ? (await conn.getFile(thumbnail))?.data : null;

      const JT = {
        contextInfo: {
          externalAdReply: {
            title: botname || 'Miku Bot',
            body: dev || 'YouTube Downloader',
            mediaType: 1,
            previewType: 0,
            mediaUrl: url,
            sourceUrl: url,
            thumbnail: thumb,
            renderLargerThumbnail: true,
          },
        },
      };

      const sentMsg = await conn.reply(m.chat, infoMessage, m, JT);
      
      if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
      }
      
      global.db.data.users[m.sender].lastYTSearch = {
        url,
        title,
        messageId: m.key.id,  
        timestamp: Date.now() 
      };
      
      console.log(`Stored search for user ${m.sender}: ${title} (ID: ${m.key.id})`);
      
    } catch (thumbError) {
      const sentMsg = await conn.reply(m.chat, infoMessage, m);
      
      if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
      }
      
      global.db.data.users[m.sender].lastYTSearch = {
        url,
        title,
        messageId: m.key.id,  
        timestamp: Date.now() 
      };
      
      console.log("Error al obtener la miniatura:", thumbError);
    }

  } catch (error) {
    console.error("Error completo:", error);
    return m.reply(`💙 Ocurrió un error: ${error.message || 'Desconocido'}`);
  }
};


function isValidUrl(string) {
  try {
    new URL(string);
    return string.startsWith('http://') || string.startsWith('https://');
  } catch (_) {
    return false;
  }
}


async function processDownload(conn, m, url, title, option) {
  await conn.reply(m.chat, `💙 Procesando ${option === 1 || option === 3 ? 'audio' : 'video'}. Por favor espera...`, m);
  
  try {
    let downloadUrl;
    let fileName;
    let mimeType;

    if (option === 1 || option === 3) {
     
      downloadUrl = await getAudioUrl(url);
      fileName = `${title.replace(/[^\w\s]/gi, '')}.mp3`;
      mimeType = 'audio/mpeg';
      
      if (!downloadUrl) {
        throw new Error("No se pudo obtener el enlace de audio desde ninguna API.");
      }

      console.log(`Audio URL obtenida: ${downloadUrl}`);

      if (option === 1) {
       
        await conn.sendMessage(m.chat, { 
          audio: { url: downloadUrl }, 
          fileName: fileName, 
          mimetype: mimeType 
        }, { quoted: m });
      } else {
        
        await conn.sendMessage(m.chat, { 
          document: { url: downloadUrl },
          mimetype: mimeType,
          fileName: fileName
        }, { quoted: m });
      }
    } else {
      
      downloadUrl = await getVideoUrl(url);
      fileName = `${title.replace(/[^\w\s]/gi, '')}.mp4`;
      mimeType = 'video/mp4';
      
      if (!downloadUrl) {
        throw new Error("No se pudo obtener el enlace de video desde ninguna API.");
      }

      console.log(`Video URL obtenida: ${downloadUrl}`);

      if (option === 2) {
        
        await conn.sendMessage(m.chat, { 
          video: { url: downloadUrl }, 
          fileName: fileName, 
          mimetype: mimeType, 
          caption: title
        }, { quoted: m });
      } else {
       
        await conn.sendMessage(m.chat, { 
          document: { url: downloadUrl },
          mimetype: mimeType,
          fileName: fileName,
          caption: title
        }, { quoted: m });
      }
    }
    
    
    const user = global.db.data.users[m.sender];
    if (!user.cebollinesDeducted) {
      user.chocolates -= 2;
      user.cebollinesDeducted = true;
      conn.reply(m.chat, `💙 Has utilizado 2 *Cebollines 🌱*`, m);
    }
    
    return true;
  } catch (error) {
    console.error("Error al procesar descarga:", error);
    conn.reply(m.chat, `💙 Error: ${error.message}`, m);
    return false;
  }
}


async function getAudioUrl(videoUrl) {
  const apis = [
    {
      url: `https://api.agatz.xyz/api/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      parser: (data) => data?.data?.download
    },
    {
      url: `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      parser: (data) => data?.result?.download?.url
    },
    {
      url: `https://api.botcahx.biz.id/api/dowloader/yt?url=${encodeURIComponent(videoUrl)}&apikey=Admin`,
      parser: (data) => data?.result?.mp3
    },
    {
      url: `https://api.lolhuman.xyz/api/ytaudio?apikey=GataDios&url=${encodeURIComponent(videoUrl)}`,
      parser: (data) => data?.result?.link || data?.result?.audio?.link
    },
    {
      url: `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      parser: (data) => data?.url
    }
  ];
  
  for (let i = 0; i < apis.length; i++) {
    try {
      console.log(`Probando API de audio ${i + 1}: ${apis[i].url}`);
      
      const response = await fetch(apis[i].url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });
      
      if (!response.ok) {
        console.log(`API ${i + 1} responded with status: ${response.status}`);
        continue;
      }
      
      const apiJson = await response.json();
      console.log(`API ${i + 1} response:`, JSON.stringify(apiJson, null, 2));
      
      const audioUrl = apis[i].parser(apiJson);
      
      if (audioUrl && isValidUrl(audioUrl)) {
        console.log(`✓ API ${i + 1} devolvió URL válida: ${audioUrl}`);
        return audioUrl;
      } else {
        console.log(`✗ API ${i + 1} no devolvió URL válida:`, audioUrl);
      }
      
    } catch (error) {
      console.error(`✗ API ${i + 1} falló:`, error.message);
    }
  }
  
  console.log("Todas las APIs de audio fallaron");
  return null;
}


async function getVideoUrl(videoUrl) {
  const apis = [
    {
      url: `https://api.agatz.xyz/api/ytmp4?url=${encodeURIComponent(videoUrl)}`,
      parser: (data) => data?.data?.download
    },
    {
      url: `https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(videoUrl)}`,
      parser: (data) => data?.result?.download?.url
    },
    {
      url: `https://api.botcahx.biz.id/api/dowloader/yt?url=${encodeURIComponent(videoUrl)}&apikey=Admin`,
      parser: (data) => data?.result?.mp4
    },
    {
      url: `https://api.lolhuman.xyz/api/ytvideo?apikey=GataDios&url=${encodeURIComponent(videoUrl)}`,
      parser: (data) => data?.result?.link
    },
    {
      url: `https://api.ryzendesu.vip/api/downloader/ytmp4?url=${encodeURIComponent(videoUrl)}`,
      parser: (data) => data?.url
    }
  ];
  
  for (let i = 0; i < apis.length; i++) {
    try {
      console.log(`Probando API de video ${i + 1}: ${apis[i].url}`);
      
      const response = await fetch(apis[i].url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 15000
      });
      
      if (!response.ok) {
        console.log(`API ${i + 1} responded with status: ${response.status}`);
        continue;
      }
      
      const apiJson = await response.json();
      console.log(`API ${i + 1} response:`, JSON.stringify(apiJson, null, 2));
      
      const videoUrlResult = apis[i].parser(apiJson);
      
      if (videoUrlResult && isValidUrl(videoUrlResult)) {
        console.log(`✓ API ${i + 1} devolvió URL válida: ${videoUrlResult}`);
        return videoUrlResult;
      } else {
        console.log(`✗ API ${i + 1} no devolvió URL válida:`, videoUrlResult);
      }
      
    } catch (error) {
      console.error(`✗ API ${i + 1} falló:`, error.message);
    }
  }
  
  console.log("Todas las APIs de video fallaron");
  return null;
}

handler.before = async (m, { conn }) => {
  if (!/^[1-4]$/.test(m.text)) return false;
  
  const user = global.db.data.users[m.sender];
  if (!user || !user.lastYTSearch) return false;
  
  console.log(`Received option: ${m.text} from user ${m.sender}`);
  console.log(`User has active search: ${user.lastYTSearch.title}`);
  
  const currentTime = Date.now();
  const searchTime = user.lastYTSearch.timestamp || 0;
  
  if (currentTime - searchTime > 10 * 60 * 1000) {
    console.log("Search expired");
    return false; 
  }
  
  const option = parseInt(m.text);
  if (isNaN(option) || option < 1 || option > 4) return false;
  
  console.log(`Processing option ${option} for ${user.lastYTSearch.title}`);

  user.cebollinesDeducted = false;

  await processDownload(
    conn, 
    m, 
    user.lastYTSearch.url, 
    user.lastYTSearch.title, 
    option
  );

  user.lastYTSearch = null;
  
  return true;
};

function formatViews(views) {
  if (views === undefined) {
    return "No disponible";
  }

  try {
    if (views >= 1_000_000_000) {
      return `${(views / 1_000_000_000).toFixed(1)}B`;
    } else if (views >= 1_000_000) {
      return `${(views / 1_000_000).toFixed(1)}M`;
    } else if (views >= 1_000) {
      return `${(views / 1_000).toFixed(1)}k`;
    }
    return views.toLocaleString();
  } catch (e) {
    return String(views);
  }
}

handler.command = handler.help = ['play'];
handler.tags = ['downloader'];

export default handler;
