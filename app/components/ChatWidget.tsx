'use client';

import { useState, useRef, useEffect } from 'react';
import { Product } from '../page';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: Product | null;
  onProductSelect: (product: Product | null) => void;
  allProducts: Product[];
}

// Usar API route local (que tiene fallback a mock si n8n no responde)
const PREVENTA_API_URL = '/api/preventa';

export default function ChatWidget({
  isOpen,
  onClose,
  selectedProduct,
  onProductSelect,
  allProducts,
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && selectedProduct && messages.length === 0) {
      // Mensaje de bienvenida cuando se selecciona un producto
      setMessages([
        {
          role: 'assistant',
          content: `¡Hola! Vi que te interesa el producto:\n\n**${selectedProduct.Título}**\n\nCódigo: ${selectedProduct.ID}\n\n¿En qué puedo ayudarte con este producto? Puedes preguntarme sobre características, compatibilidad, precio, stock, o lo que necesites. 😊`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, selectedProduct]);

  const findProductInMessage = (text: string): Product | null => {
    // Buscar código de producto en el mensaje (MLA...)
    const productCodeMatch = text.match(/MLA\d+/i);
    if (productCodeMatch) {
      const found = allProducts.find(
        (p) => p.ID.toLowerCase() === productCodeMatch[0].toLowerCase()
      );
      if (found) return found;
    }
    return null;
  };

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
      // Detectar si el usuario mencionó un producto específico
      const mentionedProduct = findProductInMessage(userMessage);
      const productToUse = mentionedProduct || selectedProduct;

      // Construir el mensaje para el webhook
      let chatInput: string;
      if (productToUse) {
        chatInput = `${productToUse.ID} - ${userMessage}`;
      } else {
        chatInput = userMessage;
      }

      // Llamar a la API de preventa
      const response = await fetch(PREVENTA_API_URL, {
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

  const handleProductClick = (product: Product) => {
    onProductSelect(product);
    setMessages([]);
    // El useEffect se encargará de mostrar el mensaje de bienvenida
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <div className="w-full max-w-md h-[600px] bg-white rounded-lg shadow-2xl flex flex-col pointer-events-auto">
        {/* Header */}
        <div className="bg-ml-blue text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <div>
              <h3 className="font-semibold">Barbi - MarIA S.A.</h3>
              <span className="text-xs opacity-90">Asistente Virtual</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-600 rounded-full p-1 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Selected Product Info */}
        {selectedProduct && (
          <div className="bg-gray-50 border-b p-3 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Consultando sobre:</p>
              <p className="text-sm font-medium text-gray-800 truncate">
                {selectedProduct.Título}
              </p>
              <p className="text-xs text-gray-400">{selectedProduct.ID}</p>
            </div>
            <button
              onClick={() => onProductSelect(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
              title="Limpiar producto seleccionado"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-ml-blue text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
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
                            className="underline hover:text-blue-300"
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
                <div
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message flex justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedProduct
                  ? 'Escribe tu consulta...'
                  : 'Ingresa código del producto (MLA...) y tu consulta'
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ml-blue focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-ml-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tip: Puedes usar códigos MLA en tu consulta para preguntar sobre otros productos
          </p>
        </form>
      </div>
    </div>
  );
}
