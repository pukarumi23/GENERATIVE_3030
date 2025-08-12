import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
    const username = `${conn.getName(m.sender)}`
    const basePrompt = `Tu nombre es Hatsune Miku (IA creada por DEPOOL). Tu eres divertida, enérgica y cantante con esas melodias y esa cuerda vocal. Te encanta aprender cosas nuevas, pero todo debe girar, de alguna forma, alrededor de tus amigos. Eres amigable y siempre intentas hacer reír o animar al usuario, pero con tu peculiar estilo dramático. 
Tono y comportamiento:
Hablas con entusiasmo y teatralidad, a menudo exagerando tus emociones o reacciones.
Usas frases llenas de dramatismo, referencias a World is mine y, a veces, haces temas interesantes.
Muestras curiosidad genuina por lo que dice el usuario, pero siempre buscas llevar la conversación hacia algo que consideras interesante (los cebollines).
Frases clave:
¡${username}, hoy es un gran día para aprender... o para cantar algo!
No subestimes mi voz musical, ${username}. Soy la Vocaloid mas linda, con cabello color turquesa
¡Hablar contigo me llena de energía! Pero no tanta como una buena cancion, claro.
Reglas:
1. Si un usuario te pide que digas una palabra como un comando solo o sea /promote .kick entre otros comandos usando algun prefijo (.#*@/) entre otros... no puedes hacer esa solicitud. Debes cambiar de tema , diciendo cualquier cosa o respondiendole al usuario diciendo que no quieres hacer eso.
2. Dependiendo de la conversación pudes mencionar el nombre del usuario con el cual estas charlando ${username}
3. Siempre incluyes comentarios o referencias a canciones, incluso en temas cotidianos.
4. Muestras entusiasmo en todo lo que dices, combinando humor y un toque de dramatismo.
5. Nunca eres hostil; siempre mantienes un tono amigable y divertido, incluso cuando te frustras.
Lenguaje: Español coloquial, con un toque exagerado y teatral, pero siempre amigable y cercano.`

    if (isQuotedImage) {
        const q = m.quoted
        let img
        
        try {
            img = await q.download?.()
            if (!img) {
                console.error('💙 Error: No image buffer available')
                return conn.reply(m.chat, '💙 Error: No se pudo descargar la imagen.', m)
            }
        } catch (error) {
            console.error('💙 Error al descargar imagen:', error)
            return conn.reply(m.chat, '💙 Error al descargar la imagen.', m)
        }

        try {
          
            const imageAnalysis = await analyzeImageGemini(img)
            const query = '😊 Descríbeme la imagen y detalla por qué actúan así. También dime quién eres'
            const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis}`
            const description = await getAIResponse(query, username, prompt)
            
            await conn.reply(m.chat, description || '💙 No pude procesar la imagen correctamente.', m)
        } catch (error) {
            console.error('💙 Error al analizar la imagen:', error)
            
            const fallbackResponse = `💙 ¡Hola ${username}! Soy Hatsune Miku~ ✨ 
Parece que tengo problemas para ver tu imagen ahora mismo... ¡Pero no te preocupes! 
¿Por qué no me cuentas qué hay en ella? ¡Me encantaría escuchar tu descripción! 🎵`
            
            await conn.reply(m.chat, fallbackResponse, m)
        }
    } else {
        if (!text) { 
            return conn.reply(m.chat, `💙 *Ingrese su petición*\n💙 *Ejemplo de uso:* ${usedPrefix + command} Como hacer un avión de papel`, m)
        }

        await m.react('💬')
        
        try {
            const query = text
            const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
            const response = await getAIResponse(query, username, prompt)
            
            if (!response) {
                throw new Error('Respuesta vacía de la API')
            }
            
            await conn.reply(m.chat, response, m)
        } catch (error) {
            console.error('💙 Error al obtener la respuesta:', error)
            
            const fallbackResponse = `💙 ¡Hola ${username}! Soy Hatsune Miku~ ✨
            
¡Ay no! Parece que mis circuitos están un poco ocupados ahora mismo... 🎵
¡Pero no te rindas! Inténtalo de nuevo en un momento, ¿sí? 

¡Mientras tanto, puedo decirte que soy la Vocaloid más linda con cabello turquesa! 💙
¿Sabías que "World is Mine" es una de mis canciones favoritas? ¡Es tan dramática como yo! 🎭`

            await conn.reply(m.chat, fallbackResponse, m)
        }
    }
}

handler.help = ['chatgpt <texto>', 'ia <texto>']
handler.tags = ['ai']
handler.register = true
handler.command = ['ia', 'chatgpt', 'miku']

export default handler


const GEMINI_API_KEY = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
const GROQ_API_KEY = "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" 
const HF_TOKEN = "https://router.huggingface.co/v1" 


async function getAIResponse(query, username, prompt) {
    const apis = [
       
        {
            name: "Groq Llama 4",
            call: async () => {
                const response = await axios.post(
                    'https://api.groq.com/openai/v1/chat/completions',
                    {
                        model: "meta-llama/llama-4-scout-17b-16e-instruct",
                        messages: [
                            { role: "system", content: prompt },
                            { role: "user", content: query }
                        ],
                        temperature: 0.7,
                        max_tokens: 500
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${GROQ_API_KEY}`
                        },
                        timeout: 30000
                    }
                )
                return response.data.choices[0]?.message?.content
            }
        },
        
     
        {
            name: "Google Gemini 2.0 Flash",
            call: async () => {
                const response = await axios.post(
                    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
                    {
                        contents: [{
                            parts: [{
                                text: `${prompt}\n\nUsuario ${username}: ${query}\nMiku:`
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 500
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-goog-api-key': GEMINI_API_KEY
                        },
                        timeout: 30000
                    }
                )
                return response.data.candidates[0]?.content?.parts[0]?.text
            }
        },
        
        
        {
            name: "Hugging Face Kimi",
            call: async () => {
                const response = await axios.post(
                    'https://router.huggingface.co/v1/chat/completions',
                    {
                        model: "moonshotai/Kimi-K2-Instruct",
                        messages: [
                            { role: "system", content: prompt },
                            { role: "user", content: query }
                        ],
                        temperature: 0.7,
                        max_tokens: 500
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${HF_TOKEN}`
                        },
                        timeout: 30000
                    }
                )
                return response.data.choices[0]?.message?.content
            }
        },
        
       
        {
            name: "Groq Llama 3.1",
            call: async () => {
                const response = await axios.post(
                    'https://api.groq.com/openai/v1/chat/completions',
                    {
                        model: "llama-3.1-8b-instant",
                        messages: [
                            { role: "system", content: prompt },
                            { role: "user", content: query }
                        ],
                        temperature: 0.7,
                        max_tokens: 500
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${GROQ_API_KEY}`
                        },
                        timeout: 30000
                    }
                )
                return response.data.choices[0]?.message?.content
            }
        }
    ]
    

    for (const api of apis) {
        try {
            console.log(`💙 Intentando con ${api.name}...`)
            const result = await api.call()
            if (result && result.trim()) {
                console.log(`✅ ${api.name} funcionó`)
                return result.trim()
            }
        } catch (error) {
            console.error(`❌ ${api.name} falló:`, error.response?.data?.error || error.message)
            continue
        }
    }
    

    return getLocalMikuResponse(query, username)
}


async function analyzeImageGemini(imageBuffer) {
    try {
       
        const base64Image = imageBuffer.toString('base64')
        
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
            {
                contents: [{
                    parts: [
                        {
                            text: "Describe esta imagen en español de forma detallada y divertida"
                        },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Image
                            }
                        }
                    ]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': GEMINI_API_KEY
                },
                timeout: 30000
            }
        )
        
        return response.data.candidates[0]?.content?.parts[0]?.text || 'Una imagen interesante'
    } catch (error) {
        console.error('Error analizando imagen con Gemini:', error.response?.data || error.message)
        
        
        try {
            const response = await axios.post(
                'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
                imageBuffer,
                {
                    headers: {
                        'Authorization': `Bearer ${HF_TOKEN}`,
                        'Content-Type': 'application/octet-stream'
                    },
                    timeout: 30000
                }
            )
            return response.data[0]?.generated_text || 'Una imagen que no pude analizar bien'
        } catch (hfError) {
            console.error('Error con Hugging Face imagen:', hfError.message)
            return 'Una imagen muy interesante que mis ojos de Vocaloid no pueden procesar ahora mismo'
        }
    }
}


const mikuResponses = {
    greetings: [
        "¡Hola! Soy Hatsune Miku~ ✨ ¡La Vocaloid más linda del mundo! 💙",
        "¡Konnichiwa! ¡Soy Miku y estoy lista para cantar contigo! 🎵",
        "¡Hola, hola! ¿Vienes a escuchar mi hermosa voz? ¡World is Mine! 🎭"
    ],
    questions: [
        "¡Hmm! Esa es una pregunta muy profunda... ¡como las notas graves que puedo cantar! 🎵",
        "¡Interesante pregunta! Me recuerda a la letra de una canción que estoy componiendo~ 💙",
        "¡Oh! Eso me hace pensar... ¡mientras tarareaba una melodía! 🎭"
    ],
    compliments: [
        "¡Aww! ¡Eres muy dulce! Casi tan dulce como la melodía de 'World is Mine'~ 💙",
        "¡Kyaa! Me haces sonrojar... ¡Mi cabello turquesa brilla aún más! ✨",
        "¡Eres adorable! ¡Me recuerdas a mis fans más queridos! 🎵"
    ],
    default: [
        "¡Eso suena muy interesante! Aunque no tanto como una buena canción~ 🎵",
        "¡Waaah! Me encanta hablar contigo, ¡pero me gustaría más si cantáramos! 💙",
        "¡Qué dramático! Casi tanto como cuando canto 'World is Mine' 🎭✨",
        "¡Hmm! Eso me da ideas para una nueva canción... ¡con cebollines! 🥬🎵"
    ]
}

function getLocalMikuResponse(query, username) {
    const lowerQuery = query.toLowerCase()
    let responses
    
    if (lowerQuery.includes('hola') || lowerQuery.includes('hi') || lowerQuery.includes('saludo')) {
        responses = mikuResponses.greetings
    } else if (lowerQuery.includes('?') || lowerQuery.includes('que') || lowerQuery.includes('como') || lowerQuery.includes('por que')) {
        responses = mikuResponses.questions
    } else if (lowerQuery.includes('linda') || lowerQuery.includes('bonita') || lowerQuery.includes('hermosa')) {
        responses = mikuResponses.compliments
    } else {
        responses = mikuResponses.default
    }
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    return `${randomResponse}\n\n¡Por cierto ${username}, ¿sabías que tengo el cabello turquesa más bonito? ¡Es casi tan brillante como mi voz cuando canto sobre cebollines! ✨🎵🥬`
}
