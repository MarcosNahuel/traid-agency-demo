-- =====================================================
-- CRM POSTVENTA DEMO - MarIA S.A.
-- SEED: Datos de ejemplo para demo
-- =====================================================

-- =====================================================
-- PRODUCTOS
-- =====================================================
INSERT INTO products (sku, title, description, price, cost, stock, category, brand, image_url, tags, status) VALUES

-- PCs Gaming
('PC-STARTER-001', 'PC Gamer Starter - Ryzen 5 5600G | 16GB RAM | 500GB SSD', 'PC ideal para iniciarse en el gaming. APU Ryzen 5 5600G con graficos integrados Vega 7, 16GB RAM DDR4 3200MHz, SSD NVMe 500GB.', 450000, 380000, 12, 'pcs-gaming', 'MarIA Custom', 'https://placehold.co/400x400/7C3AED/white?text=PC+Starter', ARRAY['entry-level', 'apu', 'ryzen'], 'active'),
('PC-MID-001', 'PC Gamer Mid - RTX 4060 | Ryzen 5 5600 | 16GB RAM', 'PC gamer de gama media con RTX 4060 8GB, Ryzen 5 5600, 16GB DDR4, SSD 1TB NVMe.', 850000, 720000, 8, 'pcs-gaming', 'MarIA Custom', 'https://placehold.co/400x400/7C3AED/white?text=PC+Mid', ARRAY['mid-range', 'rtx-4060', 'ryzen'], 'active'),
('PC-HIGH-001', 'PC Gamer Pro - RTX 4070 | Ryzen 7 5800X | 32GB RAM', 'PC gamer de alta gama con RTX 4070 12GB, Ryzen 7 5800X, 32GB DDR4 3600MHz, SSD 2TB NVMe.', 1200000, 1000000, 4, 'pcs-gaming', 'MarIA Custom', 'https://placehold.co/400x400/7C3AED/white?text=PC+Pro', ARRAY['high-end', 'rtx-4070', 'ryzen'], 'active'),
('PC-ULTRA-001', 'PC Gamer Ultra - RTX 4080 | Ryzen 9 7900X | 64GB RAM', 'PC gamer enthusiast con RTX 4080 16GB, Ryzen 9 7900X, 64GB DDR5 6000MHz, SSD 2TB NVMe.', 2200000, 1850000, 2, 'pcs-gaming', 'MarIA Custom', 'https://placehold.co/400x400/7C3AED/white?text=PC+Ultra', ARRAY['ultra', 'rtx-4080', 'ryzen-9'], 'active'),
('PC-ULTRA-002', 'PC Gamer Extreme - RTX 4090 | Intel i9-14900K | 64GB RAM', 'La PC mas potente. RTX 4090 24GB, Intel i9-14900K, 64GB DDR5 7200MHz, SSD 4TB NVMe.', 3500000, 2900000, 1, 'pcs-gaming', 'MarIA Custom', 'https://placehold.co/400x400/7C3AED/white?text=PC+Extreme', ARRAY['extreme', 'rtx-4090', 'i9'], 'active'),

-- Notebooks
('NB-WORK-001', 'Notebook HP 15 - Ryzen 5 5500U | 8GB RAM | 256GB SSD', 'Notebook para trabajo y estudio. Ryzen 5 5500U, 8GB RAM, 256GB SSD, pantalla 15.6 FHD.', 380000, 320000, 15, 'notebooks', 'HP', 'https://placehold.co/400x400/10B981/white?text=HP+15', ARRAY['work', 'hp', 'ryzen'], 'active'),
('NB-GAME-001', 'Notebook Gamer Acer Nitro 5 - RTX 3050 | Ryzen 5 | 16GB RAM', 'Notebook gamer entry con RTX 3050 4GB, Ryzen 5 5600H, 16GB RAM, 512GB SSD, pantalla 15.6 FHD 144Hz.', 750000, 630000, 7, 'notebooks', 'Acer', 'https://placehold.co/400x400/F59E0B/white?text=Nitro+5', ARRAY['gaming', 'acer', 'rtx-3050'], 'active'),
('NB-GAME-002', 'Notebook Gamer ASUS TUF Gaming - RTX 4050 | Ryzen 7 | 16GB RAM', 'Notebook gamer con RTX 4050 6GB, Ryzen 7 7735HS, 16GB DDR5, 512GB SSD, pantalla 15.6 FHD 144Hz.', 920000, 780000, 5, 'notebooks', 'ASUS', 'https://placehold.co/400x400/F59E0B/white?text=TUF+Gaming', ARRAY['gaming', 'asus', 'rtx-4050'], 'active'),
('NB-PRO-001', 'MacBook Air M2 - 8GB RAM | 256GB SSD', 'MacBook Air con chip M2, 8GB RAM unificada, 256GB SSD, pantalla Liquid Retina 13.6.', 1400000, 1200000, 6, 'notebooks', 'Apple', 'https://placehold.co/400x400/374151/white?text=MacBook+Air', ARRAY['apple', 'm2', 'ultrabook'], 'active'),

-- Placas de Video
('GPU-3060-001', 'NVIDIA GeForce RTX 3060 12GB - Gigabyte Gaming OC', 'RTX 3060 12GB GDDR6, ray tracing, DLSS. Excelente para 1080p/1440p gaming.', 380000, 320000, 12, 'placas-video', 'Gigabyte', 'https://placehold.co/400x400/76B900/white?text=RTX+3060', ARRAY['nvidia', 'rtx', 'mid'], 'active'),
('GPU-4060-001', 'NVIDIA GeForce RTX 4060 8GB - MSI Ventus 2X', 'RTX 4060 8GB GDDR6, nueva arquitectura Ada Lovelace, DLSS 3, ray tracing mejorado.', 450000, 380000, 10, 'placas-video', 'MSI', 'https://placehold.co/400x400/76B900/white?text=RTX+4060', ARRAY['nvidia', 'rtx-40', 'mid'], 'active'),
('GPU-4070-001', 'NVIDIA GeForce RTX 4070 12GB - Gigabyte Gaming OC', 'RTX 4070 12GB GDDR6X, potencia para 1440p y entrada a 4K. DLSS 3, frame generation.', 750000, 630000, 5, 'placas-video', 'Gigabyte', 'https://placehold.co/400x400/76B900/white?text=RTX+4070', ARRAY['nvidia', 'rtx-40', 'high'], 'active'),
('GPU-4080-001', 'NVIDIA GeForce RTX 4080 Super 16GB - ASUS ROG Strix', 'RTX 4080 Super 16GB GDDR6X, flagship para 4K gaming. ROG Strix con RGB Aura Sync.', 1400000, 1180000, 2, 'placas-video', 'ASUS', 'https://placehold.co/400x400/76B900/white?text=RTX+4080', ARRAY['nvidia', 'rtx-40', 'enthusiast'], 'active'),
('GPU-4090-001', 'NVIDIA GeForce RTX 4090 24GB - Gigabyte Gaming OC', 'La GPU mas potente del mercado. RTX 4090 24GB GDDR6X, para 4K 120FPS+.', 2500000, 2100000, 1, 'placas-video', 'Gigabyte', 'https://placehold.co/400x400/76B900/white?text=RTX+4090', ARRAY['nvidia', 'rtx-40', 'ultimate'], 'active'),
('GPU-RX7800-001', 'AMD Radeon RX 7800 XT 16GB - PowerColor Red Devil', 'RX 7800 XT 16GB GDDR6, potencia para 1440p gaming. 16GB VRAM para juegos modernos.', 650000, 550000, 6, 'placas-video', 'PowerColor', 'https://placehold.co/400x400/ED1C24/white?text=RX+7800XT', ARRAY['amd', 'rdna3', 'high'], 'active'),

-- Monitores
('MON-24-144', 'Monitor LG 24" FHD 144Hz IPS - 24GN60R UltraGear', 'Monitor gaming 24 Full HD, 144Hz, 1ms, IPS, G-Sync compatible.', 180000, 150000, 18, 'monitores', 'LG', 'https://placehold.co/400x400/A50034/white?text=LG+144Hz', ARRAY['gaming', '144hz', 'ips'], 'active'),
('MON-27-144', 'Monitor ASUS 27" QHD 144Hz IPS - VG27AQ1A', 'Monitor gaming 27 1440p, 144Hz, 1ms, IPS, G-Sync compatible, HDR10.', 280000, 235000, 12, 'monitores', 'ASUS', 'https://placehold.co/400x400/7C3AED/white?text=ASUS+27+QHD', ARRAY['gaming', '1440p', '144hz'], 'active'),
('MON-27-240', 'Monitor BenQ ZOWIE 27" FHD 240Hz TN - XL2546K', 'Monitor esports profesional 27 1080p, 240Hz, 0.5ms, DyAc+.', 380000, 320000, 6, 'monitores', 'BenQ', 'https://placehold.co/400x400/FF6600/white?text=ZOWIE+240Hz', ARRAY['esports', '240hz', 'pro'], 'active'),

-- Perifericos
('TEC-MEM-001', 'Teclado Mecanico Redragon Kumara K552 RGB - Switch Red', 'Teclado mecanico TKL con switches red, retroiluminacion RGB, construccion metalica.', 35000, 28000, 40, 'perifericos', 'Redragon', 'https://placehold.co/400x400/FF4444/white?text=Kumara+RGB', ARRAY['mecanico', 'tkl', 'rgb'], 'active'),
('TEC-MEM-002', 'Teclado Mecanico HyperX Alloy Origins Core RGB - Switch Red', 'Teclado mecanico TKL premium, switches HyperX Red, aluminio, RGB por tecla.', 85000, 72000, 20, 'perifericos', 'HyperX', 'https://placehold.co/400x400/FF0000/white?text=HyperX+Origins', ARRAY['mecanico', 'tkl', 'premium'], 'active'),
('MOU-GAM-001', 'Mouse Logitech G203 LIGHTSYNC RGB', 'Mouse gaming con sensor 8K DPI, LIGHTSYNC RGB, 6 botones programables.', 25000, 20000, 50, 'perifericos', 'Logitech', 'https://placehold.co/400x400/00B8FC/white?text=G203', ARRAY['gaming', 'rgb', 'entry'], 'active'),
('MOU-GAM-003', 'Mouse Logitech G Pro X Superlight 2 Wireless', 'Mouse wireless pro ultraliviano 60g, sensor HERO 2 32K, bateria 95hs.', 120000, 100000, 15, 'perifericos', 'Logitech', 'https://placehold.co/400x400/00B8FC/white?text=Superlight+2', ARRAY['wireless', 'pro', 'ultralight'], 'active'),
('AUR-GAM-002', 'Auriculares Logitech G435 LIGHTSPEED Wireless', 'Auriculares wireless gaming, Bluetooth + LIGHTSPEED, 18hs bateria, 165g ultralivianos.', 75000, 63000, 20, 'perifericos', 'Logitech', 'https://placehold.co/400x400/00B8FC/white?text=G435', ARRAY['wireless', 'bluetooth', 'liviano'], 'active'),
('AUR-GAM-003', 'Auriculares SteelSeries Arctis Nova 7 Wireless', 'Auriculares wireless premium, 2.4GHz + Bluetooth simultaneo, 38hs bateria.', 150000, 125000, 10, 'perifericos', 'SteelSeries', 'https://placehold.co/400x400/FF5500/white?text=Arctis+Nova+7', ARRAY['wireless', 'premium', 'spatial'], 'active'),

-- Sillas
('SIL-ECO-001', 'Silla Gamer Primus Thronos 100T - Negra/Roja', 'Silla gamer con soporte lumbar, apoyabrazos 2D, reclinable 150, ruedas silenciosas.', 120000, 95000, 15, 'sillas', 'Primus', 'https://placehold.co/400x400/333333/white?text=Thronos+100T', ARRAY['silla', 'gaming', 'entry'], 'active'),
('SIL-PRO-001', 'Silla Gamer Secretlab Titan Evo 2024 - Stealth', 'La mejor silla gamer. Espuma fria 4-way L-ADAPT, soporte lumbar magnetico.', 450000, 380000, 4, 'sillas', 'Secretlab', 'https://placehold.co/400x400/1A1A2E/white?text=Titan+Evo', ARRAY['silla', 'ergonomica', 'ultimate'], 'active'),

-- Componentes
('RAM-32-001', 'RAM Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4 3600MHz', 'Kit premium 32GB DDR4, 3600MHz, CL18, RGB dinamico, perfiles XMP.', 85000, 72000, 20, 'componentes', 'Corsair', 'https://placehold.co/400x400/F3C300/black?text=Vengeance+32GB', ARRAY['ram', 'ddr4', 'premium'], 'active'),
('SSD-1TB-001', 'SSD Samsung 980 PRO 1TB NVMe PCIe 4.0', 'SSD NVMe premium 1TB, lectura 7000MB/s, escritura 5000MB/s.', 85000, 72000, 25, 'componentes', 'Samsung', 'https://placehold.co/400x400/1428A0/white?text=980+PRO+1TB', ARRAY['ssd', 'nvme', 'premium'], 'active'),
('PSU-750-001', 'Fuente Corsair RM750 750W 80+ Gold Full Modular', 'Fuente premium 750W, 80+ Gold, full modular, ventilador Zero RPM.', 120000, 100000, 15, 'componentes', 'Corsair', 'https://placehold.co/400x400/F3C300/black?text=RM750', ARRAY['fuente', 'gold', 'modular'], 'active'),
('GAB-MID-001', 'Gabinete NZXT H510 Flow - Negro', 'Gabinete mid-tower con excelente airflow, panel frontal perforado, vidrio templado.', 85000, 72000, 18, 'componentes', 'NZXT', 'https://placehold.co/400x400/7C3AED/white?text=H510+Flow', ARRAY['gabinete', 'airflow', 'mid-tower'], 'active');

-- =====================================================
-- AI AGENTS
-- =====================================================
INSERT INTO ai_agents (id, name, type, avatar, description, channels, is_active, config, metrics) VALUES
(
  'a0000001-0001-0001-0001-000000000001',
  'Barbi',
  'preventa',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Barbi&backgroundColor=7c3aed',
  'Agente de preventa especializada en asesoramiento de productos gaming y tecnologia',
  ARRAY['mercadolibre', 'shopify', 'tiendanube'],
  true,
  '{"personality": "Amigable, entusiasta del gaming", "greeting": "Hola! Soy Barbi de MarIA S.A.", "tools": ["product_search", "stock_check", "compatibility_check"]}'::jsonb,
  '{"total_conversations": 1250, "resolution_rate": 0.88, "satisfaction_score": 4.7}'::jsonb
),
(
  'a0000001-0001-0001-0001-000000000002',
  'Tomi',
  'postventa',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Tomi&backgroundColor=10b981',
  'Agente de postventa especializado en seguimiento de pedidos, garantias y devoluciones',
  ARRAY['mercadolibre', 'shopify', 'tiendanube'],
  true,
  '{"personality": "Empatico, solucionador", "greeting": "Hola! Soy Tomi de MarIA S.A.", "tools": ["order_lookup", "tracking_lookup", "billing_check", "escalation"]}'::jsonb,
  '{"total_conversations": 2100, "resolution_rate": 0.88, "satisfaction_score": 4.5}'::jsonb
),
(
  'a0000001-0001-0001-0001-000000000003',
  'Sofi',
  'soporte',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Sofi&backgroundColor=f59e0b',
  'Agente de soporte tecnico especializada en troubleshooting de hardware gaming',
  ARRAY['mercadolibre', 'shopify', 'tiendanube'],
  true,
  '{"personality": "Tecnica, detallista", "greeting": "Hola! Soy Sofi del soporte tecnico", "tools": ["knowledge_base", "diagnostic_guide", "warranty_check"]}'::jsonb,
  '{"total_conversations": 850, "resolution_rate": 0.80, "satisfaction_score": 4.6}'::jsonb
);

-- =====================================================
-- ORDENES DE EJEMPLO
-- =====================================================
-- Primero obtenemos los IDs de productos
DO $$
DECLARE
  v_gpu_4060_id UUID;
  v_pc_mid_id UUID;
  v_mon_27_id UUID;
  v_tec_hyperx_id UUID;
  v_mou_superlight_id UUID;
  v_ram_32_id UUID;
BEGIN
  SELECT id INTO v_gpu_4060_id FROM products WHERE sku = 'GPU-4060-001';
  SELECT id INTO v_pc_mid_id FROM products WHERE sku = 'PC-MID-001';
  SELECT id INTO v_mon_27_id FROM products WHERE sku = 'MON-27-144';
  SELECT id INTO v_tec_hyperx_id FROM products WHERE sku = 'TEC-MEM-002';
  SELECT id INTO v_mou_superlight_id FROM products WHERE sku = 'MOU-GAM-003';
  SELECT id INTO v_ram_32_id FROM products WHERE sku = 'RAM-32-001';

  -- Insertar ordenes
  INSERT INTO orders (external_id, channel, status, buyer_id, buyer_name, buyer_email, buyer_nickname, product_id, product_sku, product_title, quantity, unit_price, total, shipping_id, shipping_status, shipping_carrier, tracking_number, date_shipped, date_delivered, receiver_city, receiver_state, billing_doc_type, billing_doc_number, billing_taxpayer_type, can_receive_factura_a, created_at) VALUES
  ('2000010050001001', 'mercadolibre', 'delivered', '123456001', 'Martin Rodriguez', 'martin.rodriguez@gmail.com', 'MARTINR_GAMER', v_gpu_4060_id, 'GPU-4060-001', 'NVIDIA GeForce RTX 4060 8GB', 1, 450000, 450000, '44180001001', 'delivered', 'mercadoenvios', 'MEL100001001AR', '2024-12-11 08:00:00+00', '2024-12-13 14:30:00+00', 'CABA', 'Capital Federal', 'DNI', '35123001', 'Consumidor Final', false, '2024-12-10 10:30:00+00'),
  ('2000010050001002', 'mercadolibre', 'delivered', '123456002', 'Lucia Fernandez', 'lucia.fernandez@hotmail.com', 'LUCIAF_TECH', v_pc_mid_id, 'PC-MID-001', 'PC Gamer Mid - RTX 4060', 1, 850000, 850000, '44180001002', 'delivered', 'mercadoenvios', 'MEL100001002AR', '2024-12-09 09:00:00+00', '2024-12-12 16:45:00+00', 'Cordoba', 'Cordoba', 'CUIT', '20-35123002-9', 'Responsable Monotributo', true, '2024-12-08 15:20:00+00'),
  ('2000010050001004', 'mercadolibre', 'delivered', '123456008', 'Joaquin Alvarez', 'joaquin.alvarez.stream@gmail.com', 'JOACO_STREAM', v_mon_27_id, 'MON-27-144', 'Monitor ASUS 27" QHD 144Hz', 1, 280000, 280000, '44180001004', 'delivered', 'mercadoenvios', 'MEL100001008AR', '2024-12-03 08:30:00+00', '2024-12-05 13:15:00+00', 'CABA', 'Capital Federal', 'CUIT', '20-33123008-1', 'Responsable Monotributo', true, '2024-12-02 12:00:00+00'),
  ('SH-1001', 'shopify', 'delivered', 'SH-123456004', 'Ana Garcia', 'ana.garcia@outlook.com', NULL, v_tec_hyperx_id, 'TEC-MEM-002', 'Teclado Mecanico HyperX Alloy Origins', 1, 85000, 85000, 'SH-SHIP-1001', 'delivered', 'oca', 'OCA100001004AR', '2024-12-06 10:00:00+00', '2024-12-10 11:30:00+00', 'La Plata', 'Buenos Aires', 'DNI', '32123004', 'Consumidor Final', false, '2024-12-05 09:15:00+00'),
  ('SH-1002', 'shopify', 'delivered', 'SH-123456005', 'Diego Lopez', 'diego.lopez.gamer@gmail.com', NULL, v_mou_superlight_id, 'MOU-GAM-003', 'Mouse Logitech G Pro X Superlight 2', 1, 120000, 120000, 'SH-SHIP-1002', 'delivered', 'andreani', 'AND100001005AR', '2024-12-11 18:00:00+00', '2024-12-12 10:00:00+00', 'CABA', 'Capital Federal', 'CUIT', '20-28123005-7', 'Responsable Inscripto', true, '2024-12-11 14:30:00+00'),
  ('TN-5001', 'tiendanube', 'delivered', 'TN-123456006', 'Pablo Martinez', 'pablo.martinez@yahoo.com', NULL, v_ram_32_id, 'RAM-32-001', 'RAM Corsair Vengeance RGB Pro 32GB', 1, 85000, 85000, 'TN-SHIP-5001', 'delivered', 'correo_argentino', 'CA100001006AR', '2024-12-02 11:00:00+00', '2024-12-07 15:20:00+00', 'Mendoza', 'Mendoza', 'DNI', '40123006', 'Consumidor Final', false, '2024-12-01 16:45:00+00');
END $$;

-- =====================================================
-- CALCULAR METRICAS DE PRODUCTOS
-- =====================================================
SELECT refresh_stock_metrics();

-- =====================================================
-- MENSAJE DE FINALIZACION
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Seed completado exitosamente para MarIA S.A. Demo';
  RAISE NOTICE 'Productos insertados: %', (SELECT COUNT(*) FROM products);
  RAISE NOTICE 'Agentes IA configurados: %', (SELECT COUNT(*) FROM ai_agents);
  RAISE NOTICE 'Ordenes de ejemplo: %', (SELECT COUNT(*) FROM orders);
END $$;
