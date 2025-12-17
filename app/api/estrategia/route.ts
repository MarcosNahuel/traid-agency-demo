import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - List all strategies
export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('ai_strategies')
      .select('*')
      .order('type', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching strategies:', error)
      return NextResponse.json(
        { error: 'Error al obtener estrategias' },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error in GET /api/estrategia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Create new strategy
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, prompt, type, is_active = true } = body

    if (!name || !prompt) {
      return NextResponse.json(
        { error: 'Nombre y prompt son requeridos' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('ai_strategies')
      .insert({
        name,
        description: description || '',
        prompt,
        type: type || 'general',
        is_active
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating strategy:', error)
      return NextResponse.json(
        { error: 'Error al crear estrategia' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/estrategia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Update strategy
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID de estrategia requerido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    }

    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.prompt !== undefined) updateData.prompt = updates.prompt
    if (updates.type !== undefined) updateData.type = updates.type
    if (updates.is_active !== undefined) updateData.is_active = updates.is_active

    const { data, error } = await supabase
      .from('ai_strategies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating strategy:', error)
      return NextResponse.json(
        { error: 'Error al actualizar estrategia' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in PUT /api/estrategia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Delete strategy
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de estrategia requerido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('ai_strategies')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting strategy:', error)
      return NextResponse.json(
        { error: 'Error al eliminar estrategia' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/estrategia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
