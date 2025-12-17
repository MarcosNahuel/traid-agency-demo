import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyAILp5OTUpaixm4MtoCHuXZEtHTSLtvzPk'
const GEMINI_MODEL = 'gemini-3-flash-preview'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

interface ImproveResponseRequest {
  originalMessage: string
  currentResponse: string
  caseType?: string
  buyerName?: string
  productTitle?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ImproveResponseRequest = await request.json()
    const { originalMessage, currentResponse, caseType, buyerName, productTitle } = body

    if (!originalMessage) {
      return NextResponse.json(
        { error: 'Se requiere el mensaje original' },
        { status: 400 }
      )
    }

    // Construir el prompt para Gemini
    const prompt = buildPrompt(originalMessage, currentResponse, caseType, buyerName, productTitle)

    // Llamar a la API de Gemini
    const geminiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      })
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API error:', errorText)
      return NextResponse.json(
        { error: 'Error al comunicarse con Gemini AI', details: errorText },
        { status: 500 }
      )
    }

    const geminiData = await geminiResponse.json()

    // Extraer la respuesta mejorada
    const improvedResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!improvedResponse) {
      return NextResponse.json(
        { error: 'No se pudo generar una respuesta mejorada' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      improvedResponse: improvedResponse.trim(),
      model: GEMINI_MODEL
    })

  } catch (error) {
    console.error('Error in improve-response:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: String(error) },
      { status: 500 }
    )
  }
}

function buildPrompt(
  originalMessage: string,
  currentResponse: string,
  caseType?: string,
  buyerName?: string,
  productTitle?: string
): string {
  const context = []

  if (buyerName) context.push(`Nombre del comprador: ${buyerName}`)
  if (productTitle) context.push(`Producto: ${productTitle}`)
  if (caseType) context.push(`Tipo de caso: ${caseType}`)

  const contextStr = context.length > 0 ? `\n\nContexto:\n${context.join('\n')}` : ''

  return `Eres un experto en atencion al cliente de MercadoLibre Argentina. Tu tarea es mejorar la siguiente respuesta de soporte para que sea mas profesional, empatica y efectiva.

REGLAS IMPORTANTES:
- Mantener un tono amable y profesional
- Ser conciso pero completo
- Usar "vos" en lugar de "tu" (espanol rioplatense)
- No usar emojis excesivos (maximo 1-2 si es apropiado)
- Incluir una solucion clara o proximos pasos
- Si hay informacion faltante, sugerir que el comprador la proporcione
- Firmar como "Equipo de Horsepower"
${contextStr}

MENSAJE ORIGINAL DEL COMPRADOR:
"${originalMessage}"

${currentResponse ? `RESPUESTA ACTUAL A MEJORAR:\n"${currentResponse}"` : 'No hay respuesta actual. Genera una respuesta apropiada.'}

INSTRUCCION: Genera una version mejorada de la respuesta (o una nueva respuesta si no hay actual). Solo devuelve el texto de la respuesta mejorada, sin explicaciones adicionales.`
}
