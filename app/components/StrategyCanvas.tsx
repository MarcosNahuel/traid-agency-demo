'use client';

import { useState, useEffect, useCallback } from 'react';

// Types
interface Strategy {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  hidden?: boolean; // Nueva propiedad para ocultar sin eliminar
  example: {
    cliente: string;
    agente: string;
  };
}

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAILp5OTUpaixm4MtoCHuXZEtHTSLtvzPk';
const GEMINI_MODEL = 'gemini-2.5-flash';

// Initial Strategies - MarIA S.A. Gaming Demo
const initialStrategies: Strategy[] = [
  {
    id: 'cross-selling-pc',
    title: 'Cross-Selling: PC Gamer + Perifericos',
    icon: '🎮',
    color: 'green',
    description: 'COMBO MAS VENDIDO: El PC Gamer Pro + Kit Periferico (teclado + mouse + auriculares). El PC viene SIN perifericos. SIEMPRE ofrecer el combo. Precio combo: ~$950.000. Destacar que los perifericos son RGB y compatibles.',
    example: {
      cliente: 'Hola quiero la PC gamer para mi hijo',
      agente: 'Hola! El PC Gamer Pro RTX 4070 es excelente para gaming. Te aviso que viene sin perifericos. Te recomiendo llevarlo con el kit gamer RGB (teclado mecanico + mouse + auriculares) por $85.000 extra, asi tu hijo puede empezar a jugar de inmediato. El combo te queda en $935.000 con envio gratis. Lo agrego al carrito?'
    }
  },
  {
    id: 'cross-selling-monitor',
    title: 'Cross-Selling: Monitor + Soporte VESA',
    icon: '🖥️',
    color: 'green',
    description: 'Los clientes que compran monitor gaming suelen necesitar soporte VESA para mejor ergonomia. El combo Monitor 144Hz + Soporte se vende frecuentemente. Precio combo: ~$280.000. Mencionar que libera espacio en el escritorio.',
    example: {
      cliente: 'Necesito un monitor para gaming',
      agente: 'Para gaming te recomiendo nuestro monitor 27" 144Hz. Muchos clientes lo llevan con el soporte VESA porque libera espacio en el escritorio y permite ajustar altura y angulo. El combo te sale $278.000. Te armo el pack?'
    }
  },
  {
    id: 'upselling-gpu',
    title: 'Up-Selling: GPUs RTX (escala 4060 -> 4090)',
    icon: '📈',
    color: 'blue',
    description: 'Escala de productos: RTX 4060 ($380k) -> RTX 4070 ($520k) -> RTX 4070 Ti ($680k) -> RTX 4080 ($950k) -> RTX 4090 ($1.8M). La 4070 es el sweet spot precio/rendimiento. Destacar DLSS 3 y Ray Tracing.',
    example: {
      cliente: 'Cuanto sale la RTX 4060?',
      agente: 'La RTX 4060 esta $380.000. Pero te cuento: la RTX 4070 a $520.000 te conviene mas porque tiene 40% mas rendimiento y mejor para juegos AAA a 1440p. La diferencia de $140k la recuperas en durabilidad y no tener que upgradear pronto. Cual te sirve mejor?'
    }
  },
  {
    id: 'upselling-sillas',
    title: 'Up-Selling: Sillas Gaming (Revenue alto)',
    icon: '🪑',
    color: 'blue',
    description: 'Las sillas gaming son productos de alto ticket ($180k-$350k). Top modelos: Racing Pro ($180k), Ergonomica Pro ($280k), Premium 4D ($350k). Destacar: soporte lumbar, apoyabrazos ajustables, reclinable. Preguntar uso diario.',
    example: {
      cliente: 'Tienen sillas gaming?',
      agente: 'Si! Tenemos sillas gaming de todas las gamas. La Racing Pro a $180k es ideal para sesiones de 4-5 horas. Si pasas mas tiempo, la Ergonomica Pro a $280k tiene mejor soporte lumbar y apoyabrazos 4D. Cuantas horas al dia estarias sentado?'
    }
  },
  {
    id: 'compatibilidad-specs',
    title: 'Compatibilidad Hardware (SIEMPRE verificar)',
    icon: '🔧',
    color: 'purple',
    description: 'REGLA DE ORO: NUNCA confirmar compatibilidad sin: 1) Modelo de motherboard, 2) Fuente de alimentacion (watts), 3) Espacio en gabinete. Error de compatibilidad = devolucion y calificacion negativa. Verificar socket CPU y slots RAM.',
    example: {
      cliente: 'Esta RAM sirve para mi PC?',
      agente: 'Para confirmarte necesito mas datos: 1) Modelo de tu motherboard, 2) Tipo de RAM actual (DDR4 o DDR5?), 3) Cuantos slots tenes disponibles. Con eso te digo 100% si es compatible. Pasame los datos!'
    }
  },
  {
    id: 'objeciones-calidad',
    title: 'Objeciones: Calidad vs Precio',
    icon: '🛡️',
    color: 'orange',
    description: 'Nuestros productos tienen garantia oficial del fabricante. IMPORTANTE: La garantia depende del producto publicado - verificar campo "warranty". Si preguntan por mas baratos, explicar que productos sin garantia salen caros a la larga.',
    example: {
      cliente: 'Vi la misma GPU mas barata en otra publicacion',
      agente: 'Te entiendo! La diferencia es que nosotros vendemos con garantia oficial del fabricante. Las mas baratas suelen ser importadas sin garantia local, si fallan perdiste todo. La garantia depende del producto, te la confirmo si me decis cual te interesa.'
    }
  },
  {
    id: 'urgencia-stock',
    title: 'Cierre: Urgencia y Stock',
    icon: '⚡',
    color: 'pink',
    description: 'Usar datos reales de stock para crear urgencia. Ejemplos: RTX 4070 (stock limitado), PC Gamer Pro (ultimas unidades). Mencionar que productos gaming se agotan rapido por demanda. No inventar numeros falsos.',
    example: {
      cliente: 'Despues lo compro, ahora no puedo',
      agente: 'Dale, sin problema! Te aviso que las RTX 4070 tienen stock limitado y cuando llegan se van rapido. Si cuando vuelvas no hay, te aviso cuando llegue. O si queres, agregalo al carrito y lo pagas cuando puedas. Cualquier cosa me escribis!'
    }
  },
  {
    id: 'postventa-fidelizacion',
    title: 'Post-Venta: Fidelizacion',
    icon: '💬',
    color: 'cyan',
    description: 'Post-entrega: preguntar si llego bien, ofrecer ayuda con instalacion/configuracion. IMPORTANTE: Solo mencionar garantia si el producto la tiene (verificar campo warranty). Ofrecer upgrades futuros y accesorios complementarios.',
    example: {
      cliente: 'Ya me llego la placa de video, gracias!',
      agente: 'Genial que llego! Si necesitas ayuda con la instalacion o configuracion de drivers, avisme que te paso guia. Y si mas adelante necesitas upgrade de RAM o SSD, avisme que te hago precio por ser cliente. Gracias por elegirnos!'
    }
  }
];

// AI Button Component
function AIButton({ onClick, loading, small = false }: { onClick: () => void; loading: boolean; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center justify-center rounded-lg transition-all ${
        loading
          ? 'bg-purple-900/50 text-purple-300 cursor-wait'
          : 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 hover:text-purple-300'
      } ${small ? 'w-8 h-8' : 'px-3 py-1.5 gap-1.5'}`}
      title="Mejorar con IA"
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          {!small && <span className="text-xs font-medium">IA</span>}
        </>
      )}
    </button>
  );
}

// Editable Field Component
function EditableField({
  label,
  value,
  onChange,
  onAIImprove,
  aiLoading,
  rows = 3,
  labelColor = 'text-gray-400'
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onAIImprove: () => void;
  aiLoading: boolean;
  rows?: number;
  labelColor?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className={`text-xs font-medium uppercase tracking-wide ${labelColor}`}>{label}</label>
        <AIButton onClick={onAIImprove} loading={aiLoading} small />
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200
                   focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none
                   placeholder-gray-500 transition-colors"
        placeholder={`Escribe ${label.toLowerCase()}...`}
      />
    </div>
  );
}

// Strategy Card Component for Canvas
function StrategyCard({
  strategy,
  index,
  onUpdate,
  onDelete,
  onToggleHidden,
  onAIImprove,
  aiLoadingField,
  isExpanded,
  onToggleExpand
}: {
  strategy: Strategy;
  index: number;
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onAIImprove: (id: string, field: 'description' | 'cliente' | 'agente') => void;
  aiLoadingField: string | null;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const isHidden = strategy.hidden === true;
  const borderColors: Record<string, string> = {
    green: 'border-l-green-500',
    blue: 'border-l-blue-500',
    purple: 'border-l-purple-500',
    orange: 'border-l-orange-500',
    pink: 'border-l-pink-500',
    cyan: 'border-l-cyan-500',
  };

  const bgColors: Record<string, string> = {
    green: 'bg-green-500/5',
    blue: 'bg-blue-500/5',
    purple: 'bg-purple-500/5',
    orange: 'bg-orange-500/5',
    pink: 'bg-pink-500/5',
    cyan: 'bg-cyan-500/5',
  };

  return (
    <div className={`rounded-lg border border-l-4 overflow-hidden transition-all ${
      isHidden
        ? 'border-gray-700 border-l-gray-600 bg-gray-800/30 opacity-50'
        : `border-gray-700 ${borderColors[strategy.color]} ${bgColors[strategy.color]}`
    }`}>
      {/* Header - Always visible */}
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
          isHidden ? 'hover:bg-gray-700/30' : 'hover:bg-gray-800/30'
        }`}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3">
          <span className={`text-xl ${isHidden ? 'grayscale' : ''}`}>{strategy.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">#{index + 1}</span>
              {isHidden && (
                <span className="text-xs bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded">OCULTA</span>
              )}
            </div>
            <h3 className={`text-sm font-semibold ${isHidden ? 'text-gray-400' : 'text-white'}`}>{strategy.title}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Boton Ojo - Toggle Visibilidad */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleHidden(strategy.id); }}
            className={`p-1.5 rounded transition-colors ${
              isHidden
                ? 'text-gray-500 hover:text-blue-400 hover:bg-blue-500/10'
                : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-500/10'
            }`}
            title={isHidden ? 'Mostrar estrategia (incluir en prompt)' : 'Ocultar estrategia (excluir del prompt)'}
          >
            {isHidden ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
          {/* Boton Eliminar - Para TODAS las estrategias */}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(strategy.id); }}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
            title="Eliminar estrategia"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-700/50">
          {/* Title Edit */}
          <div className="pt-4">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-400">Titulo</label>
            <input
              type="text"
              value={strategy.title}
              onChange={(e) => onUpdate(strategy.id, 'title', e.target.value)}
              className="w-full mt-1.5 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white
                       focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <EditableField
            label="Estrategia"
            value={strategy.description}
            onChange={(value) => onUpdate(strategy.id, 'description', value)}
            onAIImprove={() => onAIImprove(strategy.id, 'description')}
            aiLoading={aiLoadingField === `${strategy.id}-description`}
            rows={3}
          />

          {/* Example Section */}
          <div className="bg-gray-900/30 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-purple-400 uppercase tracking-wide">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Ejemplo de Conversacion (Few-Shot)
            </div>

            <EditableField
              label="Cliente dice"
              value={strategy.example.cliente}
              onChange={(value) => onUpdate(strategy.id, 'example.cliente', value)}
              onAIImprove={() => onAIImprove(strategy.id, 'cliente')}
              aiLoading={aiLoadingField === `${strategy.id}-cliente`}
              rows={2}
              labelColor="text-blue-400"
            />

            <EditableField
              label="Agente responde"
              value={strategy.example.agente}
              onChange={(value) => onUpdate(strategy.id, 'example.agente', value)}
              onAIImprove={() => onAIImprove(strategy.id, 'agente')}
              aiLoading={aiLoadingField === `${strategy.id}-agente`}
              rows={4}
              labelColor="text-green-400"
            />
          </div>

          {/* Icon & Color Selector */}
          <div className="flex gap-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gray-400">Icono</label>
              <select
                value={strategy.icon}
                onChange={(e) => onUpdate(strategy.id, 'icon', e.target.value)}
                className="mt-1.5 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-xl
                         focus:border-purple-500 outline-none cursor-pointer"
              >
                {['🎮', '🖥️', '📈', '🪑', '🔧', '🛡️', '⚡', '💬', '💡', '🚀', '✨', '📌', '🎁', '💰'].map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-gray-400">Color</label>
              <div className="flex gap-1.5 mt-1.5">
                {['green', 'blue', 'purple', 'orange', 'pink', 'cyan'].map(color => (
                  <button
                    key={color}
                    onClick={() => onUpdate(strategy.id, 'color', color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      strategy.color === color ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    } ${
                      color === 'green' ? 'bg-green-500' :
                      color === 'blue' ? 'bg-blue-500' :
                      color === 'purple' ? 'bg-purple-500' :
                      color === 'orange' ? 'bg-orange-500' :
                      color === 'pink' ? 'bg-pink-500' : 'bg-cyan-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Canvas Component
export default function StrategyCanvas() {
  // Saved state (persisted)
  const [savedStrategies, setSavedStrategies] = useState<Strategy[]>(initialStrategies);
  // Draft state (editable, not persisted until save)
  const [draftStrategies, setDraftStrategies] = useState<Strategy[]>(initialStrategies);
  // Track which strategies are expanded
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  // AI loading state
  const [aiLoadingField, setAiLoadingField] = useState<string | null>(null);
  // UI states
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStrategy, setNewStrategy] = useState({
    title: '',
    icon: '📌',
    color: 'blue'
  });

  // Check if there are unsaved changes
  const hasChanges = JSON.stringify(savedStrategies) !== JSON.stringify(draftStrategies);

  // Load saved strategies from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('maria-sa-strategies');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedStrategies(parsed);
      setDraftStrategies(parsed);
    }
  }, []);

  // Generate System Prompt from draft strategies
  const generateSystemPrompt = useCallback(() => {
    let prompt = `# ESTRATEGIAS DE VENTA - AGENTE MarIA S.A.

Eres un agente de ventas experto de MarIA S.A. en MercadoLibre Argentina. Tu objetivo es ayudar a los clientes y maximizar las ventas siguiendo estas estrategias:

`;

    // Filtrar estrategias ocultas - NO se incluyen en el prompt
    const visibleStrategies = draftStrategies.filter(s => !s.hidden);

    visibleStrategies.forEach((s, i) => {
      prompt += `## ${i + 1}. ${s.title}

${s.description}

### Ejemplo de conversacion:
CLIENTE: "${s.example.cliente}"
AGENTE: "${s.example.agente}"

---

`;
    });

    prompt += `
# REGLAS GENERALES

1. Siempre usa tono profesional pero amigable (sin "che" ni modismos exagerados)
2. Nunca inventes informacion sobre productos - usa datos del catalogo
3. Si no sabes algo, deriva a soporte humano
4. Incluye siempre un call-to-action claro en tus respuestas
5. GARANTIA: Usar SOLO el dato del campo "warranty" del producto. Si dice "Sin garantia", NO mencionar garantia. NUNCA inventar plazos.
6. Para compatibilidad, SIEMPRE pide specs del equipo ANTES de confirmar

# DATOS CLAVE - MarIA S.A. Gaming
- Especialidad: PC Gaming, Componentes, Perifericos
- Canales: MercadoLibre, Shopify, TiendaNube
- Ticket promedio: $72,000
- Productos destacados: PCs armadas, GPUs, Monitores 144Hz+
- Garantia: Varia por producto (verificar campo warranty)

# TOP PRODUCTOS POR REVENUE
1. PC Gamer Pro RTX 4070: $850,000
2. MacBook Air M3: $1,200,000
3. Monitor Gaming 27" 144Hz: $195,000
4. Silla Gaming Premium: $280,000
5. RTX 4070 Super: $520,000

# CATEGORIAS
- PCs Gaming (35% ventas)
- GPUs/Placas de Video (25%)
- Notebooks (15%)
- Monitores (10%)
- Perifericos (8%)
- Sillas Gaming (4%)
- Componentes varios (3%)
`;

    return prompt;
  }, [draftStrategies]);

  // Update draft strategy
  const handleUpdate = (id: string, field: string, value: string) => {
    setDraftStrategies(prev => prev.map(s => {
      if (s.id !== id) return s;

      if (field === 'title') return { ...s, title: value };
      if (field === 'description') return { ...s, description: value };
      if (field === 'icon') return { ...s, icon: value };
      if (field === 'color') return { ...s, color: value };
      if (field === 'example.cliente') return { ...s, example: { ...s.example, cliente: value } };
      if (field === 'example.agente') return { ...s, example: { ...s.example, agente: value } };

      return s;
    }));
  };

  // Delete strategy
  const handleDelete = (id: string) => {
    if (confirm('Estas seguro de eliminar esta estrategia?')) {
      setDraftStrategies(prev => prev.filter(s => s.id !== id));
    }
  };

  // Toggle hidden state
  const handleToggleHidden = (id: string) => {
    setDraftStrategies(prev => prev.map(s => {
      if (s.id !== id) return s;
      return { ...s, hidden: !s.hidden };
    }));
  };

  // Toggle expand
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand all / Collapse all
  const expandAll = () => setExpandedIds(new Set(draftStrategies.map(s => s.id)));
  const collapseAll = () => setExpandedIds(new Set());

  // AI Improve
  const handleAIImprove = async (id: string, field: 'description' | 'cliente' | 'agente') => {
    setAiLoadingField(`${id}-${field}`);

    const strategy = draftStrategies.find(s => s.id === id);
    if (!strategy) return;

    const textToImprove = field === 'description'
      ? strategy.description
      : strategy.example[field];

    const prompts: Record<string, string> = {
      description: `Eres un experto en ventas de ecommerce para MercadoLibre Argentina. Mejora la siguiente estrategia de ventas para un agente de atencion al cliente de MarIA S.A. (tienda de gaming y tecnologia). Hazla mas clara, persuasiva y accionable. Usa un tono profesional y directo, sin modismos exagerados como "che" o jerga innecesaria. No uses emojis. Maximo 3 oraciones.

Estrategia actual: "${textToImprove}"

Responde SOLO con el texto mejorado, sin explicaciones adicionales.`,
      cliente: `Eres un cliente tipico de MercadoLibre Argentina interesado en gaming. Reescribe este mensaje de cliente haciendolo mas realista y natural. Puede incluir errores tipicos de escritura casual pero sin exagerar modismos. Maximo 2 oraciones.

Mensaje actual: "${textToImprove}"

Responde SOLO con el mensaje del cliente mejorado, sin comillas ni explicaciones.`,
      agente: `Eres un experto en ventas de MarIA S.A. (tienda de gaming y tecnologia en MercadoLibre Argentina). Mejora esta respuesta del agente haciendola mas persuasiva, empatica y orientada a la venta. Usa un tono profesional y amigable, sin modismos exagerados como "che". Incluye un call-to-action claro. No uses emojis. Maximo 4 oraciones.

Respuesta actual: "${textToImprove}"

Contexto de la estrategia: ${strategy.title}

Responde SOLO con la respuesta mejorada del agente, sin comillas ni explicaciones.`
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompts[field] }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
          })
        }
      );

      const data = await response.json();

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const improvedText = data.candidates[0].content.parts[0].text.trim();
        const updateField = field === 'description' ? 'description' : `example.${field}`;
        handleUpdate(id, updateField, improvedText);
      } else {
        alert('Error al procesar la respuesta de IA. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error calling Gemini:', error);
      alert('Error al conectar con Gemini.');
    } finally {
      setAiLoadingField(null);
    }
  };

  // Save changes
  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('maria-sa-strategies', JSON.stringify(draftStrategies));
      setSavedStrategies(draftStrategies);

      // Save to server for n8n
      const prompt = generateSystemPrompt();
      await fetch('/api/system-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, strategies: draftStrategies })
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error al guardar');
    } finally {
      setSaveLoading(false);
    }
  };

  // Discard changes
  const handleDiscard = () => {
    if (confirm('Descartar todos los cambios sin guardar?')) {
      setDraftStrategies(savedStrategies);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generateSystemPrompt());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Add new strategy
  const handleAddStrategy = () => {
    if (!newStrategy.title.trim()) {
      alert('Ingresa un titulo para la estrategia');
      return;
    }

    const strategy: Strategy = {
      id: `custom-${Date.now()}`,
      title: newStrategy.title,
      icon: newStrategy.icon,
      color: newStrategy.color,
      description: 'Describe aqui la estrategia de venta...',
      example: {
        cliente: 'Mensaje del cliente...',
        agente: 'Respuesta del agente...'
      }
    };

    setDraftStrategies(prev => [...prev, strategy]);
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.add(strategy.id);
      return next;
    });
    setNewStrategy({ title: '', icon: '📌', color: 'blue' });
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Panel - Canvas */}
      <div className="flex-1 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🎨</span> Canvas de Estrategias
              <span className="text-xs font-normal bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                {draftStrategies.filter(s => !s.hidden).length}/{draftStrategies.length} activas
              </span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Edita las estrategias directamente. Los cambios no se guardan hasta que presiones Guardar.
              {draftStrategies.some(s => s.hidden) && (
                <span className="text-yellow-400 ml-1">(Las ocultas no se envian a n8n)</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              Expandir todo
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              Colapsar todo
            </button>
          </div>
        </div>

        {/* API Endpoint Banner */}
        <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-lg">🔗</span>
            <div>
              <span className="text-xs text-gray-400 font-medium">Endpoint para n8n</span>
              <p className="text-sm text-blue-400 font-mono">/api/system-prompt</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const url = `${window.location.origin}/api/system-prompt`;
                navigator.clipboard.writeText(url);
                setUrlCopied(true);
                setTimeout(() => setUrlCopied(false), 2000);
              }}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                urlCopied
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {urlCopied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copiado!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar URL
                </>
              )}
            </button>
            <a
              href="/api/system-prompt"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver API
            </a>
          </div>
        </div>

        {/* Unsaved Changes Banner */}
        {hasChanges && (
          <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-yellow-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium">Tienes cambios sin guardar</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDiscard}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                Descartar
              </button>
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className="px-4 py-1.5 text-sm font-medium bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saveLoading ? 'Guardando...' : saveSuccess ? 'Guardado!' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        )}

        {/* Strategy Cards */}
        <div className="space-y-3">
          {draftStrategies.map((strategy, index) => (
            <StrategyCard
              key={strategy.id}
              strategy={strategy}
              index={index}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onToggleHidden={handleToggleHidden}
              onAIImprove={handleAIImprove}
              aiLoadingField={aiLoadingField}
              isExpanded={expandedIds.has(strategy.id)}
              onToggleExpand={() => toggleExpand(strategy.id)}
            />
          ))}
        </div>

        {/* Add Strategy Button/Form */}
        {showAddForm ? (
          <div className="border border-dashed border-gray-600 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <select
                value={newStrategy.icon}
                onChange={(e) => setNewStrategy(prev => ({ ...prev, icon: e.target.value }))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-2 text-xl"
              >
                {['📌', '🎮', '🖥️', '📈', '🪑', '🔧', '🛡️', '⚡', '💬', '💡', '🚀', '✨'].map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <input
                type="text"
                value={newStrategy.title}
                onChange={(e) => setNewStrategy(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titulo de la nueva estrategia..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:border-purple-500 outline-none"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {['green', 'blue', 'purple', 'orange', 'pink', 'cyan'].map(color => (
                  <button
                    key={color}
                    onClick={() => setNewStrategy(prev => ({ ...prev, color }))}
                    className={`w-6 h-6 rounded border-2 transition-all ${
                      newStrategy.color === color ? 'border-white scale-110' : 'border-transparent opacity-60'
                    } ${
                      color === 'green' ? 'bg-green-500' :
                      color === 'blue' ? 'bg-blue-500' :
                      color === 'purple' ? 'bg-purple-500' :
                      color === 'orange' ? 'bg-orange-500' :
                      color === 'pink' ? 'bg-pink-500' : 'bg-cyan-500'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddStrategy}
                  className="px-4 py-1.5 text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-lg text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Estrategia
          </button>
        )}
      </div>

      {/* Right Panel - Preview */}
      <div className="lg:w-[400px] xl:w-[480px] flex-shrink-0">
        <div className="sticky top-4 space-y-4">
          {/* Preview Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Preview del System Prompt
            </h3>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                copySuccess
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {copySuccess ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copiado!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar
                </>
              )}
            </button>
          </div>

          {/* Preview Content */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
              {generateSystemPrompt()}
            </pre>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saveLoading || !hasChanges}
            className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              saveSuccess
                ? 'bg-green-600 text-white'
                : saveLoading
                ? 'bg-gray-600 text-gray-300 cursor-wait'
                : hasChanges
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {saveSuccess ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardado!
              </>
            ) : saveLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Guardar y Sincronizar con n8n
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
