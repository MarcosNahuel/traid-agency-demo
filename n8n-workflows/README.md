# Workflows n8n para Soporte Postventa

Este directorio contiene los workflows de n8n necesarios para el sistema de soporte postventa.

## Workflows incluidos

### 1. `get-ml-token-webhook.json`
**Endpoint:** `GET /webhook/get-ml-token`

Webhook que devuelve el token de MercadoLibre almacenado en Redis.
- Lee el token de Redis (key: `melipablo`)
- Retorna `{ token: "..." }`

**Uso:** El frontend llama este webhook para obtener el token cuando necesita enviar mensajes a ML.

### 2. `postventa-enrich-escalation.json`
**Endpoint:** `POST /webhook/enrich-escalation`

Enriquece una escalacion con datos del producto, envio y mensaje original.
- Recibe: `{ escalation_id, order_id, pack_id }`
- Obtiene datos del order desde ML API
- Obtiene mensajes del pack desde ML API
- Actualiza la escalacion en Supabase con:
  - `product_title`, `product_sku`, `product_price`
  - `envio_status`, `envio_fecha_entrega`, `envio_dias_desde_entrega`
  - `original_message`, `buyer_name`

### 3. `sync-stock-ml-v2.json`
Sync diario (cada 6 horas) de items y ordenes de ML a Supabase.

### 4. `sync-orders-full.json`
Sync manual completo de ordenes (365 dias). Ejecutar una vez para cargar historial.

### 5. `sync-stock-ml.json`
Version anterior del sync de stock (deprecado, usar v2).

## Instrucciones de instalacion

### Paso 1: Importar workflows
1. Ir a n8n: https://horsepower-n8n.e5l6dk.easypanel.host
2. Para cada archivo JSON:
   - Click en "Add Workflow" > "Import from File"
   - Seleccionar el archivo JSON
   - Guardar el workflow

### Paso 2: Configurar credenciales
Los workflows usan las siguientes credenciales que deben estar configuradas:
- **Redis account** (id: HQzKm3HsLa8ODBdx): Conexion a Redis
- **Supabase account** (id: Bjo1rbDdp4dLUimX): API de Supabase

### Paso 3: Activar webhooks
1. Abrir cada workflow con webhook
2. Click en el toggle "Active" en la esquina superior derecha
3. Verificar que el webhook aparece en la URL de produccion

### Paso 4: Probar endpoints
```bash
# Test get-ml-token
curl https://horsepower-n8n.e5l6dk.easypanel.host/webhook/get-ml-token

# Test enrich-escalation (requiere escalacion valida)
curl -X POST https://horsepower-n8n.e5l6dk.easypanel.host/webhook/enrich-escalation \
  -H "Content-Type: application/json" \
  -d '{"escalation_id": "uuid-here", "order_id": "123456", "pack_id": "789012"}'
```

## Credenciales de Redis

El token de MercadoLibre se almacena en Redis con la key `melipablo`. Este token es gestionado por un workflow separado de autenticacion OAuth que lo renueva automaticamente.

## Arquitectura

```
[Frontend Next.js]
      |
      v
[/api/support/send-reply] ---> [n8n /webhook/get-ml-token] ---> [Redis]
      |                                      |
      v                                      v
[Supabase]                            [ML Messages API]
```

## Tablas de Supabase relacionadas

- `support_escalations`: Casos escalados para atencion humana
- `ml_items`: Items sincronizados de MercadoLibre
- `ml_orders_items`: Items de ordenes de MercadoLibre
