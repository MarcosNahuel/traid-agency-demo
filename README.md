# CRM Postventa Multi-Canal con IA

## Demo: MarIA S.A. - Tienda Gaming

Sistema CRM para gestion de consultas postventa con agentes de IA que responden automaticamente y escalan a humanos cuando es necesario.

![Dashboard Preview](./image.png)

---

## Caracteristicas Principales

### Canales Integrados
- **MercadoLibre** - Mensajes, ordenes, envios
- **Shopify** - Ordenes y clientes
- **Tienda Nube** - Ordenes y productos
- **CRM/ERP** - API abierta para integraciones

### Agentes IA Incluidos
| Agente | Tipo | Funcion |
|--------|------|---------|
| **Barbi** | Preventa | Stock, compatibilidad, precios, envios |
| **Tomi** | Postventa | Tracking, facturacion, devoluciones |
| **Sofi** | Soporte | Garantias, troubleshooting tecnico |

### Modulos del Sistema
| Modulo | Descripcion |
|--------|-------------|
| **Dashboard** | Metricas de ventas, stock y performance IA |
| **Conversaciones** | CRM en tiempo real con historial |
| **Soporte** | Panel de casos escalados a humanos |
| **Stock** | Alertas de reposicion y metricas |
| **Historial IA** | Log de todas las interacciones |
| **Agentes** | Configuracion y pruebas de agentes IA |

---

## Inicio Rapido

### Opcion 1: Demo sin backend (5 minutos)

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/crm-postventa-demo.git
cd crm-postventa-demo

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Abrir http://localhost:3000 - El sistema funciona 100% con datos mock.

### Opcion 2: Demo completo con Supabase

#### 1. Crear proyecto en Supabase
- Ir a https://supabase.com
- Crear nuevo proyecto
- Copiar URL y ANON_KEY

#### 2. Ejecutar migraciones
En el SQL Editor de Supabase, ejecutar en orden:

```sql
-- 1. Tablas base
-- Copiar contenido de: supabase/migrations/001_create_base_tables.sql

-- 2. Funciones y vistas
-- Copiar contenido de: supabase/migrations/002_create_functions.sql

-- 3. Datos de ejemplo
-- Copiar contenido de: supabase/seed/001_seed_demo_data.sql
```

#### 3. Configurar variables
```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase
```

#### 4. Ejecutar
```bash
npm install
npm run dev
```

---

## Workflows n8n

El directorio `n8n-workflows/` contiene 5 workflows listos para importar:

| Archivo | Descripcion | Webhook |
|---------|-------------|---------|
| `01-agente-postventa-supabase.json` | Agente IA postventa | `/webhook/postventa-demo` |
| `02-agente-preventa-supabase.json` | Agente IA preventa | `/webhook/preventa-demo` |
| `03-refresh-stock-metrics.json` | Recalculo de metricas | `/webhook/refresh-stock` |
| `04-gestor-escalaciones.json` | Gestion de escalaciones | `/webhook/escalation-update` |
| `05-dashboard-api.json` | API de estadisticas | `/webhook/dashboard-stats` |

### Como importar en n8n

1. Abrir tu instancia de n8n
2. Ir a **Workflows > Import from File**
3. Seleccionar cada archivo JSON
4. Activar los workflows

### Configurar credenciales

1. Crear credencial **HTTP Header Auth** con nombre `supabase-auth`
2. Configurar:
   - Header Name: `apikey`
   - Header Value: `TU_SUPABASE_ANON_KEY`

### Variables de entorno en n8n

Configurar en Settings > Variables:
```
SUPABASE_URL = https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY = tu_anon_key
```

---

## Estructura del Proyecto

```
crm-postventa-demo/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Pagina principal (selector)
│   ├── dashboard/               # Dashboard analytics
│   ├── conversaciones/          # Panel CRM
│   ├── soporte/                 # Casos escalados
│   ├── historial/               # Log de IA
│   ├── api/                     # Endpoints API
│   │   ├── preventa/           # POST /api/preventa
│   │   ├── postventa/          # POST /api/postventa
│   │   └── dashboard/stock/    # GET /api/dashboard/stock
│   ├── components/              # Componentes React
│   └── hooks/                   # Custom hooks
├── lib/                         # Utilidades
│   └── supabase/               # Clientes Supabase
├── public/
│   └── data/
│       └── demo/               # Datos sinteticos MarIA S.A.
│           ├── products.json   # 55 productos gaming
│           ├── orders.json     # 15 ordenes multi-canal
│           ├── conversations.json
│           ├── escalations.json
│           └── agents.json     # 3 agentes IA
├── supabase/
│   ├── migrations/             # DDL SQL
│   │   ├── 001_create_base_tables.sql
│   │   └── 002_create_functions.sql
│   └── seed/                   # Datos iniciales
│       └── 001_seed_demo_data.sql
├── n8n-workflows/              # 5 workflows importables
│   ├── 01-agente-postventa-supabase.json
│   ├── 02-agente-preventa-supabase.json
│   ├── 03-refresh-stock-metrics.json
│   ├── 04-gestor-escalaciones.json
│   └── 05-dashboard-api.json
└── types/                      # TypeScript definitions
```

---

## Datos de Demo - MarIA S.A.

### Empresa Ficticia
- **Nombre:** MarIA S.A.
- **Rubro:** Tecnologia Gaming & Computacion
- **Slogan:** "Tu aliado gamer desde 2018"

### Productos (55 items)
| Categoria | Cantidad | Ejemplos |
|-----------|----------|----------|
| PCs Gaming | 7 | Starter, Mid, Pro, Ultra, Extreme |
| Notebooks | 7 | HP, Lenovo, Acer, ASUS, MacBook |
| Placas de Video | 10 | GTX 1650 a RTX 4090, RX 7800 XT |
| Monitores | 6 | 24" a 32", 75Hz a 240Hz |
| Perifericos | 12 | Teclados, mouses, auriculares |
| Sillas | 3 | Primus, Corsair, Secretlab |
| Componentes | 10 | RAM, SSD, fuentes, gabinetes |

### Ordenes de Ejemplo (15)
- 60% MercadoLibre
- 25% Shopify
- 15% Tienda Nube

### Escenarios de Prueba
1. **Tracking** - "Donde esta mi pedido?"
2. **Facturacion** - "Necesito factura A" (CUIT vs DNI)
3. **Devolucion** - Dentro y fuera del plazo de 30 dias
4. **Garantia** - Pixel muerto, fallas tecnicas
5. **Compatibilidad** - Consultas tecnicas
6. **Instalacion** - Como armar/configurar
7. **Agradecimiento** - Cliente satisfecho

---

## API Reference

### POST /api/preventa
Chat de preventa con contexto de producto.

```json
// Request
{
  "chatInput": "MLA123456 - Tienen stock?",
  "sessionId": "session-123"
}

// Response
{
  "text": "Hola! Si, tenemos stock de..."
}
```

### POST /api/postventa
Chat de postventa con contexto de orden.

```json
// Request
{
  "_simulation": {
    "is_test": true,
    "order_id": "ML-2000010050001001",
    "message": "Donde esta mi pedido?",
    "buyer": {
      "first_name": "Martin",
      "last_name": "Rodriguez"
    },
    "product": {
      "title": "NVIDIA RTX 4060",
      "sku": "GPU-4060-001"
    },
    "shipping": {
      "status": "in_transit",
      "tracking_number": "MEL123456"
    }
  }
}

// Response
{
  "output": "Hola Martin! Tu pedido esta en camino...",
  "toolUsed": "tracking_lookup"
}
```

### GET /api/dashboard/stock
Metricas de stock con alertas de reposicion.

```json
// Response
{
  "success": true,
  "data": {
    "summary": {
      "total_items": 55,
      "critical_count": 3,
      "warning_count": 5
    },
    "alerts": [...],
    "top_rotation": [...]
  }
}
```

---

## Deployment

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

Configurar en Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Stack Tecnologico

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Realtime)
- **Automatizacion:** n8n workflows
- **Charts:** Recharts
- **Icons:** Lucide React

---

## Soporte

- **Documentacion:** Este README
- **Issues:** GitHub Issues
- **Web:** https://traidagency.com
- **Email:** contacto@traidagency.com

---

## Licencia

MIT License - TraidAgency 2024
