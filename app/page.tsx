'use client';

import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import SearchBar from './components/SearchBar';
import MyPurchases from './components/MyPurchases';
import { useSimulatedOrders } from './hooks/useSimulatedOrders';
import { useRealOrders } from './hooks/useRealOrders';
import { createClient } from '@/lib/supabase/client';

export interface Product {
  ID: string;
  Título: string;
  Descripción: string;
  Precio: string;
  'Stock Disponible': string;
  Marca: string;
  Permalink: string;
  'Envío Gratis': string;
  'Stock Vendido': string;
}

type AppMode = 'selector' | 'preventa' | 'postventa';

export default function Home() {
  const [appMode, setAppMode] = useState<AppMode>('selector');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { orders: simulatedOrders } = useSimulatedOrders();
  const { orders: realOrders } = useRealOrders();

  // Load products from Supabase when entering preventa mode
  useEffect(() => {
    if (appMode === 'preventa' && products.length === 0) {
      setLoading(true);
      const loadProducts = async () => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('title', { ascending: true });

          if (error) {
            console.error('Error fetching products from Supabase:', error);
            setLoading(false);
            return;
          }

          // Map Supabase products to expected format
          const mappedProducts = (data || []).map((p: { sku: string; title: string; description: string; price: number; stock: number; brand: string; sold?: number }) => ({
            ID: p.sku,
            Título: p.title,
            Descripción: p.description || '',
            Precio: p.price?.toString() || '0',
            'Stock Disponible': p.stock?.toString() || '0',
            Marca: p.brand || '',
            Permalink: '#',
            'Envío Gratis': 'Sí',
            'Stock Vendido': p.sold?.toString() || '0'
          }));
          setProducts(mappedProducts);
          setFilteredProducts(mappedProducts);
        } catch (error) {
          console.error('Error loading products from Supabase:', error);
        } finally {
          setLoading(false);
        }
      };
      loadProducts();
    }
  }, [appMode, products.length]);

  // Filter products when searching
  useEffect(() => {
    if (appMode !== 'preventa') return;

    let filtered = products;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.ID.toLowerCase().includes(searchLower) ||
        product.Título.toLowerCase().includes(searchLower) ||
        product.Marca?.toLowerCase().includes(searchLower)
      );
    }
    setFilteredProducts(filtered);
  }, [searchTerm, products, appMode]);

  const handleBackToSelector = () => {
    setAppMode('selector');
    setSelectedProduct(null);
    setSearchTerm('');
  };

  const totalOrders = simulatedOrders.length + realOrders.length;

  // === SELECTOR SCREEN ===
  if (appMode === 'selector') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        {/* Header */}
        <header className="bg-ml-yellow shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-ml-blue rounded-lg p-2">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Centro de Control</h1>
                  <p className="text-sm text-gray-600">MarIA S.A. - Tu aliado gamer</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/dashboard"
                  className="hidden md:flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-500 transition-all text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium">Dashboard</span>
                </a>
                <a
                  href="/conversaciones"
                  className="hidden md:flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-400 transition-all text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <span className="font-medium">Conversaciones</span>
                </a>
                <a
                  href="/soporte"
                  className="hidden md:flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-400 transition-all text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="font-medium">Soporte</span>
                </a>
                <a
                  href="https://traidagency.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-1 bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <span className="font-medium">by</span>
                  <span className="font-bold">TRAID</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Selector */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Selecciona un modo de control
              </h2>
              <p className="text-gray-600 text-lg">
                Prueba el agente de IA en diferentes etapas del proceso de venta
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* PREVENTA Card */}
              <button
                onClick={() => setAppMode('preventa')}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-left border-2 border-transparent hover:border-ml-blue"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 group-hover:bg-ml-blue transition-colors rounded-xl p-3">
                    <svg className="w-8 h-8 text-ml-blue group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Control de Preventa</h3>
                    <p className="text-xs text-gray-500">Consultas sobre productos</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                  Prueba las preguntas de los compradores antes de la compra.
                  El agente responde consultas sobre stock, compatibilidad y especificaciones.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>{products.length > 0 ? products.length.toLocaleString() : '55'} productos</span>
                  </div>
                  <span className="text-ml-blue font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Ingresar
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>

              {/* POSTVENTA Card */}
              <button
                onClick={() => setAppMode('postventa')}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-left border-2 border-transparent hover:border-green-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-100 group-hover:bg-green-500 transition-colors rounded-xl p-3">
                    <svg className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Control de Postventa</h3>
                    <p className="text-xs text-gray-500">Gestion de ordenes</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                  Prueba las consultas despues de la compra.
                  El agente maneja reclamos, seguimiento de envios y facturas.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span>{totalOrders} ordenes disponibles</span>
                  </div>
                  <span className="text-green-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Ingresar
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>

              {/* DASHBOARD Card */}
              <a
                href="/dashboard"
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-left border-2 border-transparent hover:border-purple-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 group-hover:bg-purple-500 transition-colors rounded-xl p-3">
                    <svg className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Dashboard Analytics</h3>
                    <p className="text-xs text-gray-500">Metricas y reportes</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                  Analiza el rendimiento de tu tienda con metricas avanzadas,
                  proyecciones y estrategias de crecimiento.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>6 tabs de analisis</span>
                  </div>
                  <span className="text-purple-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Ingresar
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>

              {/* CONVERSACIONES Card */}
              <a
                href="/conversaciones"
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-left border-2 border-transparent hover:border-orange-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-orange-100 group-hover:bg-orange-500 transition-colors rounded-xl p-3">
                    <svg className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Conversaciones</h3>
                    <p className="text-xs text-gray-500">CRM en tiempo real</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                  Panel de gestion de mensajes con compradores.
                  Respuestas asistidas por IA y seguimiento de casos.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Real-time</span>
                  </div>
                  <span className="text-orange-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Ingresar
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>

              {/* SOPORTE Card */}
              <a
                href="/soporte"
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-left border-2 border-transparent hover:border-red-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-red-100 group-hover:bg-red-500 transition-colors rounded-xl p-3">
                    <svg className="w-8 h-8 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Panel de Soporte</h3>
                    <p className="text-xs text-gray-500">Casos escalados</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                  Gestiona los casos que la IA derivo a soporte humano.
                  Responde y resuelve consultas complejas.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Intervencion humana</span>
                  </div>
                  <span className="text-red-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Ingresar
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>

              {/* HISTORIAL IA Card */}
              <a
                href="/historial"
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-left border-2 border-transparent hover:border-teal-500"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-teal-100 group-hover:bg-teal-500 transition-colors rounded-xl p-3">
                    <svg className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Historial IA</h3>
                    <p className="text-xs text-gray-500">Todas las interacciones</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                  Registro completo de todas las respuestas del agente Tomi.
                  Mensajes, respuestas y clasificaciones.
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Logs en tiempo real</span>
                  </div>
                  <span className="text-teal-600 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Ingresar
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-5 gap-3 text-center">
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-2xl font-bold text-ml-blue">{products.length > 0 ? products.length.toLocaleString() : '55'}</p>
                <p className="text-sm text-gray-500">Productos</p>
              </div>
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-2xl font-bold text-green-600">{totalOrders}</p>
                <p className="text-sm text-gray-500">Ordenes</p>
              </div>
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-2xl font-bold text-purple-600">6</p>
                <p className="text-sm text-gray-500">Tabs Analytics</p>
              </div>
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-2xl font-bold text-orange-600">3</p>
                <p className="text-sm text-gray-500">Agentes IA</p>
              </div>
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-2xl font-bold text-red-600">-</p>
                <p className="text-sm text-gray-500">Pendientes</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // === POSTVENTA MODE ===
  if (appMode === 'postventa') {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-green-500 sticky top-0 z-40 shadow-md">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToSelector}
                  className="flex items-center text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver
                </button>
                <div className="h-6 w-px bg-white/30"></div>
                <h1 className="text-xl font-bold text-white">Control de Postventa</h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  {totalOrders} ordenes
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <MyPurchases onBack={handleBackToSelector} />
        </div>
      </div>
    );
  }

  // === PREVENTA MODE ===
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-ml-yellow sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToSelector}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver
              </button>
              <div className="h-6 w-px bg-gray-400"></div>
              <h1 className="text-xl font-bold text-gray-800">Control de Preventa</h1>
            </div>
            <a
              href="https://traidagency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <span className="font-bold">TRAID</span>
            </a>
          </div>
          <div className="mt-3">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            allProducts={products}
            onPurchaseSimulated={() => setAppMode('postventa')}
          />
        ) : (
          <main>
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los productos'}
                </h2>
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-ml-blue mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando productos...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No encontramos publicaciones
                </h3>
                <p className="text-gray-600 mb-4">
                  Revisa la ortografia de la palabra o intenta con otro filtro
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-ml-blue hover:text-blue-600 font-medium"
                >
                  Borrar filtros
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.slice(0, 50).map((product) => (
                  <ProductCard
                    key={product.ID}
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
                {filteredProducts.length > 50 && (
                  <div className="text-center py-4 text-gray-500">
                    Mostrando 50 de {filteredProducts.length} productos. Usa el buscador para filtrar.
                  </div>
                )}
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
