'use client';

import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Product } from '../page';
import { useSimulatedOrders, TestScenario, SimulatedOrder } from '../hooks/useSimulatedOrders';

interface CreateSimulatedOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (orderId: string) => void;
}

type Step = 'product' | 'config';

export default function CreateSimulatedOrderModal({
  isOpen,
  onClose,
  onOrderCreated
}: CreateSimulatedOrderModalProps) {
  const { scenarios, createOrderCustom } = useSimulatedOrders();

  // Step management
  const [currentStep, setCurrentStep] = useState<Step>('product');

  // Product selection
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Scenario and config
  const [selectedScenario, setSelectedScenario] = useState<TestScenario | null>(null);
  const [buyerName, setBuyerName] = useState('');

  // Custom config (overrides)
  const [customConfig, setCustomConfig] = useState({
    shippingStatus: 'delivered' as SimulatedOrder['shipping']['status'],
    billingType: 'DNI' as 'DNI' | 'CUIT',
    canReceiveFacturaA: false,
    daysSinceDelivery: 5 as number | null,
    carrier: 'mercadoenvios' as 'mercadoenvios' | 'flex' | 'treggo',
    failedAttempts: 0,
    hasClaim: false
  });

  const [isCreating, setIsCreating] = useState(false);

  // Load products
  useEffect(() => {
    if (isOpen && products.length === 0) {
      setLoadingProducts(true);
      fetch('/productos.csv')
        .then((response) => response.text())
        .then((csvText) => {
          Papa.parse(csvText, {
            header: true,
            complete: (results) => {
              const productsData = results.data as Product[];
              const validProducts = productsData.filter(p => p.ID && p.Título);
              setProducts(validProducts);
              setLoadingProducts(false);
            },
          });
        })
        .catch((error) => {
          console.error('Error loading products:', error);
          setLoadingProducts(false);
        });
    }
  }, [isOpen, products.length]);

  // Set default scenario
  useEffect(() => {
    if (scenarios.length > 0 && !selectedScenario) {
      setSelectedScenario(scenarios[0]);
      updateConfigFromScenario(scenarios[0]);
    }
  }, [scenarios]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products.slice(0, 30);
    const searchLower = searchTerm.toLowerCase();
    return products
      .filter((product) =>
        product.ID.toLowerCase().includes(searchLower) ||
        product.Título.toLowerCase().includes(searchLower) ||
        product.Marca?.toLowerCase().includes(searchLower)
      )
      .slice(0, 30);
  }, [searchTerm, products]);

  const updateConfigFromScenario = (scenario: TestScenario) => {
    setCustomConfig({
      shippingStatus: scenario.shipping_status as SimulatedOrder['shipping']['status'],
      billingType: scenario.billing_type,
      canReceiveFacturaA: scenario.can_receive_factura_a,
      daysSinceDelivery: scenario.days_since_delivery,
      carrier: (scenario.is_flex ? 'flex' : scenario.carrier) as 'mercadoenvios' | 'flex' | 'treggo',
      failedAttempts: scenario.failed_attempts || 0,
      hasClaim: scenario.has_claim
    });
  };

  const handleScenarioSelect = (scenario: TestScenario) => {
    setSelectedScenario(scenario);
    updateConfigFromScenario(scenario);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentStep('config');
  };

  const handleBack = () => {
    if (currentStep === 'config') {
      setCurrentStep('product');
    } else {
      onClose();
    }
  };

  const handleCreateOrder = () => {
    if (!selectedProduct || !selectedScenario) return;

    setIsCreating(true);

    const newOrder = createOrderCustom(
      {
        id: selectedProduct.ID,
        title: selectedProduct.Título,
        price: parseFloat(selectedProduct.Precio?.replace(/[^0-9.-]+/g, '') || '0'),
        sku: selectedProduct.ID
      },
      selectedScenario,
      customConfig,
      buyerName ? { name: buyerName, nickname: buyerName.toUpperCase().replace(/\s/g, '') } : undefined
    );

    setTimeout(() => {
      setIsCreating(false);
      resetModal();
      onOrderCreated(newOrder.id);
      onClose();
    }, 500);
  };

  const resetModal = () => {
    setCurrentStep('product');
    setSelectedProduct(null);
    setSearchTerm('');
    setBuyerName('');
    if (scenarios.length > 0) {
      setSelectedScenario(scenarios[0]);
      updateConfigFromScenario(scenarios[0]);
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const price = selectedProduct
    ? parseFloat(selectedProduct.Precio?.replace(/[^0-9.-]+/g, '') || '0')
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-ml-blue p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="text-white/80 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-white">
              {currentStep === 'product' ? 'Seleccionar Producto' : 'Configurar Orden'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Step indicators */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'product' ? 'bg-white text-ml-blue' : 'bg-blue-400 text-white'
              }`}>
                1
              </div>
              <div className="w-8 h-0.5 bg-blue-400"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'config' ? 'bg-white text-ml-blue' : 'bg-blue-400 text-white'
              }`}>
                2
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white text-2xl"
            >
              x
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {currentStep === 'product' ? (
            /* STEP 1: Product Selection */
            <div className="p-4">
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por codigo, titulo o marca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Products List */}
              {loadingProducts ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ml-blue"></div>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.ID}
                      onClick={() => handleProductSelect(product)}
                      className="w-full p-3 border rounded-lg hover:border-ml-blue hover:bg-blue-50 transition-all flex gap-3 text-left"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                        <img
                          src={`https://http2.mlstatic.com/D_NQ_NP_${product.ID.replace('MLA', '')}-O.webp`}
                          alt={product.Título}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-product.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 line-clamp-2 text-sm">
                          {product.Título}
                        </h4>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {product.Precio}
                        </p>
                        <p className="text-xs text-gray-500">{product.ID}</p>
                      </div>
                    </button>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No se encontraron productos
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* STEP 2: Configuration */
            <div className="p-4">
              {/* Selected Product Summary */}
              {selectedProduct && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-white rounded border flex items-center justify-center">
                      <img
                        src={`https://http2.mlstatic.com/D_NQ_NP_${selectedProduct.ID.replace('MLA', '')}-O.webp`}
                        alt={selectedProduct.Título}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.png';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 line-clamp-2">{selectedProduct.Título}</h3>
                      <p className="text-2xl font-light text-gray-900 mt-1">
                        $ {price.toLocaleString('es-AR')}
                      </p>
                      <p className="text-xs text-gray-500">{selectedProduct.ID}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario Selection */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Escenario Base</h3>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {scenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => handleScenarioSelect(scenario)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        selectedScenario?.id === scenario.id
                          ? 'border-ml-blue bg-blue-50 ring-2 ring-ml-blue'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{scenario.icon}</span>
                        <span className="font-medium text-xs text-gray-800">{scenario.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Configuration */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Configuracion Personalizada</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  {/* Shipping Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado del Envio
                    </label>
                    <select
                      value={customConfig.shippingStatus}
                      onChange={(e) => setCustomConfig({
                        ...customConfig,
                        shippingStatus: e.target.value as SimulatedOrder['shipping']['status']
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-transparent"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="shipped">Despachado</option>
                      <option value="in_transit">En transito</option>
                      <option value="delivered">Entregado</option>
                      <option value="not_delivered">No entregado</option>
                    </select>
                  </div>

                  {/* Days Since Delivery - Only show if delivered */}
                  {customConfig.shippingStatus === 'delivered' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dias desde la entrega
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="365"
                        value={customConfig.daysSinceDelivery ?? ''}
                        onChange={(e) => setCustomConfig({
                          ...customConfig,
                          daysSinceDelivery: e.target.value ? parseInt(e.target.value) : null
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-transparent"
                        placeholder="Ej: 5"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Importante para devoluciones (plazo 28 dias)
                      </p>
                    </div>
                  )}

                  {/* Carrier */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transportista
                    </label>
                    <select
                      value={customConfig.carrier}
                      onChange={(e) => setCustomConfig({
                        ...customConfig,
                        carrier: e.target.value as 'mercadoenvios' | 'flex' | 'treggo'
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-transparent"
                    >
                      <option value="mercadoenvios">Mercado Envios</option>
                      <option value="flex">Flex</option>
                      <option value="treggo">Treggo</option>
                    </select>
                  </div>

                  {/* Failed Attempts - Only for Flex/Treggo */}
                  {(customConfig.carrier === 'flex' || customConfig.carrier === 'treggo') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Intentos fallidos de entrega
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={customConfig.failedAttempts}
                        onChange={(e) => setCustomConfig({
                          ...customConfig,
                          failedAttempts: parseInt(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-transparent"
                      />
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Datos de Facturacion</h4>

                    {/* Billing Type */}
                    <div className="mb-3">
                      <label className="block text-sm text-gray-600 mb-1">
                        Tipo de documento
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="billingType"
                            value="DNI"
                            checked={customConfig.billingType === 'DNI'}
                            onChange={() => setCustomConfig({
                              ...customConfig,
                              billingType: 'DNI',
                              canReceiveFacturaA: false
                            })}
                            className="text-ml-blue focus:ring-ml-blue"
                          />
                          <span className="text-sm">DNI (Consumidor Final)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="billingType"
                            value="CUIT"
                            checked={customConfig.billingType === 'CUIT'}
                            onChange={() => setCustomConfig({
                              ...customConfig,
                              billingType: 'CUIT',
                              canReceiveFacturaA: true
                            })}
                            className="text-ml-blue focus:ring-ml-blue"
                          />
                          <span className="text-sm">CUIT (Monotributo/RI)</span>
                        </label>
                      </div>
                    </div>

                    {/* Can Receive Factura A */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="canReceiveFacturaA"
                        checked={customConfig.canReceiveFacturaA}
                        onChange={(e) => setCustomConfig({
                          ...customConfig,
                          canReceiveFacturaA: e.target.checked,
                          billingType: e.target.checked ? 'CUIT' : 'DNI'
                        })}
                        className="w-4 h-4 text-ml-blue focus:ring-ml-blue rounded"
                      />
                      <label htmlFor="canReceiveFacturaA" className="text-sm text-gray-700">
                        Puede recibir Factura A
                      </label>
                    </div>
                    {!customConfig.canReceiveFacturaA && (
                      <p className="text-xs text-gray-500 mt-1">
                        Solo con DNI: si el comprador pide Factura A, no corresponde
                      </p>
                    )}
                  </div>

                  {/* Has Claim */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <input
                      type="checkbox"
                      id="hasClaim"
                      checked={customConfig.hasClaim}
                      onChange={(e) => setCustomConfig({
                        ...customConfig,
                        hasClaim: e.target.checked
                      })}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500 rounded"
                    />
                    <label htmlFor="hasClaim" className="text-sm text-gray-700">
                      Tiene reclamo activo
                    </label>
                  </div>
                </div>
              </div>

              {/* Buyer Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del comprador (opcional)
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Se generara automaticamente si se deja vacio"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ml-blue focus:border-transparent"
                />
              </div>

              {/* Config Preview */}
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Resumen de configuracion:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    customConfig.shippingStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                    customConfig.shippingStatus === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                    customConfig.shippingStatus === 'not_delivered' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {customConfig.shippingStatus}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {customConfig.carrier}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    customConfig.canReceiveFacturaA ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {customConfig.billingType} - {customConfig.canReceiveFacturaA ? 'Factura A' : 'Factura B'}
                  </span>
                  {customConfig.daysSinceDelivery !== null && (
                    <span className={`px-2 py-1 rounded text-xs ${
                      customConfig.daysSinceDelivery > 28 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {customConfig.daysSinceDelivery}d desde entrega
                    </span>
                  )}
                  {customConfig.failedAttempts > 0 && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                      {customConfig.failedAttempts} intentos fallidos
                    </span>
                  )}
                  {customConfig.hasClaim && (
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
                      Reclamo activo
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-between flex-shrink-0">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            {currentStep === 'product' ? 'Cancelar' : 'Atras'}
          </button>
          {currentStep === 'config' && (
            <button
              onClick={handleCreateOrder}
              disabled={!selectedProduct || !selectedScenario || isCreating}
              className="bg-ml-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isCreating ? (
                <>
                  <span className="animate-spin">...</span>
                  Creando...
                </>
              ) : (
                <>
                  Crear Orden Simulada
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
