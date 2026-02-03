
import React, { useState } from 'react';
import { Search, BookOpen, MessageSquare, Send, Sparkles } from 'lucide-react';
import { BLOGS } from '../constants';
import { getInvestmentAssistantResponse } from '../services/geminiService';

const Learn: React.FC = () => {
  const [query, setQuery] = useState('');
  const [assistantMsg, setAssistantMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'bot', text: string}[]>([]);

  const handleAssistantAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    const botResponse = await getInvestmentAssistantResponse(userMsg);
    setChatHistory(prev => [...prev, { role: 'bot', text: botResponse }]);
    setLoading(false);
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl font-bold">InvestGrow Learning Center</h1>
          <p className="text-blue-200 max-w-2xl mx-auto text-lg">
            Master the basics of Indian markets, from SIPs to tax saving. Education is your best investment.
          </p>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="max-w-4xl mx-auto px-4 -mt-12 mb-24">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-emerald-500 p-4 text-white flex items-center space-x-2">
            <Sparkles size={20} />
            <span className="font-bold">Smart Investment Assistant</span>
          </div>
          <div className="p-6 h-96 overflow-y-auto space-y-4 bg-slate-50">
            {chatHistory.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <MessageSquare className="mx-auto mb-4 opacity-20" size={48} />
                <p>Ask me anything about SIP, Stocks, or Mutual Funds in India.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["What is an SIP?", "How to save tax with ELSS?", "Equity vs Debt"].map(q => (
                    <button 
                      key={q} 
                      onClick={() => setQuery(q)}
                      className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-emerald-500 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {chatHistory.map((chat, i) => (
              <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${chat.role === 'user' ? 'bg-blue-900 text-white' : 'bg-white text-slate-700 shadow-sm border border-slate-100'}`}>
                  {chat.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-slate-400 flex items-center">
                  <div className="flex space-x-1 mr-2">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                  Thinking...
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleAssistantAsk} className="p-4 bg-white border-t flex space-x-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., How does compounding work?"
              className="flex-grow px-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-1 focus:ring-emerald-500"
            />
            <button disabled={loading} className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50">
              <Send size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Expert Articles</h2>
            <p className="text-slate-600">Deep dives into wealth management strategies.</p>
          </div>
          <div className="hidden md:flex bg-slate-100 p-1 rounded-lg">
            <button className="px-4 py-2 bg-white rounded-md shadow-sm text-sm font-bold">All</button>
            <button className="px-4 py-2 text-sm text-slate-600 hover:text-blue-900 transition-colors">SIP</button>
            <button className="px-4 py-2 text-sm text-slate-600 hover:text-blue-900 transition-colors">Stocks</button>
            <button className="px-4 py-2 text-sm text-slate-600 hover:text-blue-900 transition-colors">Tax</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {BLOGS.map((blog) => (
            <article key={blog.id} className="group cursor-pointer">
              <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[4/3]">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-900">
                  {blog.category}
                </div>
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">{blog.date}</p>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-900 transition-colors">
                {blog.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">{blog.excerpt}</p>
              <div className="flex items-center text-blue-900 font-bold text-sm">
                Read Full Article <BookOpen size={16} className="ml-2" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Learn;
