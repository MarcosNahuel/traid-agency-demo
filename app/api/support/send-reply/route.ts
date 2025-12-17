import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Redis from 'ioredis'

// Redis connection config
const REDIS_HOST = process.env.REDIS_HOST || 'horsepower-redis.e5l6dk.easypanel.host'
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379')
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'horsepower'

// Redis client singleton
let redisClient: Redis | null = null

function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null
        return Math.min(times * 100, 3000)
      },
    })

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err.message)
    })
  }
  return redisClient
}

async function getMLToken(): Promise<string | null> {
  // Primary method: try n8n webhook (works from anywhere, including Vercel)
  try {
    const response = await fetch('https://horsepower-n8n.e5l6dk.easypanel.host/webhook/get-ml-token', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    if (response.ok) {
      const data = await response.json()
      if (data.token) {
        console.log('ML token retrieved via n8n webhook')
        return data.token
      }
    }
  } catch (webhookError) {
    console.log('n8n webhook not available, trying direct Redis...')
  }

  // Fallback: try direct Redis (only works within EasyPanel network)
  try {
    const redis = getRedisClient()
    const token = await redis.get('melipablo')
    if (token) {
      console.log('ML token retrieved via direct Redis')
      return token
    }
  } catch (error) {
    console.error('Direct Redis also failed:', error instanceof Error ? error.message : error)
  }

  console.warn('Could not retrieve ML token from any source')
  return null
}

async function getBuyerIdFromPack(packId: string, token: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.mercadolibre.com/messages/packs/${packId}/sellers/1074767186?tag=post_sale&limit=1`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    )
    if (response.ok) {
      const data = await response.json()
      // Find a message from buyer (not from seller)
      const buyerMessage = data.messages?.find((m: { from: { user_id: number } }) =>
        m.from.user_id !== 1074767186
      )
      if (buyerMessage) {
        return buyerMessage.from.user_id.toString()
      }
      // If no buyer message, check the "to" field of seller messages
      const sellerMessage = data.messages?.find((m: { from: { user_id: number } }) =>
        m.from.user_id === 1074767186
      )
      if (sellerMessage?.to?.user_id) {
        return sellerMessage.to.user_id.toString()
      }
    }
  } catch (error) {
    console.error('Error getting buyer ID from pack:', error)
  }
  return null
}

async function sendMessageToML(
  packId: string,
  message: string,
  token: string,
  buyerId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // If no buyerId provided, fetch it from the pack
    let targetBuyerId = buyerId
    if (!targetBuyerId) {
      targetBuyerId = await getBuyerIdFromPack(packId, token) || undefined
    }

    if (!targetBuyerId) {
      return {
        success: false,
        error: 'No se pudo determinar el buyer_id para enviar el mensaje'
      }
    }

    // MercadoLibre Messages API - POST with tag=post_sale
    const response = await fetch(
      `https://api.mercadolibre.com/messages/packs/${packId}/sellers/1074767186?tag=post_sale`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-format-new': 'true'
        },
        body: JSON.stringify({
          from: {
            user_id: 1074767186 // Seller ID
          },
          to: {
            user_id: parseInt(targetBuyerId)
          },
          text: message
        })
      }
    )

    if (response.ok || response.status === 201) {
      const data = await response.json()
      console.log('Message sent to ML successfully:', data.id)
      return { success: true }
    }

    const errorData = await response.json()
    console.error('ML API error:', errorData)
    return {
      success: false,
      error: errorData.message || `ML API returned ${response.status}`
    }
  } catch (error) {
    console.error('Error sending message to ML:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { escalationId, message, packId, buyerId } = body

    if (!escalationId || !message) {
      return NextResponse.json(
        { error: 'Missing escalationId or message' },
        { status: 400 }
      )
    }

    // If we have a packId, try to send to ML
    let mlSent = false
    let mlError: string | undefined

    if (packId) {
      // Get ML token only if we need to send to ML
      const token = await getMLToken()

      if (!token) {
        mlError = 'Could not retrieve ML token'
        console.warn('ML token not available, skipping ML send')
      } else {
        const result = await sendMessageToML(packId, message, token, buyerId)
        mlSent = result.success
        mlError = result.error
      }
    }

    // Update escalation in Supabase
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {
      human_response: message,
      updated_at: new Date().toISOString()
    }

    // If sent to ML, mark as sent
    if (mlSent) {
      updateData.ml_response_sent = true
      updateData.ml_response_sent_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase
      .from('support_escalations')
      .update(updateData)
      .eq('id', escalationId)

    if (updateError) {
      console.error('Supabase update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update escalation in database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      mlSent,
      mlError,
      message: mlSent
        ? 'Respuesta enviada a MercadoLibre y guardada'
        : packId
          ? `Respuesta guardada pero no enviada a ML: ${mlError}`
          : 'Respuesta guardada (sin pack_id para enviar a ML)'
    })

  } catch (error) {
    console.error('Error in send-reply API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
