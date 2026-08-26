import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coffee, Eye, EyeOff, Loader2, AlertCircle, User, Mail, Lock, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Login() {
  const { login, register, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password');
        return;
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : isLogin ? 'Login failed' : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center"><p>Redirecting...</p></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-cream-main dark:bg-dark-roasted">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-gold/20 flex items-center justify-center text-amber-gold">
              <Coffee className="w-7 h-7" />
            </div>
            <span className="font-bold text-xl tracking-wider text-coffee-brown dark:text-cream-main font-poppins">
              NEKO KISSATEN
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold text-coffee-brown dark:text-cream-main font-poppins">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-coffee-brown/70 dark:text-warm-sand/70 mt-2">
            {isLogin ? 'Sign in to your Kissaten account' : 'Join the Kissaten coffee community'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-dark-slate/40 border border-warm-sand/30 dark:border-dark-slate/60 rounded-3xl p-8 shadow-xl">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-6" role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider mb-1 text-coffee-brown/80 dark:text-warm-sand/80">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-brown/40 dark:text-warm-sand/40" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. Kenji Sato"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/50 dark:bg-dark-slate/50 text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold placeholder:text-coffee-brown/40"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider mb-1 text-coffee-brown/80 dark:text-warm-sand/80">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-brown/40 dark:text-warm-sand/40" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="e.g. kenji@kissaten.jp"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/50 dark:bg-dark-slate/50 text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold placeholder:text-coffee-brown/40"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider mb-1 text-coffee-brown/80 dark:text-warm-sand/80">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-brown/40 dark:text-warm-sand/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/50 dark:bg-dark-slate/50 text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold placeholder:text-coffee-brown/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-coffee-brown/40 dark:text-warm-sand/40 hover:text-coffee-brown"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider mb-1 text-coffee-brown/80 dark:text-warm-sand/80">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-brown/40 dark:text-warm-sand/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-warm-sand/40 dark:border-dark-slate/60 bg-cream-main/50 dark:bg-dark-slate/50 text-coffee-brown dark:text-cream-main focus:outline-none focus:border-amber-gold placeholder:text-coffee-brown/40"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-amber-gold text-dark-roasted font-bold text-sm tracking-wider uppercase hover:bg-amber-gold/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center text-coffee-brown/70 dark:text-warm-sand/70">
            <span className="text-xs">{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
              className="ml-2 text-xs font-bold text-amber-gold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-coffee-brown/50 dark:text-warm-sand/50 mt-6 max-w-xs mx-auto">
          By continuing, you agree to our Terms of Service and Privacy Policy. Your data is roasted with care.
        </p>
      </div>
    </div>
  );
}