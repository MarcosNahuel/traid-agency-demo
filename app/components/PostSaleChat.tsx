'use client';

import { useState, useRef, useEffect } from 'react';
import { SimulatedOrder, useSimulatedOrders } from '../hooks/useSimulatedOrders';

interface PostSaleChatProps {
  order: SimulatedOrder;
  onBack: () => void;
}

// Usar API local que intenta n8n y hace fallback a mock
const API_POSTVENTA_URL = '/api/postventa';

export default function PostSaleChat({ order, onBack }: PostSaleChatProps) {
  const { addMessage, getOrder } = useSimulatedOrders();
  const [currentOrder, setCurrentOrder] = useState(order);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Refresh order data
  useEffect(() => {
    const updated = getOrder(order.id);
    if (updated) {
      setCurrentOrder(updated);
    }
  }, [order.id, getOrder]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentOrder.messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add buyer message
    addMessage(order.id, {
      role: 'buyer',
      content: userMessage
    });

    // Refresh to show new message
    const updated = getOrder(order.id);
    if (updated) setCurrentOrder(updated);

    setIsLoading(true);

    // Build webhook payload in EXACT MercadoLibre format
    // NO wrapper "body" - this IS the HTTP body, n8n will receive it as $json.body
    const payload = {
      _id: `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      topic: 'messages',
      resource: `pack-${order.id}`,
      user_id: 1074767186,
      application_id: 691722676100747,
      sent: new Date().toISOString(),
      attempts: 1,
      received: new Date().toISOString(),
      actions: ['created'],
      _simulation: {
        is_test: true,
        is_real_order: false,
        order_id: order.id,
        message: userMessage,
        buyer: {
          id: order.buyer.id,
          first_name: order.buyer.name.split(' ')[0] || order.buyer.name,
          last_name: order.buyer.name.split(' ').slice(1).join(' ') || '',
          nickname: order.buyer.nickname
        },
        product: {
          id: order.product.id,
          title: order.product.title,
          price: order.product.price,
          sku: order.product.sku || 'SKU-SIM',
          quantity: 1
        },
        shipping: {
          id: order.shipping.id,
          status: order.shipping.status,
          carrier: order.shipping.carrier,
          logistic_type: order.shipping.logisticType,
          tracking_number: order.shipping.trackingNumber,
          date_shipped: order.shipping.dateShipped,
          date_delivered: order.shipping.dateDelivered,
          receiver_city: 'Buenos Aires',
          receiver_state: 'Buenos Aires'
        },
        billing: {
          doc_type: order.billing.docType,
          doc_number: order.billing.docNumber,
          taxpayer_type: order.billing.taxpayerType,
          can_receive_factura_a: order.billing.canReceiveFacturaA
        },
        days_since_delivery: order.shipping.dateDelivered
          ? Math.floor((Date.now() - new Date(order.shipping.dateDelivered).getTime()) / (1000 * 60 * 60 * 24))
          : null,
        has_mediation: false,
        mediation_id: null,
        date_created: order.createdAt,
        scenario: order.scenario
      }
    };

    try {
      const response = await fetch(API_POSTVENTA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Extract response text
      let responseText = data.output || data.text || data.message || data.response;
      if (typeof responseText !== 'string') {
        responseText = JSON.stringify(data);
      }

      // Add seller (agent) message
      addMessage(order.id, {
        role: 'seller',
        content: responseText,
        toolUsed: data.toolUsed || data._tool
      });

    } catch (error: any) {
      console.error('Error sending message:', error);
      addMessage(order.id, {
        role: 'system',
        content: `❌ Error al enviar: ${error.message}`
      });
    } finally {
      setIsLoading(false);
      // Refresh messages
      const updated = getOrder(order.id);
      if (updated) setCurrentOrder(updated);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getStatusInfo = () => {
    const status = order.shipping.status;
    const info: Record<string, { color: string; text: string; icon: string }> = {
      delivered: { color: 'bg-green-500', text: 'Entregado', icon: '✅' },
      in_transit: { color: 'bg-blue-500', text: 'En camino', icon: '🚚' },
      shipped: { color: 'bg-blue-400', text: 'Despachado', icon: '📦' },
      pending: { color: 'bg-yellow-500', text: 'Pendiente', icon: '⏳' },
      not_delivered: { color: 'bg-red-500', text: 'No entregado', icon: '❌' }
    };
    return info[status] || { color: 'bg-gray-500', text: status, icon: '📦' };
  };

  const statusInfo = getStatusInfo();

  // Suggested messages based on scenario
  const suggestedMessages = [
    '¿Dónde está mi pedido?',
    'Necesito factura A',
    'Quiero devolver',
    '¿Es compatible?'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
      {/* Header */}
      <div className="border-b">
        <div className="p-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center text-ml-blue hover:text-blue-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800">💬 Chat Postventa</h2>
            <p className="text-sm text-gray-500">
              Orden: <code className="bg-gray-100 px-1 rounded">{order.id}</code>
            </p>
          </div>
          <div className={`${statusInfo.color} text-white px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
            <span>{statusInfo.icon}</span>
            <span>{statusInfo.text}</span>
          </div>
        </div>

        {/* Order Context Bar */}
        <div className="bg-gray-50 px-4 py-3 border-t">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-white rounded border flex-shrink-0 flex items-center justify-center">
              <img
                src={order.product.imageUrl}
                alt={order.product.title}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-product.png';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 line-clamp-1">{order.product.title}</h3>
              <div className="flex flex-wrap gap-2 mt-1 text-xs">
                <span className="bg-white border px-2 py-0.5 rounded">
                  {order.scenario.icon} {order.scenario.name}
                </span>
                {order.billing.canReceiveFacturaA ? (
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                    CUIT: {order.billing.docNumber}
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    DNI: {order.billing.docNumber}
                  </span>
                )}
                {order.shipping.carrier === 'flex' && (
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                    Flex/Treggo
                  </span>
                )}
                {order.shipping.failedAttempts && (
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">
                    {order.shipping.failedAttempts} intentos fallidos
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Comprador: {order.buyer.name} ({order.buyer.nickname})
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-gray-900">
                $ {order.product.price.toLocaleString('es-AR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentOrder.messages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-2 block">💬</span>
            <p>Inicia la conversación como comprador</p>
            <p className="text-sm mt-1">El agente de IA responderá automáticamente</p>
          </div>
        )}

        {currentOrder.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === 'buyer' ? 'justify-end' :
              msg.role === 'seller' ? 'justify-start' : 'justify-center'
            }`}
          >
            {msg.role === 'system' ? (
              <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-lg max-w-md text-center">
                {msg.content}
              </div>
            ) : (
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  msg.role === 'buyer'
                    ? 'bg-ml-blue text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium ${
                    msg.role === 'buyer' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {msg.role === 'buyer' ? '👤 Tú (Comprador)' : '🏪 MarIA S.A. (Agente)'}
                  </span>
                  {msg.toolUsed && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                      🔧 {msg.toolUsed}
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <span className={`text-xs ${
                  msg.role === 'buyer' ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Messages */}
      <div className="px-4 py-2 border-t bg-gray-50">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {suggestedMessages.map((msg, i) => (
            <button
              key={i}
              onClick={() => setInput(msg)}
              className="flex-shrink-0 text-xs bg-white border px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              {msg}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe como comprador..."
            rows={2}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ml-blue resize-none"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-ml-blue text-white px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors self-end"
          >
            {isLoading ? '...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}
