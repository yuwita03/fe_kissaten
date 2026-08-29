import React from 'react';
import { Coffee, Plus} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatIDR } from '../utils/formatters';

interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string | null;
  notes?: string;
  description?: string;
  status?: string;
  category?: string;
  categoryName?: string;
  categoryId?: number;
}

interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleCart } = useCartStore();
  const isSoldOut = product.status === 'SOLD OUT';
  const categoryName = product.categoryName || product.category;

  const handleAdd = () => {
    if (isSoldOut) return;
    addToCart(product, 1);
    toggleCart();
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group rounded-3xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-warm-sand/20">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop'}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />

        {/* Category Chip */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-cream-main/90 dark:bg-dark-roasted/90 backdrop-blur-md text-[11px] font-semibold text-coffee-brown dark:text-warm-sand shadow-sm border border-warm-sand/30 dark:border-dark-slate/60">
            {categoryName}
          </span>
        </div>

        {/* Status Badge */}
        {isSoldOut ? (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-bold tracking-wider uppercase shadow-md">
              SOLD OUT
            </span>
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <h3 className="font-bold text-base text-coffee-brown dark:text-cream-main line-clamp-1 font-poppins group-hover:text-amber-gold transition-colors">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-coffee-brown/70 dark:text-warm-sand/70 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Tasting notes chip */}
          {product.notes && (
            <div className="pt-1 flex items-center gap-1.5 text-xs text-sage-green dark:text-sage-green font-medium">
              <Coffee className="w-3.5 h-3.5 shrink-0" />
              <span className="line-clamp-1">{product.notes}</span>
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-warm-sand/20 dark:border-dark-slate/60 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-coffee-brown/50 dark:text-warm-sand/50 block">
              Price
            </span>
            <span className="text-base font-bold text-coffee-brown dark:text-amber-gold">
              {formatIDR(product.price)}
            </span>
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAdd}
            disabled={isSoldOut}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              isSoldOut
                ? 'bg-warm-sand/30 dark:bg-dark-slate/60 text-coffee-brown/40 dark:text-warm-sand/40 cursor-not-allowed'
                : 'bg-amber-gold text-dark-roasted hover:bg-amber-gold/90 shadow-sm active:scale-95'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isSoldOut ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}