
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Lock, Mail, User, Eye, EyeOff, ArrowRight, TrendingUp } from 'lucide-react';

const Signup: React.FC = () => {
  /* State for form inputs */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    let strength = 0;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsLoading(true);

    // Save User for Admin Panel
    const newUser = {
      id: `USR-${Date.now()}`,
      name: name,
      email: email,
      password: password, // Note: Storing plain password strictly for demo
      date: new Date().toLocaleString()
    };
    const existingUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
    localStorage.setItem('admin_users', JSON.stringify([newUser, ...existingUsers]));

    // LOGGING: New User Signup
    const newLog = {
      id: `LOG-${Date.now()}`,
      type: 'SIGNUP',
      message: `New User Registration: ${name} (${email})`,
      time: new Date().toLocaleTimeString()
    };
    const existingLogs = JSON.parse(localStorage.getItem('admin_system_logs') || '[]');
    localStorage.setItem('admin_system_logs', JSON.stringify([newLog, ...existingLogs]));

    // Simulation of direct account creation
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }, 1500);
  };

  const strength = getPasswordStrength();
  const strengthColors = ['bg-slate-200', 'bg-red-400', 'bg-orange-400', 'bg-blue-400', 'bg-emerald-400'];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Left Section: Info Area */}
        <div className="lg:w-1/2 bg-slate-50 p-8 lg:p-24 flex flex-col justify-center">
          <div className="max-w-md mx-auto lg:mx-0 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-emerald-400" size={28} />
                </div>
                <span className="text-2xl font-bold text-slate-900">InvestGrow India</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
                Create Your <br />Wealth Account
              </h1>
              <p className="text-xl text-slate-600">
                Join 5,000+ investors and access institutional-grade funds today.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { text: 'Instant account activation', icon: CheckCircle },
                { text: 'Bank-grade AES-256 encryption', icon: Lock },
                { text: 'Verified SEBI compliance', icon: Shield },
              ].map((benefit, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <benefit.icon size={20} />
                  </div>
                  <span className="text-slate-700 font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-400 italic">
                *Full portfolio access and market insights available immediately after registration.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Form Card */}
        <div className="lg:w-1/2 p-6 lg:p-24 flex items-center justify-center">
          <div className="w-full max-w-lg bg-white rounded-3xl lg:shadow-2xl lg:border border-slate-100 p-8 lg:p-12">
            {isSuccess ? (
              <div className="space-y-8 animate-in zoom-in duration-500 text-center py-12">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900">Registration Successful!</h2>
                  <p className="text-slate-500">Your account has been created. Redirecting to Login...</p>
                </div>
                <Link to="/login" className="inline-block text-blue-900 font-bold hover:underline">
                  Click here if not redirected
                </Link>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-900">Member Registration</h2>
                  <Lock className="text-slate-300" size={20} />
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:border-blue-900 rounded-xl focus:ring-0 transition-all text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@example.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:border-blue-900 rounded-xl focus:ring-0 transition-all text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-transparent focus:border-blue-900 rounded-xl focus:ring-0 transition-all text-slate-900"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {password && (
                      <div className="flex space-x-1 mt-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1 flex-grow rounded-full transition-colors ${strength >= i ? strengthColors[strength] : 'bg-slate-100'}`}></div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-transparent focus:border-blue-900 rounded-xl focus:ring-0 transition-all text-slate-900"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <label className="flex items-start space-x-3 cursor-pointer group">
                      <input required type="checkbox" className="mt-1 w-4 h-4 rounded text-blue-900 border-slate-300 focus:ring-blue-900" />
                      <span className="text-sm text-slate-600 leading-relaxed">
                        I agree to the <Link to="/disclaimer" className="text-blue-900 font-bold hover:underline">Terms of Service</Link> & <Link to="/disclaimer" className="text-blue-900 font-bold hover:underline">Privacy Policy</Link>.
                      </span>
                    </label>

                    <button disabled={isLoading} className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/20 disabled:opacity-50">
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Create Secure Account</span>
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <p className="text-center text-slate-500 text-sm">
                  Already have an account? <Link to="/login" className="text-blue-900 font-bold hover:underline">Login</Link>
                </p>

                <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 uppercase tracking-widest pt-4">
                  <Shield size={12} />
                  <span>Secure 256-bit SSL Protected Registration</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">© 2026 InvestGrow India. All rights reserved.</p>
          <div className="flex space-x-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/disclaimer" className="hover:text-blue-900">Privacy Policy</Link>
            <Link to="/disclaimer" className="hover:text-blue-900">Terms</Link>
            <Link to="/disclaimer" className="hover:text-blue-900">Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
