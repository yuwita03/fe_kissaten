import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Flame, Droplets, Coffee, Loader2 } from 'lucide-react';
import VideoHero from '../components/VideoHero';
import ProductCard from '../components/ProductCard';
import { useProductStore } from '../store/productStore';

export default function Home() {
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayDrops = products.slice(0, 3);

  if (isLoading && products.length === 0) {
    return (
      <div id="home-page" className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto text-amber-gold animate-spin mb-4" />
          <p className="text-coffee-brown/70 dark:text-warm-sand/70">Loading Kissaten...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="home-page" className="min-h-screen">
      <VideoHero />

      <section id="intro-section" className="relative z-20 -mt-12 rounded-t-3xl bg-cream-main dark:bg-dark-roasted shadow-2xl p-6 sm:p-10 md:p-16 border-t border-warm-sand/30 dark:border-dark-slate/60 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-coffee-brown dark:text-cream-main font-poppins leading-snug">
              A Quiet Sanctuary for Slow Drip & Roastery Excellence
            </h2>
            <p className="text-sm sm:text-base text-coffee-brown/80 dark:text-warm-sand/80 leading-relaxed">
              In Japanese coffee culture, a <em>Kissaten</em> (喫茶店) is more than a café — it is a tranquil hideaway where vinyl plays gently, beans are roasted in small master batches, and every pour-over is prepared with deliberate mindfulness.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-gold/20 flex items-center justify-center text-amber-gold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-coffee-brown dark:text-cream-main">100% Specialty</h4>
                <p className="text-[11px] text-coffee-brown/70 dark:text-warm-sand/70">Ethically sourced single-origin Arabica micro-lots.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-sage-green/20 flex items-center justify-center text-sage-green">
                  <Droplets className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-coffee-brown dark:text-cream-main">Artisan Hand-Pour</h4>
                <p className="text-[11px] text-coffee-brown/70 dark:text-warm-sand/70">Precision Nel drip & Japanese flash brewing.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-gold/20 flex items-center justify-center text-amber-gold">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-coffee-brown dark:text-cream-main">Freshly Roasted</h4>
                <p className="text-[11px] text-coffee-brown/70 dark:text-warm-sand/70">Craft roasted weekly in small batches in Indonesia.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-dark-slate/60 bg-dark-slate group">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop"
                alt="Neko Kissaten Warm Counter"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 flex flex-col justify-end text-white">
                <div className="flex items-center gap-2 text-amber-gold text-xs font-semibold uppercase tracking-wider mb-1">
                  <Coffee className="w-4 h-4" />
                  <span>The Counter Experience</span>
                </div>
                <h3 className="text-xl font-bold font-poppins">Warm Cedarwood & Vintage Lo-Fi</h3>
                <p className="text-xs text-warm-sand/80 mt-1">Pull up a stool, listen to warm analog vinyl, and watch the slow drip kettle bloom.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="selected-drops" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sage-green mb-2">
              <span>FEATURED ROASTS & BREWS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-coffee-brown dark:text-cream-main font-poppins">Selected Kissaten Drops</h2>
            <p className="text-sm text-coffee-brown/70 dark:text-warm-sand/70 mt-1 max-w-xl">
              Curated house favorites roasted to peak flavor profiles. Available for dine-in or bean delivery.
            </p>
          </div>
          <Link to="/menu" id="view-full-menu-btn" className="inline-flex items-center gap-2 text-sm font-bold text-amber-gold hover:text-amber-gold/80 group transition-colors self-start md:self-auto">
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {displayDrops.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-14 p-8 rounded-3xl bg-amber-gold/10 dark:bg-dark-slate/40 border border-amber-gold/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-coffee-brown dark:text-cream-main font-poppins">Looking for our complete seasonal menu?</h3>
            <p className="text-xs sm:text-sm text-coffee-brown/70 dark:text-warm-sand/70">
              Browse pour-over beans, signature iced lattes, and fresh fluffy soufflé pancakes.
            </p>
          </div>
          <Link to="/menu" className="px-6 py-3 rounded-xl bg-amber-gold text-dark-roasted font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-amber-gold/90 transition shadow-md shrink-0">
            Explore All Items
          </Link>
        </div>
      </section>
    </div>
  );
}