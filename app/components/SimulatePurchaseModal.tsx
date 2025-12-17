'use client';

import { useState, useEffect } from 'react';
import { Product } from '../page';
import { useSimulatedOrders, TestScenario } from '../hooks/useSimulatedOrders';

interface SimulatePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onPurchaseComplete: (orderId: string) => void;
}

export default function SimulatePurchaseModal({
  isOpen,
  onClose,
  product,
  onPurchaseComplete
}: SimulatePurchaseModalProps) {
  const { scenarios, createOrder } = useSimulatedOrders();
  const [selectedScenario, setSelectedScenario] = useState<TestScenario | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (scenarios.length > 0 && !selectedScenario) {
      setSelectedScenario(scenarios[0]);
    }
  }, [scenarios, selectedScenario]);

  if (!isOpen) return null;

  const handleCreateOrder = () => {
    if (!selectedScenario) return;

    setIsCreating(true);

    const newOrder = createOrder(
      {
        id: product.ID,
        title: product.Título,
        price: parseFloat(product.Precio?.replace(/[^0-9.-]+/g, '') || '0'),
        sku: product.ID
      },
      selectedScenario,
      buyerName ? { name: buyerName, nickname: buyerName.toUpperCase().replace(/\s/g, '') } : undefined
    );

    setTimeout(() => {
      setIsCreating(false);
      onPurchaseComplete(newOrder.id);
      onClose();
    }, 500);
  };

  const price = parseFloat(product.Precio?.replace(/[^0-9.-]+/g, '') || '0');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-ml-yellow p-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">🛒 Simular Compra</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-white rounded border flex items-center justify-center">
              <img
                src={`https://http2.mlstatic.com/D_NQ_NP_${product.ID.replace('MLA', '')}-O.webp`}
                alt={product.Título}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-product.png';
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 line-clamp-2">{product.Título}</h3>
              <p className="text-2xl font-light text-gray-900 mt-1">
                $ {price.toLocaleString('es-AR')}
              </p>
              <p className="text-xs text-gray-500">{product.ID}</p>
            </div>
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-3">🎯 Seleccionar Escenario de Prueba</h3>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedScenario?.id === scenario.id
                    ? 'border-ml-blue bg-blue-50 ring-2 ring-ml-blue'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{scenario.icon}</span>
                  <span className="font-medium text-sm text-gray-800">{scenario.name}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{scenario.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Scenario Details */}
        {selectedScenario && (
          <div className="px-4 pb-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">📋 Configuración del escenario:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Estado envío:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    selectedScenario.shipping_status === 'delivered' ? 'bg-green-100 text-green-700' :
                    selectedScenario.shipping_status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                    selectedScenario.shipping_status === 'not_delivered' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedScenario.shipping_status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Factura A:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    selectedScenario.can_receive_factura_a ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedScenario.can_receive_factura_a ? 'Sí (CUIT)' : 'No (DNI)'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Transportista:</span>
                  <span className="ml-2 text-gray-700">{selectedScenario.carrier}</span>
                </div>
                {selectedScenario.days_since_delivery !== null && (
                  <div>
                    <span className="text-gray-500">Días desde entrega:</span>
                    <span className="ml-2 text-gray-700">{selectedScenario.days_since_delivery}</span>
                  </div>
                )}
                {selectedScenario.failed_attempts && (
                  <div className="col-span-2">
                    <span className="text-red-500 font-medium">⚠️ Intentos fallidos: {selectedScenario.failed_attempts}</span>
                  </div>
                )}
              </div>

              {/* Suggested Questions */}
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-500 mb-2">Preguntas sugeridas para probar:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedScenario.suggested_questions.map((q, i) => (
                    <span key={i} className="text-xs bg-white border px-2 py-1 rounded">
                      "{q}"
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buyer Name (optional) */}
        <div className="px-4 pb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del comprador (opcional)
          </label>
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Se generará automáticamente si se deja vacío"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateOrder}
            disabled={!selectedScenario || isCreating}
            className="bg-ml-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <span className="animate-spin">⏳</span>
                Creando...
              </>
            ) : (
              <>
                🛒 Simular Compra
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
