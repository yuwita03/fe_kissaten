  import React, { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';
  import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, QrCode, Loader2, AlertCircle } from 'lucide-react';
  import { useCartStore } from '../store/cartStore';
  import { useOrderStore } from '../store/orderStore';
  import useAuthStore from '../store/authStore';
  import { formatIDR } from '../utils/formatters';
  

  interface OrderDetails {
    id: number;
    customerName: string;
    customerAddress: string;
    paymentMethod: string;
    totalPrice: number;
    items: unknown[];
  }

  export default function CartDrawer() {
    const {
      cartItems,
      isCartOpen,
      setIsCartOpen,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getTotalItems
    } = useCartStore();

    const { createOrder } = useOrderStore();
    const { user, isAuthenticated } = useAuthStore();

    // Checkout modal states
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [paymentStep, setPaymentStep] = useState('FORM'); // 'FORM' | 'SNAP_PROCESSING' | 'SUCCESS' | 'PENDING' | 'CANCELLED'
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('Table 07 (Dine-in / Kissaten Bar)');
    const [paymentMethod, setPaymentMethod] = useState('QRIS / GoPay');
    const [lastOrderDetails, setLastOrderDetails] = useState<OrderDetails | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');

    const subtotal = getTotalPrice();
    const taxAndService = Math.round(subtotal * 0.1);
    const finalTotal = subtotal + taxAndService;

    const handleStartCheckout = () => {
      setIsCheckingOut(true);
      setPaymentStep('FORM');
      setCheckoutError('');
    };

    const handleProcessPayment = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setCheckoutError('');

      if (!customerName) {
        setCheckoutError('Please enter your name');
        return;
      }

      setIsProcessing(true);
      setPaymentStep('SNAP_PROCESSING');

      try {
        const orderData = {
          customerName: customerName || 'Valued Guest',
          userId: isAuthenticated ? user?.id : undefined,
          items: cartItems.map(item => ({
            productId: Number(item.id),
            qty: item.quantity
          }))
        };

        const savedOrder = await createOrder(orderData);

        if (!savedOrder.snapToken) {
          setCheckoutError('Failed to get payment token');
          setPaymentStep('FORM');
          setIsProcessing(false);
          return;
        }

        clearCart();

        window.snap.pay(savedOrder.snapToken, {
          onSuccess: () => {
            setLastOrderDetails({
              id: savedOrder.id,
              customerName: savedOrder.customerName || 'Guest',
              customerAddress: customerAddress,
              paymentMethod: paymentMethod,
              totalPrice: savedOrder.totalAmount,
              items: savedOrder.items
            });
            setPaymentStep('SUCCESS');
            setIsProcessing(false);
          },
          onPending: () => {
            setCheckoutError('Payment is pending. Please complete the payment to confirm your order.');
            clearCart();
            setPaymentStep('PENDING');
            setIsProcessing(false);
          },
          onError: () => {
            setCheckoutError('Payment failed, please try again.');
            clearCart();
            setPaymentStep('FORM');
            setIsProcessing(false);
          },
          onClose: () => {
            setCheckoutError('Payment cancelled. You can try again anytime.');
            clearCart();
            setPaymentStep('CANCELLED');
            setIsProcessing(false);
          }
        });
      } catch (err) {
        setCheckoutError(err instanceof Error ? err.message : 'Failed to process order');
        setPaymentStep('FORM');
        setIsProcessing(false);
      }
    };

    const handleCloseAll = () => {
      setIsCheckingOut(false);
      setPaymentStep('FORM');
      setIsCartOpen(false);
      setCheckoutError('');
    };

    useEffect(() => {
      if (isAuthenticated && user?.name) {
        setCustomerName(user.name);
      }
    }, [isAuthenticated, user]);
    if (!isCartOpen) return null;

    return (
      <div id="cart-drawer-wrapper" className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <div
          id="cart-backdrop"
          onClick={() => !isCheckingOut && setIsCartOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        />

        {/* Drawer Container */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <aside
            id="cart-drawer-panel"
            className="w-screen max-w-md bg-cream-main dark:bg-dark-roasted text-coffee-brown dark:text-cream-main shadow-2xl flex flex-col border-l border-warm-sand/30 dark:border-dark-slate/60 transition-transform duration-300 animate-in slide-in-from-right"
          >
            {/* Header */}
            <div className="p-5 border-b border-warm-sand/30 dark:border-dark-slate/60 flex items-center justify-between bg-warm-sand/10 dark:bg-dark-slate/20">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-amber-gold" />
                <h2 className="text-lg font-bold tracking-wide font-poppins">Your Order</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-gold/20 text-coffee-brown dark:text-amber-gold font-semibold">
                  {getTotalItems()} items
                </span>
              </div>
              <button
                id="close-cart-btn"
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-coffee-brown/70 dark:text-warm-sand/70 hover:text-coffee-brown dark:hover:text-cream-main hover:bg-warm-sand/20 dark:hover:bg-dark-slate/60 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body: Item List or Empty State */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div id="empty-cart-state" className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-amber-gold/15 dark:bg-amber-gold/10 flex items-center justify-center text-amber-gold border border-amber-gold/30">
                    <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-coffee-brown dark:text-cream-main font-poppins">
                      Your cup is empty
                    </h3>
                    <p className="text-xs text-coffee-brown/70 dark:text-warm-sand/70 max-w-xs">
                      Explore our single-origin specialty beans and artisanal Kissaten brews!
                    </p>
                  </div>
                  <Link
                    to="/menu"
                    id="empty-cart-explore-btn"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-gold text-dark-roasted font-semibold text-xs tracking-wider uppercase hover:bg-amber-gold/90 transition-all shadow-md"
                  >
                    <span>Add Some Brews</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      id={`cart-item-${item.id}`}
                      className="p-3.5 rounded-2xl bg-white dark:bg-dark-slate/50 border border-warm-sand/30 dark:border-dark-slate/80 shadow-xs flex gap-3.5 items-center transition-all hover:border-amber-gold/40"
                    >
                      {/* Thumbnail */}
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop'}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-warm-sand/20 dark:border-dark-slate/40"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-coffee-brown dark:text-cream-main line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-sage-green dark:text-sage-green font-medium line-clamp-1 mt-0.5">
                          {item.notes}
                        </p>
                        <p className="text-xs font-bold text-coffee-brown dark:text-amber-gold mt-1">
                          {formatIDR(item.price)}
                        </p>
                      </div>

                      {/* Quantity controls & Delete */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          id={`remove-item-${item.id}`}
                          aria-label={`Remove ${item.name}`}
                          className="text-coffee-brown/40 dark:text-warm-sand/40 hover:text-red-600 dark:hover:text-red-400 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1.5 bg-warm-sand/20 dark:bg-dark-roasted rounded-lg p-1 border border-warm-sand/30 dark:border-dark-slate/60">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            id={`qty-minus-${item.id}`}
                            aria-label="Decrease quantity"
                            className="w-5 h-5 rounded flex items-center justify-center text-coffee-brown dark:text-cream-main hover:bg-warm-sand/40 dark:hover:bg-dark-slate/80 transition cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            id={`qty-plus-${item.id}`}
                            aria-label="Increase quantity"
                            className="w-5 h-5 rounded flex items-center justify-center text-coffee-brown dark:text-cream-main hover:bg-warm-sand/40 dark:hover:bg-dark-slate/80 transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Drawer */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-warm-sand/30 dark:border-dark-slate/60 bg-warm-sand/10 dark:bg-dark-slate/30 space-y-3">
                <div className="space-y-1.5 text-xs text-coffee-brown/80 dark:text-warm-sand/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-coffee-brown dark:text-cream-main">{formatIDR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax & Service (10%)</span>
                    <span>{formatIDR(taxAndService)}</span>
                  </div>
                  <div className="pt-2 border-t border-warm-sand/30 dark:border-dark-slate/60 flex justify-between text-sm font-bold text-coffee-brown dark:text-cream-main">
                    <span>Total Final</span>
                    <span className="text-base text-amber-gold dark:text-amber-gold">{formatIDR(finalTotal)}</span>
                  </div>
                </div>

                <button
                  id="proceed-checkout-btn"
                  onClick={handleStartCheckout}
                  className="w-full py-3.5 rounded-xl bg-amber-gold text-dark-roasted font-bold text-sm tracking-wider uppercase hover:bg-amber-gold/90 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </aside>
        </div>

        {/* Checkout Modal Simulation (Midtrans Mock Snap) */}
        {isCheckingOut && (
          <div id="checkout-modal" className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg bg-cream-main dark:bg-dark-roasted border border-warm-sand/30 dark:border-dark-slate/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-coffee-brown dark:text-cream-main relative">
              
              {/* Close button */}
              <button
                id="close-checkout-modal"
                onClick={handleCloseAll}
                className="absolute top-5 right-5 p-2 rounded-xl text-coffee-brown/60 dark:text-warm-sand/60 hover:bg-warm-sand/20 dark:hover:bg-dark-slate/60"
              >
                <X className="w-5 h-5" />
              </button>

              {paymentStep === 'FORM' && (
                <form onSubmit={handleProcessPayment} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-gold/20 flex items-center justify-center text-amber-gold">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-poppins">Neko Kissaten Checkout</h3>
                      <p className="text-xs text-coffee-brown/70 dark:text-warm-sand/70">Complete your order details</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-gold/10 dark:bg-amber-gold/5 rounded-2xl border border-amber-gold/20 flex justify-between items-center text-sm">
                    <span>Order Total ({cartItems.length} items)</span>
                    <span className="font-bold text-amber-gold text-base">{formatIDR(finalTotal)}</span>
                  </div>

                  {checkoutError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{checkoutError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider">Your Name *</label>
                    {isAuthenticated ? (
                      <div className="w-full px-4 py-2.5 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-warm-sand/10 dark:bg-dark-slate/30 text-coffee-brown dark:text-cream-main text-sm flex items-center justify-between">
                        <span>{customerName}</span>
                        <span className="text-[10px] text-sage-green font-semibold uppercase">Logged in</span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kenji Sato"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-white dark:bg-dark-slate/50 text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold"
                      />
                    )}
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="w-1/3 py-3 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 text-xs font-semibold hover:bg-warm-sand/20 dark:hover:bg-dark-slate/50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      id="submit-payment-btn"
                      disabled={isProcessing}
                      className="w-2/3 py-3 rounded-xl bg-amber-gold text-dark-roasted font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-amber-gold/90 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>Pay {formatIDR(finalTotal)}</span>
                    </button>
                  </div>
                </form>
              )}

              {paymentStep === 'SNAP_PROCESSING' && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-gold border-t-transparent animate-spin" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-base font-poppins">Connecting to Payment Gateway...</h4>
                    <p className="text-xs text-coffee-brown/70 dark:text-warm-sand/70">
                      Executing Midtrans Snap transaction for {formatIDR(finalTotal)}
                    </p>
                  </div>
                </div>
              )}

              {paymentStep === 'PENDING' && (
                <div className="text-center space-y-4 py-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-gold/20 text-amber-gold flex items-center justify-center border-2 border-amber-gold/40 animate-in zoom-in">
                    <Loader2 className="w-10 h-10 animate-spin" />
                  </div>

                  <div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-gold/20 text-amber-gold tracking-wide">
                      PAYMENT PENDING
                    </span>
                    <h3 className="text-xl font-bold mt-2 font-poppins text-coffee-brown dark:text-cream-main">
                      Payment pending confirmation
                    </h3>
                    <p className="text-xs text-coffee-brown/70 dark:text-warm-sand/70 mt-1">
                      Your order is being processed. Please complete the payment to confirm it.
                    </p>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={handleCloseAll}
                      id="pending-order-btn"
                      className="w-full py-3 rounded-xl bg-amber-gold text-dark-roasted font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-amber-gold/90 transition shadow-md cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'CANCELLED' && (
                <div className="text-center space-y-4 py-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-gold/20 text-amber-gold flex items-center justify-center border-2 border-amber-gold/40 animate-in zoom-in">
                    <AlertCircle className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-gold/20 text-amber-gold tracking-wide">
                      PAYMENT CANCELLED
                    </span>
                    <h3 className="text-xl font-bold mt-2 font-poppins text-coffee-brown dark:text-cream-main">
                      Payment was cancelled
                    </h3>
                    <p className="text-xs text-coffee-brown/70 dark:text-warm-sand/70 mt-1">
                      Your cart has been cleared. You can place the order again when you are ready.
                    </p>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={handleCloseAll}
                      id="cancelled-order-btn"
                      className="w-full py-3 rounded-xl bg-amber-gold text-dark-roasted font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-amber-gold/90 transition shadow-md cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'SUCCESS' && lastOrderDetails && (
                <div className="text-center space-y-4 py-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-sage-green/20 text-sage-green flex items-center justify-center border-2 border-sage-green/40 animate-in zoom-in">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-sage-green/20 text-sage-green tracking-wide">
                      PAYMENT SUCCESSFUL
                    </span>
                    <h3 className="text-xl font-bold mt-2 font-poppins text-coffee-brown dark:text-cream-main">
                      Arigatou Gozaimasu! ☕
                    </h3>
                    <p className="text-xs text-coffee-brown/70 dark:text-warm-sand/70 mt-1">
                      Your order <span className="font-mono font-bold text-amber-gold">{lastOrderDetails.id}</span> has been logged to Kissaten kitchen.
                    </p>
                  </div>

                  {/* Receipt Card */}
                  <div className="p-4 bg-white dark:bg-dark-slate/60 rounded-2xl border border-warm-sand/30 dark:border-dark-slate/80 text-left text-xs space-y-2">
                    <div className="flex justify-between border-b border-warm-sand/20 dark:border-dark-slate/60 pb-2">
                      <span className="text-coffee-brown/70 dark:text-warm-sand/70">Guest</span>
                      <span className="font-semibold">{lastOrderDetails.customerName}</span>
                    </div>
                    <div className="flex justify-between border-b border-warm-sand/20 dark:border-dark-slate/60 pb-2">
                      <span className="text-coffee-brown/70 dark:text-warm-sand/70">Payment</span>
                      <span className="font-semibold">{lastOrderDetails.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between pt-1 font-bold text-sm">
                      <span>Total Paid</span>
                      <span className="text-amber-gold">{formatIDR(lastOrderDetails.totalPrice)}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={handleCloseAll}
                      id="finish-order-btn"
                      className="w-full py-3 rounded-xl bg-amber-gold text-dark-roasted font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-amber-gold/90 transition shadow-md cursor-pointer"
                    >
                      Done & Enjoy Coffee
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }