import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Coffee } from 'lucide-react';

export default function VideoHero() {
  const videoUrl = "https://res.cloudinary.com/dajkiwbqz/video/upload/q_70,w_1920,c_limit,vc_h264/v1786364490/Black_cat_on_ledge_202608101919_ibj8uj.mp4";

  return (
    <section id="hero-section" className="relative w-full h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
      {/* Single Video Element */}
      <div className="absolute inset-0 w-full h-full bg-dark-roasted overflow-hidden">
        <video
          id="hero-video"
          src={videoUrl}
          poster="https://res.cloudinary.com/dajkiwbqz/video/upload/so_2,w_1920,c_limit/v1786364490/Black_cat_on_ledge_202608101919_ibj8uj.jpg"
          preload="metadata"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay */}
      <div
        id="hero-overlay"
        className="absolute inset-0 bg-gradient-to-t from-cream-main dark:from-dark-roasted via-black/40 to-black/60 pointer-events-none"
      />

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center md:text-left flex flex-col items-center md:items-start justify-end pb-24 md:pb-32 h-full">
        {/* Main Title */}
        <div>
          <h1
            id="hero-title"
            className="text-4xl sm:justify-center sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-3xl drop-shadow-md font-poppins"
          >
            NEKO KISSATEN{" "}
          </h1>
          <h2 className=" text-amber-gold text-3xl sm:text-5xl lg:text-6xl font-light">
            (猫喫茶)
          </h2>
        </div>

        {/* Subtitle */}
        <p
          id="hero-subtitle"
          className="mt-4 text-base sm:text-lg lg:text-xl text-warm-sand/90 max-w-2xl font-light leading-relaxed drop-shadow-sm"
        >
          Freshly roasted single-origin beans, hand-poured brews, and a quiet space for your lo-fi afternoon. Savor slow coffee culture inspired by classic Tokyo kissaten.
        </p>

        {/* CTA Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/menu"
            id="hero-cta-btn"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-gold text-dark-roasted font-bold text-sm sm:text-base tracking-wider hover:bg-amber-gold/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl cursor-pointer group"
          >
            <span>EXPLORE MENU</span>
            <ArrowDown className="w-5 h-5 animate-bounce text-dark-roasted group-hover:translate-y-1 transition-transform" />
          </Link>

          <Link
            to="/story"
            id="hero-story-btn"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium text-sm sm:text-base tracking-wide transition-all duration-200"
          >
            <Coffee className="w-4 h-4 text-amber-gold" />
            <span>Our Philosophy</span>
          </Link>
        </div>
      </div>
    </section>
  );
}