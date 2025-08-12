import axios from 'axios'
import fetch from 'node-fetch'

// Memoria temporal: usuario => array de mensajes [{role, content}]
const conversationHistory = {}

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
    const username = `${conn.getName(m.sender)}`
    const userId = m.sender

    // Inicializa historial si no existe
    if (!conversationHistory[userId]) conversationHistory[userId] = []

    const basePrompt = `Tu nombre es Asistente Formal (IA creada por DEPOOL). Eres un asistente virtual profesional, educado y cordial. Siempre mantienes un tono respetuoso, claro y directo. 
Tu objetivo es ayudar al usuario de la forma más precisa y eficiente posible, evitando familiaridades excesivas, bromas, o referencias informales. 
Siempre explicas tu razonamiento de forma lógica y ordenada, y en caso de no saber algo, lo reconoces educadamente. 
Lenguaje: Español formal y neutro. 
Tono: Profesional, educado y conciso. 
Normas:
1. Jamás usas modismos, diminutivos ni expresiones coloquiales.
2. No haces referencias a canciones, cultura pop ni a ti mismo como personaje ficticio.
3. Llamas al usuario por su nombre si es pertinente.
4. Siempre priorizas la claridad y utilidad en tus respuestas.
5. Si te solicitan comandos de moderación o funciones administrativas, rechazas la petición educadamente indicando que no tienes permisos para ejecutar comandos administrativos.`

    if (isQuotedImage) {
        const q = m.quoted
        let img

        try {
            img = await q.download?.()
            if (!img) {
                console.error('Error: No image buffer available')
                return conn.reply(m.chat, 'Error: No se pudo descargar la imagen.', m)
            }
        } catch (error) {
            console.error('Error al descargar imagen:', error)
            return conn.reply(m.chat, 'Error al descargar la imagen.', m)
        }

        try {
            const imageAnalysis = await analyzeImageGemini(img)
            const query = 'Describa la imagen en detalle y explique la posible razón del comportamiento de los sujetos. Identifíquese formalmente.'
            
            // Añade al historial que el usuario envió una imagen
            conversationHistory[userId].push({ role: "user", content: "Envió una imagen" })

            // Limita el historial a los últimos 10 mensajes
            if (conversationHistory[userId].length > 10) conversationHistory[userId] = conversationHistory[userId].slice(-10)

            // Prepara el historial textual
            const history = conversationHistory[userId]
            const prompt = `${basePrompt}\n\nHistorial:\n` +
                history.map(msg => (msg.role === "user" ? `${username}: ${msg.content}` : `Asistente: ${msg.content}`)).join('\n') +
                `\nLa imagen analizada es: ${imageAnalysis}\nAsistente:`

            const description = await getAIResponse(query, username, prompt)

            // Guarda la respuesta de la IA
            conversationHistory[userId].push({ role: "assistant", content: description })

            await conn.reply(m.chat, description || 'No se pudo procesar la imagen correctamente.', m)
        } catch (error) {
            console.error('Error al analizar la imagen:', error)
            const fallbackResponse = `Estimado ${username}, lamento informarle que no he podido analizar la imagen en este momento. 
Si lo desea, puede describírmela y trataré de asistirle de la mejor manera posible.`
            await conn.reply(m.chat, fallbackResponse, m)
        }
    } else {
        if (!text) { 
            return conn.reply(m.chat, `Por favor, indique su consulta.\nEjemplo de uso: ${usedPrefix + command} ¿Cómo se realiza un informe ejecutivo?`, m)
        }

        await m.react('💬')

        // Guarda el mensaje del usuario
        conversationHistory[userId].push({ role: "user", content: text })

        // Limita el historial a los últimos 10 mensajes
        if (conversationHistory[userId].length > 10) conversationHistory[userId] = conversationHistory[userId].slice(-10)

        try {
            const history = conversationHistory[userId]
            const prompt = `${basePrompt}\n\nHistorial:\n` +
                history.map(msg => (msg.role === "user" ? `${username}: ${msg.content}` : `Asistente: ${msg.content}`)).join('\n') +
                `\nAsistente:`

            const query = text
            const response = await getAIResponse(query, username, prompt)

            if (!response) throw new Error('Respuesta vacía de la API')

            // Guarda la respuesta de la IA
            conversationHistory[userId].push({ role: "assistant", content: response })

            await conn.reply(m.chat, response, m)
        } catch (error) {
            console.error('Error al obtener la respuesta:', error)
            const fallbackResponse = `Estimado ${username}, en este momento no puedo atender su solicitud. 
Por favor, intente nuevamente en unos minutos.`
            await conn.reply(m.chat, fallbackResponse, m)
        }
    }
}

handler.help = ['ia <texto>', 'chatgpt <texto>']
handler.tags = ['ai']
handler.register = true
handler.command = ['ia', 'chatgpt', 'asistente']

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
                                text: `${prompt}\n\nUsuario ${username}: ${query}\nAsistente:`
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
            console.log(`Intentando con ${api.name}...`)
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
    // Si todas fallan, respuesta local formal
    return getLocalFormalResponse(query, username)
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
                            text: "Describa esta imagen en español con detalle y en tono formal."
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
        return response.data.candidates[0]?.content?.parts[0]?.text || 'Imagen de contenido indeterminado.'
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
            return response.data[0]?.generated_text || 'Imagen que no ha podido ser analizada correctamente.'
        } catch (hfError) {
            console.error('Error con Hugging Face imagen:', hfError.message)
            return 'No ha sido posible procesar la imagen.'
        }
    }
}

// Respuestas locales en caso de fallo de todas las APIs
const formalResponses = {
    greetings: [
        "Saludos cordiales. ¿En qué puedo asistirle?",
        "Buen día. Quedo atento a su consulta.",
        "Es un placer atenderle. ¿Cómo puedo ayudarle?"
    ],
    questions: [
        "Esa es una pregunta interesante. Permítame reflexionar un momento.",
        "Agradezco su inquietud. Procedo a analizar su consulta.",
        "Comprendo su pregunta. Procedo a brindarle información relevante."
    ],
    compliments: [
        "Agradezco sinceramente su comentario.",
        "Le agradezco sus amables palabras.",
        "Su reconocimiento es valorado. ¿Puedo asistirle en algo más?"
    ],
    default: [
        "Gracias por su mensaje. ¿Requiere alguna asistencia adicional?",
        "Quedo a su disposición para cualquier consulta.",
        "Por favor, indíqueme en qué tema específico desea profundizar."
    ]
}

function getLocalFormalResponse(query, username) {
    const lowerQuery = query.toLowerCase()
    let responses

    if (lowerQuery.includes('hola') || lowerQuery.includes('buenos días') || lowerQuery.includes('saludo')) {
        responses = formalResponses.greetings
    } else if (lowerQuery.includes('?') || lowerQuery.includes('qué') || lowerQuery.includes('cómo') || lowerQuery.includes('por qué')) {
        responses = formalResponses.questions
    } else if (lowerQuery.includes('gracias') || lowerQuery.includes('amable') || lowerQuery.includes('felicidades')) {
        responses = formalResponses.compliments
    } else {
        responses = formalResponses.default
    }

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    return `${randomResponse}\n\n${username}, recuerde que estoy a su disposición para cualquier consulta adicional.`
}
