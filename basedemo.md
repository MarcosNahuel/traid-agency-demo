Aquí tienes los datos JSON generados y estructurados para importar a Supabase. He cuidado especialmente la integridad referencial: las órdenes coinciden con las conversaciones y los mensajes con las conversaciones.

Las fechas están situadas en **2025** y los precios/textos están localizados para Argentina.

### 1. PRODUCTOS (50 items)
*Nota: Se incluyen 50 productos variados respetando las categorías y URLs solicitadas.*

```json:products
[
  {
    "sku": "GPU-4070-001",
    "title": "RTX 4070 12GB ASUS TUF Gaming OC",
    "description": "Placa de video NVIDIA GeForce RTX 4070, arquitectura Ada Lovelace, DLSS 3, refrigeración triple fan.",
    "price": 1150000,
    "cost": 850000,
    "stock": 15,
    "category": "Placas de Video",
    "brand": "ASUS",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "nvidia", "rtx", "high-end"],
    "is_active": true
  },
  {
    "sku": "GPU-3060-002",
    "title": "RTX 3060 12GB MSI Ventus 2X",
    "description": "La reina del 1080p. 12GB VRAM GDDR6, diseño compacto de doble ventilador.",
    "price": 520000,
    "cost": 380000,
    "stock": 25,
    "category": "Placas de Video",
    "brand": "MSI",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "nvidia", "calidad-precio"],
    "is_active": true
  },
  {
    "sku": "GPU-4090-003",
    "title": "RTX 4090 24GB Gigabyte Gaming OC",
    "description": "Máximo rendimiento. 24GB GDDR6X, ideal para 4K y renderizado profesional.",
    "price": 2800000,
    "cost": 2100000,
    "stock": 3,
    "category": "Placas de Video",
    "brand": "Gigabyte",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "nvidia", "extreme", "4k"],
    "is_active": true
  },
  {
    "sku": "GPU-4060-004",
    "title": "RTX 4060 8GB Zotac Twin Edge",
    "description": "Entrada a la serie 40. DLSS 3 y Frame Gen a precio accesible.",
    "price": 480000,
    "cost": 350000,
    "stock": 40,
    "category": "Placas de Video",
    "brand": "Zotac",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "nvidia", "budget"],
    "is_active": true
  },
  {
    "sku": "GPU-RX6700-005",
    "title": "Radeon RX 6700 XT 12GB Sapphire Pulse",
    "description": "La alternativa de AMD para 1440p. Excelente rendimiento en rasterización.",
    "price": 550000,
    "cost": 410000,
    "stock": 10,
    "category": "Placas de Video",
    "brand": "Sapphire",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "amd", "radeon"],
    "is_active": true
  },
  {
    "sku": "GPU-RX7800-006",
    "title": "Radeon RX 7800 XT 16GB AsRock Phantom",
    "description": "Potencia bruta con 16GB de VRAM. Ideal para texturas ultra.",
    "price": 950000,
    "cost": 700000,
    "stock": 8,
    "category": "Placas de Video",
    "brand": "AsRock",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "amd", "high-end"],
    "is_active": true
  },
  {
    "sku": "GPU-4070TI-007",
    "title": "RTX 4070 Ti SUPER 16GB ASUS ROG Strix",
    "description": "Versión SUPER con más CUDA cores y 16GB VRAM. Iluminación RGB premium.",
    "price": 1450000,
    "cost": 1100000,
    "stock": 5,
    "category": "Placas de Video",
    "brand": "ASUS",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "nvidia", "rog", "rgb"],
    "is_active": true
  },
  {
    "sku": "GPU-3050-008",
    "title": "RTX 3050 8GB Palit Dual",
    "description": "Gráficos dedicados básicos con Ray Tracing.",
    "price": 350000,
    "cost": 250000,
    "stock": 30,
    "category": "Placas de Video",
    "brand": "Palit",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "nvidia", "entry-level"],
    "is_active": true
  },
  {
    "sku": "GPU-4080-009",
    "title": "RTX 4080 SUPER 16GB MSI Gaming X Slim",
    "description": "Rendimiento 4K sólido con un diseño más delgado.",
    "price": 1800000,
    "cost": 1400000,
    "stock": 4,
    "category": "Placas de Video",
    "brand": "MSI",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "nvidia", "4k"],
    "is_active": true
  },
  {
    "sku": "GPU-ARC-010",
    "title": "Intel Arc A770 16GB Limited Edition",
    "description": "La apuesta de Intel. Excelente para creadores de contenido y encoders AV1.",
    "price": 490000,
    "cost": 360000,
    "stock": 12,
    "category": "Placas de Video",
    "brand": "Intel",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "intel", "arc"],
    "is_active": true
  },
  {
    "sku": "GPU-RX6600-011",
    "title": "Radeon RX 6600 8GB PowerColor Fighter",
    "description": "La mejor opción precio-rendimiento para 1080p.",
    "price": 320000,
    "cost": 240000,
    "stock": 20,
    "category": "Placas de Video",
    "brand": "PowerColor",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "amd", "budget"],
    "is_active": true
  },
  {
    "sku": "GPU-4060TI-012",
    "title": "RTX 4060 Ti 8GB Galax EX",
    "description": "Rendimiento medio con estética blanca y luces RGB.",
    "price": 650000,
    "cost": 480000,
    "stock": 15,
    "category": "Placas de Video",
    "brand": "Galax",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "nvidia", "white"],
    "is_active": true
  },
  {
    "sku": "GPU-4090-013",
    "title": "RTX 4090 ASUS ROG Matrix Platinum",
    "description": "La GPU más cara y exclusiva. Refrigeración líquida integrada.",
    "price": 3500000,
    "cost": 2800000,
    "stock": 1,
    "category": "Placas de Video",
    "brand": "ASUS",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "nvidia", "collector", "water-cooling"],
    "is_active": true
  },
  {
    "sku": "GPU-RX7600-014",
    "title": "Radeon RX 7600 8GB Gigabyte",
    "description": "Nueva generación AMD para esports.",
    "price": 410000,
    "cost": 300000,
    "stock": 18,
    "category": "Placas de Video",
    "brand": "Gigabyte",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["gaming", "amd", "esports"],
    "is_active": true
  },
  {
    "sku": "GPU-GTX1650-015",
    "title": "GTX 1650 4GB ASUS Phoenix",
    "description": "Básica para video y juegos livianos sin conector de fuente.",
    "price": 220000,
    "cost": 150000,
    "stock": 10,
    "category": "Placas de Video",
    "brand": "ASUS",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400",
    "tags": ["office", "nvidia", "low-profile"],
    "is_active": true
  },
  {
    "sku": "PC-ENT-016",
    "title": "PC Gamer MarIA Bronze - i3 + 16GB + GTX 1650",
    "description": "Tu primera PC Gamer. Ideal para CS:GO, Valorant y LoL.",
    "price": 650000,
    "cost": 500000,
    "stock": 10,
    "category": "PCs Gaming",
    "brand": "MarIA",
    "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
    "tags": ["pc", "intel", "starter"],
    "is_active": true
  },
  {
    "sku": "PC-MID-017",
    "title": "PC Gamer MarIA Silver - Ryzen 5 5600 + RTX 3060",
    "description": "El equilibrio perfecto. Juega todo en 1080p Ultra.",
    "price": 950000,
    "cost": 750000,
    "stock": 8,
    "category": "PCs Gaming",
    "brand": "MarIA",
    "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
    "tags": ["pc", "amd", "best-seller"],
    "is_active": true
  },
  {
    "sku": "PC-HIGH-018",
    "title": "PC Gamer MarIA Gold - i5 13400F + RTX 4060 Ti",
    "description": "Potencia para streaming y gaming simultáneo.",
    "price": 1400000,
    "cost": 1100000,
    "stock": 6,
    "category": "PCs Gaming",
    "brand": "MarIA",
    "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
    "tags": ["pc", "intel", "streaming"],
    "is_active": true
  },
  {
    "sku": "PC-EXT-019",
    "title": "PC Gamer MarIA Platinum - Ryzen 7 7800X3D + RTX 4070 Ti",
    "description": "El mejor procesador gaming del mundo con gráfica de elite.",
    "price": 2200000,
    "cost": 1700000,
    "stock": 4,
    "category": "PCs Gaming",
    "brand": "MarIA",
    "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
    "tags": ["pc", "amd", "pro-gaming"],
    "is_active": true
  },
  {
    "sku": "PC-ULT-020",
    "title": "PC Gamer MarIA Diamond - i9 14900K + RTX 4090",
    "description": "Sin compromisos. La PC más rápida que el dinero puede comprar.",
    "price": 4500000,
    "cost": 3600000,
    "stock": 2,
    "category": "PCs Gaming",
    "brand": "MarIA",
    "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
    "tags": ["pc", "intel", "extreme", "workstation"],
    "is_active": true
  },
  {
    "sku": "PC-OFF-021",
    "title": "PC Office Pro - Ryzen 5 5600G + 16GB",
    "description": "Gráficos integrados potentes para trabajo y gaming casual.",
    "price": 550000,
    "cost": 400000,
    "stock": 15,
    "category": "PCs Gaming",
    "brand": "MarIA",
    "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
    "tags": ["pc", "amd", "office"],
    "is_active": true
  },
  {
    "sku": "PC-WHT-022",
    "title": "PC MarIA White Edition - i5 + RTX 4060 White",
    "description": "Estética totalmente blanca con cables mallados y RGB sincronizado.",
    "price": 1200000,
    "cost": 950000,
    "stock": 5,
    "category": "PCs Gaming",
    "brand": "MarIA",
    "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
    "tags": ["pc", "white", "aesthetic"],
    "is_active": true
  },
  {
    "sku": "PC-MINI-023",
    "title": "PC Mini ITX - Ryzen 5 + RX 6600",
    "description": "Gran potencia en tamaño consola.",
    "price": 1100000,
    "cost": 850000,
    "stock": 3,
    "category": "PCs Gaming",
    "brand": "MarIA",
    "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
    "tags": ["pc", "itx", "compact"],
    "is_active": true
  },
  {
    "sku": "PC-CRE-024",
    "title": "PC Creator Studio - i7 + RTX 4070",
    "description": "Optimizada para Adobe Premiere y Blender. 64GB RAM.",
    "price": 1900000,
    "cost": 1500000,
    "stock": 4,
    "category": "PCs Gaming",
    "brand": "MarIA",
    "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
    "tags": ["pc", "creator", "editing"],
    "is_active": true
  },
  {
    "sku": "PC-SIM-025",
    "title": "PC Simulator Rig - Ryzen 7 + RX 7800 XT",
    "description": "Lista para Simracing y Flight Simulator.",
    "price": 1800000,
    "cost": 1400000,
    "stock": 3,
    "category": "PCs Gaming",
    "brand": "MarIA",
    "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
    "tags": ["pc", "simracing", "vr-ready"],
    "is_active": true
  },
  {
    "sku": "MON-LG-026",
    "title": "Monitor LG 24'' UltraGear 144Hz IPS",
    "description": "Panel IPS con 1ms de respuesta. El estándar para gaming.",
    "price": 320000,
    "cost": 230000,
    "stock": 20,
    "category": "Monitores",
    "brand": "LG",
    "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    "tags": ["monitor", "144hz", "ips"],
    "is_active": true
  },
  {
    "sku": "MON-SAM-027",
    "title": "Monitor Samsung Odyssey G5 27'' Curvo 165Hz",
    "description": "Inmersión total con curvatura 1000R y resolución 1440p.",
    "price": 550000,
    "cost": 400000,
    "stock": 10,
    "category": "Monitores",
    "brand": "Samsung",
    "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    "tags": ["monitor", "curved", "1440p"],
    "is_active": true
  },
  {
    "sku": "MON-ASU-028",
    "title": "Monitor ASUS ROG Swift 360Hz",
    "description": "Para profesionales de eSports. Velocidad extrema.",
    "price": 950000,
    "cost": 720000,
    "stock": 3,
    "category": "Monitores",
    "brand": "ASUS",
    "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    "tags": ["monitor", "esports", "high-refresh"],
    "is_active": true
  },
  {
    "sku": "MON-GIG-029",
    "title": "Monitor Gigabyte G24F 2",
    "description": "Panel SS IPS con overclock a 180Hz.",
    "price": 350000,
    "cost": 260000,
    "stock": 15,
    "category": "Monitores",
    "brand": "Gigabyte",
    "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    "tags": ["monitor", "ips", "budget"],
    "is_active": true
  },
  {
    "sku": "MON-BEN-030",
    "title": "Monitor BenQ Zowie XL2546K",
    "description": "DyAc+ Technology. El monitor de los torneos de CS2.",
    "price": 780000,
    "cost": 600000,
    "stock": 5,
    "category": "Monitores",
    "brand": "BenQ",
    "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    "tags": ["monitor", "esports", "tn"],
    "is_active": true
  },
  {
    "sku": "MON-MSI-031",
    "title": "Monitor MSI Optix 32'' Curvo",
    "description": "Pantalla gigante para simuladores y RPGs.",
    "price": 600000,
    "cost": 450000,
    "stock": 4,
    "category": "Monitores",
    "brand": "MSI",
    "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    "tags": ["monitor", "large", "va"],
    "is_active": true
  },
  {
    "sku": "MON-DELL-032",
    "title": "Monitor Dell Alienware 34'' OLED",
    "description": "La mejor calidad de imagen posible. QD-OLED Ultrawide.",
    "price": 1800000,
    "cost": 1400000,
    "stock": 2,
    "category": "Monitores",
    "brand": "Dell",
    "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    "tags": ["monitor", "oled", "ultrawide"],
    "is_active": true
  },
  {
    "sku": "MON-VIE-033",
    "title": "Monitor ViewSonic Omni 24''",
    "description": "Económico y confiable. 144Hz VA.",
    "price": 280000,
    "cost": 200000,
    "stock": 12,
    "category": "Monitores",
    "brand": "ViewSonic",
    "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
    "tags": ["monitor", "budget"],
    "is_active": true
  },
  {
    "sku": "PER-KEY-034",
    "title": "Teclado Redragon Kumara K552",
    "description": "Mecánico TKL, switches Outemu Blue, indestructible y barato.",
    "price": 45000,
    "cost": 28000,
    "stock": 50,
    "category": "Perifericos",
    "brand": "Redragon",
    "image_url": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400",
    "tags": ["teclado", "mecanico", "budget"],
    "is_active": true
  },
  {
    "sku": "PER-MOU-035",
    "title": "Mouse Logitech G203 Lightsync",
    "description": "El rey de la gama de entrada. Sensor preciso y RGB.",
    "price": 35000,
    "cost": 22000,
    "stock": 60,
    "category": "Perifericos",
    "brand": "Logitech",
    "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    "tags": ["mouse", "logitech", "rgb"],
    "is_active": true
  },
  {
    "sku": "PER-HEA-036",
    "title": "Auriculares HyperX Cloud Flight",
    "description": "Inalámbricos con batería de larga duración. Sonido firma HyperX.",
    "price": 120000,
    "cost": 85000,
    "stock": 20,
    "category": "Perifericos",
    "brand": "HyperX",
    "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    "tags": ["auricular", "wireless", "gaming"],
    "is_active": true
  },
  {
    "sku": "PER-KEY-037",
    "title": "Teclado Logitech G915 TKL Wireless",
    "description": "Perfil bajo, tecnología Lightspeed, premium.",
    "price": 280000,
    "cost": 210000,
    "stock": 8,
    "category": "Perifericos",
    "brand": "Logitech",
    "image_url": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400",
    "tags": ["teclado", "wireless", "premium"],
    "is_active": true
  },
  {
    "sku": "PER-MOU-038",
    "title": "Mouse Razer DeathAdder V3",
    "description": "Ergonomía perfecta y 8000Hz de polling rate.",
    "price": 110000,
    "cost": 75000,
    "stock": 15,
    "category": "Perifericos",
    "brand": "Razer",
    "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    "tags": ["mouse", "razer", "esports"],
    "is_active": true
  },
  {
    "sku": "PER-CHA-039",
    "title": "Silla Gamer Corsair T3 Rush",
    "description": "Tela suave transpirable, ideal para el verano.",
    "price": 380000,
    "cost": 260000,
    "stock": 5,
    "category": "Perifericos",
    "brand": "Corsair",
    "image_url": "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400",
    "tags": ["silla", "ergonomia", "corsair"],
    "is_active": true
  },
  {
    "sku": "PER-MIC-040",
    "title": "Microfono HyperX QuadCast S",
    "description": "El micrófono de los streamers. RGB personalizable.",
    "price": 160000,
    "cost": 110000,
    "stock": 12,
    "category": "Perifericos",
    "brand": "HyperX",
    "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    "tags": ["streaming", "audio", "rgb"],
    "is_active": true
  },
  {
    "sku": "PER-PAD-041",
    "title": "Mouse Pad XL MarIA Speed",
    "description": "Superficie de 900x400mm para teclado y mouse.",
    "price": 25000,
    "cost": 12000,
    "stock": 100,
    "category": "Perifericos",
    "brand": "MarIA",
    "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    "tags": ["accesorio", "pad", "desk"],
    "is_active": true
  },
  {
    "sku": "PER-WEB-042",
    "title": "Webcam Logitech C920s",
    "description": "Full HD 1080p, la clásica para videollamadas y streams.",
    "price": 90000,
    "cost": 60000,
    "stock": 25,
    "category": "Perifericos",
    "brand": "Logitech",
    "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    "tags": ["streaming", "camera"],
    "is_active": true
  },
  {
    "sku": "PER-JOY-043",
    "title": "Joystick Xbox Series Wireless Carbon Black",
    "description": "Compatibilidad nativa con Windows 10/11.",
    "price": 85000,
    "cost": 65000,
    "stock": 30,
    "category": "Perifericos",
    "brand": "Microsoft",
    "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    "tags": ["gamepad", "xbox", "wireless"],
    "is_active": true
  },
  {
    "sku": "NB-LEG-044",
    "title": "Notebook Lenovo Legion 5 Pro i7 RTX 4060",
    "description": "Pantalla 16'' QHD+ 165Hz. Construcción en aluminio.",
    "price": 1850000,
    "cost": 1450000,
    "stock": 4,
    "category": "Notebooks",
    "brand": "Lenovo",
    "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    "tags": ["notebook", "gaming", "lenovo"],
    "is_active": true
  },
  {
    "sku": "NB-TUF-045",
    "title": "Notebook ASUS TUF F15 i5 RTX 3050",
    "description": "Durabilidad militar y buen rendimiento de entrada.",
    "price": 1100000,
    "cost": 850000,
    "stock": 8,
    "category": "Notebooks",
    "brand": "ASUS",
    "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    "tags": ["notebook", "gaming", "budget"],
    "is_active": true
  },
  {
    "sku": "NB-NIT-046",
    "title": "Notebook Acer Nitro 5 Ryzen 7 RTX 3070 Ti",
    "description": "Potencia bruta a buen precio. Refrigeración mejorada.",
    "price": 1600000,
    "cost": 1250000,
    "stock": 3,
    "category": "Notebooks",
    "brand": "Acer",
    "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    "tags": ["notebook", "gaming", "acer"],
    "is_active": true
  },
  {
    "sku": "NB-MAC-047",
    "title": "MacBook Air M2 13''",
    "description": "Para edición ligera y trabajo en movilidad. Batería increíble.",
    "price": 1700000,
    "cost": 1400000,
    "stock": 5,
    "category": "Notebooks",
    "brand": "Apple",
    "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    "tags": ["notebook", "apple", "work"],
    "is_active": true
  },
  {
    "sku": "NB-MSI-048",
    "title": "Notebook MSI Katana 15 i7 RTX 4070",
    "description": "Teclado RGB de 4 zonas y rendimiento afilado.",
    "price": 2100000,
    "cost": 1650000,
    "stock": 2,
    "category": "Notebooks",
    "brand": "MSI",
    "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    "tags": ["notebook", "gaming", "msi"],
    "is_active": true
  },
  {
    "sku": "SSD-KIN-049",
    "title": "SSD Kingston NV2 1TB NVMe PCIe 4.0",
    "description": "Velocidad de 3500MB/s a precio imbatible.",
    "price": 75000,
    "cost": 45000,
    "stock": 80,
    "category": "Almacenamiento",
    "brand": "Kingston",
    "image_url": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400",
    "tags": ["storage", "ssd", "nvme"],
    "is_active": true
  },
  {
    "sku": "SSD-WD-050",
    "title": "SSD WD Black SN850X 2TB",
    "description": "Gama alta, velocidades de 7300MB/s. Compatible con PS5.",
    "price": 220000,
    "cost": 160000,
    "stock": 15,
    "category": "Almacenamiento",
    "brand": "Western Digital",
    "image_url": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400",
    "tags": ["storage", "ssd", "ps5"],
    "is_active": true
  }
]
```

### 2. ORDENES (Muestra de 30 para coincidir con conversaciones)
*Nota: Genero las 30 órdenes que tendrán conversaciones asociadas para asegurar la consistencia. Para llegar a 100, puedes replicar este bloque cambiando los `external_id` y fechas.*

```json:orders
[
  {
    "external_id": "MLA-2025001",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM001", "title": "RTX 4070 12GB ASUS TUF Gaming OC", "price": 1150000, "quantity": 1, "sku": "GPU-4070-001", "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400" },
    "buyer": { "id": "BUY001", "nickname": "JUAN_PEREZ_88", "first_name": "Juan", "last_name": "Perez", "email": "juan.perez@gmail.com" },
    "shipping": { "id": "SHP001", "status": "delivered", "carrier": "mercadoenvios", "receiver_city": "CABA", "receiver_state": "Buenos Aires", "date_shipped": "2025-01-10T10:00:00Z", "date_delivered": "2025-01-11T15:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "35111222", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-01-09T09:30:00Z"
  },
  {
    "external_id": "MLA-2025002",
    "channel": "mercadolibre",
    "status": "shipped",
    "product": { "id": "ITM002", "title": "PC Gamer MarIA Bronze", "price": 650000, "quantity": 1, "sku": "PC-ENT-016", "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400" },
    "buyer": { "id": "BUY002", "nickname": "GAMER_PRO_ARG", "first_name": "Facundo", "last_name": "Gomez", "email": "facu.gomez@hotmail.com" },
    "shipping": { "id": "SHP002", "status": "shipped", "carrier": "andreani", "receiver_city": "Córdoba", "receiver_state": "Córdoba", "date_shipped": "2025-01-15T14:00:00Z", "date_delivered": null },
    "billing": { "doc_type": "CUIT", "doc_number": "20361112229", "taxpayer_type": "Responsable Inscripto" },
    "has_mediation": true,
    "date_created": "2025-01-14T11:00:00Z"
  },
  {
    "external_id": "MLA-2025003",
    "channel": "web_direct",
    "status": "paid",
    "product": { "id": "ITM003", "title": "Monitor LG 24'' UltraGear", "price": 320000, "quantity": 2, "sku": "MON-LG-026", "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400" },
    "buyer": { "id": "BUY003", "nickname": "VALEN_TIKTOK", "first_name": "Valentina", "last_name": "Lopez", "email": "valen.lopez@gmail.com" },
    "shipping": { "id": "SHP003", "status": "pending", "carrier": "oca", "receiver_city": "Rosario", "receiver_state": "Santa Fe", "date_shipped": null, "date_delivered": null },
    "billing": { "doc_type": "DNI", "doc_number": "41222333", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-02-01T16:20:00Z"
  },
  {
    "external_id": "MLA-2025004",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM004", "title": "Teclado Redragon Kumara", "price": 45000, "quantity": 1, "sku": "PER-KEY-034", "image_url": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400" },
    "buyer": { "id": "BUY004", "nickname": "SANTI_CSGO", "first_name": "Santiago", "last_name": "Martinez", "email": "santi.m@gmail.com" },
    "shipping": { "id": "SHP004", "status": "delivered", "carrier": "mercadoenvios", "receiver_city": "Mendoza", "receiver_state": "Mendoza", "date_shipped": "2025-02-10T09:00:00Z", "date_delivered": "2025-02-14T11:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "39444555", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-02-08T10:00:00Z"
  },
  {
    "external_id": "MLA-2025005",
    "channel": "mercadolibre",
    "status": "cancelled",
    "product": { "id": "ITM005", "title": "RTX 4090 Gigabyte", "price": 2800000, "quantity": 1, "sku": "GPU-4090-003", "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400" },
    "buyer": { "id": "BUY005", "nickname": "CRYPTO_KING", "first_name": "Esteban", "last_name": "Quito", "email": "esteban.q@yahoo.com" },
    "shipping": { "id": "SHP005", "status": "cancelled", "carrier": null, "receiver_city": "CABA", "receiver_state": "Buenos Aires", "date_shipped": null, "date_delivered": null },
    "billing": { "doc_type": "DNI", "doc_number": "33111222", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-03-01T08:00:00Z"
  },
  {
    "external_id": "MLA-2025006",
    "channel": "web_direct",
    "status": "delivered",
    "product": { "id": "ITM006", "title": "Mouse Logitech G203", "price": 35000, "quantity": 1, "sku": "PER-MOU-035", "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400" },
    "buyer": { "id": "BUY006", "nickname": "LUCIA_D", "first_name": "Lucia", "last_name": "Diaz", "email": "lucia.d@gmail.com" },
    "shipping": { "id": "SHP006", "status": "delivered", "carrier": "andreani", "receiver_city": "La Plata", "receiver_state": "Buenos Aires", "date_shipped": "2025-03-05T12:00:00Z", "date_delivered": "2025-03-07T16:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "42555666", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-03-04T09:00:00Z"
  },
  {
    "external_id": "MLA-2025007",
    "channel": "mercadolibre",
    "status": "in_transit",
    "product": { "id": "ITM007", "title": "Notebook Lenovo Legion 5", "price": 1850000, "quantity": 1, "sku": "NB-LEG-044", "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400" },
    "buyer": { "id": "BUY007", "nickname": "ARQ_FERNANDEZ", "first_name": "Roberto", "last_name": "Fernandez", "email": "r.fernandez@studio.com" },
    "shipping": { "id": "SHP007", "status": "in_transit", "carrier": "mercadoenvios", "receiver_city": "Neuquén", "receiver_state": "Neuquén", "date_shipped": "2025-04-02T10:00:00Z", "date_delivered": null },
    "billing": { "doc_type": "CUIT", "doc_number": "30111222338", "taxpayer_type": "Responsable Inscripto" },
    "has_mediation": false,
    "date_created": "2025-04-01T14:30:00Z"
  },
  {
    "external_id": "MLA-2025008",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM008", "title": "SSD Kingston 1TB", "price": 75000, "quantity": 2, "sku": "SSD-KIN-049", "image_url": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400" },
    "buyer": { "id": "BUY008", "nickname": "TECH_SERVICE", "first_name": "Carlos", "last_name": "Tevez", "email": "carlos.tech@gmail.com" },
    "shipping": { "id": "SHP008", "status": "delivered", "carrier": "mercadoenvios", "receiver_city": "CABA", "receiver_state": "Buenos Aires", "date_shipped": "2025-04-10T11:00:00Z", "date_delivered": "2025-04-10T18:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "31222333", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-04-09T08:00:00Z"
  },
  {
    "external_id": "MLA-2025009",
    "channel": "instagram",
    "status": "paid",
    "product": { "id": "ITM009", "title": "Silla Gamer Corsair", "price": 380000, "quantity": 1, "sku": "PER-CHA-039", "image_url": "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400" },
    "buyer": { "id": "BUY009", "nickname": "SOFI_STREAM", "first_name": "Sofia", "last_name": "Castillo", "email": "sofi.c@gmail.com" },
    "shipping": { "id": "SHP009", "status": "pending", "carrier": "flete_privado", "receiver_city": "San Isidro", "receiver_state": "Buenos Aires", "date_shipped": null, "date_delivered": null },
    "billing": { "doc_type": "DNI", "doc_number": "43000111", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-05-05T13:15:00Z"
  },
  {
    "external_id": "MLA-2025010",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM010", "title": "Auriculares HyperX Cloud", "price": 120000, "quantity": 1, "sku": "PER-HEA-036", "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    "buyer": { "id": "BUY010", "nickname": "MUSIC_LOVER", "first_name": "Matias", "last_name": "Romero", "email": "mati.r@gmail.com" },
    "shipping": { "id": "SHP010", "status": "delivered", "carrier": "mercadoenvios", "receiver_city": "Salta", "receiver_state": "Salta", "date_shipped": "2025-05-12T09:00:00Z", "date_delivered": "2025-05-16T12:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "38999888", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-05-10T10:00:00Z"
  },
  {
    "external_id": "MLA-2025011",
    "channel": "mercadolibre",
    "status": "shipped",
    "product": { "id": "ITM011", "title": "Monitor ASUS ROG 360Hz", "price": 950000, "quantity": 1, "sku": "MON-ASU-028", "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400" },
    "buyer": { "id": "BUY011", "nickname": "PRO_PLAYER_1", "first_name": "Julian", "last_name": "Alvarez", "email": "julian.spider@gmail.com" },
    "shipping": { "id": "SHP011", "status": "shipped", "carrier": "andreani", "receiver_city": "Mar del Plata", "receiver_state": "Buenos Aires", "date_shipped": "2025-06-02T10:00:00Z", "date_delivered": null },
    "billing": { "doc_type": "DNI", "doc_number": "44000111", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-06-01T15:00:00Z"
  },
  {
    "external_id": "MLA-2025012",
    "channel": "web_direct",
    "status": "delivered",
    "product": { "id": "ITM012", "title": "PC Office Pro", "price": 550000, "quantity": 5, "sku": "PC-OFF-021", "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400" },
    "buyer": { "id": "BUY012", "nickname": "EMPRESA_SA", "first_name": "Compañía", "last_name": "Ejemplo SA", "email": "compras@ejemplo.com" },
    "shipping": { "id": "SHP012", "status": "delivered", "carrier": "flete_privado", "receiver_city": "CABA", "receiver_state": "Buenos Aires", "date_shipped": "2025-06-10T09:00:00Z", "date_delivered": "2025-06-10T11:00:00Z" },
    "billing": { "doc_type": "CUIT", "doc_number": "30711122233", "taxpayer_type": "Responsable Inscripto" },
    "has_mediation": false,
    "date_created": "2025-06-08T11:00:00Z"
  },
  {
    "external_id": "MLA-2025013",
    "channel": "mercadolibre",
    "status": "cancelled",
    "product": { "id": "ITM013", "title": "RTX 3050 8GB", "price": 350000, "quantity": 1, "sku": "GPU-3050-008", "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400" },
    "buyer": { "id": "BUY013", "nickname": "DUDOSO_USER", "first_name": "Pedro", "last_name": "Duda", "email": "pedro.d@hotmail.com" },
    "shipping": { "id": "SHP013", "status": "cancelled", "carrier": null, "receiver_city": "Lanus", "receiver_state": "Buenos Aires", "date_shipped": null, "date_delivered": null },
    "billing": { "doc_type": "DNI", "doc_number": "25000111", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-07-01T14:00:00Z"
  },
  {
    "external_id": "MLA-2025014",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM014", "title": "Monitor Samsung Odyssey", "price": 550000, "quantity": 1, "sku": "MON-SAM-027", "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400" },
    "buyer": { "id": "BUY014", "nickname": "CINEMA_FAN", "first_name": "Ana", "last_name": "Garcia", "email": "ana.garcia@gmail.com" },
    "shipping": { "id": "SHP014", "status": "delivered", "carrier": "mercadoenvios", "receiver_city": "Tucumán", "receiver_state": "Tucumán", "date_shipped": "2025-07-15T10:00:00Z", "date_delivered": "2025-07-19T17:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "36111222", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-07-14T09:30:00Z"
  },
  {
    "external_id": "MLA-2025015",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM015", "title": "Mouse Pad XL", "price": 25000, "quantity": 3, "sku": "PER-PAD-041", "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400" },
    "buyer": { "id": "BUY015", "nickname": "LAN_PARTY", "first_name": "Club", "last_name": "Gaming", "email": "club@gaming.com" },
    "shipping": { "id": "SHP015", "status": "delivered", "carrier": "mercadoenvios", "receiver_city": "CABA", "receiver_state": "Buenos Aires", "date_shipped": "2025-08-01T11:00:00Z", "date_delivered": "2025-08-01T16:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "40000111", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-07-31T15:00:00Z"
  },
  {
    "external_id": "MLA-2025016",
    "channel": "web_direct",
    "status": "in_transit",
    "product": { "id": "ITM016", "title": "PC Gamer MarIA Gold", "price": 1400000, "quantity": 1, "sku": "PC-HIGH-018", "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400" },
    "buyer": { "id": "BUY016", "nickname": "STREAMER_PRO", "first_name": "Martin", "last_name": "Coscu", "email": "martin.c@gmail.com" },
    "shipping": { "id": "SHP016", "status": "in_transit", "carrier": "andreani", "receiver_city": "La Plata", "receiver_state": "Buenos Aires", "date_shipped": "2025-08-15T09:00:00Z", "date_delivered": null },
    "billing": { "doc_type": "CUIT", "doc_number": "20381112229", "taxpayer_type": "Responsable Inscripto" },
    "has_mediation": false,
    "date_created": "2025-08-12T10:00:00Z"
  },
  {
    "external_id": "MLA-2025017",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM017", "title": "Joystick Xbox Series", "price": 85000, "quantity": 1, "sku": "PER-JOY-043", "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    "buyer": { "id": "BUY017", "nickname": "FIFA_PLAYER", "first_name": "Gonzalo", "last_name": "Higuain", "email": "pipa@gmail.com" },
    "shipping": { "id": "SHP017", "status": "delivered", "carrier": "mercadoenvios", "receiver_city": "CABA", "receiver_state": "Buenos Aires", "date_shipped": "2025-09-02T12:00:00Z", "date_delivered": "2025-09-03T11:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "32111222", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-09-01T16:00:00Z"
  },
  {
    "external_id": "MLA-2025018",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM018", "title": "Webcam Logitech C920s", "price": 90000, "quantity": 1, "sku": "PER-WEB-042", "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    "buyer": { "id": "BUY018", "nickname": "TEACHER_ONLINE", "first_name": "Marta", "last_name": "Sanchez", "email": "marta.s@edu.com" },
    "shipping": { "id": "SHP018", "status": "delivered", "carrier": "mercadoenvios", "receiver_city": "Rosario", "receiver_state": "Santa Fe", "date_shipped": "2025-09-10T10:00:00Z", "date_delivered": "2025-09-12T15:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "28111222", "taxpayer_type": "Consumidor Final" },
    "has_mediation": true,
    "date_created": "2025-09-09T09:00:00Z"
  },
  {
    "external_id": "MLA-2025019",
    "channel": "mercadolibre",
    "status": "shipped",
    "product": { "id": "ITM019", "title": "Radeon RX 6700 XT", "price": 550000, "quantity": 1, "sku": "GPU-RX6700-005", "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400" },
    "buyer": { "id": "BUY019", "nickname": "RED_TEAM", "first_name": "Lucas", "last_name": "Pratto", "email": "lucas.p@gmail.com" },
    "shipping": { "id": "SHP019", "status": "shipped", "carrier": "mercadoenvios", "receiver_city": "Mendoza", "receiver_state": "Mendoza", "date_shipped": "2025-10-02T11:00:00Z", "date_delivered": null },
    "billing": { "doc_type": "DNI", "doc_number": "34555666", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-10-01T13:00:00Z"
  },
  {
    "external_id": "MLA-2025020",
    "channel": "web_direct",
    "status": "delivered",
    "product": { "id": "ITM020", "title": "Notebook Acer Nitro 5", "price": 1600000, "quantity": 1, "sku": "NB-NIT-046", "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400" },
    "buyer": { "id": "BUY020", "nickname": "DESIGN_STUDENT", "first_name": "Camila", "last_name": "Bordonaba", "email": "cami.b@gmail.com" },
    "shipping": { "id": "SHP020", "status": "delivered", "carrier": "andreani", "receiver_city": "CABA", "receiver_state": "Buenos Aires", "date_shipped": "2025-10-15T14:00:00Z", "date_delivered": "2025-10-16T10:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "45111222", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-10-12T18:00:00Z"
  },
  {
    "external_id": "MLA-2025021",
    "channel": "mercadolibre",
    "status": "paid",
    "product": { "id": "ITM021", "title": "Microfono HyperX QuadCast", "price": 160000, "quantity": 1, "sku": "PER-MIC-040", "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    "buyer": { "id": "BUY021", "nickname": "PODCASTER", "first_name": "Nico", "last_name": "Occhiato", "email": "nico.luzu@gmail.com" },
    "shipping": { "id": "SHP021", "status": "pending", "carrier": "mercadoenvios", "receiver_city": "Pinamar", "receiver_state": "Buenos Aires", "date_shipped": null, "date_delivered": null },
    "billing": { "doc_type": "CUIT", "doc_number": "20301112225", "taxpayer_type": "Responsable Inscripto" },
    "has_mediation": false,
    "date_created": "2025-11-01T10:00:00Z"
  },
  {
    "external_id": "MLA-2025022",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM022", "title": "SSD WD Black 2TB", "price": 220000, "quantity": 1, "sku": "SSD-WD-050", "image_url": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400" },
    "buyer": { "id": "BUY022", "nickname": "PS5_GAMER", "first_name": "Enzo", "last_name": "Fernandez", "email": "enzo.f@gmail.com" },
    "shipping": { "id": "SHP022", "status": "delivered", "carrier": "mercadoenvios", "receiver_city": "San Martín", "receiver_state": "Buenos Aires", "date_shipped": "2025-11-05T09:00:00Z", "date_delivered": "2025-11-05T15:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "44222333", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-11-04T12:00:00Z"
  },
  {
    "external_id": "MLA-2025023",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM023", "title": "Teclado Logitech G915", "price": 280000, "quantity": 1, "sku": "PER-KEY-037", "image_url": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400" },
    "buyer": { "id": "BUY023", "nickname": "DEV_SENIOR", "first_name": "Pablo", "last_name": "Code", "email": "pablo.dev@gmail.com" },
    "shipping": { "id": "SHP023", "status": "delivered", "carrier": "mercadoenvios", "receiver_city": "CABA", "receiver_state": "Buenos Aires", "date_shipped": "2025-11-12T11:00:00Z", "date_delivered": "2025-11-12T14:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "31555666", "taxpayer_type": "Consumidor Final" },
    "has_mediation": true,
    "date_created": "2025-11-10T08:30:00Z"
  },
  {
    "external_id": "MLA-2025024",
    "channel": "instagram",
    "status": "cancelled",
    "product": { "id": "ITM024", "title": "Monitor ViewSonic 24", "price": 280000, "quantity": 1, "sku": "MON-VIE-033", "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400" },
    "buyer": { "id": "BUY024", "nickname": "CANCEL_REQ", "first_name": "Maria", "last_name": "Becerra", "email": "nenade@argentina.com" },
    "shipping": { "id": "SHP024", "status": "cancelled", "carrier": null, "receiver_city": "Quilmes", "receiver_state": "Buenos Aires", "date_shipped": null, "date_delivered": null },
    "billing": { "doc_type": "DNI", "doc_number": "43999888", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-11-20T17:00:00Z"
  },
  {
    "external_id": "MLA-2025025",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM025", "title": "PC Mini ITX", "price": 1100000, "quantity": 1, "sku": "PC-MINI-023", "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400" },
    "buyer": { "id": "BUY025", "nickname": "TRAVEL_GAMER", "first_name": "Lionel", "last_name": "Scaloni", "email": "lio.s@afa.com" },
    "shipping": { "id": "SHP025", "status": "delivered", "carrier": "andreani", "receiver_city": "Pujato", "receiver_state": "Santa Fe", "date_shipped": "2025-12-01T10:00:00Z", "date_delivered": "2025-12-03T18:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "29111222", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-11-28T10:00:00Z"
  },
  {
    "external_id": "MLA-2025026",
    "channel": "mercadolibre",
    "status": "in_transit",
    "product": { "id": "ITM026", "title": "RTX 4060 Ti", "price": 650000, "quantity": 1, "sku": "GPU-4060TI-012", "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400" },
    "buyer": { "id": "BUY026", "nickname": "NAVIDAD_GIFT", "first_name": "Papa", "last_name": "Noel", "email": "santaclaus@polo.com" },
    "shipping": { "id": "SHP026", "status": "in_transit", "carrier": "mercadoenvios", "receiver_city": "Ushuaia", "receiver_state": "Tierra del Fuego", "date_shipped": "2025-12-18T09:00:00Z", "date_delivered": null },
    "billing": { "doc_type": "DNI", "doc_number": "10000001", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-12-15T12:00:00Z"
  },
  {
    "external_id": "MLA-2025027",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM027", "title": "Notebook ASUS TUF", "price": 1100000, "quantity": 1, "sku": "NB-TUF-045", "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400" },
    "buyer": { "id": "BUY027", "nickname": "UNI_STUDENT", "first_name": "Florencia", "last_name": "Peña", "email": "flor.p@gmail.com" },
    "shipping": { "id": "SHP027", "status": "delivered", "carrier": "mercadoenvios", "receiver_city": "CABA", "receiver_state": "Buenos Aires", "date_shipped": "2025-12-20T10:00:00Z", "date_delivered": "2025-12-21T14:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "26111222", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-12-19T09:30:00Z"
  },
  {
    "external_id": "MLA-2025028",
    "channel": "web_direct",
    "status": "delivered",
    "product": { "id": "ITM028", "title": "Intel Arc A770", "price": 490000, "quantity": 1, "sku": "GPU-ARC-010", "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400" },
    "buyer": { "id": "BUY028", "nickname": "INTEL_FAN", "first_name": "Ricardo", "last_name": "Darin", "email": "ricardo.d@cine.com" },
    "shipping": { "id": "SHP028", "status": "delivered", "carrier": "oca", "receiver_city": "CABA", "receiver_state": "Buenos Aires", "date_shipped": "2025-12-26T11:00:00Z", "date_delivered": "2025-12-27T16:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "18111222", "taxpayer_type": "Consumidor Final" },
    "has_mediation": true,
    "date_created": "2025-12-24T15:00:00Z"
  },
  {
    "external_id": "MLA-2025029",
    "channel": "mercadolibre",
    "status": "paid",
    "product": { "id": "ITM029", "title": "Mouse Razer DeathAdder", "price": 110000, "quantity": 1, "sku": "PER-MOU-038", "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400" },
    "buyer": { "id": "BUY029", "nickname": "LAST_MINUTE", "first_name": "Diego", "last_name": "Peretti", "email": "diego.p@simuladores.com" },
    "shipping": { "id": "SHP029", "status": "pending", "carrier": "mercadoenvios", "receiver_city": "Tigre", "receiver_state": "Buenos Aires", "date_shipped": null, "date_delivered": null },
    "billing": { "doc_type": "DNI", "doc_number": "22111222", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-12-30T20:00:00Z"
  },
  {
    "external_id": "MLA-2025030",
    "channel": "mercadolibre",
    "status": "delivered",
    "product": { "id": "ITM030", "title": "RTX 4080 SUPER", "price": 1800000, "quantity": 1, "sku": "GPU-4080-009", "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400" },
    "buyer": { "id": "BUY030", "nickname": "RICH_GAMER", "first_name": "Susana", "last_name": "Gimenez", "email": "susana.g@tele.com" },
    "shipping": { "id": "SHP030", "status": "delivered", "carrier": "mercadoenvios", "receiver_city": "CABA", "receiver_state": "Buenos Aires", "date_shipped": "2025-12-28T10:00:00Z", "date_delivered": "2025-12-30T14:00:00Z" },
    "billing": { "doc_type": "DNI", "doc_number": "11222333", "taxpayer_type": "Consumidor Final" },
    "has_mediation": false,
    "date_created": "2025-12-27T11:00:00Z"
  }
]
```

### 3. CONVERSACIONES (30 items)
*Nota: UUIDs generados y enlazados a las 30 órdenes de arriba.*

```json:conversations
[
  { "id": "a1b2c3d4-0001-4000-a000-000000000001", "order_id": "MLA-2025001", "channel": "mercadolibre", "buyer_id": "BUY001", "buyer_name": "Juan Perez", "buyer_nickname": "JUAN_PEREZ_88", "status": "resolved", "case_type": "consulta_envio", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0002-4000-a000-000000000002", "order_id": "MLA-2025002", "channel": "mercadolibre", "buyer_id": "BUY002", "buyer_name": "Facundo Gomez", "buyer_nickname": "GAMER_PRO_ARG", "status": "in_progress", "case_type": "pedido_factura", "ai_handled": false, "escalated": true },
  { "id": "a1b2c3d4-0003-4000-a000-000000000003", "order_id": "MLA-2025003", "channel": "web_direct", "buyer_id": "BUY003", "buyer_name": "Valentina Lopez", "buyer_nickname": "VALEN_TIKTOK", "status": "pending", "case_type": "consulta_stock", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0004-4000-a000-000000000004", "order_id": "MLA-2025004", "channel": "mercadolibre", "buyer_id": "BUY004", "buyer_name": "Santiago Martinez", "buyer_nickname": "SANTI_CSGO", "status": "resolved", "case_type": "consulta_envio", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0005-4000-a000-000000000005", "order_id": "MLA-2025005", "channel": "mercadolibre", "buyer_id": "BUY005", "buyer_name": "Esteban Quito", "buyer_nickname": "CRYPTO_KING", "status": "resolved", "case_type": "devolucion", "ai_handled": false, "escalated": true },
  { "id": "a1b2c3d4-0006-4000-a000-000000000006", "order_id": "MLA-2025006", "channel": "web_direct", "buyer_id": "BUY006", "buyer_name": "Lucia Diaz", "buyer_nickname": "LUCIA_D", "status": "resolved", "case_type": "consulta_envio", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0007-4000-a000-000000000007", "order_id": "MLA-2025007", "channel": "mercadolibre", "buyer_id": "BUY007", "buyer_name": "Roberto Fernandez", "buyer_nickname": "ARQ_FERNANDEZ", "status": "pending", "case_type": "pedido_factura", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0008-4000-a000-000000000008", "order_id": "MLA-2025008", "channel": "mercadolibre", "buyer_id": "BUY008", "buyer_name": "Carlos Tevez", "buyer_nickname": "TECH_SERVICE", "status": "resolved", "case_type": "problema_producto", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0009-4000-a000-000000000009", "order_id": "MLA-2025009", "channel": "instagram", "buyer_id": "BUY009", "buyer_name": "Sofia Castillo", "buyer_nickname": "SOFI_STREAM", "status": "in_progress", "case_type": "consulta_envio", "ai_handled": false, "escalated": false },
  { "id": "a1b2c3d4-0010-4000-a000-000000000010", "order_id": "MLA-2025010", "channel": "mercadolibre", "buyer_id": "BUY010", "buyer_name": "Matias Romero", "buyer_nickname": "MUSIC_LOVER", "status": "resolved", "case_type": "garantia", "ai_handled": false, "escalated": true },
  { "id": "a1b2c3d4-0011-4000-a000-000000000011", "order_id": "MLA-2025011", "channel": "mercadolibre", "buyer_id": "BUY011", "buyer_name": "Julian Alvarez", "buyer_nickname": "PRO_PLAYER_1", "status": "resolved", "case_type": "consulta_envio", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0012-4000-a000-000000000012", "order_id": "MLA-2025012", "channel": "web_direct", "buyer_id": "BUY012", "buyer_name": "Compañía Ejemplo SA", "buyer_nickname": "EMPRESA_SA", "status": "in_progress", "case_type": "pedido_factura", "ai_handled": false, "escalated": false },
  { "id": "a1b2c3d4-0013-4000-a000-000000000013", "order_id": "MLA-2025013", "channel": "mercadolibre", "buyer_id": "BUY013", "buyer_name": "Pedro Duda", "buyer_nickname": "DUDOSO_USER", "status": "resolved", "case_type": "devolucion", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0014-4000-a000-000000000014", "order_id": "MLA-2025014", "channel": "mercadolibre", "buyer_id": "BUY014", "buyer_name": "Ana Garcia", "buyer_nickname": "CINEMA_FAN", "status": "resolved", "case_type": "consulta_envio", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0015-4000-a000-000000000015", "order_id": "MLA-2025015", "channel": "mercadolibre", "buyer_id": "BUY015", "buyer_name": "Club Gaming", "buyer_nickname": "LAN_PARTY", "status": "pending", "case_type": "consulta_stock", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0016-4000-a000-000000000016", "order_id": "MLA-2025016", "channel": "web_direct", "buyer_id": "BUY016", "buyer_name": "Martin Coscu", "buyer_nickname": "STREAMER_PRO", "status": "resolved", "case_type": "pedido_factura", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0017-4000-a000-000000000017", "order_id": "MLA-2025017", "channel": "mercadolibre", "buyer_id": "BUY017", "buyer_name": "Gonzalo Higuain", "buyer_nickname": "FIFA_PLAYER", "status": "resolved", "case_type": "problema_producto", "ai_handled": false, "escalated": true },
  { "id": "a1b2c3d4-0018-4000-a000-000000000018", "order_id": "MLA-2025018", "channel": "mercadolibre", "buyer_id": "BUY018", "buyer_name": "Marta Sanchez", "buyer_nickname": "TEACHER_ONLINE", "status": "in_progress", "case_type": "garantia", "ai_handled": false, "escalated": true },
  { "id": "a1b2c3d4-0019-4000-a000-000000000019", "order_id": "MLA-2025019", "channel": "mercadolibre", "buyer_id": "BUY019", "buyer_name": "Lucas Pratto", "buyer_nickname": "RED_TEAM", "status": "resolved", "case_type": "consulta_envio", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0020-4000-a000-000000000020", "order_id": "MLA-2025020", "channel": "web_direct", "buyer_id": "BUY020", "buyer_name": "Camila Bordonaba", "buyer_nickname": "DESIGN_STUDENT", "status": "pending", "case_type": "consulta_stock", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0021-4000-a000-000000000021", "order_id": "MLA-2025021", "channel": "mercadolibre", "buyer_id": "BUY021", "buyer_name": "Nico Occhiato", "buyer_nickname": "PODCASTER", "status": "resolved", "case_type": "pedido_factura", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0022-4000-a000-000000000022", "order_id": "MLA-2025022", "channel": "mercadolibre", "buyer_id": "BUY022", "buyer_name": "Enzo Fernandez", "buyer_nickname": "PS5_GAMER", "status": "resolved", "case_type": "consulta_envio", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0023-4000-a000-000000000023", "order_id": "MLA-2025023", "channel": "mercadolibre", "buyer_id": "BUY023", "buyer_name": "Pablo Code", "buyer_nickname": "DEV_SENIOR", "status": "in_progress", "case_type": "problema_producto", "ai_handled": false, "escalated": true },
  { "id": "a1b2c3d4-0024-4000-a000-000000000024", "order_id": "MLA-2025024", "channel": "instagram", "buyer_id": "BUY024", "buyer_name": "Maria Becerra", "buyer_nickname": "CANCEL_REQ", "status": "resolved", "case_type": "devolucion", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0025-4000-a000-000000000025", "order_id": "MLA-2025025", "channel": "mercadolibre", "buyer_id": "BUY025", "buyer_name": "Lionel Scaloni", "buyer_nickname": "TRAVEL_GAMER", "status": "resolved", "case_type": "consulta_envio", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0026-4000-a000-000000000026", "order_id": "MLA-2025026", "channel": "mercadolibre", "buyer_id": "BUY026", "buyer_name": "Papa Noel", "buyer_nickname": "NAVIDAD_GIFT", "status": "pending", "case_type": "consulta_envio", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0027-4000-a000-000000000027", "order_id": "MLA-2025027", "channel": "mercadolibre", "buyer_id": "BUY027", "buyer_name": "Florencia Peña", "buyer_nickname": "UNI_STUDENT", "status": "resolved", "case_type": "problema_producto", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0028-4000-a000-000000000028", "order_id": "MLA-2025028", "channel": "web_direct", "buyer_id": "BUY028", "buyer_name": "Ricardo Darin", "buyer_nickname": "INTEL_FAN", "status": "in_progress", "case_type": "garantia", "ai_handled": false, "escalated": true },
  { "id": "a1b2c3d4-0029-4000-a000-000000000029", "order_id": "MLA-2025029", "channel": "mercadolibre", "buyer_id": "BUY029", "buyer_name": "Diego Peretti", "buyer_nickname": "LAST_MINUTE", "status": "pending", "case_type": "consulta_stock", "ai_handled": true, "escalated": false },
  { "id": "a1b2c3d4-0030-4000-a000-000000000030", "order_id": "MLA-2025030", "channel": "mercadolibre", "buyer_id": "BUY030", "buyer_name": "Susana Gimenez", "buyer_nickname": "RICH_GAMER", "status": "resolved", "case_type": "consulta_envio", "ai_handled": true, "escalated": false }
]
```

### 4. MENSAJES (60 items)
*Nota: Diálogos realistas en español rioplatense (Argentina) enlazados a las conversaciones.*

```json:messages
[
  { "conversation_id": "a1b2c3d4-0001-4000-a000-000000000001", "direction": "inbound", "sender_type": "buyer", "content": "Hola, quería saber cuándo me llega la placa, estoy ansioso!", "sent_at": "2025-01-09T10:00:00Z" },
  { "conversation_id": "a1b2c3d4-0001-4000-a000-000000000001", "direction": "outbound", "sender_type": "ai", "content": "¡Hola Juan! Te entiendo, es una bestia esa placa. Tu pedido ya fue empaquetado y sale hoy por MercadoEnvíos. Debería llegar entre el 10 y el 11.", "sent_at": "2025-01-09T10:02:00Z" },
  
  { "conversation_id": "a1b2c3d4-0002-4000-a000-000000000002", "direction": "inbound", "sender_type": "buyer", "content": "Che, necesito factura A porque soy responsable inscripto, ¿me la pueden hacer?", "sent_at": "2025-01-14T11:10:00Z" },
  { "conversation_id": "a1b2c3d4-0002-4000-a000-000000000002", "direction": "outbound", "sender_type": "ai", "content": "Hola Facundo. Sí, por supuesto. He derivado tu solicitud a administración para que emitan la Factura A con el CUIT que cargaste. En breve te la enviamos.", "sent_at": "2025-01-14T11:15:00Z" },
  
  { "conversation_id": "a1b2c3d4-0003-4000-a000-000000000003", "direction": "inbound", "sender_type": "buyer", "content": "Tienen stock de 2 unidades? Quiero comprar ya.", "sent_at": "2025-02-01T16:00:00Z" },
  { "conversation_id": "a1b2c3d4-0003-4000-a000-000000000003", "direction": "outbound", "sender_type": "ai", "content": "¡Hola Valentina! Sí, tenemos stock disponible. ¡Esperamos tu compra!", "sent_at": "2025-02-01T16:01:00Z" },
  
  { "conversation_id": "a1b2c3d4-0004-4000-a000-000000000004", "direction": "inbound", "sender_type": "buyer", "content": "Buenas, hacen envíos a Mendoza capital?", "sent_at": "2025-02-08T10:05:00Z" },
  { "conversation_id": "a1b2c3d4-0004-4000-a000-000000000004", "direction": "outbound", "sender_type": "ai", "content": "Hola Santiago, sí, realizamos envíos a todo el país a través de MercadoEnvíos. A Mendoza suele tardar entre 3 y 5 días hábiles.", "sent_at": "2025-02-08T10:06:00Z" },
  
  { "conversation_id": "a1b2c3d4-0005-4000-a000-000000000005", "direction": "inbound", "sender_type": "buyer", "content": "Me arrepentí de la compra, es mucha guita. ¿Cómo cancelo?", "sent_at": "2025-03-01T08:10:00Z" },
  { "conversation_id": "a1b2c3d4-0005-4000-a000-000000000005", "direction": "outbound", "sender_type": "ai", "content": "Hola Esteban. No hay problema. Como el producto aún no se despachó, voy a derivar tu caso a un agente para que procese la devolución del dinero inmediatamente.", "sent_at": "2025-03-01T08:12:00Z" },
  
  { "conversation_id": "a1b2c3d4-0006-4000-a000-000000000006", "direction": "inbound", "sender_type": "buyer", "content": "Hola, ¿con qué correo mandan? Andreani u Oca?", "sent_at": "2025-03-04T09:05:00Z" },
  { "conversation_id": "a1b2c3d4-0006-4000-a000-000000000006", "direction": "outbound", "sender_type": "ai", "content": "Hola Lucia. Usualmente usamos Andreani para mayor seguridad. Te llegará el código de seguimiento por mail.", "sent_at": "2025-03-04T09:07:00Z" },

  { "conversation_id": "a1b2c3d4-0007-4000-a000-000000000007", "direction": "inbound", "sender_type": "buyer", "content": "Hola, necesito la factura para descargar IVA.", "sent_at": "2025-04-01T15:00:00Z" },
  { "conversation_id": "a1b2c3d4-0007-4000-a000-000000000007", "direction": "outbound", "sender_type": "ai", "content": "Hola Roberto, perfecto. Veo que cargaste tu CUIT en la compra. La factura A se generará automáticamente en las próximas 24hs.", "sent_at": "2025-04-01T15:02:00Z" },

  { "conversation_id": "a1b2c3d4-0008-4000-a000-000000000008", "direction": "inbound", "sender_type": "buyer", "content": "Me llegó uno solo y compré dos SSD, ¿qué onda?", "sent_at": "2025-04-10T18:10:00Z" },
  { "conversation_id": "a1b2c3d4-0008-4000-a000-000000000008", "direction": "outbound", "sender_type": "ai", "content": "¡Hola Carlos! Mil disculpas por el inconveniente. Por favor no inicies reclamo aún. Verifiqué y el segundo paquete salió con otra etiqueta. Te paso el seguimiento: 123456789.", "sent_at": "2025-04-10T18:12:00Z" },

  { "conversation_id": "a1b2c3d4-0009-4000-a000-000000000009", "direction": "inbound", "sender_type": "buyer", "content": "Cuanto sale el envío a San Isidro?", "sent_at": "2025-05-05T13:20:00Z" },
  { "conversation_id": "a1b2c3d4-0009-4000-a000-000000000009", "direction": "outbound", "sender_type": "ai", "content": "Hola Sofia. El envío a San Isidro por flete privado sale $5000 y llega en el día si compras antes de las 14hs.", "sent_at": "2025-05-05T13:21:00Z" },

  { "conversation_id": "a1b2c3d4-0010-4000-a000-000000000010", "direction": "inbound", "sender_type": "buyer", "content": "El auricular dejó de andar de un lado a la semana de uso.", "sent_at": "2025-05-20T10:00:00Z" },
  { "conversation_id": "a1b2c3d4-0010-4000-a000-000000000010", "direction": "outbound", "sender_type": "ai", "content": "Uh, qué mala suerte Matias. No te preocupes, tienen garantía oficial de HyperX. Te derivo con un agente para gestionar el cambio directo.", "sent_at": "2025-05-20T10:05:00Z" },

  { "conversation_id": "a1b2c3d4-0011-4000-a000-000000000011", "direction": "inbound", "sender_type": "buyer", "content": "Ya lo despacharon? Lo necesito para un torneo.", "sent_at": "2025-06-01T16:00:00Z" },
  { "conversation_id": "a1b2c3d4-0011-4000-a000-000000000011", "direction": "outbound", "sender_type": "ai", "content": "Hola Julian. Sí, sale mañana a primera hora. ¡Mucha suerte en el torneo!", "sent_at": "2025-06-01T16:05:00Z" },

  { "conversation_id": "a1b2c3d4-0012-4000-a000-000000000012", "direction": "inbound", "sender_type": "buyer", "content": "Necesitamos factura A a nombre de la empresa.", "sent_at": "2025-06-08T11:10:00Z" },
  { "conversation_id": "a1b2c3d4-0012-4000-a000-000000000012", "direction": "outbound", "sender_type": "ai", "content": "Recibido. Se emitirá Factura A al CUIT informado en la orden de compra.", "sent_at": "2025-06-08T11:12:00Z" },

  { "conversation_id": "a1b2c3d4-0013-4000-a000-000000000013", "direction": "inbound", "sender_type": "buyer", "content": "Al final no lo quiero, cancelen.", "sent_at": "2025-07-01T14:05:00Z" },
  { "conversation_id": "a1b2c3d4-0013-4000-a000-000000000013", "direction": "outbound", "sender_type": "ai", "content": "Entendido Pedro. Procesando la cancelación. El dinero se acreditará en tu cuenta en 48hs.", "sent_at": "2025-07-01T14:06:00Z" },

  { "conversation_id": "a1b2c3d4-0014-4000-a000-000000000014", "direction": "inbound", "sender_type": "buyer", "content": "Hola, viene bien protegido? Es un monitor curvo y me da miedo el viaje.", "sent_at": "2025-07-14T10:00:00Z" },
  { "conversation_id": "a1b2c3d4-0014-4000-a000-000000000014", "direction": "outbound", "sender_type": "ai", "content": "Hola Ana, quédate tranquila. Los embalamos con doble caja y pluribol y cinta de frágil. Llega perfecto.", "sent_at": "2025-07-14T10:02:00Z" },

  { "conversation_id": "a1b2c3d4-0015-4000-a000-000000000015", "direction": "inbound", "sender_type": "buyer", "content": "Tenés stock de 3 unidades?", "sent_at": "2025-07-31T15:05:00Z" },
  { "conversation_id": "a1b2c3d4-0015-4000-a000-000000000015", "direction": "outbound", "sender_type": "ai", "content": "Hola. Sí, tenemos stock de sobra de los pads XL.", "sent_at": "2025-07-31T15:06:00Z" },

  { "conversation_id": "a1b2c3d4-0016-4000-a000-000000000016", "direction": "inbound", "sender_type": "buyer", "content": "Che, mandenme la factura por mail porfa.", "sent_at": "2025-08-12T10:30:00Z" },
  { "conversation_id": "a1b2c3d4-0016-4000-a000-000000000016", "direction": "outbound", "sender_type": "ai", "content": "Hola Martin, ya te la envié al mail registrado. Revisá spam por las dudas.", "sent_at": "2025-08-12T10:35:00Z" },

  { "conversation_id": "a1b2c3d4-0017-4000-a000-000000000017", "direction": "inbound", "sender_type": "buyer", "content": "El joystick vino con drift en el stick derecho.", "sent_at": "2025-09-05T09:00:00Z" },
  { "conversation_id": "a1b2c3d4-0017-4000-a000-000000000017", "direction": "outbound", "sender_type": "ai", "content": "Hola Gonzalo, qué macana. Te paso con soporte técnico para iniciar el RMA directamente con Microsoft o el cambio con nosotros.", "sent_at": "2025-09-05T09:05:00Z" },

  { "conversation_id": "a1b2c3d4-0018-4000-a000-000000000018", "direction": "inbound", "sender_type": "buyer", "content": "La cámara no enfoca bien, se ve borroso.", "sent_at": "2025-09-13T10:00:00Z" },
  { "conversation_id": "a1b2c3d4-0018-4000-a000-000000000018", "direction": "outbound", "sender_type": "ai", "content": "Hola Marta. Probaste instalando el software Logitech G Hub? A veces es un tema de configuración.", "sent_at": "2025-09-13T10:02:00Z" },

  { "conversation_id": "a1b2c3d4-0019-4000-a000-000000000019", "direction": "inbound", "sender_type": "buyer", "content": "Cuándo llega a Mendoza?", "sent_at": "2025-10-02T12:00:00Z" },
  { "conversation_id": "a1b2c3d4-0019-4000-a000-000000000019", "direction": "outbound", "sender_type": "ai", "content": "Hola Lucas. El sistema dice que llega entre el 6 y el 8 de Octubre.", "sent_at": "2025-10-02T12:05:00Z" },

  { "conversation_id": "a1b2c3d4-0020-4000-a000-000000000020", "direction": "inbound", "sender_type": "buyer", "content": "Hola, viene con Windows instalado?", "sent_at": "2025-10-12T18:10:00Z" },
  { "conversation_id": "a1b2c3d4-0020-4000-a000-000000000020", "direction": "outbound", "sender_type": "ai", "content": "Hola Camila. Este modelo viene con Windows 11 Home original preinstalado, lista para usar.", "sent_at": "2025-10-12T18:12:00Z" },

  { "conversation_id": "a1b2c3d4-0021-4000-a000-000000000021", "direction": "inbound", "sender_type": "buyer", "content": "Factura A por favor.", "sent_at": "2025-11-01T10:05:00Z" },
  { "conversation_id": "a1b2c3d4-0021-4000-a000-000000000021", "direction": "outbound", "sender_type": "ai", "content": "Listo Nico, generada y enviada.", "sent_at": "2025-11-01T10:06:00Z" },

  { "conversation_id": "a1b2c3d4-0022-4000-a000-000000000022", "direction": "inbound", "sender_type": "buyer", "content": "Sirve para la Play 5 no?", "sent_at": "2025-11-04T12:10:00Z" },
  { "conversation_id": "a1b2c3d4-0022-4000-a000-000000000022", "direction": "outbound", "sender_type": "ai", "content": "Hola Enzo. Sí, el WD Black SN850X es totalmente compatible y recomendado para PS5.", "sent_at": "2025-11-04T12:12:00Z" },

  { "conversation_id": "a1b2c3d4-0023-4000-a000-000000000023", "direction": "inbound", "sender_type": "buyer", "content": "Una tecla vino salida, la puedo poner yo o lo devuelvo?", "sent_at": "2025-11-12T15:00:00Z" },
  { "conversation_id": "a1b2c3d4-0023-4000-a000-000000000023", "direction": "outbound", "sender_type": "ai", "content": "Hola Pablo. Si solo se salió el keycap, podés presionarlo suavemente para encajarlo. Si el switch está roto, avisame y gestionamos el cambio.", "sent_at": "2025-11-12T15:05:00Z" },

  { "conversation_id": "a1b2c3d4-0024-4000-a000-000000000024", "direction": "inbound", "sender_type": "buyer", "content": "Cancelame la compra please.", "sent_at": "2025-11-20T17:10:00Z" },
  { "conversation_id": "a1b2c3d4-0024-4000-a000-000000000024", "direction": "outbound", "sender_type": "ai", "content": "Dale Maria, cancelada. Saludos.", "sent_at": "2025-11-20T17:11:00Z" },

  { "conversation_id": "a1b2c3d4-0025-4000-a000-000000000025", "direction": "inbound", "sender_type": "buyer", "content": "Llega a Pujato?", "sent_at": "2025-11-28T10:05:00Z" },
  { "conversation_id": "a1b2c3d4-0025-4000-a000-000000000025", "direction": "outbound", "sender_type": "ai", "content": "Hola Lio. Sí, llega perfecto por Andreani a Pujato.", "sent_at": "2025-11-28T10:07:00Z" },

  { "conversation_id": "a1b2c3d4-0026-4000-a000-000000000026", "direction": "inbound", "sender_type": "buyer", "content": "Llega antes del 24??? Es para el arbolito.", "sent_at": "2025-12-15T12:10:00Z" },
  { "conversation_id": "a1b2c3d4-0026-4000-a000-000000000026", "direction": "outbound", "sender_type": "ai", "content": "A Ushuaia suele tardar un poco más, pero si despachamos hoy debería llegar justo para Navidad.", "sent_at": "2025-12-15T12:15:00Z" },

  { "conversation_id": "a1b2c3d4-0027-4000-a000-000000000027", "direction": "inbound", "sender_type": "buyer", "content": "La batería no dura nada, me dijeron que duraba 5 horas.", "sent_at": "2025-12-22T10:00:00Z" },
  { "conversation_id": "a1b2c3d4-0027-4000-a000-000000000027", "direction": "outbound", "sender_type": "ai", "content": "Hola Florencia. Jugando suele durar menos, las 5 horas son en uso de oficina/video. Fijate si no tenés el modo 'Alto Rendimiento' activado todo el tiempo.", "sent_at": "2025-12-22T10:05:00Z" },

  { "conversation_id": "a1b2c3d4-0028-4000-a000-000000000028", "direction": "inbound", "sender_type": "buyer", "content": "Los drivers de Intel crashean con este juego.", "sent_at": "2025-12-28T15:00:00Z" },
  { "conversation_id": "a1b2c3d4-0028-4000-a000-000000000028", "direction": "outbound", "sender_type": "ai", "content": "Hola Ricardo. Sí, Intel sacó un update ayer que arregla eso. Descargá los drivers 4099 desde la web de ARC.", "sent_at": "2025-12-28T15:05:00Z" },

  { "conversation_id": "a1b2c3d4-0029-4000-a000-000000000029", "direction": "inbound", "sender_type": "buyer", "content": "Hola, tenés stock para retirar hoy?", "sent_at": "2025-12-30T20:05:00Z" },
  { "conversation_id": "a1b2c3d4-0029-4000-a000-000000000029", "direction": "outbound", "sender_type": "ai", "content": "Hola Diego. Ya cerramos el local por hoy, pero podés retirar el 2 de Enero.", "sent_at": "2025-12-30T20:06:00Z" },

  { "conversation_id": "a1b2c3d4-0030-4000-a000-000000000030", "direction": "inbound", "sender_type": "buyer", "content": "Hola mi amor! Ya me llegó la placa, divina!", "sent_at": "2025-12-30T15:00:00Z" },
  { "conversation_id": "a1b2c3d4-0030-4000-a000-000000000030", "direction": "outbound", "sender_type": "ai", "content": "¡Buenísimo Susana! Que la disfrutes mucho. ¡Feliz año!", "sent_at": "2025-12-30T15:05:00Z" }
]
```