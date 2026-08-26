import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Coffee, Cat, ShoppingBag, Sun, Moon, Menu as MenuIcon, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { toggleCart, getTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = getTotalItems();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Story', path: '/story' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream-main/90 dark:bg-dark-roasted/90 border-b border-warm-sand/20 dark:border-dark-slate/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link
            to="/"
            id="brand-logo"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wider text-coffee-brown dark:text-cream-main flex items-center gap-1.5 font-poppins">
                NEKO KISSATEN
                <span className="text-xs font-normal px-1.5 py-0.5 rounded bg-sage-green/20 dark:bg-sage-green/30 text-coffee-brown dark:text-sage-green">
                  猫喫茶
                </span>
              </span>
              <span className="text-[10px] tracking-widest text-coffee-brown/70 dark:text-warm-sand/70 uppercase">
                Artisanal Coffee & Roastery
              </span>
            </div>
          </Link>

          {/* Desktop NavLinks */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                id={`nav-link-${link.name.toLowerCase()}`}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-amber-gold dark:text-amber-gold bg-amber-gold/10 font-semibold'
                      : 'text-coffee-brown/80 dark:text-warm-sand/80 hover:text-coffee-brown dark:hover:text-cream-main hover:bg-warm-sand/20 dark:hover:bg-dark-slate/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2.5 rounded-xl border border-warm-sand/30 dark:border-dark-slate/60 bg-cream-main dark:bg-dark-slate/40 text-coffee-brown dark:text-amber-gold hover:bg-warm-sand/20 dark:hover:bg-dark-slate/80 transition-all duration-300 focus:outline-none shadow-sm cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 transition-transform duration-500 rotate-0 hover:rotate-90 text-amber-gold" />
              ) : (
                <Moon className="w-5 h-5 transition-transform duration-500 rotate-0 hover:-rotate-12 text-coffee-brown" />
              )}
            </button>

            {/* Cart Icon Button */}
            <button
              id="cart-drawer-trigger-btn"
              onClick={toggleCart}
              aria-label="Open Cart"
              className="relative p-2.5 rounded-xl bg-amber-gold text-dark-roasted hover:bg-amber-gold/90 transition-all duration-200 focus:outline-none shadow-md flex items-center justify-center cursor-pointer group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span
                  id="cart-badge-count"
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-red-600 dark:bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-cream-main dark:border-dark-roasted shadow-sm animate-pulse"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open mobile menu"
              className="md:hidden p-2.5 rounded-xl border border-warm-sand/30 dark:border-dark-slate/60 bg-cream-main dark:bg-dark-slate/40 text-coffee-brown dark:text-cream-main hover:bg-warm-sand/20 dark:hover:bg-dark-slate/80 transition-all focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            className="md:hidden py-4 border-t border-warm-sand/20 dark:border-dark-slate/40 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  id={`mobile-nav-link-${link.name.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'text-amber-gold dark:text-amber-gold bg-amber-gold/10 font-semibold'
                        : 'text-coffee-brown dark:text-warm-sand hover:bg-warm-sand/20 dark:hover:bg-dark-slate/50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
