import React, { useState } from 'react';
import { MapPin, Clock, MessageCircle, Phone, Mail, Send, CheckCircle2, Instagram, Coffee, Heart } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
    }, 500);
  };

  return (
    <div id="contact-page" className="min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">

          <h1
            id="contact-page-title"
            className="text-3xl sm:text-5xl font-extrabold text-coffee-brown dark:text-cream-main font-poppins tracking-tight"
          >
            VISIT OUR QUIET CORNER
          </h1>
          <p className="text-xs sm:text-sm text-coffee-brown/70 dark:text-warm-sand/70 leading-relaxed">
            Drop by our kissaten bar for a slow pour-over, reserve a cozy table with our resident cats, or message us for bulk roasted beans inquiries.
          </p>
        </div>

        {/* 4 Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Address & Location */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-gold/20 flex items-center justify-center text-amber-gold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-coffee-brown dark:text-cream-main font-poppins">
              Kissaten Roastery
            </h3>
            <p className="text-xs text-coffee-brown/70 dark:text-warm-sand/70 leading-relaxed">
              Jl. Senopati No. 88, Kebayoran Baru<br />
              Jakarta Selatan 12190, Indonesia
            </p>
            <span className="inline-block text-[11px] text-sage-green font-medium">
              Near MRT Senayan Station (5 mins walk)
            </span>
          </div>

          {/* Card 2: Operating Hours */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sage-green/20 flex items-center justify-center text-sage-green">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-coffee-brown dark:text-cream-main font-poppins">
              Operating Hours
            </h3>
            <div className="text-xs text-coffee-brown/70 dark:text-warm-sand/70 space-y-1">
              <div className="flex justify-between">
                <span>Monday – Friday:</span>
                <span className="font-semibold text-coffee-brown dark:text-cream-main">09.00 - 22.00 WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday – Sunday:</span>
                <span className="font-semibold text-coffee-brown dark:text-cream-main">08.00 - 23.00 WIB</span>
              </div>
            </div>
            <span className="inline-block text-[11px] text-amber-gold font-medium">
              *Cat Lounge opens 10.00 - 21.00 WIB
            </span>
          </div>

          {/* Card 3: WhatsApp & Orders */}
          <div className="p-6 rounded-3xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-gold/20 flex items-center justify-center text-amber-gold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-coffee-brown dark:text-cream-main font-poppins">
              Direct WhatsApp Ordering
            </h3>
            <p className="text-xs text-coffee-brown/70 dark:text-warm-sand/70 leading-relaxed">
              Instant customer support, table reservation, and wholesale bean catalog.
            </p>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Neko%20Kissaten"
              target="_blank"
              rel="noreferrer"
              id="contact-whatsapp-btn"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage-green text-dark-roasted font-bold text-xs hover:bg-sage-green/90 transition shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat +62 812-3456-7890</span>
            </a>
          </div>

        </div>

        {/* 2-Column: Google Maps Embed Placeholder & Message Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Google Maps Embed Placeholder */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base font-poppins text-coffee-brown dark:text-cream-main">
                Location Map
              </h3>
              <span className="text-xs text-amber-gold font-semibold">Jakarta Flagship</span>
            </div>

            {/* Map Frame Placeholder */}
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden border border-warm-sand/30 dark:border-dark-slate/60 bg-warm-sand/20">
              <iframe
                title="Neko Kissaten Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.275824982638!2d106.8049187!3d-6.227318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1503e48cb65%3A0x6e2467bc3a4e9b94!2sSenopati%2C%20Kebayoran%20Baru%2C%20South%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                className="w-full h-full border-0 filter dark:contrast-90"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-[11px] text-coffee-brown/60 dark:text-warm-sand/60 text-center">
              Parking space available for cars and bicycles.
            </p>
          </div>

          {/* Column 2: Interactive Contact / Reservation Form */}
          <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 shadow-xs p-6 sm:p-8">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 mx-auto rounded-full bg-sage-green/20 text-sage-green flex items-center justify-center border border-sage-green/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold font-poppins text-coffee-brown dark:text-cream-main">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-coffee-brown/70 dark:text-warm-sand/70 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold">{formData.name}</span>. Our Kissaten baristas will get back to your email within 2 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', type: 'Inquiry', message: '' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-gold text-dark-roasted text-xs font-bold uppercase tracking-wider hover:bg-amber-gold/90"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg font-poppins text-coffee-brown dark:text-cream-main">
                    Send a Message or Reserve
                  </h3>
                  <p className="text-xs text-coffee-brown/70 dark:text-warm-sand/70">
                    We’d love to welcome you to our quiet Kissaten corner.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-coffee-brown/80 dark:text-warm-sand/80">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kenji"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-coffee-brown/80 dark:text-warm-sand/80">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. kenji@mail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-coffee-brown/80 dark:text-warm-sand/80">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+62 812-xxxx-xxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-coffee-brown/80 dark:text-warm-sand/80">
                      Topic / Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold"
                    >
                      <option value="Inquiry">General Inquiry</option>
                      <option value="Table Reservation">Table Reservation (Kissaten Lounge)</option>
                      <option value="Wholesale Beans">Wholesale Beans / B2B Supply</option>
                      <option value="Private Event">Private Lo-Fi Event</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-coffee-brown/80 dark:text-warm-sand/80">
                    Message / Note *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what time you'd like to arrive or what beans you are interested in..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/40 dark:bg-dark-slate/60 text-xs text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold"
                  />
                </div>

                <button
                  type="submit"
                  id="contact-submit-btn"
                  className="w-full py-3.5 rounded-xl bg-amber-gold text-dark-roasted font-bold text-xs sm:text-sm tracking-wider uppercase hover:bg-amber-gold/90 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
