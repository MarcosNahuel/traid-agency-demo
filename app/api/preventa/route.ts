import { NextRequest, NextResponse } from 'next/server'

const PREVENTA_WEBHOOK_URL = 'https://horsepower-n8n.e5l6dk.easypanel.host/webhook/preventa-demo'

// Toggle para habilitar n8n (false = solo mock, true = intenta n8n)
const USE_N8N = process.env.USE_N8N_WEBHOOKS === 'true'

// Respuestas mock para pruebas locales cuando n8n no esta disponible
function getMockResponse(productId: string, question: string): string {
  const q = question.toLowerCase()

  // Compatibilidad
  if (q.includes('compatible') || q.includes('sirve') || q.includes('funciona') || q.includes('entra')) {
    return `Hola! Gracias por tu consulta sobre el producto ${productId}.\n\nPara verificar la compatibilidad, necesito que me indiques:\n- Tu PC o notebook actual\n- Motherboard y procesador\n- Fuente de alimentacion (watts)\n\nCon esos datos te confirmo si es compatible. Tambien podes revisar la descripcion del producto donde listamos los requisitos.\n\nQuedo atento! Saludos, Barbi de MarIA S.A.`
  }

  // Stock
  if (q.includes('stock') || q.includes('disponible') || q.includes('tienen') || q.includes('hay')) {
    return `Hola! Si, tenemos stock disponible de este producto (${productId}).\n\nSi realizas la compra hoy, despachamos en 24-48hs habiles. El envio es por MercadoEnvios con seguimiento.\n\nAlguna otra consulta? Saludos, Barbi de MarIA S.A.`
  }

  // Envio
  if (q.includes('envio') || q.includes('envío') || q.includes('llega') || q.includes('demora') || q.includes('tarda')) {
    return `Hola! El envio es por MercadoEnvios Full o Standard segun tu ubicacion.\n\n- MercadoEnvios Full: llega en 24-48hs\n- MercadoEnvios Standard: 3-5 dias habiles\n\nEl envio es GRATIS en compras mayores a $50.000. Podes calcular el costo exacto ingresando tu codigo postal en la publicacion.\n\nSaludos, Barbi de MarIA S.A.`
  }

  // Garantia
  if (q.includes('garantia') || q.includes('garantía') || q.includes('falla') || q.includes('defecto')) {
    return `Hola! Todos nuestros productos tienen garantia de 6 meses por defectos de fabricacion.\n\nSi tenes algun problema con el producto, contactanos y lo resolvemos. Podes hacer el reclamo por MercadoLibre o escribirnos directamente.\n\nSaludos, Barbi de MarIA S.A.`
  }

  // Precio / Descuento
  if (q.includes('precio') || q.includes('descuento') || q.includes('oferta') || q.includes('cuotas')) {
    return `Hola! El precio publicado es el precio final.\n\nPodes pagar en hasta 12 cuotas sin interes con tarjetas seleccionadas. Tambien aceptamos todos los medios de pago de MercadoLibre.\n\nSi compras mas de una unidad, escribinos y te hacemos un precio especial.\n\nSaludos, Barbi de MarIA S.A.`
  }

  // Instalacion
  if (q.includes('instala') || q.includes('colocar') || q.includes('poner') || q.includes('armar')) {
    return `Hola! La instalacion de este producto es sencilla si tenes conocimientos basicos de hardware.\n\nTe recomendamos:\n1. Ver tutoriales en YouTube para tu componente\n2. Descargar los drivers desde la web oficial\n3. Verificar que tu fuente tenga suficiente potencia\n\nSi necesitas ayuda con la instalacion, escribinos y te orientamos. Saludos, Barbi de MarIA S.A.`
  }

  // Factura
  if (q.includes('factura') || q.includes('comprobante')) {
    return `Hola! Si, emitimos factura por todas las compras.\n\n- Factura B: automatica para consumidores finales\n- Factura A: si tenes CUIT y sos Responsable Inscripto, indicanos tus datos fiscales despues de la compra\n\nSaludos, Barbi de MarIA S.A.`
  }

  // Respuesta generica
  return `Hola! Gracias por tu consulta sobre el producto ${productId}.\n\nEstoy para ayudarte con cualquier duda sobre:\n- Compatibilidad con tu PC\n- Stock y disponibilidad\n- Tiempos de envio\n- Garantia\n- Instalacion\n\nContame que necesitas saber y te respondo a la brevedad.\n\nSaludos, Barbi de MarIA S.A.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatInput, sessionId } = body

    // Extraer productId y pregunta del chatInput
    const parts = chatInput.split(' - ')
    const productId = parts[0] || 'UNKNOWN'
    const question = parts.slice(1).join(' - ') || chatInput

    // Intentar n8n si esta habilitado
    if (USE_N8N) {
      try {
        const response = await fetch(PREVENTA_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatInput, sessionId }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Preventa: respuesta de n8n workflow')
          return NextResponse.json(data)
        }

        console.log('n8n preventa webhook not available, using mock response')
      } catch {
        console.log('n8n preventa webhook connection error, using mock response')
      }
    }

    // Fallback: Usar respuesta mock
    const mockResponse = getMockResponse(productId, question)
    return NextResponse.json({ text: mockResponse })

  } catch (error) {
    console.error('Error in preventa API:', error)
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    )
  }
}
