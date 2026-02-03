
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Phone, MessageCircle, ChevronRight, TrendingUp, Mail, MapPin, CheckCircle, Send, User } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/profile';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isDashboard ? 'bg-white shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-emerald-400" size={24} />
            </div>
            <span className={`text-xl font-bold tracking-tight text-slate-900`}>
              InvestGrow <span className="text-emerald-500">India</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${location.pathname === item.path
                    ? 'text-blue-900 border-b-2 border-emerald-500 pb-1'
                    : 'text-slate-600 hover:text-blue-900'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isDashboard ? (
              <Link to="/profile" className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition-all">
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <span className="text-sm font-bold text-slate-700">My Profile</span>
              </Link>
            ) : isAuthPage ? (
              <Link to="/" className="text-sm font-bold text-blue-900 hover:underline">Back to Home</Link>
            ) : (
              <Link to="/login" className="bg-blue-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-900/20">
                Member Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-900" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute top-full left-0 right-0 py-4 shadow-xl animate-in slide-in-from-top duration-300">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-8 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-900"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="px-8 mt-4 space-y-3">
            {isDashboard ? (
              <Link
                to="/profile"
                className="block w-full text-center bg-slate-100 text-slate-900 px-6 py-3 rounded-lg font-bold"
                onClick={() => setIsOpen(false)}
              >
                My Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Member Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const Footer: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 8000);
      }, 1000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Top Banner: Newsletter */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Subscribe to our Newsletter</h3>
              <p className="text-slate-400">Receive expert-curated investment insights and market updates every Monday.</p>
            </div>

            <div className="w-full max-w-md">
              {subscribed ? (
                <div className="flex items-center justify-center lg:justify-start space-x-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl animate-in zoom-in duration-300">
                  <CheckCircle size={24} />
                  <span className="font-semibold">Success! You're now subscribed.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative">
                  <div className="flex p-1 bg-slate-800 rounded-2xl border border-slate-700 focus-within:border-emerald-500 transition-all">
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-transparent border-none px-4 py-3 w-full text-sm text-white focus:ring-0 placeholder-slate-500"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Subscribe</span>
                          <span className="sm:hidden"><Send size={18} /></span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-3 text-[10px] text-slate-500 text-center lg:text-left flex items-center justify-center lg:justify-start">
                    <Shield size={10} className="mr-1" /> Join 10,000+ smart investors. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-white">
              <TrendingUp className="text-emerald-400" size={24} />
              <span className="text-xl font-bold">InvestGrow India</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering Indian households to build long-term wealth through transparent, research-backed investment guidance.
            </p>
            <div className="flex space-x-3">
              <div className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors">
                <MessageCircle size={18} />
              </div>
              <div className="bg-slate-800 p-2 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors">
                <Mail size={18} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Our Philosophy</Link></li>
              <li><Link to="/plans" className="hover:text-emerald-400 transition-colors">Investment Plans</Link></li>
              <li><Link to="/learn" className="hover:text-emerald-400 transition-colors">Learning Hub</Link></li>
              <li><Link to="/disclaimer" className="hover:text-emerald-400 transition-colors">Risk Disclosures</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Our Services</h4>
            <ul className="space-y-4 text-sm">
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">SIP Planning</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Mutual Fund Advisory</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Tax Saving (ELSS)</li>
              <li className="hover:text-emerald-400 cursor-pointer transition-colors">Portfolio Review</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <Mail size={16} className="mr-3 text-emerald-400 mt-1" />
                <span>support@investgrow.in</span>
              </li>
              <li className="flex items-start">
                <Phone size={16} className="mr-3 text-emerald-400 mt-1" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start">
                <MapPin size={16} className="mr-3 text-emerald-400 mt-1" />
                <span>BKC, Mumbai, Maharashtra 400051</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-12 text-center text-xs text-slate-500 space-y-4">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <span className="flex items-center"><Shield size={12} className="mr-1 text-emerald-400" /> SEBI Registered Broker Associate</span>
            <span className="flex items-center"><Shield size={12} className="mr-1 text-emerald-400" /> ISO 27001 Certified Secure</span>
            <span className="flex items-center"><Shield size={12} className="mr-1 text-emerald-400" /> RBI Compliant Payments</span>
          </div>
          <p>© 2024 InvestGrow India Wealth Management. All rights reserved. <Link to="/admin" className="text-slate-800 hover:text-slate-700 ml-2">Admin</Link></p>
          <p className="max-w-4xl mx-auto leading-relaxed italic text-[10px]">
            *Mutual fund investments are subject to market risks, read all scheme related documents carefully.
            The value of investments can go up or down based on capital market forces.
            Registration and certification do not guarantee returns or performance.
          </p>
        </div>
      </div>
    </footer>
  );
};

const WhatsAppButton: React.FC = () => (
  <a
    href="https://wa.me/919876543210"
    target="_blank"
    rel="noopener noreferrer"
    className="floating-whatsapp bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center hover:shadow-[#25D366]/40"
    title="Chat on WhatsApp"
  >
    <MessageCircle size={28} />
  </a>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <Header />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
