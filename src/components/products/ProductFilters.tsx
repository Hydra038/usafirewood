'use client';

interface ProductFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>;
  woodTypes: string[];
  selectedCategory?: string;
  selectedWood?: string;
}

export default function ProductFilters({
  categories,
  woodTypes,
  selectedCategory,
  selectedWood,
}: ProductFiltersProps) {
  const handleCategoryChange = (value: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = value ? `/products?category=${value}` : '/products';
    }
  };

  const handleWoodChange = (value: string) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      if (value) params.set('wood', value);
      window.location.href = params.toString() ? `/products?${params.toString()}` : '/products';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="">All Products</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Wood Type Filter */}
        <div>
          <label htmlFor="wood" className="block text-sm font-semibold text-gray-700 mb-2">
            Wood Type
          </label>
          <select
            id="wood"
            value={selectedWood || ''}
            onChange={(e) => handleWoodChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="">All Wood Types</option>
            {woodTypes.map((woodType) => (
              <option key={woodType} value={woodType}>
                {woodType}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
