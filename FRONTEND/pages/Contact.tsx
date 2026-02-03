
import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState('idle'); // idle, sending, success

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-slate-50 py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Let's Secure Your Future</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our advisors are ready to help you build a custom investment roadmap. No pressure, just professional guidance.
          </p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info Side */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Get in Touch</h2>
              <p className="text-slate-600 leading-relaxed">
                Whether you're just starting your career or planning for retirement, we have solutions for every life stage.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Support</h4>
                  <p className="text-slate-600">support@investgrow.in</p>
                  <p className="text-slate-400 text-sm">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Call Us</h4>
                  <p className="text-slate-600">+91 98765 43210</p>
                  <p className="text-slate-400 text-sm">Mon - Sat, 10:00 AM - 7:00 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Corporate Office</h4>
                  <p className="text-slate-600">BKC, Mumbai, Maharashtra 400051</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <a 
                href="https://wa.me/919876543210" 
                className="inline-flex items-center space-x-3 bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-[#25D366]/20 transition-all hover:-translate-y-1"
              >
                <MessageCircle size={24} />
                <span>Quick Help on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-2xl border border-slate-100 relative overflow-hidden">
            {formState === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-20">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Request Received!</h3>
                <p className="text-slate-600">Thank you for reaching out. One of our senior advisors will call you shortly.</p>
                <button onClick={() => setFormState('idle')} className="text-blue-900 font-bold underline">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-8">Schedule a Call</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-900" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <input required type="tel" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-900" placeholder="+91 00000 00000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input required type="email" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-900" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Interested In</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-900">
                    <option>SIP / Mutual Funds</option>
                    <option>Tax Saving (ELSS)</option>
                    <option>Retirement Planning</option>
                    <option>Stock Market Basics</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-900" placeholder="Tell us about your goals..."></textarea>
                </div>
                <button disabled={formState === 'sending'} className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50">
                  {formState === 'sending' ? 'Sending...' : (
                    <>
                      <span>Book Free Consultation</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
