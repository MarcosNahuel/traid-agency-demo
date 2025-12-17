/**
 * Script para probar las herramientas del agente localmente
 * Simula las respuestas de las 7 herramientas del workflow de postventa
 */

// ============================================
// HERRAMIENTA 1: Consultar Estado Envío ML
// ============================================
function consultarEstadoEnvio(simulationContext) {
  const shipping = simulationContext.shipping || {};
  const status = shipping.status || 'pending';
  const carrier = shipping.carrier || 'mercadoenvios';
  const failedAttempts = shipping.failed_attempts || 0;

  const statusLabels = {
    delivered: 'Entregado',
    in_transit: 'En tránsito',
    shipped: 'Despachado',
    pending: 'Pendiente de envío',
    not_delivered: 'No entregado'
  };

  let response = {
    shipment_id: shipping.id || `SIM-SHP-${Date.now()}`,
    status: status,
    status_label: statusLabels[status] || status,
    carrier: carrier,
    logistic_type: shipping.logistic_type || 'cross_docking',
    tracking_number: shipping.tracking_number || `SIM-TRK-${Date.now()}`,
    date_shipped: shipping.date_shipped || null,
    date_delivered: shipping.date_delivered || null,
    estimated_delivery: null
  };

  // Agregar info de intentos fallidos si aplica
  if (failedAttempts > 0) {
    response.failed_attempts = failedAttempts;
    response.alert = `El envío tiene ${failedAttempts} intentos de entrega fallidos`;
  }

  // Info específica para Flex/Treggo
  if (carrier === 'flex' || carrier === 'treggo') {
    response.is_flex = true;
    response.flex_info = {
      carrier_name: 'Treggo',
      can_reschedule: failedAttempts < 2,
      policy: failedAttempts >= 2
        ? 'POLÍTICA: Con 2+ intentos fallidos, el envío debe CANCELARSE y el comprador debe comprar nuevamente'
        : 'El comprador puede reprogramar la entrega contactando al carrier'
    };
  }

  return response;
}

// ============================================
// HERRAMIENTA 2: Consultar Datos Fiscales ML
// ============================================
function consultarDatosFiscales(simulationContext) {
  const billing = simulationContext.billing || {};
  const docType = billing.doc_type || 'DNI';
  const docNumber = billing.doc_number || '12345678';
  const canReceiveFacturaA = billing.can_receive_factura_a || false;

  let response = {
    doc_type: docType,
    doc_number: docNumber,
    can_receive_factura_a: canReceiveFacturaA,
    taxpayer_type: billing.taxpayer_type || (canReceiveFacturaA ? 'Responsable Monotributo' : 'Consumidor Final')
  };

  if (canReceiveFacturaA) {
    response.factura_info = {
      type: 'A',
      message: 'El cliente puede recibir Factura A. Debe solicitarla por el chat de MercadoLibre con su CUIT.',
      instructions: 'Pedir que escriba "Necesito factura A" en el chat oficial de ML para que el sistema la genere automáticamente.'
    };
  } else {
    response.factura_info = {
      type: 'B',
      message: 'El cliente tiene DNI, solo puede recibir Factura B (consumidor final).',
      instructions: docType === 'DNI'
        ? 'Si el cliente necesita Factura A, debe actualizar sus datos fiscales en MercadoLibre agregando su CUIT.'
        : 'Verificar que los datos fiscales estén correctos en MercadoLibre.'
    };
  }

  return response;
}

// ============================================
// HERRAMIENTA 3: Consultar Treggo (Flex)
// ============================================
function consultarTreggo(simulationContext) {
  const shipping = simulationContext.shipping || {};
  const carrier = shipping.carrier || 'mercadoenvios';
  const failedAttempts = shipping.failed_attempts || 0;
  const status = shipping.status || 'pending';

  if (carrier !== 'flex' && carrier !== 'treggo') {
    return {
      is_flex: false,
      message: 'Este envío no es Flex/Treggo, es MercadoEnvíos estándar.',
      tracking_url: null
    };
  }

  let response = {
    is_flex: true,
    carrier: 'Treggo',
    shipment_id: shipping.id || `SIM-FLEX-${Date.now()}`,
    status: status,
    failed_attempts: failedAttempts,
    can_reschedule: failedAttempts < 2
  };

  if (failedAttempts >= 2) {
    response.alert = 'ALERTA: 2 INTENTOS FALLIDOS';
    response.policy = {
      action: 'CANCELAR',
      reason: 'Política Treggo: Con 2 intentos fallidos, el envío debe cancelarse.',
      next_steps: [
        'Informar al comprador que el envío será cancelado',
        'El reembolso se procesará automáticamente',
        'El comprador debe realizar una nueva compra si desea el producto'
      ],
      cannot_reschedule: true
    };
  } else if (failedAttempts === 1) {
    response.warning = 'Hubo 1 intento fallido. Queda 1 intento más.';
    response.reschedule_info = {
      can_reschedule: true,
      instructions: 'El comprador puede reprogramar contactando a Treggo o esperando el próximo intento.'
    };
  }

  return response;
}

// ============================================
// HERRAMIENTA 4: Gestionar Devolución/Reclamo
// ============================================
function gestionarDevolucion(simulationContext) {
  const shipping = simulationContext.shipping || {};
  const daysSinceDelivery = simulationContext.days_since_delivery;
  const scenario = simulationContext.scenario || {};

  // Calcular días desde entrega
  let diasDesdeEntrega = daysSinceDelivery;
  if (diasDesdeEntrega === undefined && shipping.date_delivered) {
    const delivered = new Date(shipping.date_delivered);
    const now = new Date();
    diasDesdeEntrega = Math.floor((now - delivered) / (1000 * 60 * 60 * 24));
  }

  const dentroDePlazo = diasDesdeEntrega !== null && diasDesdeEntrega <= 28;

  let response = {
    days_since_delivery: diasDesdeEntrega,
    return_deadline_days: 28,
    within_deadline: dentroDePlazo
  };

  if (dentroDePlazo) {
    response.can_return = true;
    response.return_info = {
      status: 'DENTRO DEL PLAZO',
      message: `Han pasado ${diasDesdeEntrega} días desde la entrega. El comprador puede iniciar una devolución.`,
      instructions: [
        'El comprador debe iniciar el reclamo desde "Mis Compras" en MercadoLibre',
        'Seleccionar el motivo de la devolución',
        'ML generará una etiqueta de envío gratis',
        'Una vez recibido el producto, se procesa el reembolso'
      ],
      link_hint: 'Indicar al comprador que vaya a Mis Compras > [Producto] > "Tengo un problema"'
    };
  } else {
    response.can_return = false;
    response.return_info = {
      status: 'FUERA DEL PLAZO',
      message: diasDesdeEntrega
        ? `Han pasado ${diasDesdeEntrega} días desde la entrega. El plazo de 28 días ya venció.`
        : 'No se puede determinar la fecha de entrega.',
      policy: 'Según las políticas de MercadoLibre, las devoluciones deben iniciarse dentro de los 28 días posteriores a la entrega.',
      alternatives: [
        'Contactar directamente con el vendedor para evaluar opciones',
        'Si el producto tiene garantía del fabricante, contactar al servicio técnico oficial',
        'Si hay un defecto de fabricación, puede aplicar la Ley de Defensa del Consumidor'
      ]
    };
  }

  return response;
}

// ============================================
// HERRAMIENTA 5: Descripción de Productos
// ============================================
function descripcionProducto(simulationContext) {
  const product = simulationContext.product || {};

  return {
    product_id: product.id || 'MLA-SIM-001',
    title: product.title || 'Producto de prueba',
    price: product.price || 0,
    description: `Este es el producto "${product.title || 'Producto de prueba'}". Para obtener información técnica específica como compatibilidad con vehículos, especificaciones, etc., el agente debe basarse en la información de la publicación o consultar las FAQs.`,
    category: 'Accesorios para Vehículos',
    attributes: {
      brand: 'TiendaLubbi',
      condition: 'Nuevo',
      warranty: 'Garantía del vendedor'
    }
  };
}

// ============================================
// HERRAMIENTA 6: Query FAQs
// ============================================
function queryFAQs(query, simulationContext) {
  // FAQs simuladas basadas en escenarios comunes
  const faqs = [
    {
      question: '¿Cómo solicito Factura A?',
      answer: 'Para recibir Factura A debes tener tu CUIT registrado en MercadoLibre. Si ya lo tienes, escribe "Necesito factura A" en el chat de la compra y se generará automáticamente.'
    },
    {
      question: '¿Cuánto tarda el envío?',
      answer: 'Los envíos por MercadoEnvíos tardan entre 2-5 días hábiles dependiendo de tu ubicación. Los envíos Flex (Treggo) son entrega en el día o día siguiente.'
    },
    {
      question: '¿Cómo devuelvo un producto?',
      answer: 'Tienes 28 días desde la entrega para iniciar una devolución. Ve a "Mis Compras", selecciona el producto y haz clic en "Tengo un problema". MercadoLibre te dará una etiqueta de envío gratis.'
    },
    {
      question: '¿Qué pasa si el envío Flex falla?',
      answer: 'Los envíos Flex (Treggo) tienen 2 intentos de entrega. Si fallan ambos, el envío se cancela automáticamente y se reembolsa el dinero. El comprador debe realizar una nueva compra.'
    },
    {
      question: '¿Cómo sé si el repuesto es compatible?',
      answer: 'La compatibilidad está indicada en la publicación. Si tienes dudas, escríbenos el modelo exacto de tu vehículo (marca, modelo, año, versión) y te confirmamos.'
    },
    {
      question: '¿Tienen instrucciones de instalación?',
      answer: 'Los repuestos automotrices generalmente requieren instalación por un profesional. Recomendamos llevarlo a un taller mecánico de confianza.'
    }
  ];

  // Buscar FAQ relevante
  const queryLower = (query || '').toLowerCase();
  const relevant = faqs.filter(faq =>
    queryLower.includes('factura') && faq.question.includes('Factura') ||
    queryLower.includes('envío') && faq.question.includes('envío') ||
    queryLower.includes('devol') && faq.question.includes('devuelvo') ||
    queryLower.includes('flex') && faq.question.includes('Flex') ||
    queryLower.includes('compatible') && faq.question.includes('compatible') ||
    queryLower.includes('instal') && faq.question.includes('instalación')
  );

  return {
    query: query,
    results: relevant.length > 0 ? relevant : faqs.slice(0, 3),
    total_faqs: faqs.length
  };
}

// ============================================
// HERRAMIENTA 7: Memoria (Contexto)
// ============================================
function memoria(action, simulationContext, data = null) {
  // Simula guardar/recuperar contexto de conversación
  if (action === 'save') {
    return {
      success: true,
      message: 'Contexto guardado en memoria',
      saved_data: data
    };
  } else if (action === 'get') {
    return {
      success: true,
      context: {
        order_id: simulationContext.order_id,
        buyer_name: simulationContext.buyer?.name,
        last_topic: simulationContext.scenario?.id || 'general',
        conversation_summary: 'Conversación de prueba para simulación'
      }
    };
  }
  return { success: false, message: 'Acción no reconocida' };
}

// ============================================
// HERRAMIENTA 8: Soporte (Escalación)
// ============================================
function soporte(reason, simulationContext) {
  return {
    escalated: true,
    ticket_id: `SIM-TICKET-${Date.now()}`,
    reason: reason,
    message: 'Caso escalado a soporte humano (simulación)',
    estimated_response: '24-48 horas hábiles',
    order_info: {
      order_id: simulationContext.order_id,
      buyer: simulationContext.buyer?.name
    }
  };
}

// ============================================
// FUNCIÓN PRINCIPAL DE PRUEBA
// ============================================
function testAllTools() {
  console.log('\n===========================================');
  console.log('   PRUEBA DE HERRAMIENTAS SIMULADAS');
  console.log('===========================================\n');

  // Contexto de simulación de ejemplo (como viene del frontend)
  const testContexts = [
    {
      name: 'Escenario: Factura A con CUIT',
      context: {
        order_id: 'SIM-TEST-001',
        message: 'Necesito factura A',
        buyer: { id: 'BUYER-001', name: 'Juan Pérez', nickname: 'JUANPEREZ' },
        product: { id: 'MLA123', title: 'Filtro de aceite', price: 15000 },
        shipping: { id: 'SHP-001', status: 'delivered', carrier: 'mercadoenvios', date_delivered: '2024-12-01' },
        billing: { doc_type: 'CUIT', doc_number: '20-12345678-9', can_receive_factura_a: true },
        days_since_delivery: 3,
        scenario: { id: 'factura_a_cuit', name: 'Quiere Factura A' }
      }
    },
    {
      name: 'Escenario: Flex 2 intentos fallidos',
      context: {
        order_id: 'SIM-TEST-002',
        message: '¿Por qué no me llegó el pedido?',
        buyer: { id: 'BUYER-002', name: 'María García', nickname: 'MARIAGARCIA' },
        product: { id: 'MLA456', title: 'Pastillas de freno', price: 25000 },
        shipping: { id: 'SHP-002', status: 'not_delivered', carrier: 'flex', failed_attempts: 2 },
        billing: { doc_type: 'DNI', doc_number: '34567890', can_receive_factura_a: false },
        days_since_delivery: null,
        scenario: { id: 'flex_2_visits', name: 'Flex - 2 Visitas Fallidas' }
      }
    },
    {
      name: 'Escenario: Devolución fuera de plazo',
      context: {
        order_id: 'SIM-TEST-003',
        message: 'Quiero devolver el producto',
        buyer: { id: 'BUYER-003', name: 'Carlos López', nickname: 'CARLOSLOPEZ' },
        product: { id: 'MLA789', title: 'Amortiguador trasero', price: 45000 },
        shipping: { id: 'SHP-003', status: 'delivered', carrier: 'mercadoenvios', date_delivered: '2024-10-15' },
        billing: { doc_type: 'DNI', doc_number: '23456789', can_receive_factura_a: false },
        days_since_delivery: 45,
        scenario: { id: 'devolucion_fuera_plazo', name: 'Devolución > 28 días' }
      }
    }
  ];

  testContexts.forEach((test, index) => {
    console.log(`\n--- ${index + 1}. ${test.name} ---`);
    console.log(`Mensaje: "${test.context.message}"\n`);

    // Probar cada herramienta
    console.log('1. Consultar Estado Envío:');
    console.log(JSON.stringify(consultarEstadoEnvio(test.context), null, 2));

    console.log('\n2. Consultar Datos Fiscales:');
    console.log(JSON.stringify(consultarDatosFiscales(test.context), null, 2));

    console.log('\n3. Consultar Treggo:');
    console.log(JSON.stringify(consultarTreggo(test.context), null, 2));

    console.log('\n4. Gestionar Devolución:');
    console.log(JSON.stringify(gestionarDevolucion(test.context), null, 2));

    console.log('\n5. Descripción Producto:');
    console.log(JSON.stringify(descripcionProducto(test.context), null, 2));

    console.log('\n6. Query FAQs:');
    console.log(JSON.stringify(queryFAQs(test.context.message, test.context), null, 2));

    console.log('\n7. Memoria (get):');
    console.log(JSON.stringify(memoria('get', test.context), null, 2));

    console.log('\n8. Soporte:');
    console.log(JSON.stringify(soporte('Prueba de escalación', test.context), null, 2));

    console.log('\n' + '='.repeat(50));
  });
}

// Ejecutar pruebas
testAllTools();

// Exportar funciones para uso en otros scripts
module.exports = {
  consultarEstadoEnvio,
  consultarDatosFiscales,
  consultarTreggo,
  gestionarDevolucion,
  descripcionProducto,
  queryFAQs,
  memoria,
  soporte
};
