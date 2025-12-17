import { NextRequest, NextResponse } from 'next/server'

// Demo version - returns mock conversation data
// In production, this would connect to MercadoLibre API

interface ConversationMessage {
  id: string
  from: 'buyer' | 'seller'
  text: string
  date: string
  read: boolean
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const packId = searchParams.get('packId')
    const orderId = searchParams.get('orderId')

    if (!packId && !orderId) {
      return NextResponse.json(
        { error: 'Se requiere packId o orderId' },
        { status: 400 }
      )
    }

    // Demo: Generate mock conversation based on order/pack
    const mockMessages: ConversationMessage[] = [
      {
        id: '1',
        from: 'buyer',
        text: 'Hola, tengo una consulta sobre mi pedido',
        date: new Date(Date.now() - 3600000 * 2).toISOString(),
        read: true
      },
      {
        id: '2',
        from: 'seller',
        text: 'Hola! Claro, en que puedo ayudarte?',
        date: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        read: true
      },
      {
        id: '3',
        from: 'buyer',
        text: 'Necesito saber el estado de mi envio',
        date: new Date(Date.now() - 3600000).toISOString(),
        read: true
      }
    ]

    const result = {
      messages: mockMessages,
      product: {
        id: 'MLA1234567890',
        title: 'PC Gamer Pro RTX 4070',
        sku: 'PC-HIGH-001',
        price: 1200000,
        quantity: 1,
        thumbnail: null
      },
      shipping: {
        status: 'delivered',
        delivered_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        days_since_delivery: 5
      },
      buyer: {
        id: 123456789,
        nickname: 'COMPRADOR_DEMO',
        name: 'Cliente Demo'
      },
      order: {
        id: parseInt(orderId || '2000010000000001'),
        total: 1200000,
        date: new Date(Date.now() - 86400000 * 10).toISOString()
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in get-conversation API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
