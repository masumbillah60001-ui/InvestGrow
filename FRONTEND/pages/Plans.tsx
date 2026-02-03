
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, Zap, TrendingUp, Info } from 'lucide-react';
import { PLANS } from '../constants';

const Plans: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    // Redirect to Razorpay payment link
    window.open('https://rzp.io/rzp/E26rDDq', '_blank');
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">Tailored Investment Plans</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Choose a path that aligns with your financial goals and risk appetite. Start small, grow big.
          </p>
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
            <span className="flex items-center"><Info size={16} className="mr-2" /> No lock-in periods on most equity schemes</span>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col p-8 rounded-3xl border-2 transition-all duration-300 relative ${plan.id === 'growth'
                  ? 'border-blue-900 shadow-2xl scale-105 z-10 bg-white'
                  : 'border-slate-100 bg-white hover:border-blue-200 shadow-sm'
                }`}
            >
              {plan.id === 'growth' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-extrabold text-blue-900">{plan.minInvestment.split(' ')[0]}</span>
                  <span className="text-slate-500 font-medium">/ month</span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${plan.risk === 'Low' ? 'bg-emerald-100 text-emerald-700' :
                      plan.risk === 'Moderate' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                    }`}>
                    {plan.risk} Risk
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                <p className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Suitable For:</p>
                <p className="text-slate-600 text-sm leading-relaxed">{plan.suitableFor}</p>

                <p className="text-sm font-bold text-slate-900 uppercase tracking-wider pt-2">Includes:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-600">
                      <Check className="text-emerald-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${plan.id === 'growth'
                    ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-blue-900/20'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
              >
                Select This Plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-12 opacity-60">
          <div className="flex items-center space-x-3 grayscale hover:grayscale-0 transition-all">
            <Shield size={32} className="text-blue-900" />
            <span className="text-xl font-bold">Bank Grade Security</span>
          </div>
          <div className="flex items-center space-x-3 grayscale hover:grayscale-0 transition-all">
            <Zap size={32} className="text-emerald-500" />
            <span className="text-xl font-bold">Paperless KYC</span>
          </div>
          <div className="flex items-center space-x-3 grayscale hover:grayscale-0 transition-all">
            <TrendingUp size={32} className="text-blue-900" />
            <span className="text-xl font-bold">Expert Rebalancing</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Plans;
