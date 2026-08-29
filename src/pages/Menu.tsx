import React, { useState, useEffect } from 'react';
import { Coffee, Search, Loader2, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProductStore } from '../store/productStore';
import { categoryService, CategoryResponse } from '../service/category.service';

export default function Menu() {
  const { products, isLoading, error, total, page, limit, fetchProducts, setPage, clearError } = useProductStore();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  // categories cuma di-fetch sekali, jarang berubah
  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error);
  }, []);

    useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategoryId]);


  const totalPages = Math.max(1, Math.ceil(total / limit));

  // fetch products ke server tiap search/category berubah, di-debounce 400ms
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts({
        categoryId: selectedCategoryId || undefined,
        search: searchQuery || undefined,
      });
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery, selectedCategoryId, fetchProducts]);

  if (isLoading && products.length === 0) {
    return (
      <div id="menu-page" className="min-h-screen py-10 sm:py-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto text-amber-gold animate-spin mb-4" />
          <p className="text-coffee-brown/70 dark:text-warm-sand/70">Loading our brews...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="menu-page" className="min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 id="menu-page-title" className="text-3xl sm:text-5xl font-extrabold text-coffee-brown dark:text-cream-main font-poppins tracking-tight">
            OUR BREWS & BEANS
          </h1>
          <p className="text-xs sm:text-sm text-coffee-brown/70 dark:text-warm-sand/70 leading-relaxed">
            Every bean is sourced responsibly and roasted to unlock its authentic terroir.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400" role="alert">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={() => { clearError(); fetchProducts({ categoryId: selectedCategoryId || undefined, search: searchQuery || undefined }); }}
              className="ml-auto px-3 py-1 text-xs font-semibold hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div id="category-filter-chips" className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCategoryId('')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategoryId === ''
                    ? 'bg-amber-gold text-dark-roasted shadow-md scale-[1.02]'
                    : 'bg-white dark:bg-dark-slate/40 text-coffee-brown dark:text-warm-sand border border-warm-sand/30 dark:border-dark-slate/60 hover:border-amber-gold/50'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategoryId === category.id
                      ? 'bg-amber-gold text-dark-roasted shadow-md scale-[1.02]'
                      : 'bg-white dark:bg-dark-slate/40 text-coffee-brown dark:text-warm-sand border border-warm-sand/30 dark:border-dark-slate/60 hover:border-amber-gold/50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-coffee-brown/40 dark:text-warm-sand/40" />
              <input
                type="text"
                id="menu-search-input"
                placeholder="Search beans, notes, brews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold placeholder:text-coffee-brown/40 dark:placeholder:text-warm-sand/40 shadow-xs"
              />
            </div>
          </div>
        </div>

        {products.length === 0 && !isLoading ? (
          <div id="no-products-found" className="text-center py-16 space-y-3 bg-white dark:bg-dark-slate/20 rounded-3xl border border-warm-sand/30 dark:border-dark-slate/60">
            <Coffee className="w-12 h-12 mx-auto text-coffee-brown/30 dark:text-warm-sand/30" />
            <h3 className="text-base font-bold text-coffee-brown dark:text-cream-main font-poppins">No matching items found</h3>
            <p className="text-xs text-coffee-brown/60 dark:text-warm-sand/60">Try adjusting your category filter or search query.</p>
            <button
              onClick={() => { setSelectedCategoryId(''); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-amber-gold text-dark-roasted text-xs font-semibold tracking-wider uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div id="products-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
                {totalPages > 1 && (
          <div id="pagination" className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded-xl border border-warm-sand/30 dark:border-dark-slate/60 text-xs font-semibold text-coffee-brown dark:text-cream-main disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-xs text-coffee-brown/70 dark:text-warm-sand/70">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-xl border border-warm-sand/30 dark:border-dark-slate/60 text-xs font-semibold text-coffee-brown dark:text-cream-main disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}