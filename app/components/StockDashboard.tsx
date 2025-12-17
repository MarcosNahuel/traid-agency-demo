'use client';

import { useState, useEffect } from 'react';
import type { StockItem, StockSummary, StockResponse, SeverityLevel } from '@/types/stock';
import { SEVERITY_CONFIG } from '@/types/stock';

// Format helpers
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

// Countdown Timer Component
function ReorderCountdown({ reorderInDays, reorderDate }: { reorderInDays: number | null; reorderDate: string | null }) {
  if (reorderInDays === null) {
    return <span className="text-gray-500">N/A</span>;
  }

  const isUrgent = reorderInDays <= 0;
  const isWarning = reorderInDays > 0 && reorderInDays <= 7;

  const days = Math.floor(Math.abs(reorderInDays));
  const hours = Math.floor((Math.abs(reorderInDays) % 1) * 24);

  return (
    <div className={`flex items-center gap-2 ${isUrgent ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
      <div className="font-mono text-lg font-bold">
        {isUrgent ? (
          <span className="animate-pulse">REPONER AHORA</span>
        ) : (
          <>
            <span>{days}d</span>
            <span className="text-sm ml-1">{hours}h</span>
          </>
        )}
      </div>
      {reorderDate && !isUrgent && (
        <span className="text-xs text-gray-500">
          ({new Date(reorderDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })})
        </span>
      )}
    </div>
  );
}

// Severity Badge Component
function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  const config = SEVERITY_CONFIG[severity];
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.bgColor} ${config.color} ${config.borderColor} border`}>
      {config.icon} {config.label}
    </span>
  );
}

// Stock Level Bar Component
function StockLevelBar({ current, reorderPoint, safetyStock }: { current: number; reorderPoint: number; safetyStock: number }) {
  const maxLevel = Math.max(current, reorderPoint * 1.5, 100);
  const currentPct = (current / maxLevel) * 100;
  const reorderPct = (reorderPoint / maxLevel) * 100;
  const safetyPct = (safetyStock / maxLevel) * 100;

  const barColor = current <= safetyStock ? 'bg-red-500' : current <= reorderPoint ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="relative w-full h-4 bg-gray-700 rounded overflow-hidden">
      {/* Safety stock marker */}
      <div
        className="absolute top-0 h-full border-r-2 border-red-400 border-dashed"
        style={{ left: `${safetyPct}%` }}
        title={`Stock Seguridad: ${Math.round(safetyStock)}`}
      />
      {/* Reorder point marker */}
      <div
        className="absolute top-0 h-full border-r-2 border-amber-400"
        style={{ left: `${reorderPct}%` }}
        title={`Punto Reorden: ${Math.round(reorderPoint)}`}
      />
      {/* Current stock bar */}
      <div
        className={`h-full ${barColor} transition-all duration-500`}
        style={{ width: `${Math.min(currentPct, 100)}%` }}
      />
    </div>
  );
}

// Summary Card Component
function SummaryCard({ title, value, subtitle, icon, color = 'blue' }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color?: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'border-blue-700',
    red: 'border-red-700',
    amber: 'border-amber-700',
    emerald: 'border-emerald-700',
    purple: 'border-purple-700',
  };

  return (
    <div className={`bg-gray-800 rounded-xl p-6 border ${colorClasses[color] || 'border-gray-700'}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}

// Stock Table Component
function StockTable({ items, title, showCountdown = false }: { items: StockItem[]; title: string; showCountdown?: boolean }) {
  if (items.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-400 text-center py-8">No hay productos en esta categoria</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
              <th className="pb-3 pr-4">Producto</th>
              <th className="pb-3 pr-4 text-right">Stock</th>
              <th className="pb-3 pr-4 text-right">Rotacion</th>
              <th className="pb-3 pr-4 text-right">Vendidos 30d</th>
              <th className="pb-3 pr-4 text-center">Cobertura</th>
              <th className="pb-3 pr-4 text-center">Estado</th>
              {showCountdown && <th className="pb-3 text-center">Reponer en</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.item_id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-10 h-10 rounded object-cover bg-gray-700"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    <div>
                      <p className="text-gray-200 text-sm max-w-xs truncate" title={item.title}>
                        {item.title}
                      </p>
                      <p className="text-blue-400 text-xs font-mono">{item.sku || item.item_id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-right">
                  <span className="text-white font-semibold">{item.available_quantity}</span>
                  <div className="w-24 mt-1">
                    <StockLevelBar
                      current={item.available_quantity}
                      reorderPoint={item.reorder_point_units}
                      safetyStock={item.safety_stock_units}
                    />
                  </div>
                </td>
                <td className="py-3 pr-4 text-right">
                  <span className="text-cyan-400 font-medium">{item.avg_daily_30d}</span>
                  <span className="text-gray-500 text-xs ml-1">u/dia</span>
                </td>
                <td className="py-3 pr-4 text-right text-white font-semibold">
                  {formatNumber(item.units_sold_30d)}
                </td>
                <td className="py-3 pr-4 text-center">
                  {item.days_cover !== null ? (
                    <span className={`font-medium ${
                      item.days_cover <= 7 ? 'text-red-400' :
                      item.days_cover <= 14 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {Math.round(item.days_cover)}d
                    </span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-center">
                  <SeverityBadge severity={item.severity} />
                </td>
                {showCountdown && (
                  <td className="py-3 text-center">
                    <ReorderCountdown reorderInDays={item.reorder_in_days} reorderDate={item.reorder_date} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Alert Cards Component
function AlertCards({ alerts }: { alerts: StockItem[] }) {
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const warningAlerts = alerts.filter(a => a.severity === 'warning');

  return (
    <div className="space-y-6">
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-red-900/40 to-red-800/40 rounded-xl p-6 border border-red-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-600/30 rounded-full">
              <span className="text-2xl">!</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-300">Alertas Criticas ({criticalAlerts.length})</h3>
              <p className="text-sm text-red-200/60">Estos productos requieren reposicion inmediata</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalAlerts.map((item) => (
              <div key={item.item_id} className="bg-black/30 rounded-lg p-4 border border-red-700/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm truncate" title={item.title}>{item.title}</p>
                    <p className="text-red-300 text-xs font-mono">{item.sku}</p>
                  </div>
                  <span className="text-red-400 font-bold text-lg">{item.available_quantity}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">Punto reorden: {Math.round(item.reorder_point_units)}</span>
                  <ReorderCountdown reorderInDays={item.reorder_in_days} reorderDate={item.reorder_date} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Alerts */}
      {warningAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-amber-900/40 to-amber-800/40 rounded-xl p-6 border border-amber-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-600/30 rounded-full">
              <span className="text-2xl">!</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-300">Alertas de Stock Bajo ({warningAlerts.length})</h3>
              <p className="text-sm text-amber-200/60">Estos productos se acercan al punto de reorden</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {warningAlerts.map((item) => (
              <div key={item.item_id} className="bg-black/30 rounded-lg p-4 border border-amber-700/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm truncate" title={item.title}>{item.title}</p>
                    <p className="text-amber-300 text-xs font-mono">{item.sku}</p>
                  </div>
                  <span className="text-amber-400 font-bold text-lg">{item.available_quantity}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">Cobertura: {item.days_cover ? Math.round(item.days_cover) : '-'}d</span>
                  <ReorderCountdown reorderInDays={item.reorder_in_days} reorderDate={item.reorder_date} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {criticalAlerts.length === 0 && warningAlerts.length === 0 && (
        <div className="bg-emerald-900/20 rounded-xl p-8 border border-emerald-700 text-center">
          <span className="text-4xl">+</span>
          <h3 className="text-lg font-semibold text-emerald-400 mt-2">Todo en orden</h3>
          <p className="text-gray-400 text-sm">No hay alertas de stock en este momento</p>
        </div>
      )}
    </div>
  );
}

// Main Stock Dashboard Component
export default function StockDashboard() {
  const [data, setData] = useState<StockResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'supabase' | 'mock'>('mock');
  const [activeView, setActiveView] = useState<'alerts' | 'rotation' | 'sold' | 'countdown'>('alerts');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard/stock');
        const result: StockResponse = await response.json();

        if (result.success) {
          setData(result.data);
          setSource(result.source);
        } else {
          setError('Error al cargar datos de stock');
        }
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Error de conexion');
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando datos de stock...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-900/20 rounded-xl p-8 border border-red-700 text-center">
        <span className="text-4xl">!</span>
        <h3 className="text-lg font-semibold text-red-400 mt-2">Error</h3>
        <p className="text-gray-400">{error || 'No se pudieron cargar los datos'}</p>
      </div>
    );
  }

  const { summary, top_rotation, top_sold, alerts, reorder_countdown } = data;

  return (
    <div className="space-y-8">
      {/* Data Source Banner */}
      <div className={`rounded-xl p-4 border ${
        source === 'supabase'
          ? 'bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border-emerald-700/50'
          : 'bg-gradient-to-r from-amber-900/40 to-orange-900/40 border-amber-700/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${source === 'supabase' ? 'bg-emerald-600/30' : 'bg-amber-600/30'}`}>
              <svg className={`w-6 h-6 ${source === 'supabase' ? 'text-emerald-400' : 'text-amber-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Stock & Reposicion</h2>
              <p className={`text-sm ${source === 'supabase' ? 'text-emerald-200' : 'text-amber-200'}`}>
                {source === 'supabase' ? 'Datos en vivo desde Supabase' : 'Datos de prueba (mock data)'}
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-sm">
            <span className={`px-3 py-1 rounded-full ${
              source === 'supabase' ? 'bg-emerald-600/30 text-emerald-300' : 'bg-amber-600/30 text-amber-300'
            }`}>
              {source === 'supabase' ? 'LIVE' : 'DEMO'}
            </span>
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon="$"
          title="Valor de Stock"
          value={formatCurrency(summary.total_stock_value)}
          subtitle={`${summary.total_items} productos activos`}
          color="purple"
        />
        <SummaryCard
          icon="!"
          title="Alertas Criticas"
          value={summary.critical_count}
          subtitle="Requieren reposicion inmediata"
          color="red"
        />
        <SummaryCard
          icon="!"
          title="Alertas Warning"
          value={summary.warning_count}
          subtitle="Proximos a reordenar"
          color="amber"
        />
        <SummaryCard
          icon="+"
          title="Stock Saludable"
          value={summary.ok_count}
          subtitle={`Cobertura promedio: ${Math.round(summary.avg_days_cover)}d`}
          color="emerald"
        />
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'alerts', label: 'Alertas', count: alerts.length },
          { key: 'rotation', label: 'Mayor Rotacion', count: top_rotation.length },
          { key: 'sold', label: 'Mas Vendidos', count: top_sold.length },
          { key: 'countdown', label: 'Reloj Reposicion', count: reorder_countdown.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key as typeof activeView)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeView === tab.key
                ? tab.key === 'alerts'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white'
                  : tab.key === 'countdown'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                  : 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeView === tab.key ? 'bg-white/20' : 'bg-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content based on active view */}
      {activeView === 'alerts' && <AlertCards alerts={alerts} />}

      {activeView === 'rotation' && (
        <StockTable items={top_rotation} title="Top 10 - Mayor Rotacion (u/dia)" />
      )}

      {activeView === 'sold' && (
        <StockTable items={top_sold} title="Top 10 - Mas Vendidos (30 dias)" />
      )}

      {activeView === 'countdown' && (
        <StockTable items={reorder_countdown} title="Reloj de Reposicion - Proximos 15 dias" showCountdown />
      )}

      {/* Legend / Help */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Leyenda de Indicadores</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-gray-300">Stock sobre punto de reorden</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="text-gray-300">Stock en punto de reorden</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-300">Stock bajo minimo de seguridad</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 border-r-2 border-amber-400"></div>
            <span className="text-gray-300">Linea: Punto de reorden</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 border-r-2 border-red-400 border-dashed"></div>
            <span className="text-gray-300">Linea punteada: Stock seguridad</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-medium">u/dia</span>
            <span className="text-gray-300">Rotacion diaria promedio (30d)</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
          <p><strong>Punto de Reorden</strong> = (Rotacion diaria x Lead Time) + Stock Seguridad</p>
          <p className="mt-1"><strong>Stock Seguridad</strong> = 3 dias de venta | <strong>Lead Time default</strong> = 7 dias</p>
        </div>
      </div>
    </div>
  );
}
