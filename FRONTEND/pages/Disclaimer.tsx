
import React from 'react';
import { ShieldAlert, FileText, Info } from 'lucide-react';

const Disclaimer: React.FC = () => {
  return (
    <div className="pb-24">
      <section className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <ShieldAlert size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Disclaimer & Risk Disclosure</h1>
          </div>
          
          <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-slate-100 space-y-8 leading-relaxed text-slate-600">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">1. Market Risk</h2>
              <p>
                Mutual fund investments are subject to market risks, read all scheme related documents carefully. The value of investments can go up or down depending on the factors and forces affecting the capital markets.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">2. No Guaranteed Returns</h2>
              <p>
                InvestGrow India and its associates do not provide any guarantee or assurance of returns. Past performance of any scheme or portfolio is not necessarily an indicator of future performance. Users should be aware that investment involves the risk of loss of principal.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">3. Educational & Advisory Purpose</h2>
              <p>
                The information provided on this website, including blog posts, AI assistant responses, and investment plan details, is for educational and advisory purposes only. It should not be considered as a solicitation to buy or sell any specific financial product or security.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">4. Regulatory Compliance</h2>
              <p>
                InvestGrow India acts as an intermediary providing wealth management services. While we aim to be compliant with SEBI and RBI guidelines, users are encouraged to perform their own due diligence or consult with an independent financial advisor before making any investment decision.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">5. Tax Implications</h2>
              <p>
                Tax laws are subject to change and may vary based on individual circumstances. The ELSS and other tax-saving strategies mentioned on this site are based on current Indian Income Tax laws.
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start space-x-4">
              <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <p className="text-sm text-blue-800 font-medium">
                By using this website or our services, you acknowledge that you have read and understood these risks and agree to our terms of service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Disclaimer;
