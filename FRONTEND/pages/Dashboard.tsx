
import React, { useState, useRef, useEffect } from 'react';
import { Wallet, Laptop, Calendar, AlertCircle, ArrowUpRight, Lock, ShieldCheck, ChevronRight, X, CreditCard, CheckCircle2, Info, ArrowDownLeft, Building2, Hash, Copy, Smartphone, Upload, Camera } from 'lucide-react';
import { DASHBOARD_PLANS } from '../constants';
import { InvestmentOrder } from '../types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number>(() => {
    const savedProfile = localStorage.getItem('user_profile');
    const userId = savedProfile ? JSON.parse(savedProfile).id : 'guest';
    const saved = localStorage.getItem(`user_balance_${userId}`);
    return saved ? parseFloat(saved) : 0;
  });

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [showUpiScreen, setShowUpiScreen] = useState(false);
  const [showUtrScreen, setShowUtrScreen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [bankAccount, setBankAccount] = useState<string>('');
  const [ifscCode, setIfscCode] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successType, setSuccessType] = useState<'deposit' | 'withdraw' | 'activate' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userName = "Investor";

  // Persist balance
  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      const userId = JSON.parse(savedProfile).id;
      localStorage.setItem(`user_balance_${userId}`, balance.toString());
    }
  }, [balance]);

  const handleInitialDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amount = parseFloat(depositAmount);

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (amount < 250) {
      setError("Minimum deposit amount is ₹250.");
      return;
    }

    setShowUpiScreen(true);
  };

  const goToUtrScreen = () => {
    setShowUpiScreen(false);
    setShowUtrScreen(true);
  };

  const finalizeDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    // BYPASS: Validation disabled for demo/testing
    // if (!utrNumber || !screenshot) {
    //   setError("UTR Number and Payment Screenshot are mandatory.");
    //   return;
    // }

    setIsSuccess(true);
    setSuccessType('deposit');
    const amount = parseFloat(depositAmount);

    setTimeout(() => {
      setBalance(prev => prev + amount);
      setIsSuccess(false);
      setSuccessType(null);
      setIsDepositModalOpen(false);
      setShowUpiScreen(false);
      setShowUtrScreen(false);
      setDepositAmount('');
      setUtrNumber('');
      setScreenshot(null);
      setError(null);
    }, 2500);
  };
  // ... (inside return)
  <a
    href="#" // Disabled actual link
    // target="_blank"
    // rel="noopener noreferrer"
    onClick={(e) => {
      e.preventDefault(); // Prevent navigation
      const newPayment = {
        id: `PAY-${Date.now()}`,
        user: userName,
        amount: parseFloat(depositAmount),
        status: 'Success', // Auto-mark success
        method: 'Simulated UPI',
        date: new Date().toLocaleString()
      };
      const existing = JSON.parse(localStorage.getItem('admin_payments') || '[]');
      localStorage.setItem('admin_payments', JSON.stringify([newPayment, ...existing]));

      // LOGGING: Deposit Attempt
      const newLog = {
        id: `LOG-${Date.now()}`,
        type: 'DEPOSIT',
        message: `User ${userName} simulated ₹${depositAmount} deposit.`,
        time: new Date().toLocaleTimeString()
      };
      const existingLogs = JSON.parse(localStorage.getItem('admin_system_logs') || '[]');
      localStorage.setItem('admin_system_logs', JSON.stringify([newLog, ...existingLogs]));

      alert("Payment Simulated! Click 'CONTINUE' to proceed.");
    }}
    className="flex items-center space-x-2 w-full bg-slate-100 px-5 py-4 rounded-2xl font-bold text-slate-900 justify-between border-2 border-slate-200 hover:border-blue-900 hover:bg-white transition-all cursor-pointer"
  >
    <span className="text-lg">Simulate Payment (Bypass)</span>
    <ArrowUpRight size={20} className="text-blue-900" />
  </a>
                  </div >

                  <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100 flex items-start space-x-3">
                    <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-orange-800 leading-relaxed">
                      Click the button above to simulate a transfer. Then click "CONTINUE" to add funds immediately without UTR.
                    </p>
                  </div>

                  <button
                    onClick={(e) => finalizeDeposit(e)} // Directly finish instead of going to UTR screen?
                    // Or keep flow but allow empty inputs. Let's just go to success??
                    // The user said "successful continue button block".
                    // Let's make "CONTINUE" actually perform the deposit now that we simulated payment.
                    // onClick={finalizeDeposit} 
                    className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center space-x-2 group"
                  >
                    <span>CONTINUE & FINISH</span>
                    <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

const handleWithdraw = (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  // Rule Check: Active Plan
  const savedProfile = localStorage.getItem('user_profile');
  const userId = savedProfile ? JSON.parse(savedProfile).id : 'guest';
  const savedOrders = localStorage.getItem(`user_orders_${userId}`);
  const orders: InvestmentOrder[] = savedOrders ? JSON.parse(savedOrders) : [];
  const hasActivePlan = orders.some(order => order.status === 'Active');

  if (hasActivePlan) {
    setError("Withdrawal Blocked: You must complete and collect your current active investment plan fully (30/30 days) before making a withdrawal.");
    return;
  }

  const amount = parseFloat(withdrawAmount);

  if (isNaN(amount) || amount <= 0) {
    setError("Please enter a valid amount.");
    return;
  }

  if (amount < 500) {
    setError("Minimum withdrawal amount is ₹500.");
    return;
  }

  if (amount > balance) {
    setError("Insufficient balance in your wallet.");
    return;
  }

  setIsSuccess(true);
  setSuccessType('withdraw');
  setTimeout(() => {
    setBalance(prev => prev - amount);
    setIsSuccess(false);
    setSuccessType(null);
    setIsWithdrawModalOpen(false);
    setWithdrawAmount('');
    setBankAccount('');
    setIfscCode('');
    setError(null);
  }, 2000);
};

const handleActivatePlan = (plan: any) => {
  if (balance < plan.investAmount) {
    setError("Insufficient balance to activate this plan. Please deposit funds.");
    setIsDepositModalOpen(true);
    return;
  }

  setIsSuccess(true);
  setSuccessType('activate');
  setBalance(prev => prev - plan.investAmount);

  // Add to orders
  const newOrder: InvestmentOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    productName: plan.productName,
    productImage: plan.image,
    investAmount: plan.investAmount,
    dailyReturn: plan.dailyReturn,
    totalReturn: plan.dailyReturn * 30,
    duration: 30,
    currentDay: 0,
    daysCollected: 0,
    status: 'Active',
    startDate: new Date().toISOString().split('T')[0],
    activationTime: Date.now(),
    lastCollectedDate: null
  };

  const savedProfile = localStorage.getItem('user_profile');
  const userId = savedProfile ? JSON.parse(savedProfile).id : 'guest';

  // 1. Save to User's Private List
  const savedOrders = localStorage.getItem(`user_orders_${userId}`);
  const existingOrders: InvestmentOrder[] = savedOrders ? JSON.parse(savedOrders) : [];
  localStorage.setItem(`user_orders_${userId}`, JSON.stringify([newOrder, ...existingOrders]));

  // 2. Save to Admin's Global List (for monitoring)
  const savedAdminOrders = localStorage.getItem('admin_all_orders');
  const existingAdminOrders: InvestmentOrder[] = savedAdminOrders ? JSON.parse(savedAdminOrders) : [];
  // Append with user info if needed, but for now just raw copy
  const orderWithUser = { ...newOrder, userId: userId, userName: userName };
  localStorage.setItem('admin_all_orders', JSON.stringify([orderWithUser, ...existingAdminOrders]));

  setTimeout(() => {
    setIsSuccess(false);
    setSuccessType(null);
  }, 3000);
};

const copyToClipboard = () => {
  navigator.clipboard.writeText('indiagrow@ybl');
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setScreenshot(e.target.files[0]);
    setError(null);
  }
};

const quickAmounts = [500, 1000, 5000, 10000];

return (
  <div className="min-h-screen bg-slate-50 pb-20">
    {/* Success Notification Overlay */}
    {isSuccess && successType === 'activate' && (
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-500">
        <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-emerald-400">
          <CheckCircle2 size={24} />
          <span className="font-bold">Portfolio Activated Successfully!</span>
        </div>
      </div>
    )}

    {/* Dashboard Header */}
    <header className="bg-white border-b border-slate-200 pt-10 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome, <span className="text-blue-900">{userName}</span></h1>
            <p className="text-slate-500 font-medium">Select an active investment plan to begin building your wealth.</p>
          </div>

          <div className="bg-blue-900 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20 flex items-center space-x-6">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
              <Wallet className="text-emerald-400" size={24} />
            </div>
            <div className="flex-grow">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Total Balance</p>
              <p className="text-3xl font-extrabold tracking-tight">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setError(null);
                  setShowUpiScreen(false);
                  setShowUtrScreen(false);
                  setIsDepositModalOpen(true);
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center shadow-lg shadow-emerald-500/20 whitespace-nowrap"
              >
                Deposit
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setIsWithdrawModalOpen(true);
                }}
                className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center shadow-lg shadow-slate-900/20 whitespace-nowrap"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      {/* Investment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {DASHBOARD_PLANS.map((plan) => (
          <div
            key={plan.id}
            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative"
          >
            {plan.isLocked && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mb-4">
                  <Lock size={28} />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Premium Strategy</h4>
                <p className="text-xs text-slate-500 max-w-[200px] mt-1">Upgrade your account to unlock high-yield institutional portfolios.</p>
              </div>
            )}

            <div className="relative h-48 overflow-hidden bg-slate-200">
              <img
                src={plan.image}
                alt={plan.productName}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1 border border-slate-100 shadow-sm">
                <Calendar size={12} className="text-blue-900" />
                <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-widest">30 Days Cycle</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.productName}</h3>
                <p className="text-xs text-slate-500 flex items-center font-medium">
                  <ShieldCheck size={12} className="mr-1 text-emerald-500" /> Institutional Grade Asset
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initial Investment</p>
                  <p className="text-xl font-extrabold text-slate-900">₹{plan.investAmount.toLocaleString()}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Daily Yield</p>
                  <p className="text-xl font-extrabold text-emerald-500">₹{plan.dailyReturn.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Total Return</span>
                  <span className="text-lg font-black text-blue-900">₹{(plan.dailyReturn * 30).toLocaleString()}</span>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-6">
                  <div className="bg-blue-900 h-full w-[3.33%] rounded-full"></div>
                </div>

                <button
                  onClick={() => handleActivatePlan(plan)}
                  className="w-full bg-blue-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-800 transition-all group/btn shadow-lg shadow-blue-900/10"
                >
                  <span>{balance < plan.investAmount ? 'Insufficient Balance' : 'Activate Portfolio'}</span>
                  <ArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notice Section */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16"></div>
          <div className="flex items-start space-x-6">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Platform Guidelines</h2>
              <ul className="space-y-3">
                {[
                  "All performance figures are based on current market metrics and historical data analysis.",
                  "Asset returns may fluctuate based on market volatility and macroeconomic factors.",
                  "Portfolio activation is processed instantly once the wallet has sufficient balance.",
                  "Real investments in capital markets carry inherent risks. Consult your financial advisor."
                ].map((text, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-600 leading-relaxed">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Link */}
      <div className="mt-12 text-center">
        <Link to="/contact" className="inline-flex items-center space-x-2 text-slate-500 hover:text-blue-900 transition-colors font-medium">
          <span>Need professional assistance with these strategies?</span>
          <span className="font-bold underline flex items-center">Consult Support <ChevronRight size={14} /></span>
        </Link>
      </div>
    </main>

    {/* Deposit Modal */}
    {isDepositModalOpen && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSuccess && setIsDepositModalOpen(false)}></div>
        <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
          {isSuccess && successType === 'deposit' ? (
            <div className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Deposit Received!</h3>
                <p className="text-slate-500">Your verification request has been submitted. Funds will reflect in your wallet after internal audit.</p>
              </div>
            </div>
          ) : showUtrScreen ? (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Verification Details</h3>
                <button onClick={() => setShowUtrScreen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={finalizeDeposit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">UTR / Transaction ID <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="12 Digit UTR Number"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-900 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Payment Screenshot <span className="text-red-500">*</span></label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${screenshot ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-blue-900 bg-slate-50'}`}
                  >
                    {screenshot ? (
                      <>
                        <CheckCircle2 className="text-emerald-500" size={32} />
                        <p className="text-sm font-bold text-emerald-700">Screenshot Attached</p>
                        <p className="text-[10px] text-emerald-600">{screenshot.name}</p>
                      </>
                    ) : (
                      <>
                        <Upload className="text-slate-400" size={32} />
                        <p className="text-sm font-bold text-slate-600">Click to Upload Screenshot</p>
                        <p className="text-[10px] text-slate-400 uppercase">JPEG, PNG only</p>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 rounded-xl flex items-center space-x-2 text-red-600 animate-in fade-in">
                    <AlertCircle size={16} />
                    <span className="text-xs font-bold">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center space-x-2"
                >
                  <ShieldCheck size={20} />
                  <span>Confirm Deposit</span>
                </button>
              </form>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-medium">
                <Lock size={12} />
                <span>Secured SSL Encrypted Verification</span>
              </div>
            </div>
          ) : showUpiScreen ? (
            <div className="p-8 space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">UPI Payment</h3>
                <button onClick={() => setShowUpiScreen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl flex flex-col items-center space-y-2">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Payable Amount</p>
                <p className="text-4xl font-black text-slate-900">₹{parseFloat(depositAmount).toLocaleString()}</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complete Payment</label>
                  <a
                    href="https://rzp.io/rzp/E26rDDq"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      const newPayment = {
                        id: `PAY-${Date.now()}`,
                        user: userName,
                        amount: parseFloat(depositAmount),
                        status: 'Pending', // Razorpay link clicked
                        method: 'Razorpay UPI',
                        date: new Date().toLocaleString()
                      };
                      const existing = JSON.parse(localStorage.getItem('admin_payments') || '[]');
                      localStorage.setItem('admin_payments', JSON.stringify([newPayment, ...existing]));

                      // LOGGING: Deposit Attempt
                      const newLog = {
                        id: `LOG-${Date.now()}`,
                        type: 'DEPOSIT',
                        message: `User ${userName} clicked for ₹${depositAmount} deposit via Razorpay.`,
                        time: new Date().toLocaleTimeString()
                      };
                      const existingLogs = JSON.parse(localStorage.getItem('admin_system_logs') || '[]');
                      localStorage.setItem('admin_system_logs', JSON.stringify([newLog, ...existingLogs]));
                    }}
                    className="flex items-center space-x-2 w-full bg-slate-100 px-5 py-4 rounded-2xl font-bold text-slate-900 justify-between border-2 border-slate-200 hover:border-blue-900 hover:bg-white transition-all"
                  >
                    <span className="text-lg">Click to Pay via Razorpay</span>
                    <ArrowUpRight size={20} className="text-blue-900" />
                  </a>
                </div>

                <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100 flex items-start space-x-3">
                  <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-orange-800 leading-relaxed">
                    Click the link above to transfer <span className="font-bold">₹{parseFloat(depositAmount).toLocaleString()}</span> via UPI/Card. After payment, click "CONTINUE".
                  </p>
                </div>

                <button
                  onClick={goToUtrScreen}
                  className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center space-x-2 group"
                >
                  <span>CONTINUE</span>
                  <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-medium">
                <Smartphone size={12} />
                <span>Works with all major UPI apps in India</span>
              </div>
            </div>
          ) : (
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 text-blue-900">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <CreditCard size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Deposit Funds</h3>
                </div>
                <button onClick={() => setIsDepositModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleInitialDeposit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount to Add (₹)</label>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Min: ₹250</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
                    <input
                      autoFocus
                      required
                      type="number"
                      min="250"
                      value={depositAmount}
                      onChange={(e) => {
                        setDepositAmount(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="0.00"
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border ${error ? 'border-red-500' : 'border-transparent'} focus:border-blue-900 rounded-2xl text-2xl font-bold text-slate-900 transition-all focus:ring-0`}
                    />
                  </div>
                  {error && (
                    <p className="text-xs font-bold text-red-500 flex items-center mt-2 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={12} className="mr-1" /> {error}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {quickAmounts.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setDepositAmount(amt.toString());
                        setError(null);
                      }}
                      className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:border-blue-900 hover:text-blue-900 transition-all text-sm"
                    >
                      + ₹{amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <button type="submit" className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20">
                  Secure Deposit
                </button>

                <div className="bg-slate-50 p-3 rounded-xl flex items-start space-x-3">
                  <Info size={16} className="text-slate-400 mt-0.5" />
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Transactions are secured with bank-grade encryption. Funds are added to your wallet after verification.
                  </p>
                </div>

                <p className="text-[10px] text-center text-slate-400 flex items-center justify-center space-x-1">
                  <ShieldCheck size={12} />
                  <span>Verified PCI-DSS Compliant Gateway</span>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    )}

    {/* Withdrawal Modal */}
    {isWithdrawModalOpen && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSuccess && setIsWithdrawModalOpen(false)}></div>
        <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
          {isSuccess && successType === 'withdraw' ? (
            <div className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Request Initiated!</h3>
                <p className="text-slate-500">Your withdrawal request is being processed. Funds will be credited within 24-48 hours.</p>
              </div>
            </div>
          ) : (
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 text-slate-900">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <ArrowDownLeft size={20} />
                  </div>
                  <h3 className="text-xl font-bold">Withdraw Funds</h3>
                </div>
                <button onClick={() => setIsWithdrawModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                <div className="text-xs font-bold text-slate-500 uppercase">Available Balance</div>
                <div className="text-xl font-black text-slate-900">₹{balance.toLocaleString()}</div>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Withdrawal Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
                    <input
                      required
                      type="number"
                      min="500"
                      value={withdrawAmount}
                      onChange={(e) => {
                        setWithdrawAmount(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Min. ₹500"
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border ${error ? 'border-red-500' : 'border-transparent'} focus:border-blue-900 rounded-2xl text-2xl font-bold text-slate-900 transition-all focus:ring-0`}
                    />
                  </div>
                  {error && (
                    <p className="text-xs font-bold text-red-500 flex items-center animate-in fade-in slide-in-from-top-1 bg-red-50 p-3 rounded-xl mt-2">
                      <AlertCircle size={14} className="mr-2 flex-shrink-0" /> <span>{error}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bank Account Number</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        required
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="Enter account number"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-blue-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">IFSC Code</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        required
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SBIN0001234"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-blue-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
                  <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest flex items-center">
                    <ShieldCheck size={12} className="mr-1" /> Withdrawal Rules
                  </p>
                  <ul className="text-[10px] text-blue-700 space-y-1 list-disc pl-4">
                    <li>Minimum withdrawal amount is <strong>₹500</strong>.</li>
                    <li>Withdrawal is only possible after your <strong>Active Plan</strong> reaches 100% completion (30/30 days collected).</li>
                    <li>Funds will be credited within 24-48 working hours.</li>
                  </ul>
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-blue-900/10">
                  Submit Request
                </button>

                <p className="text-[10px] text-center text-slate-400 flex items-center justify-center space-x-1">
                  <Lock size={12} />
                  <span>Secure request for verification</span>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    )
    }

    {/* Dashboard Footer */}
    <footer className="mt-24 border-t border-slate-200 pt-8 text-center text-xs text-slate-400 space-y-4">
      <div className="flex justify-center space-x-6">
        <Link to="/disclaimer" className="hover:text-slate-600 transition-colors">Risk Disclaimer</Link>
        <Link to="/disclaimer" className="hover:text-slate-600 transition-colors">Terms of Use</Link>
        <Link to="/contact" className="hover:text-slate-600 transition-colors">Support Center</Link>
      </div>
      <p>© 2026 InvestGrow India. Secure SSL Encrypted Environment.</p>
    </footer>
  </div >
);
};

export default Dashboard;
