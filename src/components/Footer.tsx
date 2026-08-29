import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Cat, Instagram, MessageCircle, ShoppingBag, Heart, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="app-footer" className="bg-charcoal-brown text-cream-main border-t border-warm-sand/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <span className="font-bold text-lg tracking-wider text-white font-poppins">
                NEKO KISSATEN <span className="text-xs font-normal px-2 py-0.5 rounded bg-sage-green/20 text-sage-green">猫喫茶</span>
              </span>
            </Link>
            <p className="text-warm-sand/80 text-sm max-w-md leading-relaxed">
              NEKO KISSATEN (猫喫茶) — Artisanal Coffee &amp; Lo-Fi Vibes. A quiet sanctuary for single-origin brews, vintage pour-over rituals, and mindful slow moments.
            </p>
            <div className="flex items-center gap-4 text-warm-sand/70 text-xs pt-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-gold" />
                <span>Everyday | 09.00 - 22.00 WIB</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-gold font-poppins">
              Kissaten Menu
            </h4>
            <ul className="space-y-2 text-sm text-warm-sand/80">
              <li>
                <Link to="/" className="hover:text-amber-gold transition-colors">Home &amp; Highlights</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-amber-gold transition-colors">Specialty Coffee Menu</Link>
              </li>
              <li>
                <Link to="/story" className="hover:text-amber-gold transition-colors">Roasting &amp; Philosophy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-gold transition-colors">Location &amp; Visit</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Connect & Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-gold font-poppins">
              Connect &amp; Order
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-warm-sand/80">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                id="footer-link-instagram"
                className="flex items-center gap-2 hover:text-amber-gold transition-colors"
              >
                <Instagram className="w-4 h-4 text-amber-gold" />
                <span>@nekokissaten.coffee</span>
              </a>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Neko%20Kissaten,%20mau%20order%20beans"
                target="_blank"
                rel="noreferrer"
                id="footer-link-whatsapp"
                className="flex items-center gap-2 hover:text-amber-gold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-sage-green" />
                <span>WhatsApp Direct Order</span>
              </a>
              <a
                href="https://tokopedia.com"
                target="_blank"
                rel="noreferrer"
                id="footer-link-tokopedia"
                className="flex items-center gap-2 hover:text-amber-gold transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-amber-gold" />
                <span>Tokopedia Official Store</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-warm-sand/10 flex flex-col sm:flex-row items-center justify-between text-xs text-warm-sand/60 gap-4">
          <div className="flex items-center gap-1.5">
            <span>© 2026 Neko Kissaten. Built with React, Vite &amp; Tailwind CSS</span>
            <span className="inline-block">🐾</span>
          </div>

          {/* Hidden/Subtle Admin Portal Link */}
          <Link
            to="/admin"
            id="footer-admin-portal-link"
            className="text-[11px] text-warm-sand/40 hover:text-amber-gold hover:underline transition-colors px-2 py-1 rounded bg-black/20"
          >
            Staff Admin Portal ⚡
          </Link>
        </div>
      </div>
    </footer>
  );
}
