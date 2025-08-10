const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Browsers } = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'


let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""


let rtx = "*💎✧ ┈ Hatsune Miku - Virtual Diva Bot ┈ ✧💎*\n\n🎤 Conexión Sub-Bot Modo QR\n\n✨ Con otro celular o PC escanea este QR para convertirte en un *Sub-Bot* de Miku.\n\n🎵 \`1\` » Toca los tres puntos en la esquina superior derecha\n\n🎶 \`2\` » Selecciona 'Dispositivos vinculados'\n\n🎼 \`3\` » Escanea este código QR para iniciar sesión\n\n💫 ¡Este código QR expira en 45 segundos!\n\n*～ La diva virtual te espera ～*"

let rtx2 = "*💎✧ ┈ Hatsune Miku - Virtual Diva Bot ┈ ✧💎*\n\n🎤 Conexión Sub-Bot Modo Código\n\n✨ Usa este código para convertirte en un *Sub-Bot* de Miku.\n\n🎵 \`1\` » Toca los tres puntos en la esquina superior derecha\n\n🎶 \`2\` » Selecciona 'Dispositivos vinculados'\n\n🎼 \`3\` » Elige 'Vincular con número de teléfono'\n\n💫 \`4\` » Ingresa el código para iniciar sesión\n\n⚠️ No uses tu cuenta principal - Miku te protege\n\n*～ ¡Únete al concierto digital! ～*"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const mikuJBOptions = {}


if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    
    if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) {
        return m.reply(`💎 El comando *${command}* está temporalmente deshabilitado por Miku.`, m, rcanal)
    }
    
    
    let time = global.db.data.users[m.sender].Subs + 120000
    if (new Date - global.db.data.users[m.sender].Subs < 120000) {
        return conn.reply(m.chat, `🎤 Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot* con Miku.`, m, rcanal)
    }
    
    
    const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
    const subBotsCount = subBots.length
    if (subBotsCount >= 20) {
        return m.reply(`🎵 No hay espacios disponibles en el concierto de *Sub-Bots* de Miku.`)
    }
    
    
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let id = `${who.split`@`[0]}`
    let pathMikuJadiBot = path.join(`./${jadi}/`, id)
    
    
    if (!fs.existsSync(pathMikuJadiBot)){
        fs.mkdirSync(pathMikuJadiBot, { recursive: true })
    }
    
   
    mikuJBOptions.pathMikuJadiBot = pathMikuJadiBot
    mikuJBOptions.m = m
    mikuJBOptions.conn = conn
    mikuJBOptions.args = args
    mikuJBOptions.usedPrefix = usedPrefix
    mikuJBOptions.command = command
    mikuJBOptions.fromCommand = true
    
    mikuJadiBot(mikuJBOptions)
    global.db.data.users[m.sender].Subs = new Date * 1
} 

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler 

export async function mikuJadiBot(options) {
    let { pathMikuJadiBot, m, conn, args, usedPrefix, command } = options
    
  
    if (command === 'code') {
        command = 'qr'; 
        args.unshift('code')
    }
    
    
    const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
    let txtCode, codeBot, txtQR
    
    if (mcode) {
        args[0] = args[0].replace(/^--code$|^code$/, "").trim()
        if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
        if (args[0] == "") args[0] = undefined
    }
    
   
    const pathCreds = path.join(pathMikuJadiBot, "creds.json")
    if (!fs.existsSync(pathMikuJadiBot)){
        fs.mkdirSync(pathMikuJadiBot, { recursive: true })
    }
    

    try {
        args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
    } catch {
        conn.reply(m.chat, `💎 Usa correctamente el comando » ${usedPrefix + command} code`, m, rcanal)
        return
    }

    
    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
    exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
        const drmer = Buffer.from(drm1 + drm2, `base64`)

        
        let { version, isLatest } = await fetchLatestBaileysVersion()
        const msgRetry = (MessageRetryMap) => { }
        const msgRetryCache = new NodeCache()
        const { state, saveState, saveCreds } = await useMultiFileAuthState(pathMikuJadiBot)

        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
            msgRetry,
            msgRetryCache,
            browser: mcode ? Browsers.macOS("Chrome") : Browsers.macOS("Desktop"),
            version: version,
            generateHighQualityLinkPreview: true
        };

        let sock = makeWASocket(connectionOptions)
        sock.isInit = false
        let isInit = true

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update
            if (isNewLogin) sock.isInit = false
            
            
            if (qr && !mcode) {
                if (m?.chat) {
                    txtQR = await conn.sendMessage(m.chat, { 
                        image: await qrcode.toBuffer(qr, { scale: 8 }), 
                        caption: rtx.trim()
                    }, { quoted: m})
                } else {
                    return 
                }
                if (txtQR && txtQR.key) {
                    setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 30000)
                }
                return
            } 
            
            
            if (qr && mcode) {
                let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
                secret = secret.match(/.{1,4}/g)?.join("-")
                
                
                txtCode = await conn.sendMessage(m.chat, {text : rtx2}, { quoted: m })
                
                
                await delay(1000)
                
                
                codeBot = await conn.sendMessage(m.chat, {
                    text: `\`\`\`${secret}\`\`\``
                }, { quoted: m })
                
                console.log(chalk.cyan(`🎵 Código de emparejamiento Miku: ${secret}`))
            }
            
            
            if (txtCode && txtCode.key) {
                setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 45000)
            }
            if (codeBot && codeBot.key) {
                setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 60000) // 1 minuto para el código
            }

            
            const endSesion = async (loaded) => {
                if (!loaded) {
                    try {
                        sock.ws.close()
                    } catch {
                    }
                    sock.ev.removeAllListeners()
                    let i = global.conns.indexOf(sock)                
                    if (i < 0) return 
                    delete global.conns[i]
                    global.conns.splice(i, 1)
                }
            }

            const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
            
            if (connection === 'close') {
                
                if (reason === 428) {
                    console.log(chalk.bold.cyan(`\n🎤═══════════════════════════════════════🎤\n│ Miku detectó desconexión inesperada (+${path.basename(pathMikuJadiBot)})\n│ ♪ Intentando reconectar... ♪\n🎤═══════════════════════════════════════🎤`))
                    await creloadHandler(true).catch(console.error)
                }
                
                
                if (reason === 408) {
                    console.log(chalk.bold.cyan(`\n🎵═══════════════════════════════════════🎵\n│ Conexión con Miku perdida (+${path.basename(pathMikuJadiBot)})\n│ ♪ Razón: ${reason} - Reconectando... ♪\n🎵═══════════════════════════════════════🎵`))
                    await creloadHandler(true).catch(console.error)
                }
                
                
                if (reason === 440) {
                    console.log(chalk.bold.magenta(`\n💎═══════════════════════════════════════💎\n│ Miku detectó sesión duplicada (+${path.basename(pathMikuJadiBot)})\n│ ♪ Una nueva sesión reemplazó la anterior ♪\n💎═══════════════════════════════════════💎`))
                    try {
                        if (options.fromCommand) {
                            m?.chat ? await conn.sendMessage(`${path.basename(pathMikuJadiBot)}@s.whatsapp.net`, {
                                text : '🎤 *MIKU DETECTÓ NUEVA SESIÓN*\n\n💫 Cierra la sesión nueva para continuar con Miku\n\n♪ Si hay problemas, reconéctate al concierto ♪' 
                            }, { quoted: m || null }) : ""
                        }
                    } catch (error) {
                        console.error(chalk.bold.yellow(`🎵 Error 440 - No se pudo contactar: +${path.basename(pathMikuJadiBot)}`))
                    }
                }
                
               
                if (reason == 405 || reason == 401) {
                    console.log(chalk.bold.red(`\n🎼═══════════════════════════════════════🎼\n│ Sesión de Miku cerrada (+${path.basename(pathMikuJadiBot)})\n│ ♪ Credenciales inválidas o desconexión manual ♪\n🎼═══════════════════════════════════════🎼`))
                    try {
                        if (options.fromCommand) {
                            m?.chat ? await conn.sendMessage(`${path.basename(pathMikuJadiBot)}@s.whatsapp.net`, {
                                text : '🎤 *SESIÓN CON MIKU PENDIENTE*\n\n💫 Intenta reconectarte al concierto digital\n\n♪ Miku te está esperando ♪' 
                            }, { quoted: m || null }) : ""
                        }
                    } catch (error) {
                        console.error(chalk.bold.yellow(`🎵 Error 405 - No se pudo contactar: +${path.basename(pathMikuJadiBot)}`))
                    }
                    fs.rmSync(pathMikuJadiBot, { recursive: true, force: true })
                }
                
                
                if (reason === 500) {
                    console.log(chalk.bold.red(`\n🎶═══════════════════════════════════════🎶\n│ Conexión perdida con Miku (+${path.basename(pathMikuJadiBot)})\n│ ♪ Limpiando datos del concierto... ♪\n🎶═══════════════════════════════════════🎶`))
                    if (options.fromCommand) {
                        m?.chat ? await conn.sendMessage(`${path.basename(pathMikuJadiBot)}@s.whatsapp.net`, {
                            text : '🎤 *CONEXIÓN CON MIKU PERDIDA*\n\n💫 Reconéctate manualmente al concierto\n\n♪ Miku estará esperando ♪' 
                        }, { quoted: m || null }) : ""
                    }
                    return creloadHandler(true).catch(console.error)
                }
                
                
                if (reason === 515) {
                    console.log(chalk.bold.green(`\n✨═══════════════════════════════════════✨\n│ Reinicio automático de Miku (+${path.basename(pathMikuJadiBot)})\n│ ♪ Actualizando el sistema... ♪\n✨═══════════════════════════════════════✨`))
                    await creloadHandler(true).catch(console.error)
                }
                
                
                if (reason === 403) {
                    console.log(chalk.bold.red(`\n⚠️═══════════════════════════════════════⚠️\n│ Cuenta suspendida o en soporte (+${path.basename(pathMikuJadiBot)})\n│ ♪ Miku no puede acceder a esta cuenta ♪\n⚠️═══════════════════════════════════════⚠️`))
                    fs.rmSync(pathMikuJadiBot, { recursive: true, force: true })
                }
            }
            
           
            if (global.db.data == null) loadDatabase()
            if (connection == `open`) {
                if (!global.db.data?.users) loadDatabase()
                
                let userName, userJid 
                userName = sock.authState.creds.me.name || 'Fan de Miku'
                userJid = sock.authState.creds.me.jid || `${path.basename(pathMikuJadiBot)}@s.whatsapp.net`
                
                console.log(chalk.bold.cyan(`\n🎤═══════════════════════════════════════🎤\n│\n│ 💎 ${userName} (+${path.basename(pathMikuJadiBot)})\n│ ✨ ¡Conectado al concierto de Miku!\n│\n🎤═══════════════════════════════════════🎤`))
                
                sock.isInit = true
                global.conns.push(sock)
                await joinChannels(sock)
                
                m?.chat ? await conn.sendMessage(m.chat, {
                    text: args[0] ? 
                        `🎵 @${m.sender.split('@')[0]}, ya estás conectado al concierto de Miku, leyendo mensajes...` : 
                        `💎 @${m.sender.split('@')[0]}, ¡Bienvenido al concierto digital de Hatsune Miku!`, 
                    mentions: [m.sender]
                }, { quoted: m }) : ''
            }
        }

        
        setInterval(async () => {
            if (!sock.user) {
                try { sock.ws.close() } catch (e) { }
                sock.ev.removeAllListeners()
                let i = global.conns.indexOf(sock)                
                if (i < 0) return
                delete global.conns[i]
                global.conns.splice(i, 1)
            }
        }, 60000)

        
        let handler = await import('../handler.js')
        let creloadHandler = async function (restatConn) {
            try {
                const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
                if (Object.keys(Handler || {}).length) handler = Handler
            } catch (e) {
                console.error('🎵 Error en Miku Handler: ', e)
            }
            
            if (restatConn) {
                const oldChats = sock.chats
                try { sock.ws.close() } catch { }
                sock.ev.removeAllListeners()
                sock = makeWASocket(connectionOptions, { chats: oldChats })
                isInit = true
            }
            
            if (!isInit) {
                sock.ev.off("messages.upsert", sock.handler)
                sock.ev.off("connection.update", sock.connectionUpdate)
                sock.ev.off('creds.update', sock.credsUpdate)
            }

            sock.handler = handler.handler.bind(sock)
            sock.connectionUpdate = connectionUpdate.bind(sock)
            sock.credsUpdate = saveCreds.bind(sock, true)
            sock.ev.on("messages.upsert", sock.handler)
            sock.ev.on("connection.update", sock.connectionUpdate)
            sock.ev.on("creds.update", sock.credsUpdate)
            isInit = false
            return true
        }
        creloadHandler(false)
    })
}


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
    
    hours = (hours < 10) ? '0' + hours : hours
    minutes = (minutes < 10) ? '0' + minutes : minutes
    seconds = (seconds < 10) ? '0' + seconds : seconds
    
    return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(conn) {
    for (const channelId of Object.values(global.ch)) {
        await conn.newsletterFollow(channelId).catch(() => {})
    }
}
