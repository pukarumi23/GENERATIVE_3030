import yts from 'yt-search'
import fetch from 'node-fetch'
import { getBuffer } from '../../lib/message.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isYTUrl = (url) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i.test(url)

async function validateDownloadUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

async function getVideoInfo(query, videoMatch) {
  const search = await yts(query)
  if (!search.all.length) return null
  const videoInfo = videoMatch ? search.videos.find(v => v.videoId === videoMatch[1]) || search.all[0] : search.all[0]
  if (!videoInfo) {
    console.error('No se encontró el video');
    throw new Error('No se encontró el video');
  }
  return videoInfo
}

async function getAudioDownload(url) {
  console.log('🚀 Iniciando descarga de audio con API confiable...');
  
  let lastError = null;
  
  
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`🔄 Intentando API: Ootaizumi (intento ${attempt}/2)`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const endpoint = `${global.APIs.ootaizumi.url}/downloader/youtube/play?query=${encodeURIComponent(url)}`;
      const res = await fetch(endpoint, { signal: controller.signal }).then(r => r.json());
      clearTimeout(timeout);
      const link = res.result?.download;
      if (link) {
        const isValid = await validateDownloadUrl(link);
        if (isValid) {
          console.log('✅ API Ootaizumi funcionó');
          return { downloadUrl: link, api: 'Ootaizumi' };
        }
        console.log('⚠️ API Ootaizumi devolvió enlace inválido');
      }
    } catch (e) {
      lastError = e.message;
      console.log(`❌ API Ootaizumi (intento ${attempt}):`, e.message);
      if (attempt < 2) {
        console.log('⏳ Esperando antes de reintentar...');
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  console.log('🔄 Intentando API de Alya como respaldo...');
  try {
    const API_KEY = 'DEPOOL-key60015';
    const endpoint = `https://rest.alyabotpe.xyz/dl/ytmp3?url=${encodeURIComponent(url)}&key=${API_KEY}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000);
    
    const response = await fetch(endpoint, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.status && data.data?.dl) {
        console.log('✅ API Alya funcionó');
        return {
          downloadUrl: data.data.dl,
          title: data.data.title,
          author: data.data.author,
          quality: data.data.quality || 'mp3'
        };
      }
    }
  } catch (error) {
    lastError = error.message;
    console.log(`❌ API Alya falló:`, error.message);
  }
  
  throw new Error(`No se pudo obtener el audio después de reintentos: ${lastError}`);
}

async function getVideoDownload(url, quality = '360') {
  console.log('🚀 Iniciando descarga de video con API confiable...');
  
  let lastError = null;
  
  
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`🔄 Intentando API: Ootaizumi (intento ${attempt}/2)`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const endpoint = `${global.APIs.ootaizumi.url}/downloader/youtube/play?query=${encodeURIComponent(url)}`;
      const res = await fetch(endpoint, { signal: controller.signal }).then(r => r.json());
      clearTimeout(timeout);
      const link = res.result?.download;
      if (link) {
        const isValid = await validateDownloadUrl(link);
        if (isValid) {
          console.log('✅ API Ootaizumi funcionó');
          return { downloadUrl: link, api: 'Ootaizumi' };
        }
        console.log('⚠️ API Ootaizumi devolvió enlace inválido');
      }
    } catch (e) {
      lastError = e.message;
      console.log(`❌ API Ootaizumi (intento ${attempt}):`, e.message);
      if (attempt < 2) {
        console.log('⏳ Esperando antes de reintentar...');
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  console.log('🔄 Intentando API de Alya como respaldo...');
  try {
    const API_KEY = 'DEPOOL-key60015';
    const endpoint = `https://rest.alyabotpe.xyz/dl/ytmp4?url=${encodeURIComponent(url)}&quality=${quality}&key=${API_KEY}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000);
    
    const response = await fetch(endpoint, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.status && data.data?.dl) {
        console.log('✅ API Alya funcionó');
        return {
          downloadUrl: data.data.dl,
          title: data.data.title,
          author: data.data.author,
          quality: data.data.quality || quality
        };
      }
    }
  } catch (error) {
    lastError = error.message;
    console.log(`❌ API Alya falló:`, error.message);
  }
  
  throw new Error(`No se pudo obtener el video después de reintentos: ${lastError}`);
}


export async function processYouTubeButton(conn, m) {
  const buttonId = m.body || m.text;
  
  if (!buttonId || !(
    buttonId.includes('youtube_audio_') || 
    buttonId.includes('youtube_video_360_') || 
    buttonId.includes('youtube_video_doc_') || 
    buttonId.includes('youtube_audio_doc_')
  )) {
    return false;
  }
  
  
  let option = null;
  if (buttonId.includes('youtube_audio_') && !buttonId.includes('_doc')) {
    option = 1; 
  } else if (buttonId.includes('youtube_video_360_')) {
    option = 2; 
  } else if (buttonId.includes('youtube_video_doc_')) {
    option = 3; 
  } else if (buttonId.includes('youtube_audio_doc_')) {
    option = 4; 
  }
  
  if (!option) {
    return false;
  }
  
  
  const user = global.db.data.users[m.sender];
  if (!user || !user.lastYTSearch) {
    await conn.reply(m.chat, '⏰ No hay búsqueda activa. Realiza una nueva búsqueda.', m);
    return false;
  }
  
  
  const currentTime = Date.now();
  const searchTime = user.lastYTSearch.timestamp || 0;
  
  if (currentTime - searchTime > 10 * 60 * 1000) {
    await conn.reply(m.chat, '⏰ La búsqueda ha expirado. Por favor realiza una nueva búsqueda.', m);
    return false; 
  }
  
 
  user.monedaDeducted = false;
  
  try {
    const videoInfo = user.lastYTSearch.videoInfo;
    const fileName = videoInfo.title.replace(/[^\w\s]/gi, '').substring(0, 50);
    
    console.log(`🎵 Iniciando descarga - Opción: ${option}, Video: ${videoInfo.title}`);
    
    
    const downloadTypes = {
      1: '🎵 Audio MP3',
      2: '🎬 Video 360p', 
      3: '📁 Documento MP4',
      4: '📄 Documento MP3'
    };
    
    const downloadType = downloadTypes[option] || 'archivo';
    await conn.reply(m.chat, `💙 Obteniendo ${downloadType}...`, m);
    
    
    let downloadData;
    
    switch (option) {
      case 1: 
      case 4: 
        console.log(`🎵 Descargando audio desde: ${videoInfo.url}`);
        downloadData = await getAudioDownload(videoInfo.url);
        break;
      case 2: 
      case 3: 
        console.log(`🎬 Descargando video desde: ${videoInfo.url}`);
        downloadData = await getVideoDownload(videoInfo.url, '360');
        break;
    }
    
    if (!downloadData) {
      throw new Error('No se pudo obtener el enlace de descarga');
    }
    
   
    console.log(`📁 URL de descarga: ${downloadData.downloadUrl}`);
    
   
    const tempFilePath = await downloadFile(downloadData.downloadUrl, `${Date.now()}_${fileName}.${option === 1 || option === 4 ? 'mp3' : 'mp4'}`);
    
    console.log(`📁 Archivo descargado en: ${tempFilePath}`);
    
  
    
    
    switch (option) {
      case 1: 
        console.log(`🎵 Enviando audio MP3`);
        await conn.sendMessage(m.chat, {
          audio: fs.readFileSync(tempFilePath),
          mimetype: 'audio/mpeg',
          fileName: fileName + '.mp3',
          ptt: false
        }, { quoted: m });
        break;
        
      case 2: 
        console.log(`🎬 Enviando video MP4`);
        await conn.sendMessage(m.chat, {
          video: fs.readFileSync(tempFilePath),
          mimetype: 'video/mp4',
          fileName: fileName + '.mp4',
          caption: `🎬 ${videoInfo.title}` 
        }, { quoted: m });
        break;
        
      case 3: 
        console.log(`📁 Enviando documento MP4`);
        await conn.sendMessage(m.chat, {
          document: { url: tempFilePath },
          mimetype: 'video/mp4',
          fileName: fileName + '.mp4',
          caption: `📁 ${videoInfo.title}` 
        }, { quoted: m });
        break;
        
      case 4: 
        console.log(`📄 Enviando documento MP3`);
        await conn.sendMessage(m.chat, {
          document: { url: tempFilePath },
          mimetype: 'audio/mpeg',
          fileName: fileName + '.mp3',
          caption: `📄 ${videoInfo.title}` 
        }, { quoted: m });
        break;
    }
    
    
    const userObj = global.getUser ? global.getUser(m.sender) : global.db.data.users[m.sender];
    if (userObj && !userObj.monedaDeducted) {
      userObj.moneda = (userObj.moneda || 0) - 5;
      userObj.monedaDeducted = true;
      conn.reply(m.chat, `💙 Has utilizado 🌱 5 *Cebollines*`, m);
    }
    
    
    try {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        console.log(`🧹 Archivo temporal eliminado: ${tempFilePath}`);
      }
    } catch (cleanupError) {
      console.error('❌ Error eliminando archivo temporal:', cleanupError);
    }
    
    user.lastYTSearch = null;
    return true;
    
  } catch (error) {
    console.error(`❌ Error en descarga:`, error.message);
    await conn.reply(m.chat, `💙 Error al procesar la descarga: ${error.message}`, m);
    return false;
  }
}

async function downloadFile(url, filename) {
  const tempDir = path.join(__dirname, '../tmp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const tempFilePath = path.join(tempDir, filename);
  
  try {
    console.log(`🚀 Descargando: ${filename}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive'
      },
      timeout: 25000 
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const fileStream = fs.createWriteStream(tempFilePath);
    response.body.pipe(fileStream);
    
    return new Promise((resolve, reject) => {
      fileStream.on('finish', () => {
        console.log(`✅ Descarga completada`);
        resolve(tempFilePath);
      });
      fileStream.on('error', reject);
    });
  } catch (error) {
    console.error(`❌ Error en descarga:`, error.message);
    throw error;
  }
}

function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🧹 Archivo eliminado: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error eliminando archivo:`, error.message);
  }
}

function extractYouTubeId(url) {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9\-\_]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9\-\_]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9\-\_]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function formatViews(views) {
  if (views === undefined || views === null) {
    return "No disponible";
  }

  try {
    const numViews = parseInt(views);
    if (numViews >= 1_000_000_000) {
      return `${(numViews / 1_000_000_000).toFixed(1)}B`;
    } else if (numViews >= 1_000_000) {
      return `${(numViews / 1_000_000).toFixed(1)}M`;
    } else if (numViews >= 1_000) {
      return `${(numViews / 1_000).toFixed(1)}k`;
    }
    return numViews.toLocaleString();
  } catch (e) {
    return String(views);
  }
}

export async function processDownload(conn, m, videoInfo, option) {
  const downloadTypes = {
    1: '🎵 Audio MP3',
    2: '🎬 Video 360p', 
    3: '📁 Documento MP4',
    4: '📁 Documento MP3'
  };
  
  const downloadType = downloadTypes[option] || 'archivo';
  console.log(`💙 Enviando mensaje: Obteniendo ${downloadType}...`);
  await conn.reply(m.chat, `💙 Obteniendo ${downloadType}...`, m);
  
  console.log(`🎵 Iniciando descarga - Opción: ${option}, Video: ${videoInfo.title}`);
  console.log(`📁 URL del video: ${videoInfo.url}`);
  
  let tempFilePath = null;
  
  try {
    let downloadData;
    let fileName = videoInfo.title.replace(/[^\w\s]/gi, '').substring(0, 50);
    
    console.log(`🔍 Obteniendo datos de descarga para opción ${option}`);
    
    switch (option) {
      case 1: 
      case 4: 
        console.log(`🎵 Descargando audio desde: ${videoInfo.url}`);
        downloadData = await getAudioDownload(videoInfo.url);
        break;
      case 2: 
      case 3: 
        console.log(`🎬 Descargando video desde: ${videoInfo.url}`);
        downloadData = await getVideoDownload(videoInfo.url, '360');
        break;
    }
    
    if (!downloadData) {
      console.error('❌ No se obtuvo downloadData');
      throw new Error('No se pudo obtener el enlace de descarga');
    }
    
    console.log(`📁 URL de descarga: ${downloadData.downloadUrl}`);
    
    tempFilePath = await downloadFile(downloadData.downloadUrl, `${Date.now()}_${fileName}.${option === 1 || option === 4 ? 'mp3' : 'mp4'}`);
    
    console.log(`📁 Archivo descargado en: ${tempFilePath}`);
    
    switch (option) {
      case 1: 
        console.log(`🎵 Enviando audio MP3 - Archivo: ${tempFilePath}`);
        try {
          await conn.sendMessage(m.chat, {
            audio: fs.readFileSync(tempFilePath),
            mimetype: 'audio/mpeg',
            fileName: fileName + '.mp3',
            ptt: false
          }, { quoted: m });
          console.log(`✅ Audio MP3 enviado exitosamente`);
        } catch (sendError) {
          console.error(`❌ Error enviando audio MP3:`, sendError);
          throw sendError;
        }
        break;
        
      case 2: 
        console.log(`🎬 Enviando video MP4 - Archivo: ${tempFilePath}`);
        try {
          await conn.sendMessage(m.chat, {
            video: fs.readFileSync(tempFilePath),
            mimetype: 'video/mp4',
            fileName: fileName + '.mp4',
            caption: `🎬 ${videoInfo.title}` 
          }, { quoted: m });
          console.log(`✅ Video MP4 enviado exitosamente`);
        } catch (sendError) {
          console.error(`❌ Error enviando video MP4:`, sendError);
          throw sendError;
        }
        break;
        
      case 3: 
        console.log(`📁 Enviando documento MP4 - Archivo: ${tempFilePath}`);
        try {
          await conn.sendMessage(m.chat, {
            document: { url: tempFilePath },
            mimetype: 'video/mp4',
            fileName: fileName + '.mp4',
            caption: `📁 ${videoInfo.title}` 
          }, { quoted: m });
          console.log(`✅ Documento MP4 enviado exitosamente`);
        } catch (sendError) {
          console.error(`❌ Error enviando documento MP4:`, sendError);
          throw sendError;
        }
        break;
        
      case 4: 
        console.log(`📄 Enviando documento MP3 - Archivo: ${tempFilePath}`);
        try {
          await conn.sendMessage(m.chat, {
            document: { url: tempFilePath },
            mimetype: 'audio/mpeg',
            fileName: fileName + '.mp3',
            caption: `📄 ${videoInfo.title}` 
          }, { quoted: m });
          console.log(`✅ Documento MP3 enviado exitosamente`);
        } catch (sendError) {
          console.error(`❌ Error enviando documento MP3:`, sendError);
          throw sendError;
        }
        break;
    }
    
    const user = global.getUser ? global.getUser(m.sender) : global.db.data.users[m.sender];
    if (user && !user.monedaDeducted) {
      user.moneda = (user.moneda || 0) - 5;
      user.monedaDeducted = true;
      conn.reply(m.chat, `💙 Has utilizado 🌱 5 *Cebollines*`, m, global.miku);
    }
    
    return true;
  } catch (error) {
    console.error("❌ Error en processDownload:", error);
    await conn.reply(m.chat, `💙 Error: ${error.message}`, m);
    return false;
  } finally {
    if (tempFilePath) {
      deleteFile(tempFilePath);
    }
  }
}

export default {
  command: ['play', 'ytdlv2'],
  category: 'downloader',
  register: true,
  run: async (conn, m, args, usedPrefix, command) => {
    try {
      const buttonId = m.body || m.text;
      if (buttonId && (buttonId.includes('youtube_audio_') || buttonId.includes('youtube_video_360_') || buttonId.includes('youtube_video_doc_') || buttonId.includes('youtube_audio_doc_'))) {
        console.log('🚀 Botón detectado en run function:', buttonId);
        
        let option = null;
        if (buttonId.includes('youtube_audio_') && !buttonId.includes('_doc')) {
          option = 1; 
        } else if (buttonId.includes('youtube_video_360_')) {
          option = 2; 
        } else if (buttonId.includes('youtube_video_doc_')) {
          option = 3; 
        } else if (buttonId.includes('youtube_audio_doc_')) {
          option = 4; 
        }
        
        if (option) {
          console.log(`✅ Opción determinada en run: ${option}`);
          
          const user = global.db.data.users[m.sender];
          if (user && user.lastYTSearch) {
            const currentTime = Date.now();
            const searchTime = user.lastYTSearch.timestamp || 0;
            
            if (currentTime - searchTime <= 10 * 60 * 1000) {
              console.log('🚀 Procesando descarga desde run function...');
              user.monedaDeducted = false;
              
              try {
                await processDownload(conn, m, user.lastYTSearch.videoInfo, option);
                user.lastYTSearch = null;
                console.log('✅ Descarga completada desde run function');
                return;
              } catch (error) {
                console.error(`❌ Error en descarga desde run:`, error.message);
                await conn.reply(m.chat, `💙 Error al procesar la descarga: ${error.message}`, m);
                return;
              }
            } else {
              await conn.reply(m.chat, '⏰ La búsqueda ha expirado. Por favor realiza una nueva búsqueda.', m);
              return;
            }
          } else {
            await conn.reply(m.chat, '⏰ No hay búsqueda activa. Realiza una nueva búsqueda.', m);
            return;
          }
        }
      }
      
      const text = args.join(' ');
      if (!text.trim()) {
        return conn.reply(m.chat, `💙HATSUNE MIKU💙\n\n💙 Ingresa el nombre de la música o URL de YouTube a descargar.\n\nEjemplo: ${usedPrefix}${command} Let you Down Cyberpunk`, m);
      }

      let videoInfo;
      let url = '';

      if (text.includes('youtube.com') || text.includes('youtu.be')) {
        url = text;
        const videoId = extractYouTubeId(url);
        if (!videoId) {
          return m.reply('URL de YouTube inválida');
        }

        const search = await yts(videoId);
        if (search.all && search.all.length > 0) {
          const video = search.all.find(v => v.videoId === videoId);
          if (video) {
            videoInfo = {
              title: video.title,
              thumbnail: video.thumbnail,
              duration: video.duration,
              views: video.views,
              ago: video.ago,
              author: video.author,
              url: video.url,
              videoId: video.videoId
            };
          }
        }
      } else {
        const search = await yts(text);
        if (!search.all || search.all.length === 0) {
          return m.reply('No se encontraron resultados para tu búsqueda.');
        }
        videoInfo = search.all[0];
        url = videoInfo.url;
      }

      if (!videoInfo) {
        return m.reply('No se pudo obtener información del video.');
      }

      if (!url) {
        return m.reply('No se pudo obtener la URL del video.');
      }

      const vistas = formatViews(videoInfo.views);
      const canal = videoInfo.author?.name || 'Desconocido';
      
      const buttons = [
        ['🎵 Audio', `youtube_audio_${videoInfo.videoId}`],
        ['🎬 Video 360p', `youtube_video_360_${videoInfo.videoId}`],
        ['📁 Documento MP4', `youtube_video_doc_${videoInfo.videoId}`],
        ['📄 Documento MP3', `youtube_audio_doc_${videoInfo.videoId}`]
      ];
      
      const infoText = `*𖹭.╭╭ִ╼࣪━ִﮩ٨ـﮩ💙𝗠𝗶𝗸𝘂𝗺𝗶𝗻🌱ﮩ٨ـﮩ━ִ╾࣪╮╮.𖹭*

> 💙 *Título:* ${videoInfo.title}
*°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°*
> 🌱 *Duración:* ${videoInfo.duration}
*°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°*
> 💙 *Vistas:* ${vistas}
*°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°*
> 🌱 *Canal:* ${canal}
*°.⎯⃘̶⎯̸⎯ܴ⎯̶᳞͇ࠝ⎯⃘̶⎯̸.°*
> 💙 *Publicado:* ${videoInfo.ago}
*⏝ּׅ︣︢ۛ۫۫ۜ⏝ּׅ︣︢ۛ۫۫۫ۜ⏝ּׅ︣ׄۛ۫۫۫۫ۜ⏝ּׅ︣ׄۛ۫۫۫۫ۜ⏝ּׅ︣ׄۛ۫۫۫۫ۜ*

💌 *Selecciona el formato para descargar:*`;

      const footer = '🌱 Hatsune Miku Bot - YouTube';

      try {
        const thumb = videoInfo.thumbnail ? videoInfo.thumbnail : null;
        
        console.log(`🖼️ Miniatura obtenida: ${thumb ? 'Sí' : 'No'}`);
        
        await conn.sendButton(m.chat, infoText, footer, thumb, buttons, null, null, m);
      } catch (thumbError) {
        console.error("❌ Error obteniendo miniatura:", thumbError);
        
        await conn.sendButton(m.chat, infoText, footer, null, buttons, null, null, m);
      }
        
      const usr = global.getUser ? global.getUser(m.sender) : (global.db.data.users[m.sender] = global.db.data.users[m.sender] || {})
      
      usr.lastYTSearch = {
        url,
        title: videoInfo.title,
        videoId: videoInfo.videoId,
        messageId: m.key.id,
        timestamp: Date.now(),
        videoInfo: {
          title: videoInfo.title,
          thumbnail: videoInfo.thumbnail,
          duration: videoInfo.duration,
          views: videoInfo.views,
          ago: videoInfo.ago,
          author: videoInfo.author,
          url: videoInfo.url,
          videoId: videoInfo.videoId
        }
      };
      
      console.log(`💾 Guardada búsqueda: ${videoInfo.title}`);

    } catch (error) {
      console.error("Error completo:", error);
      return m.reply(`💙 Ocurrió un error: ${error.message || 'Desconocido'}`);
    }
  },

  before: async (m, { conn }) => {
    try {
      const processed = await processYouTubeButton(conn, m);
      if (processed) {
        return true;
      }
    } catch (error) {
      console.error(`❌ Error en before (play.js):`, error.message);
      return false;
    }
    return false;
  }
}
