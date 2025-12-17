interface SidebarProps {
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  freeShippingOnly: boolean;
  onFreeShippingChange: (value: boolean) => void;
  totalResults: number;
}

export default function Sidebar({
  brands,
  selectedBrand,
  onBrandChange,
  freeShippingOnly,
  onFreeShippingChange,
  totalResults,
}: SidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
      {/* Results Count */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          {totalResults.toLocaleString()}
        </h3>
        <p className="text-sm text-gray-600">
          resultado{totalResults !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Free Shipping Filter */}
      <div className="mb-6 pb-6 border-b">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={freeShippingOnly}
            onChange={(e) => onFreeShippingChange(e.target.checked)}
            className="w-5 h-5 text-ml-blue border-gray-300 rounded focus:ring-ml-blue focus:ring-2 cursor-pointer"
          />
          <div className="ml-3 flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 group-hover:text-ml-blue">
              Envío gratis
            </span>
          </div>
        </label>
      </div>

      {/* Brands Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Marca</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {/* All brands option */}
          <button
            onClick={() => onBrandChange('')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedBrand === ''
                ? 'bg-blue-50 text-ml-blue font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todas las marcas
          </button>

          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => onBrandChange(brand === selectedBrand ? '' : brand)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedBrand === brand
                  ? 'bg-blue-50 text-ml-blue font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedBrand || freeShippingOnly) && (
        <button
          onClick={() => {
            onBrandChange('');
            onFreeShippingChange(false);
          }}
          className="w-full mt-4 text-sm text-ml-blue hover:text-blue-600 font-medium"
        >
          Borrar filtros
        </button>
      )}
    </div>
  );
}
