
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, TrendingUp, Users, CheckCircle, ArrowRight, Award, Zap, BarChart2, Gift, Share2 } from 'lucide-react';
import { STATS, TESTIMONIALS } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold animate-bounce">
              <Shield size={16} className="mr-2" /> SECURE & TRUSTED BY 5,000+
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight">
              Grow Your Money <br />
              <span className="text-blue-900">the Smart Way</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
              Trusted investment guidance for long-term financial growth. Start your wealth-building journey with India's most transparent platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {/* Mobile Only Login Button */}
              <Link to="/login" className="w-full sm:hidden bg-blue-900 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-800 transition-all shadow-xl hover:shadow-blue-900/30 flex items-center justify-center">
                Member Login <ArrowRight size={20} className="ml-2" />
              </Link>

              <Link to="/plans" className="w-full sm:w-auto bg-blue-900 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-800 transition-all shadow-xl hover:shadow-blue-900/30 flex items-center justify-center hidden sm:flex">
                Start Investing <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link to="/contact" className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:border-blue-900 transition-all flex items-center justify-center">
                Free Consultation
              </Link>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4">
              <div className="flex items-center text-slate-500 text-sm">
                <CheckCircle size={18} className="text-emerald-500 mr-2" /> SEBI Compliant
              </div>
              <div className="flex items-center text-slate-500 text-sm">
                <CheckCircle size={18} className="text-emerald-500 mr-2" /> No Hidden Fees
              </div>
              <div className="flex items-center text-slate-500 text-sm">
                <CheckCircle size={18} className="text-emerald-500 mr-2" /> Verified Advisors
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 rounded-2xl shadow-2xl border-8 border-white overflow-hidden bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80&w=1200"
                alt="Growth Chart and Wealth Management"
                className="w-full aspect-square object-cover"
              />
            </div>
            {/* Overlay card */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-xl shadow-2xl flex items-center space-x-4 border border-slate-100">
              <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Historical CAGR</p>
                <p className="text-xl font-bold text-slate-900">12% - 15%*</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="bg-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {STATS.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-4xl lg:text-5xl font-extrabold text-white">{stat.value}</p>
                <p className="text-blue-200 font-medium tracking-wide uppercase text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refer & Earn High-Impact Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-16 text-white shadow-2xl">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase">
                  <Gift size={18} />
                  <span>Referral Rewards Program</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-black leading-tight">
                  Earn <span className="text-emerald-400">₹250 Cash</span> <br />
                  For Every Referral
                </h2>
                <p className="text-slate-400 text-lg max-w-xl">
                  Invite your friends to the world of smart investing. You both grow your wealth, and you get rewarded for every successful sign-up.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/signup"
                    className="flex items-center justify-center space-x-3 bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-500/20 group/btn"
                  >
                    <span>Get My Referral Link</span>
                    <Share2 size={20} className="group-hover/btn:rotate-12 transition-transform" />
                  </Link>
                  <div className="flex items-center justify-center space-x-3 text-slate-500 text-sm">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span>Instant Credit to Wallet</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 lg:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 bg-emerald-400/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-2xl animate-pulse"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-2xl">
                    <div className="text-center space-y-4">
                      <p className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">Total Earned</p>
                      <p className="text-5xl font-black text-white">₹7,500</p>
                      <div className="flex -space-x-2 justify-center">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                          </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-slate-900">
                          +30
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">30 Friends successfully joined</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Why Choose InvestGrow?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We combine modern technology with human expertise to simplify wealth management for every Indian household.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 border border-slate-100 group">
              <div className="w-14 h-14 bg-blue-100 text-blue-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Secure Planning</h3>
              <p className="text-slate-600 leading-relaxed">
                Your data and investments are protected with bank-grade encryption and compliant with Indian regulatory standards.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 border border-slate-100 group">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Expert Guidance</h3>
              <p className="text-slate-600 leading-relaxed">
                Get access to certified financial planners who help you navigate through market volatility with objective advice.
              </p>
            </div>

            <div className="p-8 bg-white rounded-2xl hover:shadow-2xl transition-all duration-300 border border-slate-100 group">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Long-Term Returns</h3>
              <p className="text-slate-600 leading-relaxed">
                Focus on disciplined investing through SIPs designed to harness the power of compounding for significant long-term wealth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Success Stories</h2>
              <p className="text-slate-600">Hear from our community of investors who are building their future with us.</p>
            </div>
            <div className="hidden md:flex space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(i => <Award key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-sm font-bold text-slate-700">4.9/5 Average Rating</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                <div className="flex text-yellow-400">
                  {[...Array(t.rating)].map((_, i) => <Award key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="italic text-slate-700 text-lg leading-relaxed">"{t.content}"</p>
                <div className="flex items-center pt-4 border-t border-slate-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-4">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl lg:text-5xl font-bold">Ready to Start Your Wealth Journey?</h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Join 5,000+ Indians who trust InvestGrow for their financial future. Get a free customized investment plan today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/plans" className="w-full sm:w-auto bg-emerald-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/20">
                  Choose a Plan
                </Link>
                <Link to="/contact" className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
