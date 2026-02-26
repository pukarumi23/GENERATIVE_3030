export default {
  command: ['dungeon', 'mazmorra'],
  category: 'rpg',
  run: async (client, m, args, usedPrefix) => {
    const chat = global.db.data.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const currency = global.db.data.settings[botId].currency
    if (chat.adminonly || !chat.economy) 
      return m.reply(`💙 Los comandos de *Economía* están desactivados en este grupo.\n\nUn *administrador* puede activarlos con el comando:\n» *${usedPrefix}economy on*`, m, global.miku)   
    user.lastdungeon ||= 0
    if (user.coins == null) user.coins = 0
    if (user.health == null) user.health = 100
    if (user.health < 5) 
      return m.reply(`🌱 No tienes suficiente salud para volver a la *mazmorra*.\n> Usa *"${usedPrefix}heal"* para curarte.`, m, global.miku)
    if (Date.now() < user.lastdungeon) {
      const restante = user.lastdungeon - Date.now()
      return m.reply(`🌱 Debes esperar *${msToTime(restante)}* antes de volver a la mazmorra.`, m, global.miku)
    }
    const rand = Math.random()
    let cantidad = 0
    let salud = Math.floor(Math.random() * (18 - 10 + 1)) + 10
    let message
    if (rand < 0.4) {
      cantidad = Math.floor(Math.random() * (15000 - 12000 + 1)) + 12000
      user.coins ||= 0
      user.coins += cantidad
      user.health -= salud
      const successMessages = [
        `💙 Derrotaste al guardián de las ruinas y reclamaste el tesoro antiguo, ganaste *${cantidad.toLocaleString()} ${currency}*.`,
        `🌱 Descifraste los símbolos únicos y obtuviste recompensas ocultas, ganaste *${cantidad.toLocaleString()} ${currency}*.`,
        `💙 Encuentras al sabio de la mazmorra, quien te premia por tu sabiduría, ganaste *${cantidad.toLocaleString()} ${currency}*.`,
        `🌱 El espíritu de la reina ancestral te bendice con una gema de poder, ganaste *${cantidad.toLocaleString()} ${currency}*.`,
        `💙 Superas la prueba de los espejos oscuros y recibes un artefacto único, ganaste *${cantidad.toLocaleString()} ${currency}*.`,
        `🌱 Derrotas a un gólem de obsidiana y desbloqueas un acceso secreto, ganaste *${cantidad.toLocaleString()} ${currency}*.`,
        `💙 Salvas a un grupo de exploradores perdidos y ellos te recompensan, ganaste *${cantidad.toLocaleString()} ${currency}*.`,
        `🌱 Consigues abrir la puerta del juicio y extraes un orbe milenario, ganaste *${cantidad.toLocaleString()} ${currency}*.`,
        `💙 Triunfas sobre un demonio ilusorio que custodiaba el sello perdido, ganaste *${cantidad.toLocaleString()} ${currency}*.`,
        `🌱 Purificas el altar corrompido y recibes una bendición ancestral, ganaste *${cantidad.toLocaleString()} ${currency}*.`
      ]
      message = pickRandom(successMessages)
    } else if (rand < 0.7) {
      cantidad = Math.floor(Math.random() * (9000 - 7500 + 1)) + 7500
      user.coins ||= 0
      user.bank ||= 0
      const total = user.coins + user.bank
      if (total >= cantidad) {
        if (user.coins >= cantidad) {
          user.coins -= cantidad
        } else {
          const restante = cantidad - user.coins
          user.coins = 0
          user.bank -= restante
        }
      } else {
        cantidad = total
        user.coins = 0
        user.bank = 0
      }
      user.health -= salud
      if (user.health < 0) user.health = 0
      const failMessages = [
        `💙 El guardián te atacó sin previo aviso y te hirió gravemente, perdiste *${cantidad.toLocaleString()} ${currency}*.`,
        `🌱 Las paredes se cerraron repentinamente y quedaste atrapado, perdiste *${cantidad.toLocaleString()} ${currency}*.`,
        `💙 El suelo se abrió bajo tus pies y cayeron garras afiladas, perdiste *${cantidad.toLocaleString()} ${currency}*.`,
        `🌱 Una trampa falsa se activó y te lanzó por un acantilado, perdiste *${cantidad.toLocaleString()} ${currency}*.`,
        `💙 El aire se volvió tóxico y comenzaste a ahogar, perdiste *${cantidad.toLocaleString()} ${currency}*.`,
        `🌱 Un falso tesoro te engañó y desapareciste cuando lo tocaste, perdiste *${cantidad.toLocaleString()} ${currency}*.`,
        `💙 El guardián te encontró y te persiguió por los pasillos oscuros, perdiste *${cantidad.toLocaleString()} ${currency}*.`,
        `🌱 Las runas mágicas se activaron y te teletransportaron a una jaula, perdiste *${cantidad.toLocaleString()} ${currency}*.`,
        `💙 Un gárgola te mordió las piernas y te arrastró a las profundidades, perdiste *${cantidad.toLocaleString()} ${currency}*.`,
        `🌱 El alma del laberinto te absorbió y casi te vuelve loco, perdiste *${cantidad.toLocaleString()} ${currency}*.`,
        `💙 Un espectro te poseyó y comenzó a alimentarse de tu miedo, perdiste *${cantidad.toLocaleString()} ${currency}*.`,
        `🌱 Los susurros en las paredes susurraron secretos que te helaron, perdiste *${cantidad.toLocaleString()} ${currency}*.`
      ]
      message = pickRandom(failMessages)
    } else {
      const neutralMessages = [
        `💙 Exploras ruinas antiguas y aprendes secretos ocultos.`,
        `🌱 Sigues la pista de un espectro pero desaparece entre la niebla.`,
        `💙 Acompañas a una princesa por los desiertos de Thaloria sin contratiempos.`,
        `🌱 Recorres un bosque encantado y descubres nuevas rutas.`,
        `💙 Visitas una aldea remota y escuchas relatos de viejas batallas.`
      ]
      message = pickRandom(neutralMessages)
    }
    user.lastdungeon = Date.now() + 20 * 60 * 1000
    await client.sendMessage(m.chat, { text: `🌱 ${global.miku || 'HATSUNE MIKU'} ${message}` }, { quoted: m })
  },
}

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const min = minutes < 10 ? '0' + minutes : minutes
  const sec = seconds < 10 ? '0' + seconds : seconds
  return min === '00' ? `${sec} segundo${sec > 1 ? 's' : ''}` : `${min} minuto${min > 1 ? 's' : ''}, ${sec} segundo${sec > 1 ? 's' : ''}`
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
