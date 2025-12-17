import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PROMPT_FILE = path.join(process.cwd(), 'data', 'system-prompt.json');

// Upstash Redis REST API (Free tier - no SDK needed)
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const KV_KEY = 'system-prompt';

// API Key para proteger el endpoint
const API_KEY = process.env.SYSTEM_PROMPT_API_KEY;

// Validar API Key
function validateApiKey(request: NextRequest): boolean {
  if (!API_KEY) return true;
  const authHeader = request.headers.get('authorization');
  const apiKeyHeader = request.headers.get('x-api-key');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7) === API_KEY;
  }
  return apiKeyHeader === API_KEY;
}

// Leer de Upstash Redis
async function readFromUpstash(): Promise<unknown | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;

  try {
    const response = await fetch(`${UPSTASH_URL}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store'
    });
    const data = await response.json();
    if (data.result) {
      return JSON.parse(data.result);
    }
    return null;
  } catch (error) {
    console.error('Error reading from Upstash:', error);
    return null;
  }
}

// Escribir a Upstash Redis
async function writeToUpstash(data: unknown): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;

  try {
    const jsonData = JSON.stringify(data);
    // Upstash REST API format: POST /set/key/value
    const response = await fetch(`${UPSTASH_URL}/set/${KV_KEY}/${encodeURIComponent(jsonData)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`
      }
    });
    const result = await response.json();
    return result.result === 'OK';
  } catch (error) {
    console.error('Error writing to Upstash:', error);
    return false;
  }
}

// Leer del archivo local (fallback)
async function readFromFile(): Promise<unknown | null> {
  try {
    const data = await fs.readFile(PROMPT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// GET - Obtener el system prompt
export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({
      success: false,
      message: 'API Key invalida o faltante'
    }, { status: 401 });
  }

  try {
    // Intentar leer de Upstash primero
    let data = await readFromUpstash();

    // Si no hay datos en Upstash, leer del archivo
    if (!data) {
      data = await readFromFile();
    }

    if (data && typeof data === 'object' && 'prompt' in data) {
      const typedData = data as { prompt: string; strategies?: unknown[]; updatedAt?: string };
      return NextResponse.json({
        success: true,
        prompt: typedData.prompt,
        strategies: typedData.strategies || [],
        updatedAt: typedData.updatedAt,
        source: UPSTASH_URL ? 'upstash' : 'file'
      });
    }

    return NextResponse.json({
      success: false,
      message: 'No hay prompt guardado.',
      prompt: null
    }, { status: 404 });

  } catch (error) {
    console.error('Error reading prompt:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al leer el prompt'
    }, { status: 500 });
  }
}

// POST - Guardar el system prompt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, strategies } = body;

    if (!prompt) {
      return NextResponse.json({
        success: false,
        message: 'El prompt es requerido'
      }, { status: 400 });
    }

    const data = {
      prompt,
      strategies: strategies || [],
      updatedAt: new Date().toISOString()
    };

    // Intentar guardar en Upstash
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      const saved = await writeToUpstash(data);
      if (saved) {
        return NextResponse.json({
          success: true,
          message: 'System prompt guardado en Upstash',
          updatedAt: data.updatedAt,
          storage: 'upstash'
        });
      }
    }

    // Fallback: intentar guardar en archivo (solo funciona en dev)
    try {
      const dir = path.dirname(PROMPT_FILE);
      await fs.mkdir(dir, { recursive: true }).catch(() => {});
      await fs.writeFile(PROMPT_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return NextResponse.json({
        success: true,
        message: 'System prompt guardado localmente',
        updatedAt: data.updatedAt,
        storage: 'file'
      });
    } catch {
      return NextResponse.json({
        success: false,
        message: 'Error: Configura UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN en Vercel. Visita https://upstash.com para crear una DB gratuita.'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error guardando prompt:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al guardar el prompt'
    }, { status: 500 });
  }
}
