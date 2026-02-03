
import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowDownLeft, Lock, LogOut, ChevronRight, Wallet, Clock, CheckCircle2, AlertCircle, Building2, Hash, Smartphone, ShieldCheck, User, Eye, EyeOff, Coins, Zap } from 'lucide-react';
import { ACTIVE_ORDERS as MOCK_ORDERS, WITHDRAWAL_HISTORY } from '../constants';
import { InvestmentOrder } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'withdrawal' | 'password'>('orders');
  const [balance, setBalance] = useState<number>(() => {
    // Wait for userProfile to be initialized (it is initialized synchronously from localStorage above)
    // However, we need to read it inside this callback or assume it's stable.
    // Better practice: Retrieve ID directly here to avoid dependency issues during init.
    const savedProfile = localStorage.getItem('user_profile');
    const userId = savedProfile ? JSON.parse(savedProfile).id : 'guest';

    const saved = localStorage.getItem(`user_balance_${userId}`);
    return saved ? parseFloat(saved) : 0;
  });

  const [userProfile, setUserProfile] = useState<{ name: string, email: string }>(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : { name: 'Investor Account', email: 'investor@example.com' };
  });

  const [userOrders, setUserOrders] = useState<InvestmentOrder[]>(() => {
    const savedProfile = localStorage.getItem('user_profile');
    const userId = savedProfile ? JSON.parse(savedProfile).id : 'guest';

    const saved = localStorage.getItem(`user_orders_${userId}`);
    return saved ? JSON.parse(saved).map((o: InvestmentOrder) => ({
      ...o,
      // Backfill activationTime for existing local storage data if missing
      activationTime: o.activationTime || Date.now(),
      // MIGRATION: Fix broken/invisible images in saved data
      productImage: (o.productImage && (o.productImage.includes('photo-1611974717483') || o.productImage.includes('photo-1579621973595')))
        ? 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=800'
        : (o.productImage && o.productImage.includes('photo-1551288049'))
          ? 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800'
          : o.productImage || 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=800'
    })) : []; // Start empty for new users (removed MOCK_ORDERS default)
  });

  const navigate = useNavigate();

  // Change Password State
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passUpdated, setPassUpdated] = useState(false);

  // Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'upi'>('bank');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collectSuccess, setCollectSuccess] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const [currentSystemTime, setCurrentSystemTime] = useState(new Date());

  // Persist data
  useEffect(() => {
    if (userProfile.id) {
      localStorage.setItem(`user_balance_${userProfile.id}`, balance.toString());
      localStorage.setItem(`user_orders_${userProfile.id}`, JSON.stringify(userOrders));
    }
  }, [balance, userOrders, userProfile.id]);

  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const newTimeLeft: { [key: string]: string } = {};

      userOrders.forEach(order => {
        if (order.status === 'Active') {
          // If activationTime exists, use it. Otherwise assume start of day (fallback for old orders)
          const startTime = order.activationTime || new Date(order.startDate).getTime();

          // Next collection time = Start Time + (Days Collected + 1) * 24 hours
          const nextCollectionTime = startTime + ((order.daysCollected + 1) * 24 * 60 * 60 * 1000);
          const diff = nextCollectionTime - now;

          if (diff > 0) {
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            newTimeLeft[order.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          } else {
            newTimeLeft[order.id] = "00:00:00";
          }
        }
      });

      setTimeLeft(newTimeLeft);
      setCurrentSystemTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [userOrders]);

  const parseTime = (timeStr: string | undefined): number => {
    if (!timeStr) return 0;
    const [h, m, s] = timeStr.split(':').map(Number);
    return (h * 3600 + m * 60 + s) * 1000;
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate('/login');
    }
  };

  const isToday = (dateString: string | null | undefined) => {
    if (!dateString) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const handleCollectProfit = (orderId: string) => {
    const today = new Date().toISOString().split('T')[0];

    setUserOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id === orderId) {
          if (isToday(order.lastCollectedDate)) {
            return order;
          }

          if (order.daysCollected >= order.duration) {
            return { ...order, status: 'Completed' as const };
          }

          // Update balance and timestamps
          setBalance(prev => prev + order.dailyReturn);
          setCollectSuccess(`₹${order.dailyReturn} collected from ${order.productName}`);
          setTimeout(() => setCollectSuccess(null), 4000);

          return {
            ...order,
            daysCollected: order.daysCollected + 1,
            lastCollectionTimestamp: Date.now(), // Reset timer anchor to NOW
            // We don't rely on lastCollectedDate for "today" check anymore, as we rely on the timer
            lastCollectedDate: new Date().toISOString().split('T')[0],
            status: (order.daysCollected + 1) >= order.duration ? 'Completed' : 'Active'
          };
        }
        return order;
      });
    });
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Rule 1: Minimum ₹500
    const amount = parseFloat(withdrawAmount);
    if (amount < 500) {
      setError("Minimum withdrawal amount is ₹500.");
      return;
    }

    if (amount > balance) {
      setError("Insufficient balance in your wallet.");
      return;
    }

    // Rule 2: Active Plan Check
    const hasActivePlan = userOrders.some(order => order.status === 'Active');
    if (hasActivePlan) {
      setError("Withdrawal Denied: You have an active investment plan. Please wait until your current portfolio reaches 100% completion (30/30 days) to withdraw funds.");
      return;
    }

    setWithdrawSuccess(true);
    setBalance(prev => prev - amount);
  };

  const renderSidebar = () => (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-fit">
      <div className="p-6 border-b border-slate-100 flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-lg">
          I
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{userProfile.name || 'Investor'}</p>
          <p className="text-xs text-slate-500">{userProfile.email}</p>
        </div>
      </div>
      <nav className="p-2">
        <button
          onClick={() => { setActiveTab('orders'); setError(null); }}
          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <div className="flex items-center space-x-3">
            <ShoppingBag size={20} />
            <span>My Orders</span>
          </div>
          <ChevronRight size={16} className={activeTab === 'orders' ? 'opacity-100' : 'opacity-30'} />
        </button>
        <button
          onClick={() => { setActiveTab('withdrawal'); setError(null); }}
          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'withdrawal' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <div className="flex items-center space-x-3">
            <ArrowDownLeft size={20} />
            <span>Withdrawal</span>
          </div>
          <ChevronRight size={16} className={activeTab === 'withdrawal' ? 'opacity-100' : 'opacity-30'} />
        </button>
        <button
          onClick={() => { setActiveTab('password'); setError(null); }}
          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'password' ? 'bg-blue-50 text-blue-900 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <div className="flex items-center space-x-3">
            <Lock size={20} />
            <span>Change Password</span>
          </div>
          <ChevronRight size={16} className={activeTab === 'password' ? 'opacity-100' : 'opacity-30'} />
        </button>
        <div className="pt-2 mt-2 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-4 rounded-2xl text-red-600 hover:bg-red-50 transition-all font-bold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );

  const renderMobileTabs = () => (
    <div className="flex overflow-x-auto space-x-2 pb-4 mb-6 md:hidden scrollbar-hide">
      {[
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'withdrawal', label: 'Withdraw', icon: ArrowDownLeft },
        { id: 'password', label: 'Security', icon: Lock }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => { setActiveTab(tab.id as any); setError(null); }}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full whitespace-nowrap font-bold transition-all text-sm border ${activeTab === tab.id ? 'bg-blue-900 text-white border-blue-900 shadow-lg shadow-blue-900/20' : 'bg-white text-slate-500 border-slate-200'}`}
        >
          <tab.icon size={16} />
          <span>{tab.label}</span>
        </button>
      ))}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 px-6 py-3 rounded-full whitespace-nowrap font-bold text-red-600 border border-red-100 bg-red-50"
      >
        <LogOut size={16} />
        <span>Exit</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      {/* Global Toast for Collection */}
      {collectSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-500">
          <div className="bg-blue-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-blue-700">
            <Coins className="text-emerald-400" size={24} />
            <span className="font-bold">{collectSuccess}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            {renderSidebar()}
            <div className="mt-6 p-6 bg-blue-900 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
              <ShieldCheck className="mb-4 text-emerald-400" size={32} />
              <p className="text-sm font-bold">Secure Environment</p>
              <p className="text-[10px] text-blue-200 mt-1">Your data is protected with bank-grade encryption.</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900">My Profile</h1>
                <p className="text-slate-500 font-medium">Manage your portfolio, funds, and account security.</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="text-right mr-2 hidden sm:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Time</p>
                  <p className="text-sm font-bold text-blue-900 tabular-nums">
                    {currentSystemTime.toLocaleTimeString()} <span className="text-xs text-slate-400">|</span> {currentSystemTime.toLocaleDateString()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                  <Wallet size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Balance</p>
                  <p className="text-xl font-black text-slate-900">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>

            {renderMobileTabs()}

            {/* TAB: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900">Active Portfolios</h2>
                  <Link to="/dashboard" className="text-blue-900 text-sm font-bold hover:underline">View Marketplace</Link>
                </div>

                {userOrders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userOrders.map((order) => (
                      <div key={order.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm group">
                        <div className="relative h-32 bg-slate-100 overflow-hidden">
                          <img
                            src={
                              order.productName === 'Bluechip Technology Fund'
                                ? 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800'
                                : (order.productName === 'Nifty 50 Growth Fund'
                                  ? 'https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=800'
                                  : order.productImage)
                            }
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                            alt={order.productName}
                            onError={(e) => {
                              // Fallback if even the new URL fails
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1611974717483-3600997e57ad?auto=format&fit=crop&q=80&w=800';
                            }}
                          />
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-slate-900">{order.productName}</h3>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{order.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-400 font-bold uppercase">Invested</p>
                              <p className="text-lg font-black text-blue-900">₹{order.investAmount}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Daily Yield</p>
                              <p className="font-bold text-emerald-600">₹{order.dailyReturn}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Term Return</p>
                              <p className="font-bold text-slate-900">₹{order.totalReturn}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-slate-400">Time to Next Profit</span>
                              <span className="text-blue-900">{timeLeft[order.id] || "Calculating..."}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-900 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${(1 - (parseTime(timeLeft[order.id]) / (24 * 60 * 60 * 1000))) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          {order.status !== 'Completed' && (
                            <button
                              disabled={timeLeft[order.id] !== "00:00:00" && timeLeft[order.id] !== undefined}
                              onClick={() => handleCollectProfit(order.id)}
                              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${(timeLeft[order.id] !== "00:00:00" && timeLeft[order.id] !== undefined)
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 animate-pulse'
                                }`}
                            >
                              {(timeLeft[order.id] !== "00:00:00" && timeLeft[order.id] !== undefined) ? (
                                <>
                                  <Clock size={18} />
                                  <span>Wait for Timer ({timeLeft[order.id]})</span>
                                </>
                              ) : (
                                <>
                                  <Zap size={18} />
                                  <span>Collect Daily Profit (₹{order.dailyReturn})</span>
                                </>
                              )}
                            </button>
                          )}

                          {order.status === 'Completed' && (
                            <div className="w-full py-3 bg-blue-50 text-blue-900 rounded-xl font-bold flex items-center justify-center space-x-2">
                              <CheckCircle2 size={18} />
                              <span>Term Completed & Collected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 border-dashed">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">You have no active orders yet.</p>
                    <Link to="/dashboard" className="mt-4 inline-block bg-blue-900 text-white px-6 py-2 rounded-full font-bold text-sm">Explore Funds</Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Withdrawal */}
            {activeTab === 'withdrawal' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-6">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Wallet size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Balance</p>
                      <p className="text-3xl font-black text-slate-900">₹{balance.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-6">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Clock size={32} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Payouts</p>
                      <p className="text-3xl font-black text-slate-900">₹0.00</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center space-x-3 text-slate-900">
                    <ArrowDownLeft size={24} className="text-blue-900" />
                    <h2 className="text-xl font-bold">Initiate Withdrawal</h2>
                  </div>

                  <div className="p-8">
                    {withdrawSuccess ? (
                      <div className="text-center py-8 space-y-4 animate-in zoom-in">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-xl font-bold">Request Submitted!</h3>
                        <p className="text-slate-500 max-sm mx-auto">Your withdrawal is being verified. Funds will be credited to your account within 24-72 hours.</p>
                        <button onClick={() => setWithdrawSuccess(false)} className="text-blue-900 font-bold underline">Make another request</button>
                      </div>
                    ) : (
                      <form onSubmit={handleWithdrawSubmit} className="max-w-xl space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Withdrawal Amount (₹)</label>
                          <input
                            required
                            type="number"
                            min="500"
                            value={withdrawAmount}
                            onChange={(e) => { setWithdrawAmount(e.target.value); setError(null); }}
                            placeholder="Min. ₹500"
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xl font-bold focus:ring-2 focus:ring-blue-900 transition-all"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transfer Method</label>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              type="button"
                              onClick={() => setWithdrawMethod('bank')}
                              className={`p-4 rounded-2xl border flex flex-col items-center space-y-2 transition-all ${withdrawMethod === 'bank' ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-600 border-slate-200'}`}
                            >
                              <Building2 size={20} />
                              <span className="text-sm font-bold">Bank Transfer</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setWithdrawMethod('upi')}
                              className={`p-4 rounded-2xl border flex flex-col items-center space-y-2 transition-all ${withdrawMethod === 'upi' ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-600 border-slate-200'}`}
                            >
                              <Smartphone size={20} />
                              <span className="text-sm font-bold">UPI ID</span>
                            </button>
                          </div>
                        </div>

                        {withdrawMethod === 'bank' ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Account Holder</label>
                              <input required type="text" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm" placeholder="Full Name" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Account Number</label>
                              <input required type="text" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm" placeholder="1234 5678 9000" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">IFSC Code</label>
                              <input required type="text" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm" placeholder="SBIN0001234" />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 animate-in fade-in duration-300">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">UPI ID</label>
                            <input required type="text" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm" placeholder="username@bank" />
                          </div>
                        )}

                        <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl space-y-3">
                          <div className="flex items-center text-blue-900 space-x-2">
                            <ShieldCheck size={18} />
                            <span className="text-sm font-bold uppercase tracking-wider">Withdrawal Rules</span>
                          </div>
                          <ul className="text-xs text-blue-700 space-y-2 list-disc pl-5 font-medium leading-relaxed">
                            <li>Minimum withdrawal amount is strictly <strong>₹500</strong>.</li>
                            <li>Withdrawal is only enabled after your <strong>Active Plan</strong> reaches 100% completion (30/30 days).</li>
                            <li>Withdrawals follow standard verification cycles (24-48 hours).</li>
                          </ul>
                        </div>

                        {error && (
                          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3 text-red-700 animate-in slide-in-from-top-2">
                            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                            <p className="text-xs font-bold leading-relaxed">{error}</p>
                          </div>
                        )}

                        <button type="submit" className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20">
                          Submit Request
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* History Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 font-bold text-slate-900">Recent Transactions</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                          <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                          <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</th>
                          <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {WITHDRAWAL_HISTORY.map((w) => (
                          <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5 text-sm font-medium text-slate-600">{w.date}</td>
                            <td className="px-8 py-5 text-sm font-black text-slate-900">₹{w.amount.toLocaleString()}</td>
                            <td className="px-8 py-5 text-sm text-slate-500">{w.method}</td>
                            <td className="px-8 py-5 text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${w.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                {w.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Change Password */}
            {activeTab === 'password' && (
              <div className="max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center space-x-3 text-slate-900">
                    <Lock size={24} className="text-blue-900" />
                    <h2 className="text-xl font-bold">Update Security</h2>
                  </div>

                  <div className="p-8">
                    {passUpdated ? (
                      <div className="text-center py-10 space-y-4 animate-in zoom-in">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-xl font-bold">Password Updated!</h3>
                        <p className="text-slate-500">Your security credentials have been refreshed successfully.</p>
                        <button onClick={() => setPassUpdated(false)} className="text-blue-900 font-bold underline">Go back</button>
                      </div>
                    ) : (
                      <form onSubmit={(e) => { e.preventDefault(); setPassUpdated(true); }} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Password</label>
                          <div className="relative">
                            <input
                              required
                              type={showCurrentPass ? "text" : "password"}
                              className="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-900"
                              placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                              {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">New Password</label>
                          <div className="relative">
                            <input
                              required
                              type={showNewPass ? "text" : "password"}
                              className="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-900"
                              placeholder="Min. 8 characters"
                            />
                            <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                              {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Confirm New Password</label>
                          <div className="relative">
                            <input
                              required
                              type={showConfirmPass ? "text" : "password"}
                              className="w-full pl-6 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 focus:ring-2 focus:ring-blue-900"
                              placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                              {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl space-y-3">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Password Requirements:</p>
                          <ul className="space-y-2">
                            {["At least 8 characters long", "Include at least one number", "Include one special character (@#$!)"].map((rule, i) => (
                              <li key={i} className="flex items-center text-xs text-slate-600">
                                <div className="w-1 h-1 bg-blue-900 rounded-full mr-2"></div>
                                {rule}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20">
                          Update Password
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center space-x-2 text-[10px] text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={14} />
                  <span>Account security is our top priority</span>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="mt-24 border-t border-slate-200 pt-8 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex space-x-6">
            <Link to="/disclaimer" className="hover:text-blue-900 transition-colors">Privacy Policy</Link>
            <Link to="/disclaimer" className="hover:text-blue-900 transition-colors">Terms of Use</Link>
            <Link to="/disclaimer" className="hover:text-blue-900 transition-colors">Disclaimer</Link>
          </div>
          <p>© 2026 InvestGrow India. Secure Member Portal.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
