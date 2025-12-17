import { Product } from '../page';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

// Función para obtener la imagen desde el permalink de MercadoLibre
function getImageUrl(permalink: string, productId: string): string {
  if (permalink && permalink.includes('mercadolibre')) {
    const mlId = productId.replace('MLA', '').replace('MLA-', '');
    return `https://http2.mlstatic.com/D_NQ_NP_${mlId}-O.webp`;
  }
  return '/placeholder-product.png';
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const imageUrl = getImageUrl(product.Permalink, product.ID);
  const price = parseFloat(product.Precio?.replace(/[^0-9.-]+/g, '') || '0');
  const hasStock = parseInt(product['Stock Disponible'] || '0') > 0;
  const soldCount = parseInt(product['Stock Vendido'] || '0');
  const freeShipping = product['Envío Gratis']?.toLowerCase() === 'si' ||
                       product['Envío Gratis']?.toLowerCase() === 'sí';

  return (
    <div
      onClick={onClick}
      className="product-card bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden cursor-pointer border border-transparent hover:border-gray-300 transition-all"
    >
      <div className="flex p-4 gap-4">
        {/* Image Container - Similar a ML */}
        <div className="relative w-48 h-48 flex-shrink-0 bg-white flex items-center justify-center rounded-lg">
          <img
            src={imageUrl}
            alt={product.Título}
            className="max-h-full max-w-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.png';
            }}
          />
          {!hasStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
              <span className="text-white font-bold text-sm">Sin stock</span>
            </div>
          )}
        </div>

        {/* Product Info - Similar a ML */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-sm text-gray-800 mb-2 line-clamp-2">
            {product.Título}
          </h3>

          {/* Price */}
          <div className="mb-2">
            <span className="text-2xl font-normal text-gray-900">
              $ {price.toLocaleString('es-AR')}
            </span>
          </div>

          {/* Free Shipping Badge */}
          {freeShipping && (
            <div className="flex items-center text-green-600 mb-2">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <span className="text-sm font-medium">Envío gratis</span>
            </div>
          )}

          {/* Brand & Sales Info */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            {product.Marca && (
              <span className="font-medium">{product.Marca}</span>
            )}
            {soldCount > 0 && (
              <span>{soldCount} vendido{soldCount !== 1 ? 's' : ''}</span>
            )}
          </div>

          {/* Stock Info */}
          {hasStock && (
            <div className="text-xs text-gray-500 mb-3">
              <span className="text-green-600 font-medium">Stock disponible</span>
              <span className="ml-2">({product['Stock Disponible']} unidades)</span>
            </div>
          )}

          {/* Product ID */}
          <div className="text-xs text-gray-400 mb-3">
            Código: {product.ID}
          </div>

          {/* Action Button */}
          <button
            className="bg-ml-blue text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors font-medium text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Ver producto y preguntar
          </button>
        </div>
      </div>
    </div>
  );
}
