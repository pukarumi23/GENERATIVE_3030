import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(m.chat, `🔶 Por favor, ingresa un enlace de TikTok.\n\n📝 *Ejemplo:* ${usedPrefix}${command} https://www.tiktok.com/@usuario/video/1234567890`, m);
    }

    const tiktokUrl = validateTikTokUrl(text);
    if (!tiktokUrl) {
        return conn.reply(m.chat, `❌ URL de TikTok inválida. Por favor verifica el enlace.\n\n✅ *Formatos válidos:*\n• https://www.tiktok.com/@usuario/video/...\n• https://vm.tiktok.com/...\n• https://vt.tiktok.com/...`, m);
    }

    await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

    try {
        await conn.reply(m.chat, `🌿 *Extrayendo audio del video TikTok...*\n\n⏳ Esto puede tomar unos segundos...`, m);
        
        const result = await downloadAudioFromMultipleAPIs(tiktokUrl);
        
        if (!result || !result.audioUrl) {
            await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            return conn.reply(m.chat, `❌ No se pudo extraer el audio del video.\n\n💡 *Posibles causas:*\n• El video es privado\n• No tiene audio original\n• Video eliminado\n• Restricciones regionales`, m);
        }

        const { audioUrl, title, author, thumbnail } = result;

        await conn.reply(m.chat, `✅ *Audio extraído exitosamente!*\n\n🎵 *Título:* ${title || 'Audio TikTok'}\n👤 *Autor:* ${author || 'Desconocido'}\n\n📤 Enviando archivo de audio...`, m);

        
        const audioMessage = {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            fileName: `${(title || 'tiktok_audio').replace(/[^\w\s]/gi, '').substring(0, 50)}.mp3`,
            ptt: false,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    mediaType: 2,
                    mediaUrl: tiktokUrl,
                    title: title || 'Audio de TikTok',
                    body: `👤 ${author || 'Autor desconocido'} | 🧡 Auralis Bot`,
                    sourceUrl: tiktokUrl,
                    thumbnail: thumbnail ? await getImageBuffer(thumbnail) : null
                }
            }
        };
        
        
        try {
            await conn.sendMessage(m.chat, audioMessage, { quoted: m });
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        } catch (audioError) {
            console.log('Error enviando audio, intentando como documento:', audioError);
            
            
            const docMessage = {
                document: { url: audioUrl },
                mimetype: 'audio/mpeg',
                fileName: `${(title || 'tiktok_audio').replace(/[^\w\s]/gi, '').substring(0, 50)}.mp3`,
                caption: `🎵 *Audio de TikTok*\n\n📝 *Título:* ${title || 'Audio TikTok'}\n👤 *Autor:* ${author || 'Desconocido'}\n\n🔶 *Descargado por Aralis Bot*`
            };
            
            await conn.sendMessage(m.chat, docMessage, { quoted: m });
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        }
        
    } catch (error) {
        console.error('Error en TikTok MP3:', error);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return conn.reply(m.chat, `❌ Error al procesar el audio: ${error.message}\n\n🔄 Intenta nuevamente en unos momentos.`, m);
    }
}

handler.help = ['tiktokmp3 *<url>*']
handler.tags = ['dl']
handler.command = ['tiktokmp3', 'ttmp3', 'tiktokmusic', 'ttmusic']
handler.group = true
handler.register = true
handler.coin = 2

export default handler


function validateTikTokUrl(url) {
    try {
        url = url.trim().replace(/[^\x00-\x7F]/g, "");
        
        const patterns = [
            /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([^\/]+)\/video\/(\d+)/,
            /(?:https?:\/\/)?vm\.tiktok\.com\/([A-Za-z0-9]+)/,
            /(?:https?:\/\/)?vt\.tiktok\.com\/([A-Za-z0-9]+)/,
            /(?:https?:\/\/)?m\.tiktok\.com\/v\/(\d+)/,
            /(?:https?:\/\/)?www\.tiktok\.com\/t\/([A-Za-z0-9]+)/,
            /(?:https?:\/\/)?www\.tiktok\.com\/.*\/video\/(\d+)/
        ];
        
        for (const pattern of patterns) {
            if (pattern.test(url)) {
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                return url;
            }
        }
        
        return null;
    } catch (error) {
        return null;
    }
}


async function downloadAudioFromMultipleAPIs(url) {
    const apis = [
        {
            name: 'TikWM',
            func: () => tiktokAudioTikWM(url)
        },
        {
            name: 'TiklyDown',
            func: () => tiktokAudioTiklyDown(url)
        },
        {
            name: 'DouyinWTF',
            func: () => tiktokAudioDouyin(url)
        },
        {
            name: 'LiveSave',
            func: () => tiktokAudioLiveSave(url)
        },
        {
            name: 'TikWM-Alt',
            func: () => tiktokAudioTikWMAlt(url)
        }
    ];
    
    for (const api of apis) {
        try {
            console.log(`🔍 Probando ${api.name}...`);
            const result = await api.func();
            
            if (result && result.audioUrl && result.audioUrl.startsWith('http')) {
                console.log(`✅ ${api.name} exitoso!`);
                return result;
            } else {
                console.log(`❌ ${api.name} no retornó URL válida`);
            }
        } catch (error) {
            console.log(`❌ ${api.name} falló: ${error.message}`);
            continue;
        }
    }
    
    console.log('❌ Todas las APIs fallaron');
    return null;
}


async function tiktokAudioTikWM(url) {
    try {
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 25000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 0 && data.data) {
            let audioUrl = data.data.music || data.data.music_info?.url;
            
            if (audioUrl && audioUrl.startsWith('http')) {
                return {
                    audioUrl: audioUrl,
                    title: data.data.title || 'Audio TikTok',
                    author: data.data.author?.unique_id || data.data.author?.nickname || 'Desconocido',
                    thumbnail: data.data.cover || data.data.origin_cover
                };
            }
        }
        
        throw new Error('Sin URL de audio válida');
    } catch (error) {
        throw new Error(`TikWM: ${error.message}`);
    }
}


async function tiktokAudioTiklyDown(url) {
    try {
        const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 25000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status && data.audio) {
            let audioUrl = data.audio.url || data.audio;
            
            if (typeof audioUrl === 'string' && audioUrl.startsWith('http')) {
                return {
                    audioUrl: audioUrl,
                    title: data.title || 'Audio TikTok',
                    author: data.author || 'Desconocido',
                    thumbnail: data.cover
                };
            }
        }
        
        throw new Error('Sin datos de audio');
    } catch (error) {
        throw new Error(`TiklyDown: ${error.message}`);
    }
}


async function tiktokAudioDouyin(url) {
    try {
        const apiUrl = `https://api.douyin.wtf/api?url=${encodeURIComponent(url)}&minimal=false`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 25000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.music_info && data.music_info.url) {
            return {
                audioUrl: data.music_info.url,
                title: data.desc || 'Audio TikTok',
                author: data.author?.nickname || 'Desconocido',
                thumbnail: data.cover
            };
        }
        
        throw new Error('Sin información de música');
    } catch (error) {
        throw new Error(`DouyinWTF: ${error.message}`);
    }
}


async function tiktokAudioLiveSave(url) {
    try {
        const apiUrl = `https://tiktok.livesdtp.workers.dev/api/parse?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 25000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 0 && data.data) {
            let audioUrl = data.data.music || data.data.musicUrl;
            
            if (audioUrl && audioUrl.startsWith('http')) {
                return {
                    audioUrl: audioUrl,
                    title: data.data.title || 'Audio TikTok',
                    author: data.data.authorMeta?.name || 'Desconocido',
                    thumbnail: data.data.covers?.[0]
                };
            }
        }
        
        throw new Error('Sin datos disponibles');
    } catch (error) {
        throw new Error(`LiveSave: ${error.message}`);
    }
}


async function tiktokAudioTikWMAlt(url) {
    try {
        const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 25000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 0 && data.data && data.data.music) {
            return {
                audioUrl: data.data.music,
                title: data.data.title || 'Audio TikTok',
                author: data.data.author?.unique_id || 'Desconocido',
                thumbnail: data.data.cover
            };
        }
        
        throw new Error('Sin música disponible');
    } catch (error) {
        throw new Error(`TikWM-Alt: ${error.message}`);
    }
}


async function getImageBuffer(url) {
    try {
        if (!url || !url.startsWith('http')) return null;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        if (response.ok) {
            return await response.buffer();
        }
        
        return null;
    } catch (error) {
        console.log('Error obteniendo thumbnail:', error.message);
        return null;
    }
}
