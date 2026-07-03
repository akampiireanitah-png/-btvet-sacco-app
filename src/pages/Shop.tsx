import { useState, useMemo } from 'react';
import { Search, ShoppingCart, Star, X, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, getCategoryLabel, getCategoryColor, cn } from '../lib/utils';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import EmptyState from '../components/ui/EmptyState';

const categories = [
  { value: 'all', label: 'All Products' },
  { value: 'school_supplies', label: 'School Supplies' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'household', label: 'Household' },
  { value: 'office', label: 'Office' },
];

export default function Shop() {
  const { products, addToCart } = useStore();
  const { toasts, addToast, removeToast } = useToast();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }
    switch (sortBy) {
      case 'price_low': result.sort((a, b) => a.price - b.price); break;
      case 'price_high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return result;
  }, [products, search, category, sortBy]);

  const handleAddToCart = (productId: string, name: string) => {
    addToCart(productId);
    addToast('success', `${name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Shop Products</h1>
          <p className="text-slate-500 text-sm">Browse our catalog of quality goods at SACCO member prices.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="featured">Featured First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name: A to Z</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        <div className="flex gap-6">
          {/* Category Sidebar */}
          <aside className={cn(
            "w-56 flex-shrink-0",
            showFilters ? "fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent lg:z-auto" : "hidden lg:block"
          )}>
            <div className={cn(
              "bg-white rounded-xl p-4 sticky top-20",
              showFilters && "absolute right-0 top-0 bottom-0 w-72 h-full rounded-none lg:relative lg:rounded-xl lg:w-full lg:h-auto"
            )}>
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilters(false)}><X size={20} /></button>
              </div>
              <h3 className="font-semibold text-slate-900 mb-3 hidden lg:block">Categories</h3>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => { setCategory(cat.value); setShowFilters(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      category === cat.value
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {cat.label}
                    <span className="float-right text-xs text-slate-400">
                      {cat.value === 'all' ? products.length : products.filter(p => p.category === cat.value).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-slate-500 mb-4">
              Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={<Search size={28} />}
                title="No products found"
                description="Try adjusting your search or filters to find what you're looking for."
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map(product => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all flex flex-col"
                  >
                    <div className="aspect-square overflow-hidden bg-slate-100 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {product.featured && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-accent-500 text-white text-xs font-bold rounded-full">
                          Featured
                        </span>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <span className={cn('inline-block self-start text-xs px-2 py-0.5 rounded-full mb-1.5', getCategoryColor(product.category))}>
                        {getCategoryLabel(product.category)}
                      </span>
                      <h3 className="font-medium text-sm text-slate-900 line-clamp-2 mb-1 flex-1">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs text-slate-500">{product.rating} ({product.reviews})</span>
                        <span className="text-xs text-slate-300 ml-auto">{product.stock} in stock</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-auto">
                        <span className="font-bold text-brand-600 text-sm">{formatCurrency(product.price)}</span>
                        <button
                          onClick={() => handleAddToCart(product.id, product.name)}
                          disabled={product.stock === 0}
                          className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
