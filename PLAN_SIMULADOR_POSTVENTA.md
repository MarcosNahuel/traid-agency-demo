# Plan: Simulador de Postventa Integrado en tienda-frontend-meli

## Objetivo
Agregar a la aplicación existente `tienda-frontend-meli` la capacidad de **simular una compra** de cualquier producto y luego interactuar con el agente de postventa como si fuera un comprador real, sin afectar órdenes reales de MercadoLibre.

---

## Análisis del Problema

### Lo que solicita el cliente (Mensajeria ML):
1. **Factura A**: Ver datos fiscales, adjuntar factura, corregir datos
2. **Estado de pedido**: Tracking, entregas Flex/Treggo, 2 visitas fallidas
3. **Productos**: Instalación, compatibilidad, devoluciones (dentro de 28 días)

### Limitaciones técnicas:
- **NO podemos crear órdenes reales** en MercadoLibre (solo ML puede)
- **NO podemos afectar órdenes existentes** (devoluciones reales, facturas reales)
- **SÍ podemos leer** datos de órdenes reales para simular escenarios

### Solución propuesta:
Crear un **modo simulación híbrido** que:
1. Use datos REALES de órdenes existentes como "plantilla"
2. Permita al usuario "comprar" cualquier producto del catálogo
3. Genere una orden SIMULADA con datos realistas
4. Envíe mensajes al agente de n8n con contexto de la orden simulada
5. El agente responda usando las herramientas reales (pero en modo lectura)

---

## Arquitectura Propuesta

### 1. Base de Datos Local de Órdenes Reales (JSON/localStorage)

Traer ~50 órdenes reales de MercadoLibre para usar como:
- Plantillas de datos (shipment_id, billing_info, estados)
- Escenarios de prueba predefinidos
- Referencias de productos vendidos

```json
{
  "orders": [
    {
      "id": "2000010039409178",
      "product": {
        "id": "MLA1575488578",
        "title": "Carburador Keihin Pwk...",
        "price": 78500
      },
      "buyer": { "id": "3909057", "nickname": "MARIANOFRANCESCHI" },
      "shipping": { "id": "44171781349", "status": "delivered" },
      "date_created": "2024-12-03",
      "billing_info": { "doc_type": "CUIT", "doc_number": "..." }
    }
  ]
}
```

### 2. Flujo de Usuario en la Aplicación

```
[Catálogo de Productos]
        ↓
[Usuario ve producto] → [Click "Simular Compra"]
        ↓
[Modal: Configurar Orden Simulada]
   - Seleccionar escenario (entregado, en camino, con reclamo)
   - Datos del comprador (simulado o basado en orden real)
   - Tipo de envío (Flex/Full/Normal)
        ↓
[Orden Simulada Creada en localStorage]
        ↓
[Vista "Mis Compras Simuladas"]
   - Lista de órdenes simuladas
   - Click en orden → Chat Postventa
        ↓
[Chat Postventa]
   - Contexto completo de la orden
   - Mensajes al webhook de n8n
   - Respuestas del agente
```

### 3. Componentes a Crear/Modificar

#### A. En `tienda-frontend-meli` (existente):

**Nuevos componentes:**
- `SimulatePurchaseModal.tsx` - Modal para configurar la compra simulada
- `MyPurchases.tsx` - Vista de "Mis Compras" simuladas
- `PostSaleChat.tsx` - Chat de postventa para orden específica
- `OrderDetail.tsx` - Detalle de orden simulada

**Modificar:**
- `ProductDetail.tsx` - Agregar botón "Simular Compra"
- `page.tsx` - Agregar navegación a "Mis Compras"

#### B. Datos Mock/Reales:

**Archivo: `data/real-orders.json`**
- 50 órdenes reales extraídas de la API
- Datos de envío, billing, estados
- Se usa como plantilla para simulaciones

**Archivo: `data/test-scenarios.json`**
- Escenarios predefinidos (orden entregada, en tránsito, con reclamo, etc.)
- Configuraciones típicas para testing

### 4. Lógica del Simulador

```typescript
interface SimulatedOrder {
  id: string;                    // "SIM-{timestamp}"
  realOrderTemplate?: string;    // ID de orden real usada como base
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
  buyer: {
    name: string;
    id: string;
    canReceiveFacturaA: boolean; // CUIT válido vs DNI
  };
  shipping: {
    id: string;
    status: 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'not_delivered';
    carrier: 'mercadoenvios' | 'flex' | 'treggo';
    estimatedDelivery: string;
    failedAttempts?: number;     // Para simular 2 visitas Treggo
  };
  createdAt: Date;
  scenario: 'normal' | 'factura_a' | 'devolucion' | 'flex_failed' | 'compatibility';
}
```

### 5. Integración con el Agente de n8n

El webhook recibirá un payload enriquecido:

```json
{
  "topic": "messages",
  "resource": "sim-msg-{timestamp}",
  "user_id": "1074767186",
  "_simulation": {
    "is_test": true,
    "order_id": "SIM-1234567890",
    "real_order_template": "2000010039409178",
    "message": "¿Dónde está mi pedido?",
    "buyer": { "id": "999999", "name": "Usuario Prueba" },
    "shipping": { "id": "44171781349", "status": "in_transit" },
    "product": { "id": "MLA1575488578", "title": "Carburador..." }
  }
}
```

El agente de n8n deberá:
1. Detectar `_simulation.is_test === true`
2. Usar los datos de `_simulation` en lugar de llamar APIs reales
3. O llamar APIs reales pero en modo lectura (sin modificar nada)

---

## Escenarios de Prueba Predefinidos

| Escenario | Estado Envío | Billing | Descripción |
|-----------|-------------|---------|-------------|
| Normal Entregado | delivered | DNI | Orden típica completada |
| Pendiente Envío | pending | CUIT | Esperando despacho |
| En Tránsito | in_transit | DNI | Viajando al destino |
| Flex 2 Visitas | not_delivered | DNI | Treggo falló 2 veces → cancelar |
| Quiere Factura A | delivered | CUIT | Comprador monotributista |
| Devolución <28d | delivered | DNI | Dentro del plazo de devolución |
| Devolución >28d | delivered | DNI | Fuera del plazo |
| Incompatibilidad | delivered | DNI | Repuesto no compatible |

---

## Funcionalidades Específicas a Probar

### 1. Factura A
- **Simular comprador con CUIT válido** → Agente debe ofrecer adjuntar factura
- **Simular comprador con DNI** → Agente debe explicar que solo Factura B

### 2. Estado de Envío
- **Flex en tránsito** → Agente consulta Treggo (simulado)
- **2 visitas fallidas** → Agente informa que debe cancelarse
- **Entregado** → Agente confirma entrega

### 3. Devolución
- **Dentro de 28 días** → Agente ofrece generar devolución
- **Fuera de 28 días** → Agente indica analizar caso

### 4. Compatibilidad
- **Pregunta sobre vehículo** → Agente verifica compatibilidad del ítem

---

## Implementación por Fases

### Fase 1: Base de Datos de Órdenes Reales
- [ ] Extraer 50 órdenes reales con todos los datos
- [ ] Crear `data/real-orders.json`
- [ ] Crear `data/test-scenarios.json`

### Fase 2: Componentes de Simulación
- [ ] `SimulatePurchaseModal.tsx`
- [ ] `MyPurchases.tsx`
- [ ] Modificar `ProductDetail.tsx`
- [ ] Hook `useSimulatedOrders.ts`

### Fase 3: Chat de Postventa
- [ ] `PostSaleChat.tsx` (similar al existente pero con contexto de orden)
- [ ] Integración con webhook de n8n
- [ ] Manejo de respuestas

### Fase 4: Pruebas y Ajustes
- [ ] Probar todos los escenarios
- [ ] Ajustar prompts del agente si es necesario
- [ ] Documentar casos de uso

---

## Consideraciones Técnicas

### ¿Por qué NO afecta órdenes reales?

1. **Las órdenes simuladas tienen IDs que empiezan con "SIM-"**
2. **El agente detecta `_simulation.is_test`** y actúa en modo lectura
3. **Los shipment_id usados son de órdenes YA ENTREGADAS** (no se pueden modificar)
4. **Los billing_info son solo para consulta**, no generamos facturas reales
5. **Las devoluciones son simuladas**, no se abren reclamos reales

### Seguridad
- El token de MercadoLibre solo se usa para LEER datos
- Las escrituras (POST) solo van al webhook de n8n
- No hay llamadas a endpoints de modificación de ML

---

## Preguntas para el Usuario

1. **¿Querés que la simulación use datos de compradores reales (anonimizados) o prefierís datos 100% ficticios?**

2. **¿El agente de n8n ya está preparado para recibir el campo `_simulation` o hay que modificar el workflow?**

3. **¿Querés poder editar los datos de la orden simulada después de crearla, o una vez creada es fija?**

4. **¿Preferís que los escenarios de prueba estén hardcodeados o que el usuario pueda configurar cualquier combinación?**
