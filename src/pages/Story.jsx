import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Heart, Sparkles, Feather, Compass, Flame, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Story() {
  const steps = [
    {
      number: "01",
      title: "Ethically Sourced Beans",
      subtitle: "Direct Trade Micro-Lots & Volcanic Terroirs",
      description:
        "We partner directly with sustainable coffee farmers across the Indonesian archipelago (Flores Bajawa, Aceh Gayo, Bali Kintamani) and select African origins to source Grade 1 specialty Arabica with full traceability.",
      image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=800&auto=format&fit=crop"
    },
    {
      number: "02",
      title: "Artisan Precision Roasting",
      subtitle: "Profiled for Clean Clarity & Subtle Sweetness",
      description:
        "Roasting is conducted weekly in custom small batches. We target roast curves that highlight natural floral aromatics, caramel sweetness, and velvety mouthfeel without overpowering bitterness.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop"
    },
    {
      number: "03",
      title: "Hand-Poured with Care",
      subtitle: "The Japanese Kissaten Ritual",
      description:
        "Every cup is dripped slowly using copper gooseneck kettles, calibrated water temperatures (90°C–93°C), and custom filter geometry to ensure optimal extraction and nuanced tasting layers.",
      image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div id="story-page" className="min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Title & Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">

          <h1
            id="story-page-title"
            className="text-3xl sm:text-5xl font-extrabold text-coffee-brown dark:text-cream-main font-poppins tracking-tight leading-tight"
          >
            THE ART OF THE BREW &amp; PHILOSOPHY
          </h1>

          <p className="text-sm sm:text-base text-coffee-brown/80 dark:text-warm-sand/80 leading-relaxed">
            In an era of rushed caffeine fixes, Neko Kissaten (猫喫茶) honors the timeless Japanese kissaten philosophy: slowing down time, fostering quiet contemplation, and treating each hand-poured cup as a work of intentional art.
          </p>
        </div>

        {/* Atmosphere Quote Section */}
        <div className="p-8 md:p-12 rounded-3xl bg-amber-gold/10 dark:bg-dark-slate/40 border border-amber-gold/25 relative overflow-hidden text-center max-w-4xl mx-auto">
          <div className="text-amber-gold text-4xl font-serif">“</div>
          <blockquote className="text-lg md:text-xl font-light italic text-coffee-brown dark:text-cream-main max-w-2xl mx-auto leading-relaxed">
            A cup of specialty coffee is not merely a beverage; it is a peaceful pause in a noisy world. When you listen to the drip and the soft purr of our resident feline, you are home.
          </blockquote>
          <div className="mt-4 text-xs font-bold uppercase tracking-widest text-amber-gold">
            — Master Roaster &amp; Founder, Neko Kissaten
          </div>
        </div>

        {/* Timeline Process: 3 Vertical Cards */}
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-coffee-brown dark:text-cream-main font-poppins">
              Our 3-Step Quality Journey
            </h2>
            <p className="text-xs sm:text-sm text-coffee-brown/70 dark:text-warm-sand/70">
              From sustainable mountain soils to your warm porcelain cup.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  id={`story-step-${step.number}`}
                  className="rounded-3xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-0"
                >
                  {/* Visual Image */}
                  <div className={`md:col-span-5 h-64 md:h-auto relative overflow-hidden ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                    <img
                      src={step.image}
                      alt={step.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-dark-roasted/80 backdrop-blur-md text-amber-gold font-mono font-bold text-lg flex items-center justify-center border border-amber-gold/40 shadow-md">
                      {step.number}
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className={`md:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-3 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sage-green">
                      <span>{step.subtitle}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-coffee-brown dark:text-cream-main font-poppins">
                      {step.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-coffee-brown/80 dark:text-warm-sand/80 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA to Menu */}
        <div className="text-center pt-6">
          <Link
            to="/menu"
            id="story-to-menu-cta"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-gold text-dark-roasted font-bold text-sm tracking-wider uppercase hover:bg-amber-gold/90 transition-all shadow-lg"
          >
            <span>Taste Our Brews</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
