// Stock Dashboard Types

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

export type SeverityLevel = 'critical' | 'warning' | 'ok';

export const SEVERITY_CONFIG: Record<SeverityLevel, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}> = {
  critical: {
    label: 'Critico',
    color: 'text-red-400',
    bgColor: 'bg-red-900/30',
    borderColor: 'border-red-700',
    icon: '!',
  },
  warning: {
    label: 'Alerta',
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/30',
    borderColor: 'border-amber-700',
    icon: '!',
  },
  ok: {
    label: 'OK',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-900/30',
    borderColor: 'border-emerald-700',
    icon: '+',
  },
};
