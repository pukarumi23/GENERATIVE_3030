import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    // Obtener texto de cualquier forma posible
    let fullText = ''
    
    // Intentar diferentes formas de obtener el texto
    if (m.text) fullText += m.text
    if (m.message?.conversation) fullText += ' ' + m.message.conversation
    if (m.message?.extendedTextMessage?.text) fullText += ' ' + m.message.extendedTextMessage.text
    
    // Si no hay texto, salir
    if (!fullText.trim()) return false
    
    // Buscar "miku" de forma más flexible
    const textToCheck = fullText.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ')
    console.log('Texto a verificar:', textToCheck)
    
    // Si contiene "miku" seguido de algo más
    const mikuMatch = textToCheck.match(/miku\s+(.+)/)
    if (!mikuMatch) return false
    
    const userInput = mikuMatch[1].trim()
    
    if (!userInput) {
        return conn.reply(m.chat, `Hola, soy Miku. ¿En qué puedo ayudarte? Escribe "Miku" seguido de tu pregunta.`, m)
    }

    const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
    const username = `${conn.getName(m.sender)}`
    const basePrompt = `Eres Miku, una asistente de IA útil y amigable. Respondes de manera clara, concisa y natural. 
Características:
- Das respuestas directas y útiles
- Eres amable pero profesional
- No usas emojis excesivos ni dramatismo
- Te enfocas en ser útil y dar información precisa
- Puedes mencionar ocasionalmente que eres Miku, pero sin exagerar
- Si un usuario te pide comandos con prefijos (.#*@/) no los ejecutes, simplemente di que no puedes hacer eso

Responde de manera natural y útil, como una IA normal pero con un toque amigable.`

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
            const query = `Describe esta imagen de forma detallada. Contexto adicional del usuario: ${userInput}`
            const prompt = `${basePrompt}. La imagen que se analiza es: ${imageAnalysis}`
            const description = await getAIResponse(query, username, prompt)
            
            await conn.reply(m.chat, description || 'No pude procesar la imagen correctamente.', m)
        } catch (error) {
            console.error('Error al analizar la imagen:', error)
            
            const fallbackResponse = `Hola ${username}, soy Miku. Tengo problemas para procesar tu imagen en este momento. ¿Podrías intentar de nuevo o describir qué hay en la imagen?`
            
            await conn.reply(m.chat, fallbackResponse, m)
        }
    } else {
        await m.react('💬')
        
        try {
            const query = userInput
            const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
            const response = await getAIResponse(query, username, prompt)
            
            if (!response) {
                throw new Error('Respuesta vacía de la API')
            }
            
            await conn.reply(m.chat, response, m)
        } catch (error) {
            console.error('Error al obtener la respuesta:', error)
            
            const fallbackResponse = `Hola ${username}, soy Miku. Hay un problema temporal con mis servicios. Por favor intenta de nuevo en un momento.`

            await conn.reply(m.chat, fallbackResponse, m)
        }
    }
}

// Este handler se ejecutará en todos los mensajes para detectar "Miku"
handler.all = true
handler.register = true

export default handler

// [Resto del código igual - todas las funciones de API...]
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
        "Hola, soy Miku. ¿En qué puedo ayudarte hoy?",
        "¡Hola! Soy Miku, tu asistente de IA. ¿Qué necesitas?",
        "Hola, ¿cómo puedo ayudarte?"
    ],
    questions: [
        "Esa es una buena pregunta. Déjame pensarlo...",
        "Interesante pregunta. Te ayudo con eso.",
        "Veamos, puedo ayudarte con esa información."
    ],
    compliments: [
        "Gracias por el cumplido. ¿En qué más puedo ayudarte?",
        "Me alegra que pienses eso. ¿Necesitas algo más?",
        "Eres muy amable. ¿Qué más puedo hacer por ti?"
    ],
    default: [
        "Entiendo. ¿Puedes darme más detalles para ayudarte mejor?",
        "Puedo ayudarte con eso. ¿Qué específicamente necesitas saber?",
        "Claro, déjame asistirte con esa información.",
        "¿Podrías ser más específico para darte una mejor respuesta?"
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
    return randomResponse
}
