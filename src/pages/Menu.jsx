import React, { useState } from 'react';
import { Coffee, Filter, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

export default function Menu() {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Single-Origin Beans',
    'Hand-Pour Brews',
    'Espresso-Based',
    'Desserts'
  ];

  // Filter products by category and search term
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="menu-page" className="min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1
            id="menu-page-title"
            className="text-3xl sm:text-5xl font-extrabold text-coffee-brown dark:text-cream-main font-poppins tracking-tight"
          >
            OUR BREWS &amp; BEANS
          </h1>
          <p className="text-xs sm:text-sm text-coffee-brown/70 dark:text-warm-sand/70 leading-relaxed">
            Every bean is sourced responsibly and roasted to unlock its authentic terroir. Enjoy our signature pour-overs or order whole beans for home brewing.
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Filter Chips */}
            <div
              id="category-filter-chips"
              className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  id={`filter-btn-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === category
                      ? 'bg-amber-gold text-dark-roasted shadow-md scale-[1.02]'
                      : 'bg-white dark:bg-dark-slate/40 text-coffee-brown dark:text-warm-sand border border-warm-sand/30 dark:border-dark-slate/60 hover:border-amber-gold/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Input */}
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

        {/* Grid Product Display */}
        {filteredProducts.length === 0 ? (
          <div id="no-products-found" className="text-center py-16 space-y-3 bg-white dark:bg-dark-slate/20 rounded-3xl border border-warm-sand/30 dark:border-dark-slate/60">
            <Coffee className="w-12 h-12 mx-auto text-coffee-brown/30 dark:text-warm-sand/30" />
            <h3 className="text-base font-bold text-coffee-brown dark:text-cream-main font-poppins">
              No matching items found
            </h3>
            <p className="text-xs text-coffee-brown/60 dark:text-warm-sand/60">
              Try adjusting your category filter or search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-amber-gold text-dark-roasted text-xs font-semibold tracking-wider uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            id="products-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
