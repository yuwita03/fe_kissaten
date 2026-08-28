import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReceiptText, RefreshCw, Loader2, ShoppingBag, ArrowRight, ChevronDown } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import useAuthStore from '../store/authStore';
import { formatIDR, formatDate } from '../utils/formatters';

const STATUS_STYLES: Record<string, string> = {
  PAID: 'bg-sage-green/20 text-coffee-brown dark:text-sage-green',
  PENDING: 'bg-amber-gold/20 text-coffee-brown dark:text-amber-gold',
  FAILED: 'bg-red-500/10 text-red-600 dark:text-red-400',
  EXPIRED: 'bg-warm-sand/30 text-coffee-brown/70 dark:text-warm-sand/70',
};

export default function OrderHistory() {
  const { myOrders, isLoading, error, page, limit, total, fetchMyOrders, setPage } = useOrderStore();
  const { isAuthenticated } = useAuthStore();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyOrders(page, limit);
    }
  }, [isAuthenticated, page, limit]);

  const toggleExpanded = (orderId: number) => {
    setExpandedId((prev) => (prev === orderId ? null : orderId));
  };

  if (!isAuthenticated) {
    return (
      <div id="order-history-page" className="min-h-screen py-10 sm:py-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <ReceiptText className="w-16 h-16 mx-auto text-coffee-brown/30 dark:text-warm-sand/30 mb-4" />
          <h2 className="text-2xl font-bold text-coffee-brown dark:text-cream-main font-poppins mb-2">
            Sign In Required
          </h2>
          <p className="text-coffee-brown/70 dark:text-warm-sand/70">
            Log in to view your order history at Neko Kissaten.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="order-history-page" className="min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-warm-sand/30 dark:border-dark-slate/60 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-gold/20 text-coffee-brown dark:text-amber-gold text-xs font-semibold uppercase tracking-wider">
              <span>Neko Kissaten</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-coffee-brown dark:text-cream-main font-poppins">
              Order History
            </h1>
            <p className="text-xs sm:text-sm text-coffee-brown/70 dark:text-warm-sand/70">
              Every cup you've ordered, in one place.
            </p>
          </div>

          <button
            onClick={() => fetchMyOrders(page, limit)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 text-xs font-semibold text-coffee-brown/80 dark:text-warm-sand/80 hover:bg-warm-sand/20 dark:hover:bg-dark-slate/50 transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm" role="alert">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && myOrders.length === 0 && !error && (
          <div id="order-history-empty" className="flex flex-col items-center justify-center text-center py-20 space-y-4">
            <div className="w-20 h-20 rounded-full bg-amber-gold/15 dark:bg-amber-gold/10 flex items-center justify-center text-amber-gold border border-amber-gold/30">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-coffee-brown dark:text-cream-main font-poppins">
                No orders yet
              </h3>
              <p className="text-xs text-coffee-brown/70 dark:text-warm-sand/70 max-w-xs">
                Your first order will show up here once you check out.
              </p>
            </div>
            <Link
              to="/menu"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-gold text-dark-roasted font-semibold text-xs tracking-wider uppercase hover:bg-amber-gold/90 transition-all shadow-md"
            >
              <span>Browse Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Order list */}
        {myOrders.length > 0 && (
          <div className="space-y-4">
            {myOrders.map((order) => {
              const isExpanded = expandedId === order.id;
              return (
                <div
                  key={order.id}
                  id={`order-history-item-${order.id}`}
                  className="rounded-3xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpanded(order.id)}
                    aria-expanded={isExpanded}
                    className="w-full flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6 text-left cursor-pointer hover:bg-warm-sand/10 dark:hover:bg-dark-slate/30 transition"
                  >
                    <div>
                      <p className="text-xs text-coffee-brown/60 dark:text-warm-sand/60 uppercase tracking-wider font-semibold">
                        Order #{order.id} &middot; {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-coffee-brown/60 dark:text-warm-sand/60 mt-0.5">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-amber-gold">
                        {formatIDR(order.totalAmount)}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${STATUS_STYLES[order.paymentStatus] || STATUS_STYLES.PENDING}`}
                      >
                        {order.paymentStatus}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-coffee-brown/60 dark:text-warm-sand/60 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 border-t border-warm-sand/20 dark:border-dark-slate/60">
                      <ul className="space-y-1.5 mt-4">
                        {order.items.map((item) => (
                          <li
                            key={item.id}
                            className="flex justify-between text-xs text-coffee-brown/80 dark:text-warm-sand/80"
                          >
                            <span>{item.qty}x {item.productName}</span>
                            <span className="font-medium text-coffee-brown dark:text-cream-main">
                              {formatIDR(item.subtotal)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {Math.ceil(total / limit) > 1 && (
          <div className="flex items-center justify-center gap-4 py-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 text-xs font-semibold text-coffee-brown dark:text-cream-main disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-xs text-coffee-brown/70 dark:text-warm-sand/70">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-4 py-2 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 text-xs font-semibold text-coffee-brown dark:text-cream-main disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}