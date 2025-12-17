'use client';

import { useState } from 'react';
import { useSimulatedOrders, SimulatedOrder } from '../hooks/useSimulatedOrders';
import { useRealOrders, RealOrderWithMessages } from '../hooks/useRealOrders';
import PostSaleChat from './PostSaleChat';
import RealOrderChat from './RealOrderChat';
import CreateSimulatedOrderModal from './CreateSimulatedOrderModal';

interface MyPurchasesProps {
  onBack: () => void;
}

type TabType = 'simulated' | 'real';

type ShippingStatus = 'all' | 'delivered' | 'in_transit' | 'shipped' | 'pending' | 'not_delivered';

export default function MyPurchases({ onBack }: MyPurchasesProps) {
  const { orders: simulatedOrders, deleteOrder, clearAllOrders, isLoading: loadingSimulated } = useSimulatedOrders();
  const { orders: realOrders, isLoading: loadingReal, clearAllMessages, getDaysSinceDelivery } = useRealOrders();

  const [activeTab, setActiveTab] = useState<TabType>('real');
  const [selectedSimulatedOrder, setSelectedSimulatedOrder] = useState<SimulatedOrder | null>(null);
  const [selectedRealOrder, setSelectedRealOrder] = useState<RealOrderWithMessages | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);

  // Filtros
  const [searchProduct, setSearchProduct] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShippingStatus>('all');

  // If a simulated order is selected, show the chat
  if (selectedSimulatedOrder) {
    return (
      <PostSaleChat
        order={selectedSimulatedOrder}
        onBack={() => setSelectedSimulatedOrder(null)}
      />
    );
  }

  // If a real order is selected, show the real order chat
  if (selectedRealOrder) {
    return (
      <RealOrderChat
        order={selectedRealOrder}
        onBack={() => setSelectedRealOrder(null)}
      />
    );
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      delivered: 'bg-green-100 text-green-700',
      in_transit: 'bg-blue-100 text-blue-700',
      shipped: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      not_delivered: 'bg-red-100 text-red-700'
    };
    const labels: Record<string, string> = {
      delivered: 'Entregado',
      in_transit: 'En camino',
      shipped: 'Despachado',
      pending: 'Pendiente',
      not_delivered: 'No entregado'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrar órdenes reales
  const filteredRealOrders = realOrders.filter(order => {
    const searchLower = searchProduct.toLowerCase();
    const matchesSearch = searchProduct === '' ||
      order.product.title.toLowerCase().includes(searchLower) ||
      order.product.sku?.toLowerCase().includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === 'all' || order.shipping.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filtrar órdenes simuladas
  const filteredSimulatedOrders = simulatedOrders.filter(order => {
    const searchLower = searchProduct.toLowerCase();
    const matchesSearch = searchProduct === '' ||
      order.product.title.toLowerCase().includes(searchLower) ||
      order.product.sku?.toLowerCase().includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === 'all' || order.shipping.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Limpiar filtros
  const clearFilters = () => {
    setSearchProduct('');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchProduct !== '' || statusFilter !== 'all';

  const isLoading = activeTab === 'simulated' ? loadingSimulated : loadingReal;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Ordenes
          </h1>

          {activeTab === 'simulated' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateOrderModal(true)}
                className="bg-ml-blue text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Orden
              </button>
              {simulatedOrders.length > 0 && (
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                >
                  Limpiar todo
                </button>
              )}
            </div>
          )}
          {activeTab === 'real' && realOrders.some(o => o.messages.length > 0) && (
            <button
              onClick={clearAllMessages}
              className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
            >
              Limpiar chats
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('real')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'real'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ordenes Reales
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'real' ? 'bg-green-600' : 'bg-gray-200'
            }`}>
              {realOrders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('simulated')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'simulated'
                ? 'bg-ml-blue text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Simuladas
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'simulated' ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
              {simulatedOrders.length}
            </span>
          </button>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t">
          {/* Búsqueda por producto */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
            <input
              type="text"
              placeholder="Buscar por producto, SKU u orden..."
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ml-blue focus:border-transparent"
            />
            {searchProduct && (
              <button
                onClick={() => setSearchProduct('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ShippingStatus)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ml-blue focus:border-transparent bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="delivered">Entregado</option>
              <option value="in_transit">En camino</option>
              <option value="shipped">Despachado</option>
              <option value="pending">Pendiente</option>
              <option value="not_delivered">No entregado</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Contador de resultados */}
        {hasActiveFilters && (
          <div className="mt-3 text-sm text-gray-500">
            Mostrando {activeTab === 'real' ? filteredRealOrders.length : filteredSimulatedOrders.length} de {activeTab === 'real' ? realOrders.length : simulatedOrders.length} órdenes
          </div>
        )}
      </div>

      {/* Confirm Clear Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="font-semibold text-gray-800 mb-2">Eliminar todas las ordenes simuladas?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Esta accion no se puede deshacer. Se eliminaran {simulatedOrders.length} ordenes simuladas.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  clearAllOrders();
                  setShowConfirmClear(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Eliminar todo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ml-blue"></div>
          </div>
        ) : activeTab === 'real' ? (
          /* Real Orders Tab */
          filteredRealOrders.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">{hasActiveFilters ? '🔍' : '📦'}</span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {hasActiveFilters ? 'No se encontraron órdenes' : 'No hay ordenes reales cargadas'}
              </h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters
                  ? 'Probá ajustando los filtros de búsqueda'
                  : 'Las ordenes reales se cargan desde el archivo real-orders.json'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-ml-blue hover:underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRealOrders.map((order) => {
                const daysSince = getDaysSinceDelivery(order);
                return (
                  <div
                    key={order.id}
                    className="border border-green-200 rounded-lg p-4 hover:border-green-500 hover:shadow-sm transition-all cursor-pointer bg-green-50/30"
                    onClick={() => setSelectedRealOrder(order)}
                  >
                    <div className="flex gap-4">
                      {/* Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-800 line-clamp-1">
                              {order.product.title}
                            </h3>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">
                              REAL
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {getStatusBadge(order.shipping.status)}
                          <span className="text-sm text-gray-500">
                            {order.buyer.nickname}
                          </span>
                          {order.billing_info.can_receive_factura_a ? (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                              CUIT
                            </span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              DNI
                            </span>
                          )}
                          {order.shipping.logistic_type === 'fulfillment' && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              Full
                            </span>
                          )}
                          {daysSince !== null && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              daysSince > 30 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {daysSince}d
                            </span>
                          )}
                          {order.has_mediation && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                              Reclamo
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm text-gray-500">
                            <span>Orden: </span>
                            <code className="bg-gray-100 px-1 rounded text-xs">{order.id}</code>
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatDate(order.date_created)}
                          </div>
                        </div>

                        {order.messages.length > 0 && (
                          <div className="mt-2 text-xs text-green-600">
                            {order.messages.length} mensaje{order.messages.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-semibold text-gray-900">
                          $ {order.product.price.toLocaleString('es-AR')}
                        </p>
                        <p className="text-xs text-gray-500">{order.product.sku}</p>
                        <button className="text-green-600 text-sm hover:underline mt-2">
                          Probar chat
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Simulated Orders Tab */
          filteredSimulatedOrders.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">{hasActiveFilters ? '🔍' : '🛒'}</span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {hasActiveFilters ? 'No se encontraron órdenes' : 'No hay compras simuladas'}
              </h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters
                  ? 'Probá ajustando los filtros de búsqueda'
                  : 'Crea una orden simulada para probar diferentes escenarios de postventa'}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="text-ml-blue hover:underline"
                >
                  Limpiar filtros
                </button>
              ) : (
                <button
                  onClick={() => setShowCreateOrderModal(true)}
                  className="bg-ml-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar Orden Simulada
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSimulatedOrders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 hover:border-ml-blue hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => setSelectedSimulatedOrder(order)}
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                      <img
                        src={order.product.imageUrl}
                        alt={order.product.title}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.png';
                        }}
                      />
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-gray-800 line-clamp-2">
                          {order.product.title}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteOrder(order.id);
                          }}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Eliminar orden"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {getStatusBadge(order.shipping.status)}
                        <span className="text-sm text-gray-500">
                          {order.scenario.icon} {order.scenario.name}
                        </span>
                        {order.billing.canReceiveFacturaA && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            CUIT
                          </span>
                        )}
                        {order.shipping.carrier === 'flex' && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                            Flex
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-gray-500">
                          <span>Orden: </span>
                          <code className="bg-gray-100 px-1 rounded text-xs">{order.id}</code>
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>

                      {order.messages.length > 0 && (
                        <div className="mt-2 text-xs text-ml-blue">
                          {order.messages.length} mensaje{order.messages.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-semibold text-gray-900">
                        $ {order.product.price.toLocaleString('es-AR')}
                      </p>
                      <button className="text-ml-blue text-sm hover:underline mt-2">
                        Ver chat
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Info Footer */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <span>i</span>
          <p>
            {activeTab === 'real'
              ? 'Ordenes de demo de MarIA S.A. Podes probar el chat sin afectar ordenes reales.'
              : 'Las ordenes simuladas se guardan en tu navegador. Podes probar diferentes escenarios de postventa.'}
          </p>
        </div>
      </div>

      {/* Create Order Modal */}
      <CreateSimulatedOrderModal
        isOpen={showCreateOrderModal}
        onClose={() => setShowCreateOrderModal(false)}
        onOrderCreated={(orderId) => {
          setShowCreateOrderModal(false);
          // Find the newly created order and open the chat
          const newOrder = simulatedOrders.find(o => o.id === orderId);
          if (newOrder) {
            setSelectedSimulatedOrder(newOrder);
          }
        }}
      />
    </div>
  );
}
