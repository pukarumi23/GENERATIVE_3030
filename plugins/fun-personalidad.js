var handler = async (m, { conn, command, text }) => {

if (!text) return conn.reply(m.chat, `🎤💙 Por favor, ingresa el nombre del fanático para analizar su personalidad virtual ✨🎵`, m)

let personalidad = `🎤💙 *Análisis de Personalidad Virtual* ✨

\`Nombre del Fanático\` : ${text}
\`Armonía Musical\` : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
\`Rebeldía Virtual\` : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
\`Tipo de Fanático\` : ${pickRandom(['Kawaii Virtual','Idol del Concierto','Estrella Digital','Fan Supremo','Diva Virtual','Tímido/a Musical','Valiente del Escenario','Curioso/a Virtual','Cristal Musical','Fanático/a Binario/a', 'Rebelde Cibernético'])}
\`Siempre está\` : ${pickRandom(['Cantando Melodías','Bailando Virtual','Distraid@ con Música','Ensayando Coreografías','Chismeando en el Concierto','Escuchando a Miku','De Compras Virtuales','Viendo Conciertos','Chateando en WhatsApp sobre Miku','Descansando después del Show','Conquistando Corazones','En el Escenario Virtual'])}
\`Inteligencia Musical\` : ${pickRandom(['9%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
\`Rebeldía Digital\` : ${pickRandom(['9%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
\`Popularidad Virtual\` : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
\`Valor en el Escenario\` : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
\`Nervios Escénicos\` : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
\`Fama del Concierto\` : ${pickRandom(['6%','12%','20%','27%','35%','41%','49%','54%','60%','66%','73%','78%','84%','92%','93%','94%','96%','98,3%','99,7%','99,9%','1%','2,9%','0%','0,4%'])}
\`Estilo Musical\` : ${pickRandom(['Fan de Miku', 'Diva Virtual', 'Idol Kawaii', 'Estrella Bisexual', 'Artista Pansexual', 'Feminista Musical', 'Heterosexual Virtual', 'Alpha del Escenario', 'Diva Suprema', 'Rebelde Musical', 'Fan de PlayStation', 'Solista Virtual', 'Amante de la Música'])}

🎵✨ *¡Análisis completo del mundo virtual de Miku!* ✨🎵`

conn.reply(m.chat, personalidad, m)

}
handler.help = ['personalidad']
handler.tags = ['fun']
handler.command = ['personalidad']
handler.group = true;
handler.register = true

export default handler



