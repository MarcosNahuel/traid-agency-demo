import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Types for Stock API
export interface StockItem {
  item_id: string;
  title: string;
  permalink: string | null;
  thumbnail: string | null;
  price: number | null;
  available_quantity: number;
  status: string | null;
  sku: string | null;
  units_sold_30d: number;
  units_sold_90d: number;
  avg_daily_30d: number;
  days_cover: number | null;
  lead_time_days: number;
  safety_stock_units: number;
  reorder_point_units: number;
  reorder_in_days: number | null;
  reorder_date: string | null;
  severity: 'critical' | 'warning' | 'ok';
  calculated_at: string;
}

export interface StockSummary {
  total_items: number;
  critical_count: number;
  warning_count: number;
  ok_count: number;
  total_stock_value: number;
  items_needing_reorder: number;
  avg_days_cover: number;
}

export interface StockResponse {
  success: boolean;
  data: {
    summary: StockSummary;
    top_rotation: StockItem[];
    top_sold: StockItem[];
    alerts: StockItem[];
    reorder_countdown: StockItem[];
  };
  source: 'supabase' | 'mock';
  timestamp: string;
}

// Mock data for development/testing when Supabase tables don't exist
function generateMockData(): StockResponse['data'] {
  const mockProducts = [
    { id: 'ITM-001', title: 'PC Gamer MarIA Nitro - RTX 4060', sku: 'PC-NITRO-001', price: 1200000, stock: 5, sold30: 12, sold90: 30 },
    { id: 'ITM-002', title: 'NVIDIA RTX 4070 12GB Galax', sku: 'GPU-4070-012', price: 750000, stock: 3, sold30: 15, sold90: 40 },
    { id: 'ITM-003', title: 'Monitor LG 27\" UltraGear 144Hz', sku: 'MON-LG-27', price: 380000, stock: 12, sold30: 25, sold90: 60 },
    { id: 'ITM-004', title: 'Auriculares HyperX Cloud II', sku: 'PER-HYP-CLOU', price: 120000, stock: 2, sold30: 40, sold90: 110 },
    { id: 'ITM-005', title: 'Teclado Logitech G915 TKL', sku: 'PER-KEY-037', price: 280000, stock: 8, sold30: 10, sold90: 25 },
    { id: 'ITM-006', title: 'Mouse Razer DeathAdder V3 Pro', sku: 'PER-MOU-038', price: 110000, stock: 15, sold30: 30, sold90: 80 },
    { id: 'ITM-007', title: 'SSD WD Black 2TB NVMe', sku: 'SSD-WD-050', price: 220000, stock: 20, sold30: 18, sold90: 45 },
    { id: 'ITM-008', title: 'Silla Gaming Secretlab Titan', sku: 'FUR-SEC-TIT', price: 850000, stock: 4, sold30: 5, sold90: 12 },
    { id: 'ITM-009', title: 'Microfono HyperX QuadCast S', sku: 'PER-MIC-040', price: 160000, stock: 6, sold30: 14, sold90: 35 },
    { id: 'ITM-010', title: 'Placa Madre ASUS ROG Strix Z790', sku: 'MB-ASU-Z790', price: 550000, stock: 3, sold30: 8, sold90: 20 },
    { id: 'ITM-011', title: 'Fuente Corsair 850W Gold', sku: 'PSU-COR-850', price: 180000, stock: 10, sold30: 22, sold90: 55 },
    { id: 'ITM-012', title: 'Gabinete NZXT H7 Flow White', sku: 'CASE-NZXT-H7', price: 210000, stock: 7, sold30: 11, sold90: 28 },
  ];


  const calculateMetrics = (item: typeof mockProducts[0]) => {
    const avgDaily = item.sold30 / 30;
    const daysCover = avgDaily > 0 ? item.stock / avgDaily : null;
    const safetyStock = avgDaily * 3;
    const leadTime = 7;
    const reorderPoint = (avgDaily * leadTime) + safetyStock;
    const reorderInDays = avgDaily > 0 ? (item.stock - reorderPoint) / avgDaily : null;
    const reorderDate = reorderInDays !== null && reorderInDays > 0
      ? new Date(Date.now() + reorderInDays * 24 * 60 * 60 * 1000).toISOString()
      : reorderInDays !== null && reorderInDays <= 0
        ? new Date().toISOString()
        : null;

    let severity: 'critical' | 'warning' | 'ok' = 'ok';
    if (item.stock <= reorderPoint) {
      severity = 'critical';
    } else if (daysCover !== null && daysCover <= leadTime + 5) {
      severity = 'warning';
    }

    return {
      item_id: item.id,
      title: item.title,
      permalink: `https://www.mercadolibre.com.ar/p/${item.id}`,
      thumbnail: `https://http2.mlstatic.com/D_NQ_NP_${item.id}-V.webp`,
      price: item.price,
      available_quantity: item.stock,
      status: 'active',
      sku: item.sku,
      units_sold_30d: item.sold30,
      units_sold_90d: item.sold90,
      avg_daily_30d: Math.round(avgDaily * 100) / 100,
      days_cover: daysCover !== null ? Math.round(daysCover * 10) / 10 : null,
      lead_time_days: leadTime,
      safety_stock_units: Math.round(safetyStock),
      reorder_point_units: Math.round(reorderPoint),
      reorder_in_days: reorderInDays !== null ? Math.round(reorderInDays * 10) / 10 : null,
      reorder_date: reorderDate,
      severity,
      calculated_at: new Date().toISOString(),
    };
  };

  const items: StockItem[] = mockProducts.map(calculateMetrics);

  // Sort by different criteria
  const topRotation = [...items].sort((a, b) => b.avg_daily_30d - a.avg_daily_30d).slice(0, 10);
  const topSold = [...items].sort((a, b) => b.units_sold_30d - a.units_sold_30d).slice(0, 10);
  const alerts = items.filter(i => i.severity === 'critical' || i.severity === 'warning')
    .sort((a, b) => {
      if (a.severity === 'critical' && b.severity !== 'critical') return -1;
      if (a.severity !== 'critical' && b.severity === 'critical') return 1;
      return (a.reorder_in_days ?? Infinity) - (b.reorder_in_days ?? Infinity);
    });
  const reorderCountdown = items
    .filter(i => i.reorder_in_days !== null && i.reorder_in_days <= 15)
    .sort((a, b) => (a.reorder_in_days ?? Infinity) - (b.reorder_in_days ?? Infinity))
    .slice(0, 10);

  // Calculate summary
  const summary: StockSummary = {
    total_items: items.length,
    critical_count: items.filter(i => i.severity === 'critical').length,
    warning_count: items.filter(i => i.severity === 'warning').length,
    ok_count: items.filter(i => i.severity === 'ok').length,
    total_stock_value: items.reduce((sum, i) => sum + (i.price || 0) * i.available_quantity, 0),
    items_needing_reorder: items.filter(i => i.available_quantity <= i.reorder_point_units).length,
    avg_days_cover: items.filter(i => i.days_cover !== null).reduce((sum, i) => sum + (i.days_cover || 0), 0) /
      items.filter(i => i.days_cover !== null).length || 0,
  };

  return {
    summary,
    top_rotation: topRotation,
    top_sold: topSold,
    alerts,
    reorder_countdown: reorderCountdown,
  };
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Try to fetch from Supabase first
    const { data: stockData, error } = await supabase
      .from('v_stock_dashboard')
      .select('*');

    if (error || !stockData || stockData.length === 0) {
      // Fallback to mock data if tables don't exist or are empty
      console.log('Using mock data for stock dashboard:', error?.message || 'No data');

      const mockData = generateMockData();

      return NextResponse.json({
        success: true,
        data: mockData,
        source: 'mock',
        timestamp: new Date().toISOString(),
      } as StockResponse);
    }

    // Process real data from Supabase
    const items: StockItem[] = stockData.map((row: Record<string, unknown>) => ({
      item_id: row.item_id as string,
      title: row.title as string,
      permalink: row.permalink as string | null,
      thumbnail: row.thumbnail as string | null,
      price: row.price as number | null,
      available_quantity: row.available_quantity as number,
      status: row.status as string | null,
      sku: row.sku as string | null,
      units_sold_30d: row.units_sold_30d as number || 0,
      units_sold_90d: row.units_sold_90d as number || 0,
      avg_daily_30d: row.avg_daily_30d as number || 0,
      days_cover: row.days_cover as number | null,
      lead_time_days: row.lead_time_days as number || 7,
      safety_stock_units: row.safety_stock_units as number || 0,
      reorder_point_units: row.reorder_point_units as number || 0,
      reorder_in_days: row.reorder_in_days as number | null,
      reorder_date: row.reorder_date as string | null,
      severity: (row.severity as 'critical' | 'warning' | 'ok') || 'ok',
      calculated_at: row.calculated_at as string || new Date().toISOString(),
    }));

    // Sort by different criteria
    const topRotation = [...items].sort((a, b) => b.avg_daily_30d - a.avg_daily_30d).slice(0, 10);
    const topSold = [...items].sort((a, b) => b.units_sold_30d - a.units_sold_30d).slice(0, 10);
    const alerts = items.filter(i => i.severity === 'critical' || i.severity === 'warning')
      .sort((a, b) => {
        if (a.severity === 'critical' && b.severity !== 'critical') return -1;
        if (a.severity !== 'critical' && b.severity === 'critical') return 1;
        return (a.reorder_in_days ?? Infinity) - (b.reorder_in_days ?? Infinity);
      });
    const reorderCountdown = items
      .filter(i => i.reorder_in_days !== null && i.reorder_in_days <= 15)
      .sort((a, b) => (a.reorder_in_days ?? Infinity) - (b.reorder_in_days ?? Infinity))
      .slice(0, 10);

    // Calculate summary
    const summary: StockSummary = {
      total_items: items.length,
      critical_count: items.filter(i => i.severity === 'critical').length,
      warning_count: items.filter(i => i.severity === 'warning').length,
      ok_count: items.filter(i => i.severity === 'ok').length,
      total_stock_value: items.reduce((sum, i) => sum + (i.price || 0) * i.available_quantity, 0),
      items_needing_reorder: items.filter(i => i.available_quantity <= i.reorder_point_units).length,
      avg_days_cover: items.filter(i => i.days_cover !== null).reduce((sum, i) => sum + (i.days_cover || 0), 0) /
        items.filter(i => i.days_cover !== null).length || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        summary,
        top_rotation: topRotation,
        top_sold: topSold,
        alerts,
        reorder_countdown: reorderCountdown,
      },
      source: 'supabase',
      timestamp: new Date().toISOString(),
    } as StockResponse);

  } catch (error) {
    console.error('Stock API Error:', error);

    // Return mock data on any error
    const mockData = generateMockData();

    return NextResponse.json({
      success: true,
      data: mockData,
      source: 'mock',
      timestamp: new Date().toISOString(),
    } as StockResponse);
  }
}
