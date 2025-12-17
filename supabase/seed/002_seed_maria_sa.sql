-- ================================================
-- SEED DATA: MarIA S.A. - Tienda Gaming
-- Fecha: 2024-12-16
-- Descripcion: Datos demo para CRM Postventa
-- ================================================

-- Limpiar datos existentes (en orden de dependencias)
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE conversations CASCADE;
TRUNCATE TABLE escalations CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE ai_agents CASCADE;
TRUNCATE TABLE dashboard_metrics CASCADE;
TRUNCATE TABLE ai_interactions CASCADE;

-- ================================================
-- PRODUCTOS (65 productos gaming)
-- ================================================

INSERT INTO products (sku, title, description, price, cost, stock, category, brand, image_url, tags) VALUES
-- PCs Gaming
('PC-STARTER-001', 'PC Gamer Starter - Ryzen 5 5600G | 16GB RAM | 500GB SSD', 'PC ideal para iniciarse en el gaming. APU Ryzen 5 5600G con graficos integrados Vega 7, 16GB RAM DDR4 3200MHz, SSD NVMe 500GB.', 450000, 380000, 12, 'pcs-gaming', 'MarIA Custom', 'https://placehold.co/400x400/7C3AED/white?text=PC+Starter', ARRAY['entry-level', 'apu', 'ryzen']),
('PC-MID-001', 'PC Gamer Mid - RTX 4060 | Ryzen 5 5600 | 16GB RAM', 'PC gamer de gama media con RTX 4060 8GB, Ryzen 5 5600, 16GB DDR4, SSD 1TB NVMe.', 850000, 720000, 8, 'pcs-gaming', 'MarIA Custom', 'https://placehold.co/400x400/7C3AED/white?text=PC+Mid', ARRAY['mid-range', 'rtx-4060', 'ryzen']),
('PC-MID-002', 'PC Gamer Mid - RTX 4060 Ti | Intel i5-12400F | 32GB RAM', 'PC gamer potente con RTX 4060 Ti 8GB, Intel i5-12400F, 32GB DDR4, SSD 1TB NVMe.', 950000, 800000, 6, 'pcs-gaming', 'MarIA Custom', 'https://placehold.co/400x400/7C3AED/white?text=PC+Mid+Ti', ARRAY['mid-range', 'rtx-4060-ti', 'intel']),
('PC-HIGH-001', 'PC Gamer Pro - RTX 4070 | Ryzen 7 5800X | 32GB RAM', 'PC gamer de alta gama con RTX 4070 12GB, Ryzen 7 5800X, 32GB DDR4 3600MHz, SSD 2TB NVMe.', 1200000, 1000000, 4, 'pcs-gaming', 'MarIA Custom', 'https://placehold.co/400x400/7C3AED/white?text=PC+Pro', ARRAY['high-end', 'rtx-4070', 'ryzen']),
('PC-HIGH-002', 'PC Gamer Pro - RTX 4070 Ti | Intel i7-13700KF | 32GB RAM', 'PC gamer premium con RTX 4070 Ti Super 16GB, Intel i7-13700KF, 32GB DDR5, SSD 2TB NVMe.', 1500000, 1250000, 3, 'pcs-gaming', 'MarIA Custom', 'https://placehold.co/400x400/7C3AED/white?text=PC+Pro+Ti', ARRAY['high-end', 'rtx-4070-ti', 'intel']),
('PC-ULTRA-001', 'PC Gamer Ultra - RTX 4080 | Ryzen 9 7900X | 64GB RAM', 'PC gamer enthusiast con RTX 4080 16GB, Ryzen 9 7900X, 64GB DDR5 6000MHz, SSD 2TB NVMe.', 2200000, 1850000, 2, 'pcs-gaming', 'MarIA Custom', 'https://placehold.co/400x400/7C3AED/white?text=PC+Ultra', ARRAY['ultra', 'rtx-4080', 'ryzen-9']),
('PC-ULTRA-002', 'PC Gamer Extreme - RTX 4090 | Intel i9-14900K | 64GB RAM', 'La PC mas potente del mercado. RTX 4090 24GB, Intel i9-14900K, 64GB DDR5 7200MHz, SSD 4TB NVMe.', 3500000, 2900000, 1, 'pcs-gaming', 'MarIA Custom', 'https://placehold.co/400x400/7C3AED/white?text=PC+Extreme', ARRAY['extreme', 'rtx-4090', 'i9']),

-- Notebooks
('NB-WORK-001', 'Notebook HP 15 - Ryzen 5 5500U | 8GB RAM | 256GB SSD', 'Notebook para trabajo y estudio. Ryzen 5 5500U, 8GB RAM, 256GB SSD, pantalla 15.6 FHD.', 380000, 320000, 15, 'notebooks', 'HP', 'https://placehold.co/400x400/10B981/white?text=HP+15', ARRAY['work', 'hp', 'ryzen']),
('NB-WORK-002', 'Notebook Lenovo IdeaPad 3 - Intel i5-1235U | 16GB RAM | 512GB SSD', 'Notebook versatil con Intel Core i5 12va gen, 16GB RAM, 512GB SSD NVMe, pantalla 15.6 FHD IPS.', 520000, 440000, 10, 'notebooks', 'Lenovo', 'https://placehold.co/400x400/10B981/white?text=IdeaPad+3', ARRAY['work', 'lenovo', 'intel']),
('NB-GAME-001', 'Notebook Gamer Acer Nitro 5 - RTX 3050 | Ryzen 5 | 16GB RAM', 'Notebook gamer entry con RTX 3050 4GB, Ryzen 5 5600H, 16GB RAM, 512GB SSD, pantalla 15.6 FHD 144Hz.', 750000, 630000, 7, 'notebooks', 'Acer', 'https://placehold.co/400x400/F59E0B/white?text=Nitro+5', ARRAY['gaming', 'acer', 'rtx-3050']),
('NB-GAME-002', 'Notebook Gamer ASUS TUF Gaming - RTX 4050 | Ryzen 7 | 16GB RAM', 'Notebook gamer con RTX 4050 6GB, Ryzen 7 7735HS, 16GB DDR5, 512GB SSD, pantalla 15.6 FHD 144Hz.', 920000, 780000, 5, 'notebooks', 'ASUS', 'https://placehold.co/400x400/F59E0B/white?text=TUF+Gaming', ARRAY['gaming', 'asus', 'rtx-4050']),
('NB-GAME-003', 'Notebook Gamer Lenovo Legion 5 - RTX 4060 | Ryzen 7 | 32GB RAM', 'Notebook gamer premium con RTX 4060 8GB, Ryzen 7 7840HS, 32GB DDR5, 1TB SSD, pantalla 16 WQXGA 165Hz.', 1100000, 920000, 4, 'notebooks', 'Lenovo', 'https://placehold.co/400x400/F59E0B/white?text=Legion+5', ARRAY['gaming', 'lenovo', 'rtx-4060']),
('NB-PRO-001', 'MacBook Air M2 - 8GB RAM | 256GB SSD', 'MacBook Air con chip M2, 8GB RAM unificada, 256GB SSD, pantalla Liquid Retina 13.6.', 1400000, 1200000, 6, 'notebooks', 'Apple', 'https://placehold.co/400x400/374151/white?text=MacBook+Air', ARRAY['apple', 'm2', 'ultrabook']),
('NB-PRO-002', 'MacBook Pro 14 M3 - 16GB RAM | 512GB SSD', 'MacBook Pro 14 con chip M3 Pro, 16GB RAM unificada, 512GB SSD, pantalla Liquid Retina XDR 14.2.', 2100000, 1800000, 3, 'notebooks', 'Apple', 'https://placehold.co/400x400/374151/white?text=MacBook+Pro', ARRAY['apple', 'm3', 'pro']),

-- Placas de Video
('GPU-1650-001', 'NVIDIA GeForce GTX 1650 4GB GDDR6 - ASUS Phoenix', 'Placa de video entry level. GTX 1650 4GB GDDR6, ideal para gaming 1080p en juegos esports.', 180000, 150000, 20, 'placas-video', 'ASUS', 'https://placehold.co/400x400/76B900/white?text=GTX+1650', ARRAY['nvidia', 'gtx', 'entry']),
('GPU-3060-001', 'NVIDIA GeForce RTX 3060 12GB - Gigabyte Gaming OC', 'RTX 3060 12GB GDDR6, ray tracing, DLSS. Excelente para 1080p/1440p gaming.', 380000, 320000, 12, 'placas-video', 'Gigabyte', 'https://placehold.co/400x400/76B900/white?text=RTX+3060', ARRAY['nvidia', 'rtx', 'mid']),
('GPU-4060-001', 'NVIDIA GeForce RTX 4060 8GB - MSI Ventus 2X', 'RTX 4060 8GB GDDR6, nueva arquitectura Ada Lovelace, DLSS 3, ray tracing mejorado.', 450000, 380000, 10, 'placas-video', 'MSI', 'https://placehold.co/400x400/76B900/white?text=RTX+4060', ARRAY['nvidia', 'rtx-40', 'mid']),
('GPU-4060TI-001', 'NVIDIA GeForce RTX 4060 Ti 8GB - ASUS Dual OC', 'RTX 4060 Ti 8GB GDDR6, mas poder para 1440p gaming. DLSS 3, ray tracing.', 580000, 490000, 8, 'placas-video', 'ASUS', 'https://placehold.co/400x400/76B900/white?text=RTX+4060Ti', ARRAY['nvidia', 'rtx-40', 'mid-high']),
('GPU-4070-001', 'NVIDIA GeForce RTX 4070 12GB - Gigabyte Gaming OC', 'RTX 4070 12GB GDDR6X, potencia para 1440p y entrada a 4K. DLSS 3, frame generation.', 750000, 630000, 5, 'placas-video', 'Gigabyte', 'https://placehold.co/400x400/76B900/white?text=RTX+4070', ARRAY['nvidia', 'rtx-40', 'high']),
('GPU-4070TI-001', 'NVIDIA GeForce RTX 4070 Ti Super 16GB - MSI Gaming X Trio', 'RTX 4070 Ti Super 16GB GDDR6X, maxima performance 1440p, muy capaz en 4K.', 950000, 800000, 4, 'placas-video', 'MSI', 'https://placehold.co/400x400/76B900/white?text=RTX+4070Ti', ARRAY['nvidia', 'rtx-40', 'high-end']),
('GPU-4080-001', 'NVIDIA GeForce RTX 4080 Super 16GB - ASUS ROG Strix', 'RTX 4080 Super 16GB GDDR6X, flagship para 4K gaming sin compromiso.', 1400000, 1180000, 2, 'placas-video', 'ASUS', 'https://placehold.co/400x400/76B900/white?text=RTX+4080', ARRAY['nvidia', 'rtx-40', 'enthusiast']),
('GPU-4090-001', 'NVIDIA GeForce RTX 4090 24GB - Gigabyte Gaming OC', 'La GPU mas potente del mercado. RTX 4090 24GB GDDR6X, para 4K 120FPS+.', 2500000, 2100000, 1, 'placas-video', 'Gigabyte', 'https://placehold.co/400x400/76B900/white?text=RTX+4090', ARRAY['nvidia', 'rtx-40', 'ultimate']),
('GPU-RX7600-001', 'AMD Radeon RX 7600 8GB - Sapphire Pulse', 'RX 7600 8GB GDDR6, alternativa AMD para 1080p gaming.', 350000, 295000, 15, 'placas-video', 'Sapphire', 'https://placehold.co/400x400/ED1C24/white?text=RX+7600', ARRAY['amd', 'rdna3', 'mid']),
('GPU-RX7800-001', 'AMD Radeon RX 7800 XT 16GB - PowerColor Red Devil', 'RX 7800 XT 16GB GDDR6, potencia para 1440p gaming.', 650000, 550000, 6, 'placas-video', 'PowerColor', 'https://placehold.co/400x400/ED1C24/white?text=RX+7800XT', ARRAY['amd', 'rdna3', 'high']),

-- Monitores
('MON-24-001', 'Monitor Samsung 24" FHD 75Hz IPS - LS24C310', 'Monitor 24 pulgadas Full HD, panel IPS, 75Hz, FreeSync, bordes finos.', 120000, 100000, 25, 'monitores', 'Samsung', 'https://placehold.co/400x400/1428A0/white?text=Samsung+24', ARRAY['fhd', '75hz', 'ips']),
('MON-24-144', 'Monitor LG 24" FHD 144Hz IPS - 24GN60R UltraGear', 'Monitor gaming 24 Full HD, 144Hz, 1ms, IPS, G-Sync compatible.', 180000, 150000, 18, 'monitores', 'LG', 'https://placehold.co/400x400/A50034/white?text=LG+144Hz', ARRAY['gaming', '144hz', 'ips']),
('MON-27-144', 'Monitor ASUS 27" QHD 144Hz IPS - VG27AQ1A', 'Monitor gaming 27 1440p, 144Hz, 1ms, IPS, G-Sync compatible, HDR10.', 280000, 235000, 12, 'monitores', 'ASUS', 'https://placehold.co/400x400/7C3AED/white?text=ASUS+27+QHD', ARRAY['gaming', '1440p', '144hz']),
('MON-27-165', 'Monitor MSI 27" QHD 165Hz VA - G274QPF', 'Monitor gaming 27 1440p, 165Hz, 1ms, VA con colores vibrantes.', 320000, 270000, 8, 'monitores', 'MSI', 'https://placehold.co/400x400/FF0000/white?text=MSI+165Hz', ARRAY['gaming', '1440p', '165hz']),
('MON-27-240', 'Monitor BenQ ZOWIE 27" FHD 240Hz TN - XL2546K', 'Monitor esports profesional 27 1080p, 240Hz, 0.5ms, DyAc+.', 380000, 320000, 6, 'monitores', 'BenQ', 'https://placehold.co/400x400/FF6600/white?text=ZOWIE+240Hz', ARRAY['esports', '240hz', 'pro']),
('MON-32-144', 'Monitor LG 32" 4K 144Hz Nano IPS - 32GQ950-B UltraGear', 'Monitor premium 32 4K, 144Hz, 1ms, Nano IPS, HDMI 2.1.', 650000, 550000, 4, 'monitores', 'LG', 'https://placehold.co/400x400/A50034/white?text=LG+4K+144Hz', ARRAY['4k', '144hz', 'premium']),

-- Perifericos - Teclados
('TEC-MEM-001', 'Teclado Mecanico Redragon Kumara K552 RGB - Switch Red', 'Teclado mecanico TKL con switches red, retroiluminacion RGB, construccion metalica.', 35000, 28000, 40, 'perifericos', 'Redragon', 'https://placehold.co/400x400/FF4444/white?text=Kumara+RGB', ARRAY['mecanico', 'tkl', 'rgb']),
('TEC-MEM-002', 'Teclado Mecanico HyperX Alloy Origins Core RGB - Switch Red', 'Teclado mecanico TKL premium, switches HyperX Red, aluminio, RGB por tecla.', 85000, 72000, 20, 'perifericos', 'HyperX', 'https://placehold.co/400x400/FF0000/white?text=HyperX+Origins', ARRAY['mecanico', 'tkl', 'premium']),
('TEC-MEM-003', 'Teclado Mecanico Logitech G Pro X RGB - Switch GX', 'Teclado mecanico pro con switches intercambiables GX, LIGHTSYNC RGB.', 120000, 100000, 12, 'perifericos', 'Logitech', 'https://placehold.co/400x400/00B8FC/white?text=G+Pro+X', ARRAY['mecanico', 'pro', 'hot-swap']),

-- Perifericos - Mouse
('MOU-GAM-001', 'Mouse Logitech G203 LIGHTSYNC RGB', 'Mouse gaming con sensor 8K DPI, LIGHTSYNC RGB, 6 botones programables.', 25000, 20000, 50, 'perifericos', 'Logitech', 'https://placehold.co/400x400/00B8FC/white?text=G203', ARRAY['gaming', 'rgb', 'entry']),
('MOU-GAM-002', 'Mouse Razer DeathAdder V3 - 30K DPI', 'Mouse gaming ergonomico con sensor Focus Pro 30K, switches opticos Gen 3.', 65000, 55000, 25, 'perifericos', 'Razer', 'https://placehold.co/400x400/44D62C/white?text=DeathAdder+V3', ARRAY['gaming', 'ergonomico', 'pro']),
('MOU-GAM-003', 'Mouse Logitech G Pro X Superlight 2 Wireless', 'Mouse wireless pro ultraliviano 60g, sensor HERO 2 32K, bateria 95hs.', 120000, 100000, 15, 'perifericos', 'Logitech', 'https://placehold.co/400x400/00B8FC/white?text=Superlight+2', ARRAY['wireless', 'pro', 'ultralight']),

-- Perifericos - Auriculares
('AUR-GAM-001', 'Auriculares HyperX Cloud Stinger 2 Core', 'Auriculares gaming con sonido envolvente, microfono con cancelacion de ruido.', 45000, 38000, 30, 'perifericos', 'HyperX', 'https://placehold.co/400x400/FF0000/white?text=Stinger+2', ARRAY['auriculares', 'gaming', 'entry']),
('AUR-GAM-002', 'Auriculares Logitech G435 LIGHTSPEED Wireless', 'Auriculares wireless gaming, Bluetooth + LIGHTSPEED, 18hs bateria.', 75000, 63000, 20, 'perifericos', 'Logitech', 'https://placehold.co/400x400/00B8FC/white?text=G435', ARRAY['wireless', 'bluetooth', 'liviano']),
('AUR-GAM-003', 'Auriculares SteelSeries Arctis Nova 7 Wireless', 'Auriculares wireless premium, 2.4GHz + Bluetooth simultaneo, 38hs bateria.', 150000, 125000, 10, 'perifericos', 'SteelSeries', 'https://placehold.co/400x400/FF5500/white?text=Arctis+Nova+7', ARRAY['wireless', 'premium', 'spatial']),

-- Perifericos - Mousepad
('PAD-XL-001', 'Mousepad XL SteelSeries QcK Heavy - 90x40cm', 'Mousepad XL con base antideslizante, superficie de tela optimizada.', 18000, 14000, 60, 'perifericos', 'SteelSeries', 'https://placehold.co/400x400/FF5500/white?text=QcK+XL', ARRAY['mousepad', 'xl', 'cloth']),

-- Sillas Gaming
('SIL-ECO-001', 'Silla Gamer Primus Thronos 100T - Negra/Roja', 'Silla gamer con soporte lumbar, apoyabrazos 2D, reclinable 150.', 120000, 95000, 15, 'sillas', 'Primus', 'https://placehold.co/400x400/333333/white?text=Thronos+100T', ARRAY['silla', 'gaming', 'entry']),
('SIL-MID-001', 'Silla Gamer Corsair T1 Race - Negra', 'Silla gamer ergonomica, estructura de acero, cuero PU premium, apoyabrazos 4D.', 280000, 235000, 8, 'sillas', 'Corsair', 'https://placehold.co/400x400/F3C300/black?text=T1+Race', ARRAY['silla', 'gaming', 'premium']),
('SIL-PRO-001', 'Silla Gamer Secretlab Titan Evo 2024 - Stealth', 'La mejor silla gamer del mercado. Espuma fria 4-way L-ADAPT, soporte lumbar magnetico.', 450000, 380000, 4, 'sillas', 'Secretlab', 'https://placehold.co/400x400/1A1A2E/white?text=Titan+Evo', ARRAY['silla', 'ergonomica', 'ultimate']),

-- Componentes - RAM
('RAM-16-001', 'RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz RGB', 'Kit de memorias DDR4 16GB, 3200MHz, CL16, RGB sincronizable.', 45000, 38000, 35, 'componentes', 'Kingston', 'https://placehold.co/400x400/FF0000/white?text=Fury+16GB', ARRAY['ram', 'ddr4', 'rgb']),
('RAM-32-001', 'RAM Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4 3600MHz', 'Kit premium 32GB DDR4, 3600MHz, CL18, RGB dinamico.', 85000, 72000, 20, 'componentes', 'Corsair', 'https://placehold.co/400x400/F3C300/black?text=Vengeance+32GB', ARRAY['ram', 'ddr4', 'premium']),
('RAM-32-D5', 'RAM Kingston Fury Beast 32GB (2x16GB) DDR5 5600MHz', 'Kit DDR5 de ultima generacion, 5600MHz, CL40.', 150000, 125000, 12, 'componentes', 'Kingston', 'https://placehold.co/400x400/FF0000/white?text=DDR5+32GB', ARRAY['ram', 'ddr5', 'next-gen']),

-- Componentes - SSD
('SSD-500-001', 'SSD Kingston NV2 500GB NVMe PCIe 4.0', 'SSD NVMe 500GB, lectura 3500MB/s, escritura 2100MB/s.', 35000, 28000, 40, 'componentes', 'Kingston', 'https://placehold.co/400x400/FF0000/white?text=NV2+500GB', ARRAY['ssd', 'nvme', 'pcie4']),
('SSD-1TB-001', 'SSD Samsung 980 PRO 1TB NVMe PCIe 4.0', 'SSD NVMe premium 1TB, lectura 7000MB/s, escritura 5000MB/s.', 85000, 72000, 25, 'componentes', 'Samsung', 'https://placehold.co/400x400/1428A0/white?text=980+PRO+1TB', ARRAY['ssd', 'nvme', 'premium']),
('SSD-2TB-001', 'SSD WD Black SN850X 2TB NVMe PCIe 4.0', 'SSD gaming 2TB, lectura 7300MB/s, escritura 6600MB/s, con heatsink.', 180000, 150000, 10, 'componentes', 'Western Digital', 'https://placehold.co/400x400/000000/white?text=SN850X+2TB', ARRAY['ssd', 'nvme', 'gaming']),

-- Componentes - Fuentes
('PSU-650-001', 'Fuente EVGA 650 BQ 650W 80+ Bronze Semi-Modular', 'Fuente 650W certificada 80+ Bronze, semi-modular.', 65000, 55000, 20, 'componentes', 'EVGA', 'https://placehold.co/400x400/9FBF00/white?text=EVGA+650W', ARRAY['fuente', 'bronze', 'semi-modular']),
('PSU-750-001', 'Fuente Corsair RM750 750W 80+ Gold Full Modular', 'Fuente premium 750W, 80+ Gold, full modular, garantia 10 anos.', 120000, 100000, 15, 'componentes', 'Corsair', 'https://placehold.co/400x400/F3C300/black?text=RM750', ARRAY['fuente', 'gold', 'modular']),
('PSU-850-001', 'Fuente Seasonic Focus GX-850 850W 80+ Gold Full Modular', 'Fuente high-end 850W, 80+ Gold, full modular.', 160000, 135000, 8, 'componentes', 'Seasonic', 'https://placehold.co/400x400/333333/white?text=Focus+GX-850', ARRAY['fuente', 'gold', 'premium']),

-- Componentes - Gabinetes
('GAB-MID-001', 'Gabinete NZXT H510 Flow - Negro', 'Gabinete mid-tower con excelente airflow, panel frontal perforado.', 85000, 72000, 18, 'componentes', 'NZXT', 'https://placehold.co/400x400/7C3AED/white?text=H510+Flow', ARRAY['gabinete', 'airflow', 'mid-tower']),
('GAB-PRO-001', 'Gabinete Lian Li O11 Dynamic EVO - Negro', 'Gabinete premium dual chamber, soporte para triple 360mm radiator.', 150000, 125000, 10, 'componentes', 'Lian Li', 'https://placehold.co/400x400/000000/white?text=O11+Dynamic', ARRAY['gabinete', 'premium', 'watercooling']);

-- ================================================
-- ORDENES (16 ordenes multi-canal)
-- ================================================

INSERT INTO orders (external_id, channel, status, product, buyer, shipping, billing, tags, date_created) VALUES
-- MercadoLibre Orders
('2000010050001001', 'mercadolibre', 'delivered',
 '{"sku": "GPU-4060-001", "title": "NVIDIA GeForce RTX 4060 8GB - MSI Ventus 2X", "price": 450000, "quantity": 1, "image_url": "https://placehold.co/400x400/76B900/white?text=RTX+4060"}',
 '{"id": "123456001", "first_name": "Martin", "last_name": "Rodriguez", "nickname": "MARTINR_GAMER", "email": "martin.rodriguez@gmail.com", "phone": "+5491155551001"}',
 '{"id": "44180001001", "status": "delivered", "carrier": "mercadoenvios", "logistic_type": "fulfillment", "tracking_number": "MEL100001001AR", "date_created": "2024-12-10T10:30:00Z", "date_shipped": "2024-12-11T08:00:00Z", "date_delivered": "2024-12-13T14:30:00Z", "receiver_city": "CABA", "receiver_state": "Capital Federal"}',
 '{"doc_type": "DNI", "doc_number": "35123001", "taxpayer_type": "Consumidor Final", "can_receive_factura_a": false}',
 ARRAY['gaming', 'gpu', 'nvidia'], '2024-12-10T10:30:00Z'),

('2000010050001002', 'mercadolibre', 'delivered',
 '{"sku": "PC-MID-001", "title": "PC Gamer Mid - RTX 4060 | Ryzen 5 5600 | 16GB RAM", "price": 850000, "quantity": 1, "image_url": "https://placehold.co/400x400/7C3AED/white?text=PC+Mid"}',
 '{"id": "123456002", "first_name": "Lucia", "last_name": "Fernandez", "nickname": "LUCIAF_TECH", "email": "lucia.fernandez@hotmail.com", "phone": "+5491155551002"}',
 '{"id": "44180001002", "status": "delivered", "carrier": "mercadoenvios", "logistic_type": "cross_docking", "tracking_number": "MEL100001002AR", "date_created": "2024-12-08T15:20:00Z", "date_shipped": "2024-12-09T09:00:00Z", "date_delivered": "2024-12-12T16:45:00Z", "receiver_city": "Cordoba", "receiver_state": "Cordoba"}',
 '{"doc_type": "CUIT", "doc_number": "20-35123002-9", "taxpayer_type": "Responsable Monotributo", "can_receive_factura_a": true}',
 ARRAY['gaming', 'pc', 'custom'], '2024-12-08T15:20:00Z'),

('2000010050001003', 'mercadolibre', 'in_transit',
 '{"sku": "NB-GAME-002", "title": "Notebook Gamer ASUS TUF Gaming - RTX 4050 | Ryzen 7 | 16GB RAM", "price": 920000, "quantity": 1, "image_url": "https://placehold.co/400x400/F59E0B/white?text=TUF+Gaming"}',
 '{"id": "123456003", "first_name": "Carlos", "last_name": "Mendez", "nickname": "CARLOSM_2024", "email": "carlos.mendez@gmail.com", "phone": "+5491155551003"}',
 '{"id": "44180001003", "status": "in_transit", "carrier": "andreani", "logistic_type": "cross_docking", "tracking_number": "AND100001003AR", "date_created": "2024-12-14T11:00:00Z", "date_shipped": "2024-12-15T07:30:00Z", "date_delivered": null, "receiver_city": "Rosario", "receiver_state": "Santa Fe"}',
 '{"doc_type": "DNI", "doc_number": "38123003", "taxpayer_type": "Consumidor Final", "can_receive_factura_a": false}',
 ARRAY['gaming', 'notebook', 'asus'], '2024-12-14T11:00:00Z'),

('2000010050001004', 'mercadolibre', 'delivered',
 '{"sku": "MON-27-144", "title": "Monitor ASUS 27\" QHD 144Hz IPS - VG27AQ1A", "price": 280000, "quantity": 1, "image_url": "https://placehold.co/400x400/7C3AED/white?text=ASUS+27+QHD"}',
 '{"id": "123456008", "first_name": "Joaquin", "last_name": "Alvarez", "nickname": "JOACO_STREAM", "email": "joaquin.alvarez.stream@gmail.com", "phone": "+5491155551008"}',
 '{"id": "44180001004", "status": "delivered", "carrier": "mercadoenvios", "logistic_type": "fulfillment", "tracking_number": "MEL100001008AR", "date_created": "2024-12-02T12:00:00Z", "date_shipped": "2024-12-03T08:30:00Z", "date_delivered": "2024-12-05T13:15:00Z", "receiver_city": "CABA", "receiver_state": "Capital Federal"}',
 '{"doc_type": "CUIT", "doc_number": "20-33123008-1", "taxpayer_type": "Responsable Monotributo", "can_receive_factura_a": true}',
 ARRAY['monitor', 'gaming', 'asus'], '2024-12-02T12:00:00Z'),

('2000010050001005', 'mercadolibre', 'cancelled',
 '{"sku": "GPU-4070-001", "title": "NVIDIA GeForce RTX 4070 12GB - Gigabyte Gaming OC", "price": 750000, "quantity": 1, "image_url": "https://placehold.co/400x400/76B900/white?text=RTX+4070"}',
 '{"id": "123456009", "first_name": "Romina", "last_name": "Peralta", "nickname": "ROMI_GAMER99", "email": "romina.peralta@live.com", "phone": "+5491155551009"}',
 '{"id": "44180001005", "status": "cancelled", "carrier": "mercadoenvios", "logistic_type": "cross_docking", "tracking_number": null, "date_created": "2024-12-12T18:30:00Z", "date_shipped": null, "date_delivered": null, "receiver_city": "Mar del Plata", "receiver_state": "Buenos Aires"}',
 '{"doc_type": "DNI", "doc_number": "36123009", "taxpayer_type": "Consumidor Final", "can_receive_factura_a": false}',
 ARRAY['gpu', 'nvidia', 'cancelled'], '2024-12-12T18:30:00Z'),

('2000010050001006', 'mercadolibre', 'delivered',
 '{"sku": "SIL-PRO-001", "title": "Silla Gamer Secretlab Titan Evo 2024 - Stealth", "price": 450000, "quantity": 1, "image_url": "https://placehold.co/400x400/1A1A2E/white?text=Titan+Evo"}',
 '{"id": "123456010", "first_name": "Federico", "last_name": "Sanchez", "nickname": "FEDE_ESPORTS", "email": "fede.sanchez.esports@gmail.com", "phone": "+5491155551010"}',
 '{"id": "44180001006", "status": "delivered", "carrier": "flex", "logistic_type": "same_day", "tracking_number": "FLX100001010AR", "date_created": "2024-11-28T09:00:00Z", "date_shipped": "2024-11-28T10:30:00Z", "date_delivered": "2024-11-28T17:45:00Z", "receiver_city": "CABA", "receiver_state": "Capital Federal"}',
 '{"doc_type": "DNI", "doc_number": "29123010", "taxpayer_type": "Consumidor Final", "can_receive_factura_a": false}',
 ARRAY['silla', 'secretlab', 'premium'], '2024-11-28T09:00:00Z'),

('2000010050001007', 'mercadolibre', 'delivered',
 '{"sku": "PC-HIGH-001", "title": "PC Gamer Pro - RTX 4070 | Ryzen 7 5800X | 32GB RAM", "price": 1200000, "quantity": 1, "image_url": "https://placehold.co/400x400/7C3AED/white?text=PC+Pro"}',
 '{"id": "123456012", "first_name": "Gonzalo", "last_name": "Ramirez", "nickname": "GONZA_BUILDS", "email": "gonzalo.ramirez.tech@gmail.com", "phone": "+5491155551012"}',
 '{"id": "44180001007", "status": "delivered", "carrier": "mercadoenvios", "logistic_type": "fulfillment", "tracking_number": "MEL100001012AR", "date_created": "2024-11-20T14:00:00Z", "date_shipped": "2024-11-21T08:00:00Z", "date_delivered": "2024-11-25T11:30:00Z", "receiver_city": "San Juan", "receiver_state": "San Juan"}',
 '{"doc_type": "CUIT", "doc_number": "20-30123012-5", "taxpayer_type": "Responsable Inscripto", "can_receive_factura_a": true}',
 ARRAY['pc', 'gaming', 'custom'], '2024-11-20T14:00:00Z'),

('2000010050001008', 'mercadolibre', 'delivered',
 '{"sku": "NB-PRO-001", "title": "MacBook Air M2 - 8GB RAM | 256GB SSD", "price": 1400000, "quantity": 1, "image_url": "https://placehold.co/400x400/374151/white?text=MacBook+Air"}',
 '{"id": "123456014", "first_name": "Camila", "last_name": "Ortiz", "nickname": "CAMI_DESIGN", "email": "camila.ortiz.design@gmail.com", "phone": "+5491155551014"}',
 '{"id": "44180001008", "status": "delivered", "carrier": "mercadoenvios", "logistic_type": "fulfillment", "tracking_number": "MEL100001014AR", "date_created": "2024-12-06T10:15:00Z", "date_shipped": "2024-12-07T07:30:00Z", "date_delivered": "2024-12-09T12:00:00Z", "receiver_city": "CABA", "receiver_state": "Capital Federal"}',
 '{"doc_type": "CUIT", "doc_number": "27-34123014-8", "taxpayer_type": "Responsable Monotributo", "can_receive_factura_a": true}',
 ARRAY['notebook', 'apple', 'macbook'], '2024-12-06T10:15:00Z'),

('2000010050001009', 'mercadolibre', 'delivered',
 '{"sku": "GPU-RX7800-001", "title": "AMD Radeon RX 7800 XT 16GB - PowerColor Red Devil", "price": 650000, "quantity": 1, "image_url": "https://placehold.co/400x400/ED1C24/white?text=RX+7800XT"}',
 '{"id": "123456015", "first_name": "Nicolas", "last_name": "Herrera", "nickname": "NICO_AMD_FAN", "email": "nicolas.herrera.tech@gmail.com", "phone": "+5491155551015"}',
 '{"id": "44180001009", "status": "delivered", "carrier": "mercadoenvios", "logistic_type": "cross_docking", "tracking_number": "MEL100001015AR", "date_created": "2024-11-15T16:00:00Z", "date_shipped": "2024-11-16T09:00:00Z", "date_delivered": "2024-11-20T15:30:00Z", "receiver_city": "Bahia Blanca", "receiver_state": "Buenos Aires"}',
 '{"doc_type": "DNI", "doc_number": "31123015", "taxpayer_type": "Consumidor Final", "can_receive_factura_a": false}',
 ARRAY['gpu', 'amd', 'radeon'], '2024-11-15T16:00:00Z'),

-- Shopify Orders
('SH-1001', 'shopify', 'delivered',
 '{"sku": "TEC-MEM-002", "title": "Teclado Mecanico HyperX Alloy Origins Core RGB - Switch Red", "price": 85000, "quantity": 1, "image_url": "https://placehold.co/400x400/FF0000/white?text=HyperX+Origins"}',
 '{"id": "SH-123456004", "first_name": "Ana", "last_name": "Garcia", "nickname": null, "email": "ana.garcia@outlook.com", "phone": "+5491155551004"}',
 '{"id": "SH-SHIP-1001", "status": "delivered", "carrier": "oca", "logistic_type": "standard", "tracking_number": "OCA100001004AR", "date_created": "2024-12-05T09:15:00Z", "date_shipped": "2024-12-06T10:00:00Z", "date_delivered": "2024-12-10T11:30:00Z", "receiver_city": "La Plata", "receiver_state": "Buenos Aires"}',
 '{"doc_type": "DNI", "doc_number": "32123004", "taxpayer_type": "Consumidor Final", "can_receive_factura_a": false}',
 ARRAY['periferico', 'teclado', 'hyperx'], '2024-12-05T09:15:00Z'),

('SH-1002', 'shopify', 'delivered',
 '{"sku": "MOU-GAM-003", "title": "Mouse Logitech G Pro X Superlight 2 Wireless", "price": 120000, "quantity": 1, "image_url": "https://placehold.co/400x400/00B8FC/white?text=Superlight+2"}',
 '{"id": "SH-123456005", "first_name": "Diego", "last_name": "Lopez", "nickname": null, "email": "diego.lopez.gamer@gmail.com", "phone": "+5491155551005"}',
 '{"id": "SH-SHIP-1002", "status": "delivered", "carrier": "andreani", "logistic_type": "express", "tracking_number": "AND100001005AR", "date_created": "2024-12-11T14:30:00Z", "date_shipped": "2024-12-11T18:00:00Z", "date_delivered": "2024-12-12T10:00:00Z", "receiver_city": "CABA", "receiver_state": "Capital Federal"}',
 '{"doc_type": "CUIT", "doc_number": "20-28123005-7", "taxpayer_type": "Responsable Inscripto", "can_receive_factura_a": true}',
 ARRAY['periferico', 'mouse', 'logitech'], '2024-12-11T14:30:00Z'),

('SH-1003', 'shopify', 'in_transit',
 '{"sku": "AUR-GAM-003", "title": "Auriculares SteelSeries Arctis Nova 7 Wireless", "price": 150000, "quantity": 1, "image_url": "https://placehold.co/400x400/FF5500/white?text=Arctis+Nova+7"}',
 '{"id": "SH-123456011", "first_name": "Valentina", "last_name": "Torres", "nickname": null, "email": "vale.torres.music@gmail.com", "phone": "+5491155551011"}',
 '{"id": "SH-SHIP-1003", "status": "in_transit", "carrier": "oca", "logistic_type": "standard", "tracking_number": "OCA100001011AR", "date_created": "2024-12-14T16:20:00Z", "date_shipped": "2024-12-15T09:00:00Z", "date_delivered": null, "receiver_city": "Neuquen", "receiver_state": "Neuquen"}',
 '{"doc_type": "DNI", "doc_number": "41123011", "taxpayer_type": "Consumidor Final", "can_receive_factura_a": false}',
 ARRAY['auriculares', 'steelseries', 'wireless'], '2024-12-14T16:20:00Z'),

-- TiendaNube Orders
('TN-5001', 'tiendanube', 'delivered',
 '{"sku": "RAM-32-001", "title": "RAM Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4 3600MHz", "price": 85000, "quantity": 1, "image_url": "https://placehold.co/400x400/F3C300/black?text=Vengeance+32GB"}',
 '{"id": "TN-123456006", "first_name": "Pablo", "last_name": "Martinez", "nickname": null, "email": "pablo.martinez@yahoo.com", "phone": "+5491155551006"}',
 '{"id": "TN-SHIP-5001", "status": "delivered", "carrier": "correo_argentino", "logistic_type": "standard", "tracking_number": "CA100001006AR", "date_created": "2024-12-01T16:45:00Z", "date_shipped": "2024-12-02T11:00:00Z", "date_delivered": "2024-12-07T15:20:00Z", "receiver_city": "Mendoza", "receiver_state": "Mendoza"}',
 '{"doc_type": "DNI", "doc_number": "40123006", "taxpayer_type": "Consumidor Final", "can_receive_factura_a": false}',
 ARRAY['componente', 'ram', 'corsair'], '2024-12-01T16:45:00Z'),

('TN-5002', 'tiendanube', 'pending',
 '{"sku": "SSD-1TB-001", "title": "SSD Samsung 980 PRO 1TB NVMe PCIe 4.0", "price": 85000, "quantity": 2, "image_url": "https://placehold.co/400x400/1428A0/white?text=980+PRO+1TB"}',
 '{"id": "TN-123456007", "first_name": "Sofia", "last_name": "Ruiz", "nickname": null, "email": "sofia.ruiz.dev@gmail.com", "phone": "+5491155551007"}',
 '{"id": "TN-SHIP-5002", "status": "pending", "carrier": "andreani", "logistic_type": "standard", "tracking_number": null, "date_created": "2024-12-15T20:00:00Z", "date_shipped": null, "date_delivered": null, "receiver_city": "San Miguel de Tucuman", "receiver_state": "Tucuman"}',
 '{"doc_type": "CUIT", "doc_number": "27-35123007-4", "taxpayer_type": "Responsable Monotributo", "can_receive_factura_a": true}',
 ARRAY['componente', 'ssd', 'samsung'], '2024-12-15T20:00:00Z'),

('TN-5003', 'tiendanube', 'delivered',
 '{"sku": "PSU-750-001", "title": "Fuente Corsair RM750 750W 80+ Gold Full Modular", "price": 120000, "quantity": 1, "image_url": "https://placehold.co/400x400/F3C300/black?text=RM750"}',
 '{"id": "TN-123456013", "first_name": "Mariana", "last_name": "Vega", "nickname": null, "email": "mariana.vega@outlook.com", "phone": "+5491155551013"}',
 '{"id": "TN-SHIP-5003", "status": "delivered", "carrier": "andreani", "logistic_type": "standard", "tracking_number": "AND100001013AR", "date_created": "2024-12-03T11:30:00Z", "date_shipped": "2024-12-04T10:00:00Z", "date_delivered": "2024-12-09T14:45:00Z", "receiver_city": "Salta", "receiver_state": "Salta"}',
 '{"doc_type": "DNI", "doc_number": "37123013", "taxpayer_type": "Consumidor Final", "can_receive_factura_a": false}',
 ARRAY['fuente', 'corsair', 'modular'], '2024-12-03T11:30:00Z');

-- ================================================
-- CONVERSACIONES (10 conversaciones con mensajes)
-- ================================================

INSERT INTO conversations (id, order_id, channel, buyer_id, buyer_name, status, case_type, ai_handled, escalated, created_at, resolved_at) VALUES
('conv-001', '2000010050001001', 'mercadolibre', '123456001', 'Martin Rodriguez', 'resolved', 'tracking', true, false, '2024-12-12T10:30:00Z', '2024-12-12T10:35:03Z'),
('conv-002', '2000010050001002', 'mercadolibre', '123456002', 'Lucia Fernandez', 'resolved', 'facturacion', true, false, '2024-12-13T09:00:00Z', '2024-12-13T09:05:00Z'),
('conv-003', '2000010050001004', 'mercadolibre', '123456008', 'Joaquin Alvarez', 'resolved', 'garantia', false, true, '2024-12-10T14:20:00Z', '2024-12-10T16:20:00Z'),
('conv-004', 'SH-1001', 'shopify', 'SH-123456004', 'Ana Garcia', 'resolved', 'consulta_tecnica', true, false, '2024-12-11T18:00:00Z', '2024-12-11T18:30:00Z'),
('conv-005', '2000010050001007', 'mercadolibre', '123456012', 'Gonzalo Ramirez', 'resolved', 'devolucion', false, true, '2024-12-15T11:00:00Z', '2024-12-15T12:30:00Z'),
('conv-006', 'TN-5001', 'tiendanube', 'TN-123456006', 'Pablo Martinez', 'resolved', 'agradecimiento', true, false, '2024-12-08T20:00:00Z', '2024-12-08T20:00:04Z'),
('conv-007', '2000010050001006', 'mercadolibre', '123456010', 'Federico Sanchez', 'resolved', 'instalacion', true, false, '2024-11-28T19:00:00Z', '2024-11-28T20:30:00Z'),
('conv-008', 'SH-1002', 'shopify', 'SH-123456005', 'Diego Lopez', 'resolved', 'facturacion', true, false, '2024-12-13T10:00:00Z', '2024-12-13T10:05:00Z'),
('conv-009', '2000010050001003', 'mercadolibre', '123456003', 'Carlos Mendez', 'in_progress', 'tracking', true, false, '2024-12-16T09:00:00Z', NULL),
('conv-010', '2000010050001008', 'mercadolibre', '123456014', 'Camila Ortiz', 'pending', 'compatibilidad', false, true, '2024-12-16T10:30:00Z', NULL);

-- ================================================
-- MENSAJES
-- ================================================

INSERT INTO messages (conversation_id, direction, sender_type, content, tool_used, sent_at) VALUES
-- Conversacion 1 - Tracking
('conv-001', 'inbound', 'buyer', 'Hola! Compre una RTX 4060 hace 2 dias y todavia no tengo novedades del envio. Donde esta mi pedido?', NULL, '2024-12-12T10:30:00Z'),
('conv-001', 'outbound', 'ai', 'Hola Martin! Gracias por escribirnos. Ya revise tu pedido de la RTX 4060 (orden ML-2000010050001001). Tu paquete salio ayer del centro de distribucion y esta en camino! El numero de seguimiento es MEL100001001AR. Segun el tracking, la entrega estimada es para manana 13/12 entre las 9hs y 18hs. Podes seguir el envio en tiempo real desde la app de MercadoLibre. Cualquier otra consulta, estoy para ayudarte!', 'tracking_lookup', '2024-12-12T10:30:05Z'),
('conv-001', 'inbound', 'buyer', 'Genial, gracias por la info!', NULL, '2024-12-12T10:35:00Z'),
('conv-001', 'outbound', 'ai', 'De nada Martin! Espero que disfrutes mucho tu nueva RTX 4060. Si tenes alguna consulta sobre instalacion o drivers, no dudes en escribirnos. Buen gaming!', NULL, '2024-12-12T10:35:03Z'),

-- Conversacion 2 - Facturacion
('conv-002', 'inbound', 'buyer', 'Hola, necesito la factura A de mi compra. Soy monotributista.', NULL, '2024-12-13T09:00:00Z'),
('conv-002', 'outbound', 'ai', 'Hola Lucia! Vi que compraste la PC Gamer Mid con RTX 4060, excelente eleccion! Revise tus datos y veo que registraste CUIT 20-35123002-9 como Responsable Monotributo, asi que si, te corresponde Factura A. Ya la estamos generando y te la enviamos por email a lucia.fernandez@hotmail.com en las proximas 24-48hs habiles. Si necesitas que la enviemos a otro mail, avisame!', 'billing_check', '2024-12-13T09:00:04Z'),
('conv-002', 'inbound', 'buyer', 'Perfecto, gracias! A ese mail esta bien.', NULL, '2024-12-13T09:05:00Z'),

-- Conversacion 3 - Garantia (escalada)
('conv-003', 'inbound', 'buyer', 'Hola, el monitor que compre tiene un pixel muerto en el centro de la pantalla. Quiero hacer uso de la garantia.', NULL, '2024-12-10T14:20:00Z'),
('conv-003', 'outbound', 'ai', 'Hola Joaquin! Lamento mucho escuchar eso con tu monitor ASUS VG27AQ1A. Un pixel muerto es un defecto de fabrica y por supuesto esta cubierto por la garantia. Voy a escalar tu caso a nuestro equipo de soporte tecnico para que te ayuden con el proceso de RMA. Te van a contactar en las proximas horas con los pasos a seguir. Mientras tanto, te pido que nos envies una foto o video donde se vea el pixel muerto para agilizar el tramite. Disculpa las molestias!', 'escalation', '2024-12-10T14:20:06Z'),
('conv-003', 'inbound', 'buyer', 'Aca te mando la foto. Se ve claramente el punto blanco en el centro.', NULL, '2024-12-10T14:30:00Z'),
('conv-003', 'outbound', 'seller', 'Hola Joaquin, soy Marcos del equipo de soporte. Recibi tu caso y la foto. Efectivamente se ve el pixel muerto. Te ofrecemos dos opciones: 1) Cambio por una unidad nueva (demora 5-7 dias) o 2) Devolucion completa del dinero. Cual preferis?', NULL, '2024-12-10T16:00:00Z'),
('conv-003', 'inbound', 'buyer', 'Prefiero el cambio por una unidad nueva por favor.', NULL, '2024-12-10T16:15:00Z'),
('conv-003', 'outbound', 'seller', 'Perfecto Joaquin! Iniciamos el proceso de cambio. Te enviamos una etiqueta de devolucion por email para que despaches el monitor. Apenas lo recibamos, te enviamos la unidad nueva. Gracias por tu paciencia!', NULL, '2024-12-10T16:20:00Z'),

-- Conversacion 4 - Consulta tecnica
('conv-004', 'inbound', 'buyer', 'Hola! Recibi el teclado HyperX y es hermoso, pero no se como cambiar los colores del RGB. Tienen algun manual?', NULL, '2024-12-11T18:00:00Z'),
('conv-004', 'outbound', 'ai', 'Hola Ana! Me alegra que te haya gustado el HyperX Alloy Origins Core! Para personalizar el RGB tenes dos opciones:\n\n1. **Desde el teclado:** Presiona FN + tecla de brillo para cambiar efectos preconfigurados.\n\n2. **Con software:** Descarga HyperX NGENUITY desde la Microsoft Store (es gratis). Ahi podes crear perfiles personalizados, elegir colores por tecla, efectos y mas.\n\nTe dejo el link directo: https://www.microsoft.com/store/apps/9P1TBXR6QDCX\n\nSi tenes alguna duda con la configuracion, chiflame!', 'knowledge_base', '2024-12-11T18:00:05Z'),
('conv-004', 'inbound', 'buyer', 'Excelente! Ya lo descargue y funciona perfecto. Gracias!', NULL, '2024-12-11T18:30:00Z'),

-- Conversacion 5 - Devolucion (escalada)
('conv-005', 'inbound', 'buyer', 'Hola, compre la PC hace 25 dias pero me arrepenti. Quiero devolverla.', NULL, '2024-12-15T11:00:00Z'),
('conv-005', 'outbound', 'ai', 'Hola Gonzalo! Entiendo que queres devolver tu PC Gamer Pro con RTX 4070. Deja que revise tu caso... Veo que la compra fue hace 25 dias (20/11) y la recibiste el 25/11. Segun la politica de MercadoLibre, tenes 30 dias desde la recepcion para devolucion por arrepentimiento, asi que todavia estas dentro del plazo! Sin embargo, como es una PC armada de alto valor, necesito escalar esto a nuestro equipo para coordinar la logistica de devolucion. Te contactan en breve. La PC esta en perfectas condiciones y con todos los accesorios?', 'return_policy_check', '2024-12-15T11:00:06Z'),
('conv-005', 'inbound', 'buyer', 'Si, esta impecable. Solo la prendi 2 veces para probarla. Tiene todo en la caja original.', NULL, '2024-12-15T11:10:00Z'),
('conv-005', 'outbound', 'seller', 'Hola Gonzalo, soy Laura de atencion al cliente. Entiendo que queres devolver la PC. Como esta dentro del plazo y en perfectas condiciones, podemos proceder. Te enviamos etiqueta de devolucion por correo. El reembolso se procesa dentro de los 5 dias habiles de recibir el equipo. Alguna duda?', NULL, '2024-12-15T12:30:00Z'),

-- Conversacion 6 - Agradecimiento
('conv-006', 'inbound', 'buyer', 'Hola! Solo queria agradecerles. Las RAM Corsair llegaron perfectas y la PC vuela ahora. Muy buen servicio!', NULL, '2024-12-08T20:00:00Z'),
('conv-006', 'outbound', 'ai', 'Hola Pablo! Muchas gracias por tomarte el tiempo de escribirnos! Nos pone muy contentos saber que las Corsair Vengeance 32GB estan funcionando de 10 y que notaste la diferencia. Si en algun momento necesitas mas upgrades o tenes alguna consulta tecnica, estamos para ayudarte. Buen gaming y gracias por elegirnos!', NULL, '2024-12-08T20:00:04Z'),

-- Conversacion 7 - Instalacion
('conv-007', 'inbound', 'buyer', 'Buenas! Llego la silla Secretlab pero no entiendo como armarla. El manual esta en ingles.', NULL, '2024-11-28T19:00:00Z'),
('conv-007', 'outbound', 'ai', 'Hola Federico! Felicitaciones por tu Titan Evo, es una silla espectacular! Te ayudo con el armado:\n\n**Pasos basicos:**\n1. Primero arma la base con las 5 ruedas (solo presionalas)\n2. Inserta el piston de gas en la base\n3. Arma el respaldo con el asiento usando los 4 tornillos grandes\n4. Coloca los apoyabrazos (2 tornillos cada uno)\n5. Monta el conjunto sobre el piston\n6. Ajusta el soporte lumbar magnetico\n\nTambien te dejo este video oficial de Secretlab que explica todo paso a paso.\n\nSi te trabas en algun paso, mandame foto y te guio!', 'knowledge_base', '2024-11-28T19:00:06Z'),
('conv-007', 'inbound', 'buyer', 'Gracias! Con el video pude armarla sin problemas. Es muy comoda!', NULL, '2024-11-28T20:30:00Z'),

-- Conversacion 8 - Facturacion
('conv-008', 'inbound', 'buyer', 'Hola necesito factura A. CUIT 20-28123005-7. Soy responsable inscripto.', NULL, '2024-12-13T10:00:00Z'),
('conv-008', 'outbound', 'ai', 'Hola Diego! Perfecto, ya tengo tus datos. Como Responsable Inscripto con CUIT 20-28123005-7, te corresponde Factura A por tu compra del Mouse Logitech G Pro X Superlight 2. La factura se genera dentro de las 48hs habiles y te llega al mail diego.lopez.gamer@gmail.com. Necesitas que la enviemos a otra direccion?', 'billing_check', '2024-12-13T10:00:04Z'),
('conv-008', 'inbound', 'buyer', 'No, a ese mail esta perfecto. Gracias!', NULL, '2024-12-13T10:05:00Z'),

-- Conversacion 9 - Tracking (en progreso)
('conv-009', 'inbound', 'buyer', 'Hola, mi notebook ASUS TUF sigue en transito hace 2 dias. Cuando llega?', NULL, '2024-12-16T09:00:00Z'),
('conv-009', 'outbound', 'ai', 'Hola Carlos! Ya revise tu envio. Tu Notebook ASUS TUF Gaming (orden ML-2000010050001003) salio el 15/12 y esta en camino a Rosario. El tracking AND100001003AR muestra que esta en el centro de distribucion de Andreani en Santa Fe. La entrega estimada es para hoy 16/12 o manana 17/12 como maximo. Te recomiendo tener el telefono a mano porque el transportista suele llamar antes de llegar. Cualquier novedad me avisas!', 'tracking_lookup', '2024-12-16T09:00:05Z'),

-- Conversacion 10 - Compatibilidad (escalada)
('conv-010', 'inbound', 'buyer', 'Hola! Compre la MacBook Air pero me di cuenta que necesito conectar 2 monitores externos para trabajar. Se puede hacer con el M2?', NULL, '2024-12-16T10:30:00Z'),
('conv-010', 'outbound', 'ai', 'Hola Camila! Muy buena pregunta. El chip M2 de la MacBook Air tiene una limitacion de hardware: nativamente solo soporta 1 monitor externo. Sin embargo, hay soluciones! Podes usar un dock con tecnologia DisplayLink que permite conectar multiples monitores. Te paso esto a nuestro equipo tecnico para que te recomienden las mejores opciones compatibles. Te contactan en breve!', 'escalation', '2024-12-16T10:30:06Z');

-- ================================================
-- ESCALACIONES (8 escalaciones)
-- ================================================

INSERT INTO escalations (id, conversation_id, order_id, channel, buyer_id, buyer_name, buyer_email, original_message, reason, case_type, priority, status, product, ai_suggested_response, human_response, resolution_notes, assigned_to, created_at, resolved_at) VALUES
('esc-001', 'conv-003', '2000010050001004', 'mercadolibre', '123456008', 'Joaquin Alvarez', 'joaquin.alvarez.stream@gmail.com',
 'Hola, el monitor que compre tiene un pixel muerto en el centro de la pantalla. Quiero hacer uso de la garantia.',
 'Defecto de fabrica - pixel muerto en monitor', 'garantia', 2, 'resolved',
 '{"sku": "MON-27-144", "title": "Monitor ASUS 27\" QHD 144Hz IPS - VG27AQ1A", "price": 280000}',
 'Ofrecer cambio por unidad nueva o devolucion completa. Solicitar foto/video del defecto para documentar.',
 'Se ofrecio cambio por unidad nueva. Cliente acepto. Se envio etiqueta de devolucion.',
 'RMA iniciado. Monitor defectuoso recibido el 15/12. Unidad nueva enviada el 16/12.',
 'Marcos - Soporte Tecnico', '2024-12-10T14:20:06Z', '2024-12-16T10:00:00Z'),

('esc-002', 'conv-005', '2000010050001007', 'mercadolibre', '123456012', 'Gonzalo Ramirez', 'gonzalo.ramirez.tech@gmail.com',
 'Hola, compre la PC hace 25 dias pero me arrepenti. Quiero devolverla.',
 'Devolucion por arrepentimiento - producto de alto valor', 'devolucion', 3, 'resolved',
 '{"sku": "PC-HIGH-001", "title": "PC Gamer Pro - RTX 4070 | Ryzen 7 5800X | 32GB RAM", "price": 1200000}',
 'Verificar plazo de devolucion (30 dias desde recepcion). Si esta dentro del plazo y producto en condiciones, proceder con devolucion.',
 'Dentro del plazo de 30 dias. Producto en perfectas condiciones. Se aprobo devolucion y se envio etiqueta.',
 'PC recibida el 18/12 en perfectas condiciones. Reembolso procesado.',
 'Laura - Atencion al Cliente', '2024-12-15T11:00:06Z', '2024-12-18T15:00:00Z'),

('esc-003', 'conv-010', '2000010050001008', 'mercadolibre', '123456014', 'Camila Ortiz', 'camila.ortiz.design@gmail.com',
 'Hola! Compre la MacBook Air pero me di cuenta que necesito conectar 2 monitores externos para trabajar. Se puede hacer con el M2?',
 'Consulta tecnica compleja - limitaciones hardware Apple M2', 'consulta_tecnica', 3, 'pending',
 '{"sku": "NB-PRO-001", "title": "MacBook Air M2 - 8GB RAM | 256GB SSD", "price": 1400000}',
 'Explicar limitacion del M2 (1 monitor nativo). Recomendar dock DisplayLink como solucion. Opciones: Plugable UD-6950PDZ o Dell D6000.',
 NULL, NULL, NULL, '2024-12-16T10:30:06Z', NULL),

('esc-004', NULL, '2000010050001009', 'mercadolibre', '123456015', 'Nicolas Herrera', 'nicolas.herrera.tech@gmail.com',
 'La placa de video hace un ruido raro, como un zumbido electrico. Es normal?',
 'Posible coil whine en GPU - requiere evaluacion tecnica', 'garantia', 2, 'in_progress',
 '{"sku": "GPU-RX7800-001", "title": "AMD Radeon RX 7800 XT 16GB - PowerColor Red Devil", "price": 650000}',
 'El coil whine es comun en GPUs de alta gama y no es defecto. Si el ruido es excesivo, ofrecer evaluacion en garantia.',
 'Solicitado video del ruido para evaluar si es coil whine normal o defecto.',
 'Esperando video del cliente',
 'Marcos - Soporte Tecnico', '2024-12-14T16:45:00Z', NULL),

('esc-005', NULL, 'SH-1003', 'shopify', 'SH-123456011', 'Valentina Torres', 'vale.torres.music@gmail.com',
 'Hola, los auriculares SteelSeries no conectan por Bluetooth a mi celular. Probe de todo y no aparecen.',
 'Problema de conectividad Bluetooth - requiere troubleshooting', 'soporte_tecnico', 2, 'pending',
 '{"sku": "AUR-GAM-003", "title": "Auriculares SteelSeries Arctis Nova 7 Wireless", "price": 150000}',
 'Guiar proceso de pairing: 1) Apagar auriculares, 2) Mantener boton BT 5 seg hasta luz azul parpadeante, 3) Buscar en celular. Si no funciona, puede ser defecto.',
 NULL, NULL, NULL, '2024-12-16T11:00:00Z', NULL),

('esc-006', NULL, 'TN-5002', 'tiendanube', 'TN-123456007', 'Sofia Ruiz', 'sofia.ruiz.dev@gmail.com',
 'Hola! Pedi 2 SSD Samsung 980 PRO pero el pedido sigue en pendiente hace 2 dias. Cuando lo despachan?',
 'Demora en despacho - orden pendiente', 'envio', 3, 'pending',
 '{"sku": "SSD-1TB-001", "title": "SSD Samsung 980 PRO 1TB NVMe PCIe 4.0", "price": 170000}',
 'Verificar stock y estado de la orden. Informar fecha estimada de despacho.',
 NULL, NULL, NULL, '2024-12-16T12:00:00Z', NULL),

('esc-007', NULL, '2000010050001005', 'mercadolibre', '123456009', 'Romina Peralta', 'romina.peralta@live.com',
 'Cancele la compra pero todavia no me devolvieron la plata. Ya pasaron 5 dias.',
 'Reclamo por reembolso pendiente', 'reembolso', 1, 'in_progress',
 '{"sku": "GPU-4070-001", "title": "NVIDIA GeForce RTX 4070 12GB - Gigabyte Gaming OC", "price": 750000}',
 'Verificar estado del reembolso en MercadoPago. Normalmente demora 5-10 dias habiles segun medio de pago.',
 'Verificado: reembolso en proceso. Pago con tarjeta credito, demora hasta 10 dias habiles en reflejarse.',
 'Informado a cliente. Seguimiento del reembolso.',
 'Laura - Atencion al Cliente', '2024-12-15T09:00:00Z', NULL),

('esc-008', NULL, NULL, 'mercadolibre', '123456020', 'Fernando Gimenez', 'fernando.gimenez@gmail.com',
 'Quiero comprar una PC Gamer Ultra pero necesito financiacion en 18 cuotas. Hacen?',
 'Consulta preventa - financiacion especial', 'preventa', 4, 'pending',
 '{"sku": "PC-ULTRA-001", "title": "PC Gamer Ultra - RTX 4080 | Ryzen 9 7900X | 64GB RAM", "price": 2200000}',
 'MercadoLibre ofrece hasta 12 cuotas sin interes con tarjetas bancarias. 18 cuotas disponible con interes.',
 NULL, NULL, NULL, '2024-12-16T08:30:00Z', NULL);

-- ================================================
-- AGENTES IA (3 agentes)
-- ================================================

INSERT INTO ai_agents (id, name, type, avatar, description, channels, is_active, config, metrics) VALUES
('agent-001', 'Barbi', 'preventa',
 'https://api.dicebear.com/7.x/bottts/svg?seed=Barbi&backgroundColor=7c3aed',
 'Agente de preventa especializada en asesoramiento de productos gaming y tecnologia',
 ARRAY['mercadolibre', 'shopify', 'tiendanube'], true,
 '{"personality": "Amigable, entusiasta del gaming, conocedora de specs tecnicas", "greeting": "Hola! Soy Barbi de MarIA S.A. En que te puedo ayudar hoy?", "escalation_triggers": ["precio_especial", "financiacion_custom", "producto_no_listado", "reclamo"], "tools": ["product_search", "stock_check", "compatibility_check", "price_lookup"], "response_style": "casual_profesional", "max_response_length": 500}',
 '{"total_conversations": 1250, "resolved_without_escalation": 1100, "resolution_rate": 0.88, "avg_response_time_ms": 2500, "satisfaction_score": 4.7, "last_30_days": {"conversations": 180, "escalations": 15, "avg_messages_per_conv": 3.2}}'),

('agent-002', 'Tomi', 'postventa',
 'https://api.dicebear.com/7.x/bottts/svg?seed=Tomi&backgroundColor=10b981',
 'Agente de postventa especializado en seguimiento de pedidos, garantias y devoluciones',
 ARRAY['mercadolibre', 'shopify', 'tiendanube'], true,
 '{"personality": "Empatico, solucionador, paciente con reclamos", "greeting": "Hola! Soy Tomi de MarIA S.A. Como puedo ayudarte con tu compra?", "escalation_triggers": ["producto_danado", "paquete_extraviado", "reclamo_reembolso", "garantia_compleja", "mediacion_ml"], "tools": ["order_lookup", "tracking_lookup", "billing_check", "return_policy_check", "escalation"], "response_style": "profesional_empatico", "max_response_length": 600}',
 '{"total_conversations": 2100, "resolved_without_escalation": 1850, "resolution_rate": 0.88, "avg_response_time_ms": 3200, "satisfaction_score": 4.5, "last_30_days": {"conversations": 320, "escalations": 35, "avg_messages_per_conv": 4.1}}'),

('agent-003', 'Sofi', 'soporte',
 'https://api.dicebear.com/7.x/bottts/svg?seed=Sofi&backgroundColor=f59e0b',
 'Agente de soporte tecnico especializada en troubleshooting de hardware gaming',
 ARRAY['mercadolibre', 'shopify', 'tiendanube'], true,
 '{"personality": "Tecnica, detallista, orientada a soluciones", "greeting": "Hola! Soy Sofi del soporte tecnico de MarIA S.A. Contame que problema tenes!", "escalation_triggers": ["rma_confirmado", "defecto_fabrica", "problema_no_documentado", "multiples_intentos_fallidos"], "tools": ["knowledge_base", "diagnostic_guide", "warranty_check", "rma_initiate"], "response_style": "tecnico_amigable", "max_response_length": 800}',
 '{"total_conversations": 850, "resolved_without_escalation": 680, "resolution_rate": 0.80, "avg_response_time_ms": 4500, "satisfaction_score": 4.6, "last_30_days": {"conversations": 95, "escalations": 18, "avg_messages_per_conv": 5.5}}');

-- ================================================
-- METRICAS DE DASHBOARD
-- ================================================

INSERT INTO dashboard_metrics (metric_type, period, data) VALUES
-- Resumen general
('general_stats', '2024-2025', '{
  "total_ordenes": 2500,
  "total_revenue": 180000000,
  "ticket_promedio": 72000,
  "productos_activos": 65,
  "clientes_unicos": 2100,
  "tasa_recurrencia": 16,
  "tendencia": "crecimiento",
  "crecimiento_mensual": 3.5
}'),

-- Ventas mensuales
('monthly_sales', '2024-12', '{"orders": 165, "revenue": 11880000, "avg_ticket": 72000, "new_customers": 140, "returning_customers": 25}'),
('monthly_sales', '2025-01', '{"orders": 180, "revenue": 12960000, "avg_ticket": 72000, "new_customers": 148, "returning_customers": 32}'),
('monthly_sales', '2025-02', '{"orders": 175, "revenue": 12600000, "avg_ticket": 72000, "new_customers": 138, "returning_customers": 37}'),
('monthly_sales', '2025-03', '{"orders": 190, "revenue": 13680000, "avg_ticket": 72000, "new_customers": 150, "returning_customers": 40}'),
('monthly_sales', '2025-04', '{"orders": 185, "revenue": 13320000, "avg_ticket": 72000, "new_customers": 142, "returning_customers": 43}'),
('monthly_sales', '2025-05', '{"orders": 195, "revenue": 14040000, "avg_ticket": 72000, "new_customers": 148, "returning_customers": 47}'),
('monthly_sales', '2025-06', '{"orders": 200, "revenue": 14400000, "avg_ticket": 72000, "new_customers": 150, "returning_customers": 50}'),
('monthly_sales', '2025-07', '{"orders": 205, "revenue": 14760000, "avg_ticket": 72000, "new_customers": 152, "returning_customers": 53}'),
('monthly_sales', '2025-08', '{"orders": 210, "revenue": 15120000, "avg_ticket": 72000, "new_customers": 155, "returning_customers": 55}'),
('monthly_sales', '2025-09', '{"orders": 215, "revenue": 15480000, "avg_ticket": 72000, "new_customers": 158, "returning_customers": 57}'),
('monthly_sales', '2025-10', '{"orders": 225, "revenue": 16200000, "avg_ticket": 72000, "new_customers": 165, "returning_customers": 60}'),
('monthly_sales', '2025-11', '{"orders": 240, "revenue": 17280000, "avg_ticket": 72000, "new_customers": 175, "returning_customers": 65}'),
('monthly_sales', '2025-12', '{"orders": 115, "revenue": 8280000, "avg_ticket": 72000, "new_customers": 79, "returning_customers": 36}'),

-- Categorias
('category_breakdown', '2025', '{
  "PCs Gaming": {"orders": 875, "revenue": 78750000, "percentage": 43.8},
  "Placas de Video": {"orders": 625, "revenue": 45000000, "percentage": 25.0},
  "Notebooks": {"orders": 375, "revenue": 27000000, "percentage": 15.0},
  "Monitores": {"orders": 250, "revenue": 13500000, "percentage": 7.5},
  "Perifericos": {"orders": 200, "revenue": 9000000, "percentage": 5.0},
  "Sillas Gaming": {"orders": 100, "revenue": 4500000, "percentage": 2.5},
  "Componentes": {"orders": 75, "revenue": 2250000, "percentage": 1.2}
}'),

-- Metricas IA
('ai_metrics', '2025', '{
  "total_conversaciones": 3200,
  "resueltas_por_ia": 2720,
  "escaladas_humano": 480,
  "tasa_resolucion_ia": 85,
  "tiempo_respuesta_promedio": "1.2 segundos",
  "satisfaccion_cliente": 4.6,
  "principales_consultas": {
    "tracking": 40,
    "compatibilidad": 20,
    "facturacion": 15,
    "garantia": 12,
    "devolucion": 8,
    "otros": 5
  }
}');

-- ================================================
-- FIN DEL SEED
-- ================================================

-- Verificar datos insertados
DO $$
DECLARE
    product_count INT;
    order_count INT;
    conv_count INT;
    esc_count INT;
    agent_count INT;
BEGIN
    SELECT COUNT(*) INTO product_count FROM products;
    SELECT COUNT(*) INTO order_count FROM orders;
    SELECT COUNT(*) INTO conv_count FROM conversations;
    SELECT COUNT(*) INTO esc_count FROM escalations;
    SELECT COUNT(*) INTO agent_count FROM ai_agents;

    RAISE NOTICE '=== SEED COMPLETADO ===';
    RAISE NOTICE 'Productos: %', product_count;
    RAISE NOTICE 'Ordenes: %', order_count;
    RAISE NOTICE 'Conversaciones: %', conv_count;
    RAISE NOTICE 'Escalaciones: %', esc_count;
    RAISE NOTICE 'Agentes IA: %', agent_count;
END $$;
