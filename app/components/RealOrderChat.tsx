'use client';

import { useState, useRef, useEffect } from 'react';
import { RealOrderWithMessages, useRealOrders } from '../hooks/useRealOrders';

interface RealOrderChatProps {
  order: RealOrderWithMessages;
  onBack: () => void;
}

// Usar API local que intenta n8n y hace fallback a mock
const API_POSTVENTA_URL = '/api/postventa';

export default function RealOrderChat({ order, onBack }: RealOrderChatProps) {
  const { addMessage, getOrder, getDaysSinceDelivery, clearMessages } = useRealOrders();
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

  const daysSinceDelivery = getDaysSinceDelivery(order);

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
      // Simulation data embedded - workflow detects this and uses mock data
      _simulation: {
        is_test: true,
        is_real_order: true,
        order_id: order.id,
        message: userMessage,
        buyer: {
          id: order.buyer.id,
          first_name: order.buyer.first_name,
          last_name: order.buyer.last_name,
          nickname: order.buyer.nickname
        },
        product: {
          id: order.product.id,
          title: order.product.title,
          price: order.product.price,
          sku: order.product.sku,
          quantity: 1
        },
        shipping: {
          id: order.shipping.id,
          status: order.shipping.status,
          carrier: order.shipping.carrier,
          logistic_type: order.shipping.logistic_type,
          tracking_number: order.shipping.tracking_number,
          date_shipped: order.shipping.date_shipped,
          date_delivered: order.shipping.date_delivered,
          receiver_city: order.shipping.receiver_city,
          receiver_state: order.shipping.receiver_state
        },
        billing: {
          doc_type: order.billing_info.doc_type,
          doc_number: order.billing_info.doc_number,
          taxpayer_type: order.billing_info.taxpayer_type,
          can_receive_factura_a: order.billing_info.can_receive_factura_a
        },
        days_since_delivery: daysSinceDelivery,
        has_mediation: order.has_mediation,
        mediation_id: order.mediation_id,
        date_created: order.date_created
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
        content: `Error al enviar: ${error.message}`
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
    const info: Record<string, { color: string; text: string }> = {
      delivered: { color: 'bg-green-500', text: 'Entregado' },
      in_transit: { color: 'bg-blue-500', text: 'En camino' },
      shipped: { color: 'bg-blue-400', text: 'Despachado' },
      pending: { color: 'bg-yellow-500', text: 'Pendiente' },
      not_delivered: { color: 'bg-red-500', text: 'No entregado' }
    };
    return info[status] || { color: 'bg-gray-500', text: status };
  };

  const statusInfo = getStatusInfo();

  // Suggested messages for real orders
  const suggestedMessages = order.billing_info.can_receive_factura_a
    ? ['Necesito factura A', 'Donde esta mi pedido?', 'Quiero devolver', 'Es compatible?']
    : ['Necesito factura A', 'Donde esta mi pedido?', 'Quiero devolver', 'Gracias!'];

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
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-800">Chat Postventa</h2>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">
                ORDEN REAL
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Orden: <code className="bg-gray-100 px-1 rounded">{order.id}</code>
            </p>
          </div>
          <div className={`${statusInfo.color} text-white px-3 py-1 rounded-full text-sm`}>
            {statusInfo.text}
          </div>
        </div>

        {/* Order Context Bar */}
        <div className="bg-green-50 px-4 py-3 border-t">
          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 line-clamp-1">{order.product.title}</h3>
              <div className="flex flex-wrap gap-2 mt-1 text-xs">
                <span className="bg-white border px-2 py-0.5 rounded">
                  {order.buyer.nickname}
                </span>
                {order.billing_info.can_receive_factura_a ? (
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                    CUIT: {order.billing_info.doc_number}
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    DNI: {order.billing_info.doc_number}
                  </span>
                )}
                {order.shipping.logistic_type === 'fulfillment' && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    Fulfillment
                  </span>
                )}
                {daysSinceDelivery !== null && (
                  <span className={`px-2 py-0.5 rounded ${
                    daysSinceDelivery > 30 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {daysSinceDelivery} dias desde entrega
                  </span>
                )}
                {order.has_mediation && (
                  <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                    Tiene reclamo
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {order.buyer.first_name} {order.buyer.last_name} - {order.shipping.receiver_city}, {order.shipping.receiver_state}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-gray-900">
                $ {order.product.price.toLocaleString('es-AR')}
              </p>
              <p className="text-xs text-gray-500">
                {order.product.sku}
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
            <p>Inicia la conversacion como {order.buyer.first_name}</p>
            <p className="text-sm mt-1">El agente de IA respondera con los datos reales de esta orden</p>
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
                    {msg.role === 'buyer' ? `${order.buyer.first_name} (${order.buyer.nickname})` : 'Tomi de MarIA S.A.'}
                  </span>
                  {msg.toolUsed && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                      {msg.toolUsed}
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
            placeholder={`Escribi como ${order.buyer.first_name}...`}
            rows={2}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ml-blue resize-none"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-ml-blue text-white px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors flex-1"
            >
              {isLoading ? '...' : 'Enviar'}
            </button>
            {currentOrder.messages.length > 0 && (
              <button
                onClick={() => {
                  clearMessages(order.id);
                  const updated = getOrder(order.id);
                  if (updated) setCurrentOrder(updated);
                }}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
