'use client';

import { useState, useRef, useEffect } from 'react';
import { Product } from '../page';
import SimulatePurchaseModal from './SimulatePurchaseModal';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  allProducts: Product[];
  onPurchaseSimulated?: (orderId: string) => void;
}

// Usar API local que intenta n8n y hace fallback a mock
const API_PREVENTA_URL = '/api/preventa';

// Función para obtener la imagen desde el permalink de MercadoLibre
function getImageUrl(permalink: string, productId: string): string {
  if (permalink && permalink.includes('mercadolibre')) {
    const mlId = productId.replace('MLA', '').replace('MLA-', '');
    return `https://http2.mlstatic.com/D_NQ_NP_${mlId}-O.webp`;
  }
  return '/placeholder-product.png';
}

export default function ProductDetail({ product, onBack, allProducts, onPurchaseSimulated }: ProductDetailProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const imageUrl = getImageUrl(product.Permalink, product.ID);
  const price = parseFloat(product.Precio?.replace(/[^0-9.-]+/g, '') || '0');
  const hasStock = parseInt(product['Stock Disponible'] || '0') > 0;
  const soldCount = parseInt(product['Stock Vendido'] || '0');
  const freeShipping = product['Envío Gratis']?.toLowerCase() === 'si' ||
                       product['Envío Gratis']?.toLowerCase() === 'sí';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Agregar mensaje del usuario
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Construir el mensaje para el webhook con el ID del producto
      const chatInput = `${product.ID} - ${userMessage}`;

      // Llamar a la API local (que intenta n8n y hace fallback a mock)
      const response = await fetch(API_PREVENTA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Agregar respuesta del asistente
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.text || 'Lo siento, no pude procesar tu consulta. Por favor intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling webhook:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu consulta. Por favor intenta de nuevo en unos momentos.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Back Button */}
      <div className="border-b p-4">
        <button
          onClick={onBack}
          className="flex items-center text-ml-blue hover:text-blue-600 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al listado
        </button>
      </div>

      {/* Product Info Section */}
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image */}
          <div className="lg:w-1/2">
            <div className="relative bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
              <img
                src={imageUrl}
                alt={product.Título}
                className="max-h-[400px] max-w-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.png';
                }}
              />
              {!hasStock && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                  <span className="text-white font-bold text-xl">Sin stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            {/* Sold count */}
            {soldCount > 0 && (
              <p className="text-sm text-gray-500 mb-2">
                {soldCount} vendido{soldCount !== 1 ? 's' : ''}
              </p>
            )}

            {/* Title */}
            <h1 className="text-2xl font-normal text-gray-900 mb-4">
              {product.Título}
            </h1>

            {/* Price */}
            <div className="mb-4">
              <span className="text-4xl font-light text-gray-900">
                $ {price.toLocaleString('es-AR')}
              </span>
            </div>

            {/* Free Shipping */}
            {freeShipping && (
              <div className="flex items-center text-green-600 mb-4">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                <span className="font-medium">Envío gratis</span>
              </div>
            )}

            {/* Stock */}
            <div className="mb-4">
              {hasStock ? (
                <div className="text-green-600">
                  <span className="font-medium">Stock disponible</span>
                  <span className="text-gray-500 ml-2">({product['Stock Disponible']} unidades)</span>
                </div>
              ) : (
                <span className="text-red-500 font-medium">Sin stock</span>
              )}
            </div>

            {/* Brand */}
            {product.Marca && (
              <div className="mb-4">
                <span className="text-gray-500">Marca: </span>
                <span className="text-ml-blue">{product.Marca}</span>
              </div>
            )}

            {/* Product Code */}
            <div className="mb-6 text-sm text-gray-400">
              Código: {product.ID}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              {product.Permalink && (
                <a
                  href={product.Permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-ml-blue text-white px-8 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
                >
                  Ver en MercadoLibre
                </a>
              )}
              <button
                onClick={() => setShowSimulateModal(true)}
                className="inline-block bg-ml-green text-white px-8 py-3 rounded-md hover:bg-green-600 transition-colors font-medium"
              >
                🛒 Simular Compra
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.Descripción && (
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
            <div className="text-gray-700 whitespace-pre-line">
              {product.Descripción}
            </div>
          </div>
        )}
      </div>

      {/* Q&A Section - Estilo MercadoLibre */}
      <div className="border-t p-6 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Preguntas y respuestas
        </h2>
        <p className="text-gray-600 mb-6">
          ¿Qué querés saber sobre este producto?
        </p>

        {/* Question Input */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu pregunta..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ml-blue focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-ml-blue text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Preguntar
            </button>
          </div>
        </form>

        {/* Q&A List */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Todavía no hay preguntas sobre este producto. ¡Sé el primero en preguntar!
            </p>
          ) : (
            messages.map((message, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                {message.role === 'user' ? (
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-200 rounded-full p-2 flex-shrink-0">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 ml-8 mt-3 pt-3 border-t">
                    <div className="bg-ml-blue rounded-full p-2 flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.172 9.172a4 4 0 015.656 0L10 10l-.828.828a4 4 0 01-5.656 0 4 4 0 010-5.656L5.172 9.172z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">MarIA S.A.</p>
                      <div className="text-gray-900 whitespace-pre-wrap">
                        {message.content.split('\n').map((line, i) => {
                          // Detectar enlaces de ML en las respuestas
                          const linkMatch = line.match(/(https:\/\/articulo\.mercadolibre\.com\.ar\/[^\s]+)/);
                          if (linkMatch) {
                            const parts = line.split(linkMatch[0]);
                            return (
                              <div key={i}>
                                {parts[0]}
                                <a
                                  href={linkMatch[0]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-ml-blue hover:underline"
                                >
                                  Ver producto
                                </a>
                                {parts[1]}
                              </div>
                            );
                          }
                          // Renderizar texto normal con formato
                          return (
                            <div key={i}>
                              {line.split('**').map((part, j) =>
                                j % 2 === 0 ? part : <strong key={j}>{part}</strong>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3 ml-8">
                <div className="bg-ml-blue rounded-full p-2 flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.172 9.172a4 4 0 015.656 0L10 10l-.828.828a4 4 0 01-5.656 0 4 4 0 010-5.656L5.172 9.172z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex space-x-2 py-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Simulate Purchase Modal */}
      <SimulatePurchaseModal
        isOpen={showSimulateModal}
        onClose={() => setShowSimulateModal(false)}
        product={product}
        onPurchaseComplete={(orderId) => {
          if (onPurchaseSimulated) {
            onPurchaseSimulated(orderId);
          }
        }}
      />
    </div>
  );
}
