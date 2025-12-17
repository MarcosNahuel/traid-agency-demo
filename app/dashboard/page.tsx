'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import StrategyCanvas from '../components/StrategyCanvas';
import StockDashboard from '../components/StockDashboard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

// Types
interface Stats {
  total_revenue: number;
  active_products: number;
  unique_customers: number;
  total_orders: number;
  answered_questions: number;
  total_products: number;
  repeat_customers: number;
  total_questions: number;
  extraction_date: string;
}

interface Insights {
  generated_at: string;
  data_source: string;
  resumen_general: {
    total_ordenes: number;
    total_clientes: number;
    clientes_recurrentes: number;
    tasa_fidelizacion: number;
    productos_activos: number;
    ticket_promedio: number;
    revenue_total: number;
  };
  productos_estrella: Array<{
    sku: string;
    titulo: string;
    ordenes: number;
    revenue: number;
    unidades: number;
    compradores_unicos: number;
  }>;
  productos_frecuentemente_juntos: Array<{
    producto_1: string;
    producto_2: string;
    veces: number;
    precio_combo: number;
  }>;
  segmentos_clientes: Array<{
    segmento: string;
    clientes: number;
    ticket_promedio: number;
  }>;
  recomendaciones_venta: string[];
}

interface Category {
  categoria: string;
  ordenes: number;
  revenue: number;
  porcentaje_ordenes: number;
}

interface MonthlySale {
  mes: string;
  ordenes: number;
  revenue: number;
}

interface WeeklySale {
  week: string;
  ordenes: number;
  revenue: number;
}

interface TopCustomer {
  buyer_nickname: string;
  total_orders: string;
  total_spent: string;
}

interface Projections {
  metadata: {
    version: string;
    fecha_generacion: string;
    metodologia: string;
    supuestos: {
      margen_bruto: number;
      margen_descripcion: string;
      confianza_proyeccion: string;
    };
    alcance: {
      incluye: string[];
      limitaciones: string[];
    };
  };
  datos_historicos: {
    totales: {
      ordenes_12_meses: number;
      revenue_12_meses: number;
      promedio_mensual_ordenes: number;
      promedio_mensual_revenue: number;
      ticket_promedio: number;
    };
    diciembre_2025_parcial: {
      ordenes_hasta_ahora: number;
      revenue_hasta_ahora: number;
      dias_transcurridos: number;
      ordenes_dia_actual: number;
    };
  };
  analisis_regresion: {
    ordenes: {
      pendiente: number;
      r_cuadrado: number;
      interpretacion: string;
    };
    revenue: {
      pendiente: number;
      r_cuadrado: number;
    };
  };
  indices_estacionales: {
    indices: Record<string, number>;
    insights: {
      meses_pico: string[];
      meses_valle: string[];
      factor_noviembre: string;
    };
  };
  proyeccion_diciembre_2025: {
    proyeccion_total_mes: {
      ordenes_proyectadas: number;
      revenue_proyectado: number;
      ordenes_restantes: number;
      dias_restantes: number;
    };
    proyeccion_diaria: Array<{
      dia: number;
      ordenes: number;
      revenue: number;
      acumulado_ordenes: number;
      tipo: string;
    }>;
    intervalo_confianza: {
      ordenes_minimo: number;
      ordenes_maximo: number;
      nivel_confianza: string;
    };
  };
  proyeccion_2026: {
    proyecciones_mensuales: Array<{
      mes: string;
      ordenes: number;
      revenue: number;
      crecimiento_yoy: number;
      indice_estacional: number;
    }>;
    resumen_anual_2026: {
      ordenes_proyectadas: number;
      revenue_proyectado: number;
      crecimiento_ordenes_vs_2025: number;
      crecimiento_revenue_vs_2025: number;
      ticket_promedio_proyectado: number;
    };
    trimestres_2026: Array<{
      trimestre: string;
      ordenes: number;
      revenue: number;
      porcentaje_anual: number;
    }>;
  };
  analisis_pareto: {
    top_20_productos: Array<{
      rank: number;
      titulo: string;
      sku: string;
      ordenes: number;
      revenue: number;
      ganancia_estimada: number;
      porcentaje_revenue_acumulado: number;
      velocidad_rotacion: string;
      recomendacion_stock: string;
    }>;
    resumen_pareto: {
      top_20_pct_productos: number;
      revenue_top_20: number;
      porcentaje_revenue: number;
      ganancia_top_20_estimada: number;
      confirmacion_80_20: boolean;
      insight: string;
    };
  };
  sugerencias_stock: {
    criticos_para_navidad: Array<{
      producto: string;
      sku: string;
      demanda_dic_proyectada: number;
      stock_sugerido: number;
      motivo: string;
    }>;
    productos_alto_rotacion_2026: Array<{
      producto: string;
      crecimiento_esperado: number;
      stock_mensual_sugerido: number;
      motivo: string;
    }>;
  };
  metricas_crecimiento: {
    tasas_crecimiento: {
      cagr_ordenes_12m: number;
      cagr_revenue_12m: number;
    };
    escenarios_2026: {
      pesimista: { ordenes: number; revenue: number; crecimiento: number; supuestos: string };
      base: { ordenes: number; revenue: number; crecimiento: number; supuestos: string };
      optimista: { ordenes: number; revenue: number; crecimiento: number; supuestos: string };
    };
  };
  insights_prescriptivos: {
    acciones_inmediatas: Array<{
      prioridad: number;
      accion: string;
      impacto_estimado: number;
      fecha_limite: string;
      detalle: string;
    }>;
    oportunidades_identificadas: Array<{
      oportunidad: string;
      potencial_revenue: number;
      inversion_requerida: number;
      roi_estimado: number;
    }>;
    riesgos_identificados: Array<{
      riesgo: string;
      impacto: string;
      probabilidad: string;
      mitigacion: string;
    }>;
  };
}

// Progress Bar Component
function ProgressBar({ value, max, color = 'blue' }: { value: number; max: number; color?: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
    cyan: 'bg-cyan-500',
  };

  return (
    <div className="w-full bg-gray-700 rounded-full h-3">
      <div
        className={`${colors[color] || 'bg-blue-500'} h-3 rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// KPI Card Component
function KPICard({ title, value, subtitle, icon }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
}) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlySales, setMonthlySales] = useState<MonthlySale[]>([]);
  const [weeklySales, setWeeklySales] = useState<WeeklySale[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [projections, setProjections] = useState<Projections | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'customers' | 'insights' | 'proyecciones' | 'estrategia' | 'stock'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Cargar stats.json de MarIA S.A. (tienda gaming)
        const statsRes = await fetch('/data/maria-sa/stats.json');
        const statsData = await statsRes.json();
        setStats(statsData);

        const insightsRes = await fetch('/data/maria-sa/insights.json');
        const insightsData = await insightsRes.json();
        setInsights(insightsData);

        const categoriesRes = await fetch('/data/maria-sa/categories.csv');
        const categoriesText = await categoriesRes.text();
        Papa.parse(categoriesText, {
          header: true,
          complete: (results) => setCategories(results.data as Category[]),
        });

        // Cargar monthly_sales.csv de MarIA S.A. (13 meses)
        const monthlyRes = await fetch('/data/maria-sa/monthly_sales.csv');
        const monthlyText = await monthlyRes.text();
        Papa.parse(monthlyText, {
          header: true,
          complete: (results) => setMonthlySales(results.data as MonthlySale[]),
        });

        // Cargar weekly_sales.csv para grafico comparativo trimestral
        const weeklyRes = await fetch('/data/maria-sa/weekly_sales.csv');
        const weeklyText = await weeklyRes.text();
        Papa.parse(weeklyText, {
          header: true,
          complete: (results) => setWeeklySales(results.data as WeeklySale[]),
        });

        // Para MarIA S.A. no tenemos top_customers separado
        // Los datos de clientes estan en insights.json
        setTopCustomers([]);

        // Cargar proyecciones de MarIA S.A.
        const projectionsRes = await fetch('/data/maria-sa/projections.json');
        const projectionsData = await projectionsRes.json();
        setProjections(projectionsData);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-AR').format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const maxCategoryOrders = Math.max(...categories.map(c => Number(c.ordenes) || 0));
  const maxCategoryRevenue = Math.max(...categories.map(c => Number(c.revenue) || 0));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Inicio</span>
            </a>
            <div className="h-6 w-px bg-gray-600"></div>
            <div>
              <h1 className="text-2xl font-bold">Dashboard MarIA S.A.</h1>
              <p className="text-gray-400 text-sm">
                Actualizado: {stats?.extraction_date || insights?.generated_at}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['overview', 'products', 'customers', 'insights', 'proyecciones', 'stock', 'estrategia'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? tab === 'estrategia'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : tab === 'stock'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                      : tab === 'proyecciones'
                      ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white'
                      : 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab === 'overview' ? 'General' :
                 tab === 'products' ? 'Productos' :
                 tab === 'customers' ? 'Clientes' :
                 tab === 'insights' ? 'Insights' :
                 tab === 'proyecciones' ? 'Proyecciones 2026' : tab === 'stock' ? 'Stock' : 'Estrategia'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab: Overview */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Banner de Documentacion - Fuente y Filtros */}
            <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 rounded-xl p-4 border border-blue-700/50">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/30 rounded-lg">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Dashboard MarIA S.A. - Tienda Gaming</h2>
                    <p className="text-sm text-blue-200">Datos demo | ~2,500 ordenes | Ticket promedio: $72,000</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <div className="bg-blue-800/40 px-3 py-2 rounded-lg">
                    <span className="text-blue-300">Periodo:</span>
                    <span className="text-white font-semibold ml-1">Dic 2024 - Dic 2025</span>
                    <span className="text-blue-400 ml-1">(13 meses)</span>
                  </div>
                  <div className="bg-green-800/40 px-3 py-2 rounded-lg">
                    <span className="text-green-300">Ordenes PAID:</span>
                    <span className="text-white font-semibold ml-1">{formatNumber(stats.total_orders)}</span>
                  </div>
                  <div className="bg-purple-800/40 px-3 py-2 rounded-lg">
                    <span className="text-purple-300">Clientes:</span>
                    <span className="text-white font-semibold ml-1">{formatNumber(stats.unique_customers)}</span>
                  </div>
                  <div className="bg-yellow-800/40 px-3 py-2 rounded-lg">
                    <span className="text-yellow-300">Tasa Recurrencia:</span>
                    <span className="text-white font-semibold ml-1">{((stats.repeat_customers / stats.unique_customers) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-700/30 text-xs text-blue-300">
                <span className="font-semibold">Rubro:</span> Gaming & Hardware | Productos: PCs, GPUs, Monitores, Perifericos |
                <span className="text-green-300 ml-2">Ticket Promedio: {formatCurrency(stats.total_revenue / stats.total_orders)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard icon="$" title="Ingresos Totales" value={formatCurrency(stats.total_revenue)} subtitle="Ultimos 12 meses" />
              <KPICard icon="+" title="Ordenes" value={formatNumber(stats.total_orders)} subtitle={`Ticket promedio: ${formatCurrency(stats.total_revenue / stats.total_orders)}`} />
              <KPICard icon="@" title="Clientes Unicos" value={formatNumber(stats.unique_customers)} subtitle={`${stats.repeat_customers} recurrentes (${((stats.repeat_customers / stats.unique_customers) * 100).toFixed(1)}%)`} />
              <KPICard icon="?" title="Preguntas" value={formatNumber(stats.total_questions)} subtitle={`${stats.answered_questions} respondidas (${((stats.answered_questions / stats.total_questions) * 100).toFixed(1)}%)`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Categorias por Ordenes</h3>
                <div className="space-y-4">
                  {categories.filter(c => c.categoria).slice(0, 6).map((cat, i) => {
                    const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'cyan'];
                    return (
                      <div key={cat.categoria}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{cat.categoria.replace(/_/g, ' ')}</span>
                          <span className="text-gray-400">{formatNumber(Number(cat.ordenes))} ({cat.porcentaje_ordenes}%)</span>
                        </div>
                        <ProgressBar value={Number(cat.ordenes)} max={maxCategoryOrders} color={colors[i % colors.length]} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Categorias por Revenue</h3>
                <div className="space-y-4">
                  {categories.filter(c => c.categoria).sort((a, b) => Number(b.revenue) - Number(a.revenue)).slice(0, 6).map((cat, i) => {
                    const colors = ['green', 'blue', 'purple', 'orange', 'pink', 'cyan'];
                    return (
                      <div key={cat.categoria}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{cat.categoria.replace(/_/g, ' ')}</span>
                          <span className="text-gray-400">{formatCurrency(Number(cat.revenue))}</span>
                        </div>
                        <ProgressBar value={Number(cat.revenue)} max={maxCategoryRevenue} color={colors[i % colors.length]} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Grafico de Serie Mensual */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Evolucion Mensual de Ventas</h3>
              <p className="text-gray-400 text-sm mb-4">Ordenes por mes (Dic 2024 - Dic 2025)</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlySales.filter(m => m.mes).map(m => ({
                      mes: m.mes,
                      ordenes: Number(m.ordenes),
                      revenue: Number(m.revenue),
                      revenueM: Number(m.revenue) / 1000000,
                    }))}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="mes"
                      tick={{ fill: '#9CA3AF', fontSize: 11 }}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <YAxis
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value: number, name: string) => {
                        if (name === 'ordenes') return [formatNumber(value), 'Ordenes'];
                        return [value, name];
                      }}
                    />
                    <Bar
                      dataKey="ordenes"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      name="ordenes"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grafico de Revenue Mensual */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Revenue Mensual</h3>
              <p className="text-gray-400 text-sm mb-4">Ingresos totales por mes</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlySales.filter(m => m.mes).map(m => ({
                      mes: m.mes,
                      revenueM: Number(m.revenue) / 1000000,
                    }))}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="mes"
                      tick={{ fill: '#9CA3AF', fontSize: 11 }}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <YAxis
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      axisLine={{ stroke: '#4B5563' }}
                      tickFormatter={(value) => `$${value}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value: number) => [formatCurrency(value * 1000000), 'Revenue']}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenueM"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 8, fill: '#10B981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grafico Comparativo Trimestral - Semana a Semana */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Comparativa Trimestral - Evolucion Semanal</h3>
              <p className="text-gray-400 text-sm mb-4">Ordenes por semana comparando Q1, Q2, Q3 y Q4 de 2025</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={(() => {
                      // Organizar datos semanales por trimestre
                      // Q1: Ene-Mar (semanas que empiezan 2025-01 a 2025-03)
                      // Q2: Abr-Jun (semanas que empiezan 2025-04 a 2025-06)
                      // Q3: Jul-Sep (semanas que empiezan 2025-07 a 2025-09)
                      // Q4: Oct-Dic (semanas que empiezan 2025-10 a 2025-12)

                      const q1Weeks: number[] = [];
                      const q2Weeks: number[] = [];
                      const q3Weeks: number[] = [];
                      const q4Weeks: number[] = [];

                      weeklySales.filter(w => w.week && w.week.startsWith('2025')).forEach(w => {
                        const month = parseInt(w.week.split('-')[1]);
                        const ordenes = Number(w.ordenes);

                        if (month >= 1 && month <= 3) q1Weeks.push(ordenes);
                        else if (month >= 4 && month <= 6) q2Weeks.push(ordenes);
                        else if (month >= 7 && month <= 9) q3Weeks.push(ordenes);
                        else if (month >= 10 && month <= 12) q4Weeks.push(ordenes);
                      });

                      // Crear array de 13 semanas para comparar
                      const chartData = [];
                      for (let i = 0; i < 13; i++) {
                        chartData.push({
                          semana: `S${i + 1}`,
                          Q1: q1Weeks[i] || null,
                          Q2: q2Weeks[i] || null,
                          Q3: q3Weeks[i] || null,
                          Q4: q4Weeks[i] || null,
                        });
                      }
                      return chartData;
                    })()}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="semana"
                      tick={{ fill: '#9CA3AF', fontSize: 11 }}
                      axisLine={{ stroke: '#4B5563' }}
                    />
                    <YAxis
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      axisLine={{ stroke: '#4B5563' }}
                      tickFormatter={(value) => formatNumber(value)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value, name) => {
                        if (value === null || value === undefined) return ['-', name];
                        return [formatNumber(Number(value)), String(name)];
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Q1"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      connectNulls={false}
                      name="Q1 (Ene-Mar)"
                    />
                    <Line
                      type="monotone"
                      dataKey="Q2"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      connectNulls={false}
                      name="Q2 (Abr-Jun)"
                    />
                    <Line
                      type="monotone"
                      dataKey="Q3"
                      stroke="#A855F7"
                      strokeWidth={2}
                      dot={{ fill: '#A855F7', strokeWidth: 2, r: 4 }}
                      connectNulls={false}
                      name="Q3 (Jul-Sep)"
                    />
                    <Line
                      type="monotone"
                      dataKey="Q4"
                      stroke="#F97316"
                      strokeWidth={2}
                      dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                      connectNulls={false}
                      name="Q4 (Oct-Dic)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Resumen de totales por trimestre debajo del grafico */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
                {(() => {
                  // Calcular totales desde weeklySales
                  const quarterTotals = {
                    Q1: { ordenes: 0, semanas: 0 },
                    Q2: { ordenes: 0, semanas: 0 },
                    Q3: { ordenes: 0, semanas: 0 },
                    Q4: { ordenes: 0, semanas: 0 },
                  };

                  weeklySales.filter(w => w.week && w.week.startsWith('2025')).forEach(w => {
                    const month = parseInt(w.week.split('-')[1]);
                    const ordenes = Number(w.ordenes);

                    if (month >= 1 && month <= 3) { quarterTotals.Q1.ordenes += ordenes; quarterTotals.Q1.semanas++; }
                    else if (month >= 4 && month <= 6) { quarterTotals.Q2.ordenes += ordenes; quarterTotals.Q2.semanas++; }
                    else if (month >= 7 && month <= 9) { quarterTotals.Q3.ordenes += ordenes; quarterTotals.Q3.semanas++; }
                    else if (month >= 10 && month <= 12) { quarterTotals.Q4.ordenes += ordenes; quarterTotals.Q4.semanas++; }
                  });

                  const colors = {
                    Q1: { border: 'border-blue-500', text: 'text-blue-400', dot: 'bg-blue-500' },
                    Q2: { border: 'border-green-500', text: 'text-green-400', dot: 'bg-green-500' },
                    Q3: { border: 'border-purple-500', text: 'text-purple-400', dot: 'bg-purple-500' },
                    Q4: { border: 'border-orange-500', text: 'text-orange-400', dot: 'bg-orange-500' },
                  };

                  return Object.entries(quarterTotals).map(([q, data]) => (
                    <div key={q} className={`bg-gray-900/50 rounded-lg p-3 border ${colors[q as keyof typeof colors].border}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${colors[q as keyof typeof colors].dot}`}></div>
                        <span className={`font-bold ${colors[q as keyof typeof colors].text}`}>{q}</span>
                        <span className="text-xs text-gray-500">({data.semanas} sem)</span>
                      </div>
                      <p className="text-xl font-bold text-white">{formatNumber(data.ordenes)}</p>
                      <p className="text-xs text-gray-400">ordenes totales</p>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Resumen Totales */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-700">
              <h3 className="text-lg font-semibold mb-4">Resumen Total (13 meses)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Total Ordenes</p>
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(monthlySales.filter(m => m.mes).reduce((acc, m) => acc + Number(m.ordenes), 0))}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(monthlySales.filter(m => m.mes).reduce((acc, m) => acc + Number(m.revenue), 0))}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Promedio Mensual</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {formatNumber(Math.round(monthlySales.filter(m => m.mes).reduce((acc, m) => acc + Number(m.ordenes), 0) / Math.max(monthlySales.filter(m => m.mes).length, 1)))}
                  </p>
                  <p className="text-xs text-gray-500">ordenes/mes</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Mejor Mes</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {monthlySales.filter(m => m.mes).reduce((best, m) => Number(m.ordenes) > Number(best.ordenes) ? m : best, monthlySales[0])?.mes || '-'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatNumber(Math.max(...monthlySales.filter(m => m.mes).map(m => Number(m.ordenes))))} ordenes
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab: Products */}
        {activeTab === 'products' && insights && (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Top 10 Productos Estrella</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                      <th className="pb-3 pr-4">#</th>
                      <th className="pb-3 pr-4">SKU</th>
                      <th className="pb-3 pr-4">Producto</th>
                      <th className="pb-3 pr-4 text-right">Ordenes</th>
                      <th className="pb-3 pr-4 text-right">Revenue</th>
                      <th className="pb-3 text-right">Unidades</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insights.productos_estrella?.map((prod, i) => (
                      <tr key={prod.sku} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                        <td className="py-3 pr-4 text-blue-400 font-mono text-sm">{prod.sku}</td>
                        <td className="py-3 pr-4 text-gray-200 max-w-xs truncate" title={prod.titulo}>{prod.titulo}</td>
                        <td className="py-3 pr-4 text-right text-white font-semibold">{formatNumber(prod.ordenes)}</td>
                        <td className="py-3 pr-4 text-right text-green-400">{formatCurrency(prod.revenue)}</td>
                        <td className="py-3 text-right font-semibold text-gray-300">
                          {formatNumber(prod.unidades)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Productos Comprados Juntos</h3>
              <p className="text-gray-400 text-sm mb-4">Patrones de compra para estrategia de cross-sell</p>
              <div className="space-y-3">
                {insights.productos_frecuentemente_juntos?.slice(0, 8).map((combo, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {combo.veces}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="text-sm text-gray-200 truncate" title={combo.producto_1}>{combo.producto_1}</div>
                      <div className="text-sm text-gray-200 truncate flex items-center gap-2" title={combo.producto_2}>
                        <span className="text-purple-400">+</span>
                        {combo.producto_2}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Customers */}
        {activeTab === 'customers' && insights && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.segmentos_clientes?.map((seg) => (
                <div key={seg.segmento} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-gray-400 text-sm">{seg.segmento}</h4>
                  <p className="text-3xl font-bold text-white mt-2">{formatNumber(seg.clientes)}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Ticket promedio: <span className="text-green-400">{formatCurrency(seg.ticket_promedio)}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Top 20 Clientes Recurrentes</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                      <th className="pb-3 pr-4">#</th>
                      <th className="pb-3 pr-4">Cliente</th>
                      <th className="pb-3 pr-4 text-right">Ordenes</th>
                      <th className="pb-3 text-right">Gasto Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.filter(c => c.buyer_nickname).map((customer, i) => (
                      <tr key={customer.buyer_nickname} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                        <td className="py-3 pr-4 text-gray-200">{customer.buyer_nickname}</td>
                        <td className="py-3 pr-4 text-right text-white">{customer.total_orders}</td>
                        <td className="py-3 text-right text-green-400 font-semibold">{formatCurrency(Number(customer.total_spent))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard icon="%" title="Tasa de Fidelizacion" value={`${insights.resumen_general.tasa_fidelizacion}%`} subtitle="Clientes que vuelven a comprar" />
              <KPICard icon="@" title="Clientes Recurrentes" value={formatNumber(insights.resumen_general.clientes_recurrentes)} subtitle={`De ${formatNumber(insights.resumen_general.total_clientes)} totales`} />
              <KPICard icon="$" title="Revenue de Recurrentes" value="~30%" subtitle="Estimado del revenue total" />
            </div>
          </div>
        )}

        {/* Tab: Insights */}
        {activeTab === 'insights' && insights && (
          <div className="space-y-8">
            {/* Resumen General del Negocio */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Resumen General del Negocio</h3>
              <p className="text-gray-400 text-sm mb-4">Fuente: {insights.data_source} | Generado: {insights.generated_at}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-700 rounded-lg text-center">
                  <p className="text-2xl font-bold text-white">{formatNumber(insights.resumen_general.total_ordenes)}</p>
                  <p className="text-gray-400 text-sm">Ordenes Totales</p>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(insights.resumen_general.revenue_total)}</p>
                  <p className="text-gray-400 text-sm">Revenue Total</p>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-400">{formatCurrency(insights.resumen_general.ticket_promedio)}</p>
                  <p className="text-gray-400 text-sm">Ticket Promedio</p>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-400">{insights.resumen_general.productos_activos}</p>
                  <p className="text-gray-400 text-sm">Productos Activos</p>
                </div>
              </div>
            </div>

            {/* Segmentos de Clientes */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Segmentacion de Clientes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.segmentos_clientes?.map((seg, i) => {
                  const colors = ['purple', 'blue', 'green'];
                  const bgColors = ['bg-purple-900/30 border-purple-700', 'bg-blue-900/30 border-blue-700', 'bg-green-900/30 border-green-700'];
                  return (
                    <div key={seg.segmento} className={`p-4 rounded-lg border ${bgColors[i % 3]}`}>
                      <h4 className="font-medium text-white mb-2">{seg.segmento}</h4>
                      <p className="text-3xl font-bold text-white">{formatNumber(seg.clientes)}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Ticket: <span className="text-green-400">{formatCurrency(seg.ticket_promedio)}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 border border-blue-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">*</span>
                <h3 className="text-lg font-semibold">Recomendaciones para Estrategia de Venta</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">Insights accionables basados en el analisis de datos</p>
              <div className="space-y-3">
                {insights.recomendaciones_venta?.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-black/30 rounded-lg">
                    <span className="text-blue-400 font-bold">{i + 1}.</span>
                    <span className="text-gray-200">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Combos - Oportunidades de Cross-sell */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Top Oportunidades de Cross-Sell</h3>
              <p className="text-gray-400 text-sm mb-4">Productos que se compran juntos frecuentemente</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insights.productos_frecuentemente_juntos?.slice(0, 6).map((combo, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">{combo.veces}x</span>
                      <span className="text-green-400 text-sm">{formatCurrency(combo.precio_combo)}</span>
                    </div>
                    <p className="text-gray-200 text-sm truncate" title={combo.producto_1}>{combo.producto_1}</p>
                    <p className="text-purple-400 text-xs my-1">+</p>
                    <p className="text-gray-200 text-sm truncate" title={combo.producto_2}>{combo.producto_2}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metricas de Fidelizacion */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-xl p-6 border border-green-700">
                <h4 className="text-green-400 font-semibold mb-2">Tasa de Fidelizacion</h4>
                <p className="text-3xl font-bold text-white">{insights.resumen_general.tasa_fidelizacion}%</p>
                <p className="text-gray-400 text-sm mt-1">Clientes que vuelven a comprar</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-blue-700">
                <h4 className="text-blue-400 font-semibold mb-2">Clientes Recurrentes</h4>
                <p className="text-3xl font-bold text-white">{formatNumber(insights.resumen_general.clientes_recurrentes)}</p>
                <p className="text-gray-400 text-sm mt-1">De {formatNumber(insights.resumen_general.total_clientes)} totales</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-purple-700">
                <h4 className="text-purple-400 font-semibold mb-2">Top Combo</h4>
                <p className="text-xl font-bold text-white">{insights.productos_frecuentemente_juntos?.[0]?.veces || 0} veces</p>
                <p className="text-gray-400 text-sm mt-1">{insights.productos_frecuentemente_juntos?.[0]?.producto_1} + {insights.productos_frecuentemente_juntos?.[0]?.producto_2}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Proyecciones 2026 */}
        {activeTab === 'proyecciones' && projections && (
          <div className="space-y-8">
            {/* Banner de Metodologia */}
            <div className="bg-gradient-to-r from-emerald-900/60 to-cyan-900/60 rounded-xl p-4 border border-emerald-700/50">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/30 rounded-lg">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Proyecciones BI - Machine Learning</h2>
                    <p className="text-sm text-emerald-200">{projections.metadata.metodologia}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <div className="bg-emerald-800/40 px-3 py-2 rounded-lg">
                    <span className="text-emerald-300">Confianza:</span>
                    <span className="text-white font-semibold ml-1">{projections.metadata.supuestos.confianza_proyeccion}</span>
                  </div>
                  <div className="bg-cyan-800/40 px-3 py-2 rounded-lg">
                    <span className="text-cyan-300">Margen supuesto:</span>
                    <span className="text-white font-semibold ml-1">{(projections.metadata.supuestos.margen_bruto * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KPIs de Proyeccion 2026 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-xl p-6 border border-emerald-700">
                <h4 className="text-emerald-400 text-sm font-medium">Ordenes 2026 (Proy.)</h4>
                <p className="text-3xl font-bold text-white mt-2">{formatNumber(projections.proyeccion_2026.resumen_anual_2026.ordenes_proyectadas)}</p>
                <p className="text-emerald-400 text-sm mt-1">+{projections.proyeccion_2026.resumen_anual_2026.crecimiento_ordenes_vs_2025}% vs 2025</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-cyan-700">
                <h4 className="text-cyan-400 text-sm font-medium">Revenue 2026 (Proy.)</h4>
                <p className="text-3xl font-bold text-white mt-2">{formatCurrency(projections.proyeccion_2026.resumen_anual_2026.revenue_proyectado)}</p>
                <p className="text-cyan-400 text-sm mt-1">+{projections.proyeccion_2026.resumen_anual_2026.crecimiento_revenue_vs_2025}% vs 2025</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-purple-700">
                <h4 className="text-purple-400 text-sm font-medium">Ticket Promedio (Proy.)</h4>
                <p className="text-3xl font-bold text-white mt-2">{formatCurrency(projections.proyeccion_2026.resumen_anual_2026.ticket_promedio_proyectado)}</p>
                <p className="text-purple-400 text-sm mt-1">+0.8% vs 2025</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-orange-700">
                <h4 className="text-orange-400 text-sm font-medium">Ganancia Bruta Est.</h4>
                <p className="text-3xl font-bold text-white mt-2">{formatCurrency(projections.proyeccion_2026.resumen_anual_2026.revenue_proyectado * 0.25)}</p>
                <p className="text-orange-400 text-sm mt-1">Margen 25%</p>
              </div>
            </div>

            {/* Grafico de Proyeccion Mensual 2026 */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Proyeccion Mensual 2026</h3>
              <p className="text-gray-400 text-sm mb-4">Ordenes y Revenue proyectados por mes (Regresion + Estacionalidad)</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={projections.proyeccion_2026.proyecciones_mensuales.map(m => ({
                      mes: m.mes.replace('2026-', ''),
                      ordenes: m.ordenes,
                      revenueM: m.revenue / 1000000,
                      crecimiento: m.crecimiento_yoy
                    }))}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="mes" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={{ stroke: '#4B5563' }} />
                    <YAxis yAxisId="left" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={{ stroke: '#4B5563' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={{ stroke: '#4B5563' }} tickFormatter={(v) => `$${v}M`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }}
                      formatter={(value: number, name: string) => {
                        if (name === 'ordenes') return [formatNumber(value), 'Ordenes'];
                        if (name === 'revenueM') return [formatCurrency(value * 1000000), 'Revenue'];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="ordenes" fill="#10B981" radius={[4, 4, 0, 0]} name="ordenes" />
                    <Line yAxisId="right" type="monotone" dataKey="revenueM" stroke="#06B6D4" strokeWidth={3} dot={{ fill: '#06B6D4', r: 4 }} name="revenueM" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Proyeccion Diciembre 2025 - Diaria */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Proyeccion Diciembre 2025 - Dia a Dia</h3>
                  <p className="text-gray-400 text-sm">Dias 1-8: Real | Dias 9-31: Proyectado (basado en Dic 2024 + factor crecimiento)</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-400">{formatNumber(projections.proyeccion_diciembre_2025.proyeccion_total_mes.ordenes_proyectadas)}</p>
                  <p className="text-xs text-gray-400">ordenes proyectadas</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={projections.proyeccion_diciembre_2025.proyeccion_diaria}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="dia" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={{ stroke: '#4B5563' }} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={{ stroke: '#4B5563' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }}
                      formatter={(value: number, name: string) => {
                        if (name === 'ordenes') return [formatNumber(value), 'Ordenes'];
                        if (name === 'acumulado_ordenes') return [formatNumber(value), 'Acumulado'];
                        return [value, name];
                      }}
                      labelFormatter={(label) => `Dia ${label}`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="ordenes" stroke="#10B981" strokeWidth={2} dot={(props) => {
                      const { cx, cy, payload } = props;
                      const color = payload.tipo === 'real' ? '#10B981' : '#F59E0B';
                      return <circle cx={cx} cy={cy} r={4} fill={color} stroke={color} />;
                    }} name="ordenes" />
                    <Line type="monotone" dataKey="acumulado_ordenes" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" dot={false} name="acumulado_ordenes" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Ordenes actuales</p>
                  <p className="text-xl font-bold text-white">{formatNumber(projections.datos_historicos.diciembre_2025_parcial.ordenes_hasta_ahora)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Ordenes restantes</p>
                  <p className="text-xl font-bold text-amber-400">{formatNumber(projections.proyeccion_diciembre_2025.proyeccion_total_mes.ordenes_restantes)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Intervalo confianza</p>
                  <p className="text-lg font-bold text-cyan-400">{formatNumber(projections.proyeccion_diciembre_2025.intervalo_confianza.ordenes_minimo)} - {formatNumber(projections.proyeccion_diciembre_2025.intervalo_confianza.ordenes_maximo)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Revenue proyectado</p>
                  <p className="text-xl font-bold text-green-400">{formatCurrency(projections.proyeccion_diciembre_2025.proyeccion_total_mes.revenue_proyectado)}</p>
                </div>
              </div>
            </div>

            {/* Escenarios 2026 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-xl p-6 border border-red-700/50">
                <h4 className="text-red-400 font-semibold mb-2">Escenario Pesimista</h4>
                <p className="text-2xl font-bold text-white">{formatNumber(projections.metricas_crecimiento.escenarios_2026.pesimista.ordenes)}</p>
                <p className="text-gray-400 text-sm">ordenes | +{projections.metricas_crecimiento.escenarios_2026.pesimista.crecimiento}%</p>
                <p className="text-xl font-semibold text-red-300 mt-2">{formatCurrency(projections.metricas_crecimiento.escenarios_2026.pesimista.revenue)}</p>
                <p className="text-xs text-gray-500 mt-2">{projections.metricas_crecimiento.escenarios_2026.pesimista.supuestos}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-900/50 to-cyan-900/50 rounded-xl p-6 border border-emerald-500">
                <h4 className="text-emerald-400 font-semibold mb-2">Escenario Base (Proyectado)</h4>
                <p className="text-3xl font-bold text-white">{formatNumber(projections.metricas_crecimiento.escenarios_2026.base.ordenes)}</p>
                <p className="text-gray-300 text-sm">ordenes | +{projections.metricas_crecimiento.escenarios_2026.base.crecimiento}%</p>
                <p className="text-2xl font-semibold text-emerald-300 mt-2">{formatCurrency(projections.metricas_crecimiento.escenarios_2026.base.revenue)}</p>
                <p className="text-xs text-gray-400 mt-2">{projections.metricas_crecimiento.escenarios_2026.base.supuestos}</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-blue-700/50">
                <h4 className="text-blue-400 font-semibold mb-2">Escenario Optimista</h4>
                <p className="text-2xl font-bold text-white">{formatNumber(projections.metricas_crecimiento.escenarios_2026.optimista.ordenes)}</p>
                <p className="text-gray-400 text-sm">ordenes | +{projections.metricas_crecimiento.escenarios_2026.optimista.crecimiento}%</p>
                <p className="text-xl font-semibold text-blue-300 mt-2">{formatCurrency(projections.metricas_crecimiento.escenarios_2026.optimista.revenue)}</p>
                <p className="text-xs text-gray-500 mt-2">{projections.metricas_crecimiento.escenarios_2026.optimista.supuestos}</p>
              </div>
            </div>

            {/* Trimestres 2026 */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Distribucion Trimestral 2026</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {projections.proyeccion_2026.trimestres_2026.map((q, i) => {
                  const colors = ['border-blue-500 text-blue-400', 'border-green-500 text-green-400', 'border-purple-500 text-purple-400', 'border-orange-500 text-orange-400'];
                  return (
                    <div key={q.trimestre} className={`bg-gray-900/50 rounded-lg p-4 border ${colors[i].split(' ')[0]}`}>
                      <h4 className={`font-bold ${colors[i].split(' ')[1]}`}>{q.trimestre}</h4>
                      <p className="text-2xl font-bold text-white mt-1">{formatNumber(q.ordenes)}</p>
                      <p className="text-sm text-gray-400">{formatCurrency(q.revenue)}</p>
                      <p className="text-xs text-gray-500 mt-1">{q.porcentaje_anual}% del ano</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Analisis Pareto */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Analisis Pareto (80/20)</h3>
                  <p className="text-gray-400 text-sm">Top productos con margen estimado del 25%</p>
                </div>
                <div className="text-right bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-700">
                  <p className="text-emerald-400 text-sm">{projections.analisis_pareto.resumen_pareto.insight}</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(projections.analisis_pareto.resumen_pareto.ganancia_top_20_estimada)}</p>
                  <p className="text-xs text-gray-400">ganancia estimada top 20%</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                      <th className="pb-3 pr-4">#</th>
                      <th className="pb-3 pr-4">Producto</th>
                      <th className="pb-3 pr-4 text-right">Ordenes</th>
                      <th className="pb-3 pr-4 text-right">Revenue</th>
                      <th className="pb-3 pr-4 text-right">Ganancia (25%)</th>
                      <th className="pb-3 pr-4 text-center">Rotacion</th>
                      <th className="pb-3 text-left">Stock Sugerido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projections.analisis_pareto.top_20_productos.slice(0, 10).map((prod) => (
                      <tr key={prod.rank} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 pr-4 text-gray-500">{prod.rank}</td>
                        <td className="py-3 pr-4 text-gray-200 max-w-xs truncate" title={prod.titulo}>{prod.titulo}</td>
                        <td className="py-3 pr-4 text-right text-white font-semibold">{formatNumber(prod.ordenes)}</td>
                        <td className="py-3 pr-4 text-right text-green-400">{formatCurrency(prod.revenue)}</td>
                        <td className="py-3 pr-4 text-right text-emerald-400">{formatCurrency(prod.ganancia_estimada)}</td>
                        <td className="py-3 pr-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            prod.velocidad_rotacion === 'muy_alta' ? 'bg-red-900/50 text-red-300' :
                            prod.velocidad_rotacion === 'alta' ? 'bg-orange-900/50 text-orange-300' :
                            'bg-blue-900/50 text-blue-300'
                          }`}>
                            {prod.velocidad_rotacion.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 text-left text-cyan-400 text-sm">{prod.recomendacion_stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sugerencias de Stock Navidad */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-900/30 to-green-900/30 rounded-xl p-6 border border-red-700/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>Criticos para Navidad</span>
                </h3>
                <div className="space-y-3">
                  {projections.sugerencias_stock.criticos_para_navidad.map((prod, i) => (
                    <div key={i} className="bg-black/30 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{prod.producto}</p>
                          <p className="text-gray-400 text-xs">{prod.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-bold">{prod.stock_sugerido} u.</p>
                          <p className="text-gray-500 text-xs">demanda: {prod.demanda_dic_proyectada}</p>
                        </div>
                      </div>
                      <p className="text-amber-300 text-xs mt-2">{prod.motivo}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Productos Alto Rotacion 2026</h3>
                <div className="space-y-3">
                  {projections.sugerencias_stock.productos_alto_rotacion_2026.map((prod, i) => (
                    <div key={i} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{prod.producto}</p>
                          <p className="text-cyan-400 text-sm">+{prod.crecimiento_esperado}% crecimiento esperado</p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-bold">{prod.stock_mensual_sugerido} u/mes</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs mt-2">{prod.motivo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Acciones Inmediatas */}
            <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 rounded-xl p-6 border border-amber-700">
              <h3 className="text-lg font-semibold mb-4 text-amber-300">Acciones Inmediatas - Prescriptivo</h3>
              <div className="space-y-4">
                {projections.insights_prescriptivos.acciones_inmediatas.map((accion, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-4 flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      accion.prioridad === 1 ? 'bg-red-600' : accion.prioridad === 2 ? 'bg-orange-600' : 'bg-yellow-600'
                    }`}>
                      {accion.prioridad}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-semibold">{accion.accion}</h4>
                        <span className="text-amber-300 font-bold">{formatCurrency(accion.impacto_estimado)}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{accion.detalle}</p>
                      <p className="text-amber-400 text-xs mt-2">Fecha limite: {accion.fecha_limite}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Oportunidades y Riesgos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-emerald-700">
                <h3 className="text-lg font-semibold mb-4 text-emerald-400">Oportunidades Identificadas</h3>
                <div className="space-y-3">
                  {projections.insights_prescriptivos.oportunidades_identificadas.map((op, i) => (
                    <div key={i} className="bg-gray-700/50 rounded-lg p-3">
                      <p className="text-white font-medium">{op.oportunidad}</p>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-emerald-400">Potencial: {formatCurrency(op.potencial_revenue)}</span>
                        <span className="text-cyan-400">Inversion: {formatCurrency(op.inversion_requerida)}</span>
                        <span className="text-amber-400 font-bold">ROI: {op.roi_estimado}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-red-700">
                <h3 className="text-lg font-semibold mb-4 text-red-400">Riesgos Identificados</h3>
                <div className="space-y-3">
                  {projections.insights_prescriptivos.riesgos_identificados.map((riesgo, i) => (
                    <div key={i} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <p className="text-white font-medium">{riesgo.riesgo}</p>
                        <div className="flex gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            riesgo.impacto === 'alto' ? 'bg-red-900/50 text-red-300' : 'bg-yellow-900/50 text-yellow-300'
                          }`}>{riesgo.impacto}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            riesgo.probabilidad === 'alta' ? 'bg-red-900/50 text-red-300' : 'bg-yellow-900/50 text-yellow-300'
                          }`}>{riesgo.probabilidad}</span>
                        </div>
                      </div>
                      <p className="text-cyan-300 text-sm mt-2">Mitigacion: {riesgo.mitigacion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* IMPORTANTE: Limitaciones de la Analitica */}
            <div className="bg-gradient-to-r from-amber-900/40 to-red-900/40 rounded-xl p-6 border-2 border-amber-600/70">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-amber-600/30 rounded-full">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-amber-300 mb-3">LIMITACIONES DE LA ANALITICA</h3>

                  <div className="bg-black/30 rounded-lg p-4 mb-4">
                    <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                      <span className="text-xl">$</span>
                      Margen de Ganancia Estimado - NO REAL
                    </h4>
                    <p className="text-gray-300">
                      Se aplica un <span className="text-amber-400 font-bold">margen global del 25%</span> a todos los productos
                      como estimacion. Este valor <span className="text-red-400 font-semibold">NO refleja los costos reales</span> de cada producto.
                    </p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-red-900/30 rounded p-2 border border-red-700/50">
                        <span className="text-red-400 font-medium">No disponible:</span>
                        <span className="text-gray-300 ml-2">Costo de adquisicion por producto</span>
                      </div>
                      <div className="bg-red-900/30 rounded p-2 border border-red-700/50">
                        <span className="text-red-400 font-medium">No disponible:</span>
                        <span className="text-gray-300 ml-2">Comisiones reales de MercadoLibre</span>
                      </div>
                      <div className="bg-red-900/30 rounded p-2 border border-red-700/50">
                        <span className="text-red-400 font-medium">No disponible:</span>
                        <span className="text-gray-300 ml-2">Costos de envio absorbidos</span>
                      </div>
                      <div className="bg-red-900/30 rounded p-2 border border-red-700/50">
                        <span className="text-red-400 font-medium">No disponible:</span>
                        <span className="text-gray-300 ml-2">Margenes por categoria/SKU</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 mb-4">
                    <h4 className="text-amber-400 font-semibold mb-2">Periodo de Datos</h4>
                    <p className="text-gray-300">
                      Analisis basado en <span className="text-cyan-400 font-semibold">12 meses de datos historicos</span> (Dic 2024 - Nov 2025).
                      La estacionalidad se calcula con un unico ciclo anual, lo cual limita la precision para detectar patrones multianuales.
                    </p>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4">
                    <h4 className="text-amber-400 font-semibold mb-2">Otras Limitaciones</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">!</span>
                        <span>No considera eventos macroeconomicos imprevistos (inflacion, devaluacion, crisis)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">!</span>
                        <span>No incluye proyeccion de lanzamiento de nuevos productos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">!</span>
                        <span>No considera acciones de la competencia ni cambios en el algoritmo de MercadoLibre</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">!</span>
                        <span>Las proyecciones pierden precision a medida que se alejan en el tiempo (confianza: 85% corto plazo, 55% largo plazo)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-700/50">
                    <p className="text-blue-300 text-sm">
                      <span className="font-semibold">Recomendacion:</span> Para obtener metricas de rentabilidad precisas,
                      se requiere integrar los costos reales de cada SKU desde el sistema de inventario/ERP.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supuestos y Alcance */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Supuestos y Alcance del Analisis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-emerald-400 font-medium mb-2">Incluye:</h4>
                  <ul className="space-y-1">
                    {projections.metadata.alcance.incluye.map((item, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">+</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-400 font-medium mb-2">Limitaciones:</h4>
                  <ul className="space-y-1">
                    {projections.metadata.alcance.limitaciones.map((item, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-red-400 mt-1">!</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
                <p><strong>Supuestos clave:</strong> {projections.metadata.supuestos.margen_descripcion}</p>
                <p className="mt-1"><strong>Generado:</strong> {projections.metadata.fecha_generacion} | <strong>Version:</strong> {projections.metadata.version}</p>
              </div>
            </div>

            {/* Indices Estacionales */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Indices Estacionales Calculados</h3>
              <p className="text-gray-400 text-sm mb-4">Factor multiplicador vs promedio anual (1.0 = promedio)</p>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {Object.entries(projections.indices_estacionales.indices).map(([mes, indice]) => {
                  const isHigh = indice > 1.2;
                  const isLow = indice < 0.8;
                  return (
                    <div key={mes} className={`text-center p-2 rounded-lg ${
                      isHigh ? 'bg-emerald-900/50 border border-emerald-700' :
                      isLow ? 'bg-red-900/50 border border-red-700' :
                      'bg-gray-700/50'
                    }`}>
                      <p className="text-xs text-gray-400 capitalize">{mes.slice(0, 3)}</p>
                      <p className={`font-bold ${isHigh ? 'text-emerald-400' : isLow ? 'text-red-400' : 'text-white'}`}>
                        {indice.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Meses Pico</p>
                  <p className="text-emerald-400 font-semibold">{projections.indices_estacionales.insights.meses_pico.join(', ')}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Meses Valle</p>
                  <p className="text-red-400 font-semibold">{projections.indices_estacionales.insights.meses_valle.join(', ')}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">R2 Regresion</p>
                  <p className="text-cyan-400 font-semibold">{(projections.analisis_regresion.ordenes.r_cuadrado * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab: Estrategia - Canvas Mode */}
        {/* Tab: Stock - Dashboard de Stock */}
        {activeTab === 'stock' && (
          <StockDashboard />
        )}

        {activeTab === 'estrategia' && (
          <StrategyCanvas />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-6 py-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          Dashboard MarIA S.A. | Datos demo para demostracion CRM | Powered by TRAID Agency
        </div>
      </footer>

    </div>
  );
}
