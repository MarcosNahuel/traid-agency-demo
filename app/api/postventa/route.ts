import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const POSTVENTA_WEBHOOK_URL = 'https://n8n.italicia.com/webhook/demo-postventa'

// Toggle para habilitar n8n (false = solo mock, true = intenta n8n)
const USE_N8N = process.env.USE_N8N_WEBHOOKS === 'true'

// Cliente Supabase para Route Handlers (no usa cookies)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SimulationData {
  is_test: boolean
  is_real_order: boolean
  order_id: string
  message: string
  buyer: {
    id: string
    first_name: string
    last_name: string
    nickname: string
  }
  product: {
    id: string
    title: string
    price: number
    sku?: string
    quantity?: number
  }
  shipping: {
    id: string
    status: string
    carrier?: string
    logistic_type?: string
    tracking_number?: string
    date_shipped?: string
    date_delivered?: string
    receiver_city?: string
    receiver_state?: string
  }
  billing: {
    doc_type: string
    doc_number: string
    taxpayer_type?: string
    can_receive_factura_a: boolean
  }
  days_since_delivery?: number | null
  has_mediation?: boolean
  scenario?: {
    id: string
    name: string
    icon: string
  }
}

// ============================================
// FUNCIONES DE DETECCION Y MOCK
// ============================================

// Funcion para determinar el tipo de caso basado en el mensaje
function detectCaseType(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('factura') || lowerMessage.includes('cuit') || lowerMessage.includes('comprobante')) {
    return 'FACTURACION'
  }
  if (lowerMessage.includes('donde') || lowerMessage.includes('envio') || lowerMessage.includes('tracking') ||
      lowerMessage.includes('pedido') || lowerMessage.includes('seguimiento')) {
    return 'CONSULTA_ENVIO'
  }
  if (lowerMessage.includes('garantia') || lowerMessage.includes('garantía') || lowerMessage.includes('falla') ||
      lowerMessage.includes('defecto') || lowerMessage.includes('no funciona')) {
    return 'GARANTIA'
  }
  if (lowerMessage.includes('devol') || lowerMessage.includes('cambio') || lowerMessage.includes('reembolso')) {
    return 'DEVOLUCION'
  }
  if (lowerMessage.includes('compatible') || lowerMessage.includes('sirve') || lowerMessage.includes('funciona con')) {
    return 'COMPATIBILIDAD'
  }
  return 'CONSULTA_GENERAL'
}

// Respuestas mock para pruebas locales cuando n8n no esta disponible
function getMockResponse(simulation: SimulationData): { output: string; toolUsed?: string } {
  const message = simulation.message.toLowerCase()
  const buyerName = simulation.buyer?.first_name || 'Cliente'
  const orderStatus = simulation.shipping?.status || 'pending'
  const canReceiveFacturaA = simulation.billing?.can_receive_factura_a ?? false
  const daysSinceDelivery = simulation.days_since_delivery

  // Tracking / Donde esta mi pedido
  if (message.includes('donde') || message.includes('dónde') || message.includes('pedido') ||
      message.includes('envio') || message.includes('envío') || message.includes('seguimiento') ||
      message.includes('tracking') || message.includes('rastrear')) {

    if (orderStatus === 'delivered') {
      return {
        output: `Hola ${buyerName}! Tu pedido ya fue entregado hace ${daysSinceDelivery || 'algunos'} dias.\n\nSi no lo recibiste o tenes algun problema con el producto, por favor contame y te ayudo a resolverlo.\n\nSaludos, Tomi de MarIA S.A.`,
        toolUsed: 'tracking'
      }
    } else if (orderStatus === 'in_transit' || orderStatus === 'shipped') {
      return {
        output: `Hola ${buyerName}! Tu pedido esta en camino.\n\nEstado: En transito\nCarrier: ${simulation.shipping.carrier || 'MercadoEnvios'}\n${simulation.shipping.tracking_number ? `Tracking: ${simulation.shipping.tracking_number}` : ''}\n\nPodes seguir el envio desde MercadoLibre. Cualquier novedad te aviso!\n\nSaludos, Tomi de MarIA S.A.`,
        toolUsed: 'tracking'
      }
    } else {
      return {
        output: `Hola ${buyerName}! Tu pedido esta siendo preparado para el envio.\n\nEstado actual: ${orderStatus === 'pending' ? 'Pendiente de despacho' : orderStatus}\n\nDespachamos en 24-48hs habiles. Te llegara la notificacion cuando este en camino!\n\nSaludos, Tomi de MarIA S.A.`,
        toolUsed: 'tracking'
      }
    }
  }

  // Factura A
  if (message.includes('factura') || message.includes('comprobante') || message.includes('cuit')) {
    if (canReceiveFacturaA) {
      return {
        output: `Hola ${buyerName}! Veo que tenes CUIT registrado (${simulation.billing.doc_number}).\n\nTe puedo emitir Factura A sin problema. Necesito que me confirmes:\n- Razon social\n- Domicilio fiscal\n- Condicion de IVA\n\nUna vez que tengas estos datos, te genero la factura y te la envio por email.\n\nSaludos, Tomi de MarIA S.A.`,
        toolUsed: 'facturacion'
      }
    } else {
      return {
        output: `Hola ${buyerName}! Lamentablemente no puedo emitir Factura A porque tu cuenta esta registrada como Consumidor Final (DNI: ${simulation.billing.doc_number}).\n\nPara recibir Factura A necesitas:\n1. Tener CUIT\n2. Estar inscripto como Responsable Inscripto o Monotributista\n3. Actualizar tus datos fiscales en MercadoLibre\n\nSi cumples estos requisitos y actualizas tus datos, escribime de nuevo y te la genero.\n\nSaludos, Tomi de MarIA S.A.`,
        toolUsed: 'facturacion'
      }
    }
  }

  // Devolucion / Cambio
  if (message.includes('devol') || message.includes('cambio') || message.includes('cambiar') ||
      message.includes('reembolso') || message.includes('plata') || message.includes('dinero')) {

    if (daysSinceDelivery !== null && daysSinceDelivery !== undefined && daysSinceDelivery <= 30) {
      return {
        output: `Hola ${buyerName}! Lamento que no estes conforme con tu compra.\n\nPara la devolucion:\n1. Inicia el reclamo desde MercadoLibre\n2. Selecciona el motivo de devolucion\n3. Imprime la etiqueta de envio\n4. Envia el producto en su empaque original\n\nUna vez que recibamos el producto en condiciones, procesamos el reembolso.\n\nSi tenes alguna duda sobre el proceso, contame y te guio paso a paso.\n\nSaludos, Tomi de MarIA S.A.`,
        toolUsed: 'garantia'
      }
    } else {
      return {
        output: `Hola ${buyerName}! Veo que tu pedido fue entregado hace mas de 30 dias.\n\nLamentablemente ya paso el plazo de devolucion gratuita de MercadoLibre. Sin embargo, si el producto tiene un defecto de fabrica, nuestra garantia cubre 6 meses.\n\nContame que problema tenes con el producto y vemos como ayudarte.\n\nSaludos, Tomi de MarIA S.A.`,
        toolUsed: 'garantia'
      }
    }
  }

  // Garantia / Problema con producto
  if (message.includes('garantia') || message.includes('garantía') || message.includes('falla') ||
      message.includes('roto') || message.includes('defecto') || message.includes('no funciona') ||
      message.includes('no anda') || message.includes('problema')) {
    return {
      output: `Hola ${buyerName}! Lamento que tengas un problema con el producto.\n\nNuestra garantia cubre defectos de fabricacion por 6 meses. Para activarla necesito:\n\n1. Descripcion del problema\n2. Fotos o video del defecto\n3. Numero de orden (${simulation.order_id})\n\nUna vez que reciba esta info, evaluamos el caso y te damos una solucion: reparacion, cambio o reembolso segun corresponda.\n\nSaludos, Tomi de MarIA S.A.`,
      toolUsed: 'garantia'
    }
  }

  // Compatibilidad
  if (message.includes('compatible') || message.includes('sirve') || message.includes('funciona con') ||
      message.includes('entra')) {
    return {
      output: `Hola ${buyerName}! Para verificar compatibilidad necesito que me indiques:\n\n- Tu PC o notebook actual\n- Motherboard y procesador\n- Fuente de alimentacion (watts)\n\nCon esos datos te confirmo si el producto ${simulation.product.title} es compatible.\n\nSaludos, Tomi de MarIA S.A.`,
      toolUsed: 'buscar_catalogo'
    }
  }

  // Instalacion
  if (message.includes('instala') || message.includes('colocar') || message.includes('poner') ||
      message.includes('como se') || message.includes('cómo se')) {
    return {
      output: `Hola ${buyerName}! Para la instalacion de ${simulation.product.title} te recomiendo:\n\n1. Revisar el manual o instructivo incluido\n2. Ver tutoriales en YouTube para tu modelo especifico\n3. Descargar los drivers desde la web oficial del fabricante\n\nSi tenes alguna duda especifica sobre la instalacion, contame y te ayudo.\n\nSaludos, Tomi de MarIA S.A.`
    }
  }

  // Producto equivocado / faltante
  if (message.includes('equivocado') || message.includes('otro producto') || message.includes('falta') ||
      message.includes('incompleto') || message.includes('no es el')) {
    return {
      output: `Hola ${buyerName}! Lamento mucho el inconveniente.\n\nPara resolver esto necesito:\n1. Foto del producto que recibiste\n2. Foto de la etiqueta del paquete\n\nUna vez que reciba las fotos, gestiono el envio del producto correcto sin costo adicional.\n\nMil disculpas por el error!\n\nSaludos, Tomi de MarIA S.A.`,
      toolUsed: 'derivar_humano'
    }
  }

  // Respuesta generica
  return {
    output: `Hola ${buyerName}! Gracias por contactarnos.\n\nEstoy para ayudarte con:\n- Estado de tu envio\n- Facturacion\n- Garantia y devoluciones\n- Consultas sobre el producto\n\nContame en que puedo asistirte.\n\nSaludos, Tomi de MarIA S.A.`
  }
}

// ============================================
// FUNCIONES DE BASE DE DATOS - CONVERSACIONES
// ============================================

// Buscar o crear una conversacion
async function findOrCreateConversation(simulation: SimulationData, caseType: string): Promise<string | null> {
  try {
    const buyerId = simulation.buyer?.id
    const orderId = simulation.order_id

    if (!buyerId) {
      console.error('No buyer_id provided')
      return null
    }

    // Buscar conversacion existente por order_id y buyer_id
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('id')
      .eq('buyer_id', buyerId)
      .eq('order_id', orderId)
      .single()

    if (existingConv) {
      console.log('Found existing conversation:', existingConv.id)

      // Actualizar la conversacion con nuevo case_type y timestamp
      await supabase
        .from('conversations')
        .update({
          case_type: caseType,
          ai_handled: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingConv.id)

      return existingConv.id
    }

    // Crear nueva conversacion
    const buyerName = simulation.buyer
      ? `${simulation.buyer.first_name} ${simulation.buyer.last_name}`.trim()
      : null

    const { data: newConv, error } = await supabase
      .from('conversations')
      .insert({
        order_id: orderId,
        channel: 'mercadolibre',
        buyer_id: buyerId,
        buyer_name: buyerName,
        buyer_nickname: simulation.buyer?.nickname || null,
        status: 'in_progress',
        case_type: caseType,
        ai_handled: true,
        escalated: false
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating conversation:', error)
      return null
    }

    console.log('Created new conversation:', newConv?.id)
    return newConv?.id || null

  } catch (err) {
    console.error('Exception in findOrCreateConversation:', err)
    return null
  }
}

// Guardar mensaje del comprador
async function saveBuyerMessage(
  conversationId: string,
  content: string,
  sentAt?: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        direction: 'inbound',
        sender_type: 'buyer',
        content: content,
        sent_at: sentAt || new Date().toISOString()
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error saving buyer message:', error)
      return null
    }

    console.log('Buyer message saved:', data?.id)
    return data?.id || null

  } catch (err) {
    console.error('Exception saving buyer message:', err)
    return null
  }
}

// Guardar respuesta de IA
async function saveAIMessage(
  conversationId: string,
  content: string,
  toolUsed?: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        direction: 'outbound',
        sender_type: 'ai',
        content: content,
        tool_used: toolUsed || null,
        sent_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error saving AI message:', error)
      return null
    }

    console.log('AI message saved:', data?.id)
    return data?.id || null

  } catch (err) {
    console.error('Exception saving AI message:', err)
    return null
  }
}

// Guardar interaccion en agent_interactions (para historial IA)
async function saveInteraction(
  simulation: SimulationData,
  aiResponse: string,
  toolUsed: string | undefined,
  caseType: string,
  wasEscalated: boolean = false,
  escalationReason: string | null = null,
  wasSentToML: boolean = true,
  n8nExecutionId: string | null = null
) {
  try {
    const interactionData = {
      buyer_id: simulation.buyer?.id || null,
      buyer_nickname: simulation.buyer?.nickname || null,
      buyer_name: simulation.buyer ? `${simulation.buyer.first_name} ${simulation.buyer.last_name}`.trim() : null,
      pack_id: `pack-${simulation.order_id}`,
      order_id: simulation.order_id,
      message_original: simulation.message,
      ai_response: aiResponse,
      case_type: caseType,
      was_escalated: wasEscalated,
      escalation_reason: escalationReason,
      source: 'postventa',
      was_sent_to_ml: wasSentToML,
      ml_response_status: wasSentToML ? 'sent' : null,
      n8n_execution_id: n8nExecutionId,
      workflow_id: 'postventa-demo'
    }

    const { data, error } = await supabase
      .from('agent_interactions')
      .insert(interactionData)
      .select()
      .single()

    if (error) {
      console.error('Error saving interaction:', error)
    } else {
      console.log('Interaction saved:', data?.id)
    }

    return data
  } catch (err) {
    console.error('Exception saving interaction:', err)
    return null
  }
}

// ============================================
// ENDPOINT PRINCIPAL
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extraer datos de simulacion
    const simulation: SimulationData | undefined = body._simulation

    if (!simulation) {
      return NextResponse.json(
        { error: 'Missing _simulation data in payload' },
        { status: 400 }
      )
    }

    let responseData: { output: string; toolUsed?: string }
    let n8nExecutionId: string | null = null

    // Detectar tipo de caso
    const caseType = detectCaseType(simulation.message)
    const wasEscalated = false
    let escalationReason: string | null = null

    // Intentar n8n si esta habilitado
    if (USE_N8N) {
      try {
        const response = await fetch(POSTVENTA_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Postventa: respuesta de n8n workflow')
          responseData = data
          n8nExecutionId = data.executionId || null

          // Guardar todo en Supabase
          await saveAllToDatabase(
            simulation,
            data.output || data.response,
            data.toolUsed,
            caseType,
            data.wasEscalated || false,
            data.escalationReason || null,
            true,
            n8nExecutionId
          )

          return NextResponse.json(data)
        }

        console.log('n8n postventa webhook not available, using mock response')
      } catch {
        console.log('n8n postventa webhook connection error, using mock response')
      }
    }

    // Fallback: Usar respuesta mock
    responseData = getMockResponse(simulation)

    // Detectar si fue escalado
    const isEscalated = responseData.toolUsed === 'derivar_humano'
    if (isEscalated) {
      escalationReason = 'Caso requiere atencion humana'
    }

    // Guardar todo en Supabase
    await saveAllToDatabase(
      simulation,
      responseData.output,
      responseData.toolUsed,
      caseType,
      isEscalated,
      escalationReason,
      true,
      null
    )

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Error in postventa API:', error)
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    )
  }
}

// Funcion auxiliar para guardar todo en la base de datos
async function saveAllToDatabase(
  simulation: SimulationData,
  aiResponse: string,
  toolUsed: string | undefined,
  caseType: string,
  wasEscalated: boolean,
  escalationReason: string | null,
  wasSentToML: boolean,
  n8nExecutionId: string | null
) {
  // 1. Buscar o crear conversacion
  const conversationId = await findOrCreateConversation(simulation, caseType)

  if (conversationId) {
    // 2. Guardar mensaje del comprador
    await saveBuyerMessage(conversationId, simulation.message)

    // 3. Guardar respuesta de IA
    await saveAIMessage(conversationId, aiResponse, toolUsed)

    // 4. Si fue escalado, actualizar conversacion
    if (wasEscalated) {
      await supabase
        .from('conversations')
        .update({
          escalated: true,
          status: 'escalated',
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId)
    }
  }

  // 5. Guardar en agent_interactions (historial IA)
  await saveInteraction(
    simulation,
    aiResponse,
    toolUsed,
    caseType,
    wasEscalated,
    escalationReason,
    wasSentToML,
    n8nExecutionId
  )
}
