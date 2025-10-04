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
      return conn.reply(m.chat, `💙 Ingresa el nombre de la música a descargar.\n\nEjemplo: ${usedPrefix}${command} Let you Down Cyberpunk`, m, rcanal);
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
    
    
    const buttons = [
      { buttonId: `YTDL_AUDIO_${Date.now()}`, buttonText: { displayText: '� Audio MP3' }, type: 1 },
      { buttonId: `YTDL_VIDEO_${Date.now()}`, buttonText: { displayText: '🎬 Video MP4' }, type: 1 },
      { buttonId: `YTDL_AUDIODOC_${Date.now()}`, buttonText: { displayText: '📁 Audio Documento' }, type: 1 },
      { buttonId: `YTDL_VIDEODOC_${Date.now()}`, buttonText: { displayText: '📁 Video Documento' }, type: 1 }
    ];
    
    const infoText = `*𖹭.╭╭ִ╼࣪━ִﮩ٨ـﮩ💙𝗠𝗶𝗸𝘂𝗺𝗶𝗻🌱ﮩ٨ـﮩ━ִ╾࣪╮╮.𖹭*

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

💌 *Selecciona el formato para descargar:*`;

    const footer = '🌱 Hatsune Miku Bot - YouTube';

    try {
      const thumb = thumbnail ? (await conn.getFile(thumbnail))?.data : null;

      
      const buttonMessage = {
        text: infoText,
        footer: footer,
        buttons: buttons,
        headerType: 4,
        ...(thumb && { image: thumb })
      };
      await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
      
      
      if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
      }
      
      global.db.data.users[m.sender].lastYTSearch = {
        url: url,
        title: title,
        messageId: m.key.id,  
        timestamp: Date.now(),
        videoInfo: {
          duration: timestamp,
          views: vistas,
          channel: canal,
          published: ago
        }
      };
      
      
      global.db.data.users[m.sender].processingDownload = false;
      global.db.data.users[m.sender].monedaDeducted = false;
      
    } catch (thumbError) {
      
      const buttonMessage = {
        text: infoText,
        footer: footer,
        buttons: buttons,
        headerType: 1
      };
      await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
      
      
      if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = {};
      }
      
      global.db.data.users[m.sender].lastYTSearch = {
        url: url,
        title: title,
        messageId: m.key.id,  
        timestamp: Date.now(),
        videoInfo: {
          duration: timestamp,
          views: vistas,
          channel: canal,
          published: ago
        }
      };
      
      
      global.db.data.users[m.sender].processingDownload = false;
      global.db.data.users[m.sender].monedaDeducted = false;
      
      console.error("Error al obtener la miniatura:", thumbError);
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




async function validateDownloadUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    console.log('❌ URL inválida o vacía');
    return false;
  }

  try {
    
    new URL(url);
    
    console.log(`🔍 Validating download URL: ${url.substring(0, 100)}...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); 
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    clearTimeout(timeoutId);
    
    const isValid = response.ok && 
                   response.status >= 200 && 
                   response.status < 400 &&
                   response.status !== 404 &&
                   response.status !== 403;
    
    const contentType = response.headers.get('content-type') || '';
    const contentLength = response.headers.get('content-length');
    
    
    const isMediaFile = contentType.includes('video') || 
                       contentType.includes('audio') || 
                       contentType.includes('application/octet-stream') ||
                       contentType.includes('binary') ||
                       url.includes('.mp4') || 
                       url.includes('.mp3') || 
                       url.includes('.m4a');
    
    if (isValid && isMediaFile) {
      console.log(`✅ URL validation status: ${response.status} - Tipo: ${contentType} - Tamaño: ${contentLength || 'desconocido'}`);
      return true;
    } else {
      console.log(`❌ URL no válida - Status: ${response.status}, Tipo: ${contentType}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ URL validation failed: ${error.message}`);
    return false;
  }
}


async function processDownload(conn, m, url, title, option) {
 
  const downloadTypes = {
    1: '🎵 Audio MP3',
    2: '🎬 Video MP4', 
    3: '📁 Audio MP3 (Documento)',
    4: '📁 Video MP4 (Documento)'
  };
  
  const downloadType = downloadTypes[option] || 'archivo';
  
  
  let processingMsg;
  try {
    processingMsg = await conn.reply(m.chat, `💙 Descargando ${downloadType}... ⚡\n\n⏳ Por favor espera...`, m);
  } catch (error) {
    console.log('No se pudo enviar mensaje de procesamiento');
  }
  
  try {
    let downloadUrl;
    let fileName;
    let mimeType;
    let isAudio = (option === 1 || option === 3);

  
    const cleanTitle = title.replace(/[^\w\s\-_.()]/gi, '').replace(/\s+/g, ' ').trim();
    
    if (isAudio) {
      
      downloadUrl = await getAudioUrl(url);
      fileName = `${cleanTitle}.mp3`;
      mimeType = 'audio/mpeg';
      
      if (!downloadUrl) {
        throw new Error(`No se pudo obtener el enlace de audio. La canción podría no estar disponible.`);
      }

      
      const isValidDownload = await validateDownloadUrl(downloadUrl);
      if (!isValidDownload) {
        throw new Error(`El enlace de descarga no es válido o ha expirado.`);
      }

      
      if (option === 1) {
        
        await conn.sendMessage(m.chat, { 
          audio: { url: downloadUrl }, 
          fileName: fileName, 
          mimetype: mimeType,
          ptt: false
        }, { quoted: m });
      } else {
        
        await conn.sendMessage(m.chat, { 
          document: { url: downloadUrl },
          mimetype: mimeType,
          fileName: fileName,
          caption: `🎵 ${title}`
        }, { quoted: m });
      }
    } else {
      
      downloadUrl = await getVideoUrl(url);
      fileName = `${cleanTitle}.mp4`;
      mimeType = 'video/mp4';
      
      if (!downloadUrl) {
        throw new Error(`No se pudo obtener el enlace de video. El video podría no estar disponible.`);
      }

      
      const isValidDownload = await validateDownloadUrl(downloadUrl);
      if (!isValidDownload) {
        throw new Error(`El enlace de descarga no es válido o ha expirado.`);
      }

      
      if (option === 2) {
        
        await conn.sendMessage(m.chat, { 
          video: { url: downloadUrl }, 
          fileName: fileName, 
          mimetype: mimeType, 
          caption: `🎬 ${title}`
        }, { quoted: m });
      } else {
        
        await conn.sendMessage(m.chat, { 
          document: { url: downloadUrl },
          mimetype: mimeType,
          fileName: fileName,
          caption: `🎬 ${title}`
        }, { quoted: m });
      }
    }
    
    
    const user = global.db.data.users[m.sender];
    if (user && !user.monedaDeducted) {
      
      if ((user.moneda || 0) >= 2) {
        user.moneda = (user.moneda || 0) - 2;
        user.monedaDeducted = true;
        
        try {
          await conn.reply(m.chat, `✅ ${downloadType} descargado exitosamente!\n💰 Se descontaron 2 Cebollines 🌱\n💰 Cebollines restantes: ${user.moneda}`, m);
        } catch (error) {
          console.log('No se pudo enviar mensaje de confirmación');
        }
      } else {
        user.monedaDeducted = true;
        try {
          await conn.reply(m.chat, `✅ ${downloadType} descargado exitosamente!\n⚠️ No tienes suficientes Cebollines. Consigue más con otros comandos.`, m);
        } catch (error) {
          console.log('No se pudo enviar mensaje de confirmación');
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error al procesar descarga:", error);
    
    
    let errorMessage = `❌ Error al descargar ${downloadType}:\n\n`;
    
    if (error.message.includes('obtener el enlace')) {
      errorMessage += `• El contenido no está disponible para descarga\n• Intenta con otro video o canción`;
    } else if (error.message.includes('no es válido')) {
      errorMessage += `• El enlace de descarga ha expirado\n• Intenta realizar una nueva búsqueda`;
    } else if (error.message.includes('network') || error.message.includes('timeout')) {
      errorMessage += `• Problema de conexión\n• Intenta de nuevo en unos momentos`;
    } else {
      errorMessage += `• ${error.message}\n• Intenta con otro formato de descarga`;
    }
    
    try {
      await conn.reply(m.chat, errorMessage, m);
    } catch (replyError) {
      console.error('No se pudo enviar mensaje de error:', replyError);
    }
    
    return false;
  }
}

async function fetchFromApis(apis) {
  for (let i = 0; i < apis.length; i++) {
    try {
      console.log(`🔍 Probando ${apis[i].api}`);
      
      const fetchOptions = {
        method: apis[i].method || 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...apis[i].headers
        },
        timeout: 3000 
      };
      
      if (apis[i].body) {
        fetchOptions.body = apis[i].body;
      }
      
      const response = await fetch(apis[i].endpoint, fetchOptions);
      
      if (!response.ok) {
        console.log(`${apis[i].api} responded with status: ${response.status}`);
        continue;
      }
      
      const apiJson = await response.json();
      
      const downloadUrl = apis[i].extractor(apiJson);
        
      
      const trustedDomains = [
        'savemedia.website',
        'stellarwa.xyz', 
        'da.gd',
        'api.zenzxz.my.id',
        'delirius-apiofc.vercel.app'
      ];
      
      const isTrustedDomain = downloadUrl && trustedDomains.some(domain => 
        downloadUrl.includes(domain)
      );
      
      if (downloadUrl && isValidUrl(downloadUrl)) {
        if (isTrustedDomain) {
          console.log(`✅ ${apis[i].api} - Dominio confiable, omitiendo validación`);
          return downloadUrl;
        }
        
       
        const isWorking = await validateDownloadUrl(downloadUrl);
        if (isWorking) {
          console.log(`✅ ${apis[i].api} devolvió URL válida: ${downloadUrl.substring(0, 50)}...`);
          return downloadUrl;
        } else {
          console.log(`❌ ${apis[i].api} URL no funciona`);
        }
      } else {
        console.log(`✗ ${apis[i].api} no devolvió URL válida`);
      }
      
    } catch (error) {
      console.error(`✗ ${apis[i].api} falló:`, error.message);
    }
  }
  
  console.log("Todas las APIs fallaron");
  return null;
}


async function getAud(url) {
  
  const apis = [
    { api: 'ZenzzXD', endpoint: `https://api.zenzxz.my.id/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.download_url },
    { api: 'Xyro', endpoint: `${global.APIs.xyro.url}/download/youtubemp3?url=${encodeURIComponent(url)}`, extractor: res => res.result?.dl },
{ api: 'Yupra', endpoint: `${global.APIs.yupra.url}/api/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.resultado?.enlace }
  ]
  return await fetchFromBackupApis(apis)
}

async function getVid(url) {
  
  const apis = [
    { api: 'Xyro', endpoint: `${global.APIs.xyro.url}/download/youtubemp4?url=${encodeURIComponent(url)}&quality=360`, extractor: res => res.result?.dl },
{ api: 'Yupra', endpoint: `${global.APIs.yupra.url}/api/downloader/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.resultado?.formatos?.[0]?.url }
  ]
  return await fetchFromBackupApis(apis)
}

async function fetchFromBackupApis(apis) {
  for (const { api, endpoint, extractor } of apis) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 2000)
      const res = await fetch(endpoint, { signal: controller.signal }).then(r => r.json())
      clearTimeout(timeout)
      const link = extractor(res)
      if (link) return { url: link, api }
    } catch (e) {}
    await new Promise(resolve => setTimeout(resolve, 50)) 
  }
  return null
}




async function getAudioUrl(url) {
  
  const defaultAPIs = {
    xyro: { url: 'https://api.xyro.com' },
    yupra: { url: 'https://api.yupra.com' },
    vreden: { url: 'https://api.vreden.com' },
    delirius: { url: 'https://delirius-apiofc.vercel.app' },
    zenzxz: { url: 'https://api.zenzxz.my.id' }
  };
  
  
  const APIs = global.APIs || defaultAPIs;
  
  const apis = [
    
    { api: 'StellarWA', endpoint: `https://api.stellarwa.xyz/dow/ytmp3?url=${encodeURIComponent(url)}&apikey=Diamond`, extractor: res => res?.data?.dl },
    
    
    ...(APIs.xyro?.url ? [{ api: 'Xyro', endpoint: `${APIs.xyro.url}/download/youtubemp3?url=${encodeURIComponent(url)}`, extractor: res => res.result?.dl }] : []),
    ...(APIs.yupra?.url ? [{ api: 'Yupra', endpoint: `${APIs.yupra.url}/api/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.resultado?.enlace }] : []),
    ...(APIs.vreden?.url ? [{ api: 'Vreden', endpoint: `${APIs.vreden.url}/api/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.result?.download?.url }] : []),
    ...(APIs.delirius?.url ? [{ api: 'Delirius', endpoint: `${APIs.delirius.url}/download/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download?.url }] : []),
    ...(APIs.zenzxz?.url ? [{ api: 'ZenzzXD', endpoint: `${APIs.zenzxz.url}/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.download_url }] : []),
    ...(APIs.zenzxz?.url ? [{ api: 'ZenzzXD v2', endpoint: `${APIs.zenzxz.url}/downloader/ytmp3v2?url=${encodeURIComponent(url)}`, extractor: res => res.download_url }] : []),
    
    
    { api: 'ZenzzXD Legacy', endpoint: `https://api.zenzxz.my.id/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.download_url }
  ];
  
  
  const result = await fetchFromApis(apis);
  if (result) return result;
  
  
  try {
    console.log('🔄 Trying backup ZenzzXD...');
    const backupResult = await getAud(url);
    if (backupResult && backupResult.url) {
      console.log(`✅ Backup API ${backupResult.api} succeeded`);
      return backupResult.url;
    }
  } catch (error) {
    console.error('❌ Backup API failed:', error.message);
  }
  
  return null;
}




async function getVideoUrl(url) {
  
  const defaultAPIs = {
    xyro: { url: 'https://api.xyro.com' },
    yupra: { url: 'https://api.yupra.com' },
    vreden: { url: 'https://api.vreden.com' },
    delirius: { url: 'https://delirius-apiofc.vercel.app' },
    zenzxz: { url: 'https://api.zenzxz.my.id' }
  };
  
  
  const APIs = global.APIs || defaultAPIs;
  
  const apis = [
    
    ...(APIs.xyro?.url ? [{ api: 'Xyro', endpoint: `${APIs.xyro.url}/download/youtubemp4?url=${encodeURIComponent(url)}&quality=360`, extractor: res => res.result?.dl }] : []),
    ...(APIs.yupra?.url ? [{ api: 'Yupra', endpoint: `${APIs.yupra.url}/api/downloader/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.resultado?.formatos?.[0]?.url }] : []),
    ...(APIs.vreden?.url ? [{ api: 'Vreden', endpoint: `${APIs.vreden.url}/api/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.result?.download?.url }] : []),
    ...(APIs.delirius?.url ? [{ api: 'Delirius', endpoint: `${APIs.delirius.url}/download/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download?.url }] : []),
    ...(APIs.zenzxz?.url ? [{ api: 'ZenzzXD', endpoint: `${APIs.zenzxz.url}/downloader/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.download_url }] : []),
    ...(APIs.zenzxz?.url ? [{ api: 'ZenzzXD v2', endpoint: `${APIs.zenzxz.url}/downloader/ytmp4v2?url=${encodeURIComponent(url)}`, extractor: res => res.download_url }] : []),
    
    
    { api: 'ZenzzXD Legacy', endpoint: `https://api.zenzxz.my.id/downloader/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.download_url },
    { api: 'Delirius Legacy', endpoint: `https://delirius-apiofc.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download?.url }
  ];
  
  
  const result = await fetchFromApis(apis);
  if (result) return result;
  

  try {
    console.log('🔄 Trying backup ZenzzXD...');
    const backupResult = await getVid(url);
    if (backupResult && backupResult.url) {
      console.log(`✅ Backup API ${backupResult.api} succeeded`);
      return backupResult.url;
    }
  } catch (error) {
    console.error('❌ Backup API failed:', error.message);
  }
  
  return null;
}




handler.before = async (m, { conn }) => {
  
  const ytdlPatterns = [
    /^YTDL_(AUDIO|VIDEO|AUDIODOC|VIDEODOC)_\d+$/,
    /^ytdl_(audio|video)_(mp3|mp4|doc)$/,
    /🎵.*Audio.*MP3/i,
    /🎬.*Video.*MP4/i,
    /📁.*Audio.*Documento/i,
    /📁.*Video.*Documento/i
  ];
  
  let isYTDLButton = false;
  let buttonType = null;
  
  
  for (const pattern of ytdlPatterns) {
    if (pattern.test(m.text)) {
      isYTDLButton = true;
      
     
      if (/YTDL_AUDIO_|ytdl_audio_mp3|🎵.*Audio.*MP3/i.test(m.text)) {
        buttonType = 'audio';
      } else if (/YTDL_VIDEO_|ytdl_video_mp4|🎬.*Video.*MP4/i.test(m.text)) {
        buttonType = 'video';
      } else if (/YTDL_AUDIODOC_|ytdl_audio_doc|📁.*Audio.*Documento/i.test(m.text)) {
        buttonType = 'audiodoc';
      } else if (/YTDL_VIDEODOC_|ytdl_video_doc|📁.*Video.*Documento/i.test(m.text)) {
        buttonType = 'videodoc';
      }
      break;
    }
  }
  
  
  if (!isYTDLButton || !buttonType) {
    return false;
  }
  
  
  const user = global.db.data.users[m.sender];
  if (!user || !user.lastYTSearch) {
    await conn.reply(m.chat, '❌ No hay búsqueda activa. Realiza una nueva búsqueda con .play', m);
    return false;
  }
  
  
  const currentTime = Date.now();
  const searchTime = user.lastYTSearch.timestamp || 0;
  
  if (currentTime - searchTime > 10 * 60 * 1000) {
    await conn.reply(m.chat, '⏰ La búsqueda ha expirado. Por favor realiza una nueva búsqueda.', m);
    delete user.lastYTSearch;
    return false;
  }
  
  
  if (user.processingDownload) {
    await conn.reply(m.chat, '⏳ Ya hay una descarga en proceso. Espera a que termine.', m);
    return false;
  }
  
  console.log(`🎵 Procesando descarga de: ${user.lastYTSearch.title} - Tipo: ${buttonType}`);
  
 
  const optionMap = {
    'audio': 1,     
    'video': 2,     
    'audiodoc': 3, 
    'videodoc': 4   
  };
  
  const option = optionMap[buttonType];
  if (!option) {
    await conn.reply(m.chat, '❌ Tipo de descarga no válido.', m);
    return false;
  }
  

  user.processingDownload = true;
  user.monedaDeducted = false;

  try {
    await processDownload(
      conn, 
      m, 
      user.lastYTSearch.url, 
      user.lastYTSearch.title, 
      option
    );
    
   
    delete user.lastYTSearch;
    user.processingDownload = false;
    
  } catch (error) {
    console.error(`❌ Error en descarga:`, error.message);
    user.processingDownload = false;
    await conn.reply(m.chat, `💙 Error al procesar la descarga: ${error.message}`, m);
  }
  
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
