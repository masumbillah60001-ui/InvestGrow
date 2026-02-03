
import React from 'react';
import { Target, Eye, Users, ShieldCheck, Heart, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pb-24">
      {/* Page Header */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Our Mission to Empower <br/><span className="text-emerald-400">Indian Investors</span></h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Founded with a vision to democratize wealth creation in India through transparency, education, and expert-led strategies.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">8+ Years of Navigating Indian Markets</h2>
            <p className="text-slate-600 leading-relaxed">
              InvestGrow India was born out of a simple observation: Most Indians want to invest, but few know where to start without feeling overwhelmed by complex jargon or fearing losses.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We specialize in SIP-based wealth creation, helping families build legacies by making consistent, small investments that grow significantly over time. We believe in "time in the market" over "timing the market."
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="p-4 bg-emerald-50 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600">100%</p>
                <p className="text-sm text-slate-600">Transparent Fees</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">Direct</p>
                <p className="text-sm text-slate-600">Fund Access</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl shadow-2xl overflow-hidden bg-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                alt="Our Modern Office Environment" 
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-emerald-500/20 rounded-full -z-10 blur-2xl"></div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 space-y-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold">Our Mission</h3>
              <p className="text-slate-600">To help 1 million Indian households achieve financial independence by providing honest and expert-backed investment advice.</p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <Eye size={32} />
              </div>
              <h3 className="text-2xl font-bold">Our Vision</h3>
              <p className="text-slate-600">To become India's most trusted wealth-tech platform, known for its ethical approach and user-first philosophy.</p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 space-y-6">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold">Our Values</h3>
              <p className="text-slate-600">Integrity, Transparency, and Education. We never sell products we wouldn't invest in ourselves.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
