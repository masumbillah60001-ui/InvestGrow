
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, TrendingUp, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Admin Login Check
    if (email === 'Admininvest@gmail.com' && password === 'Admininvest123') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      setTimeout(() => {
        setIsLoading(false);
        navigate('/admin');
      }, 1000);
      return;
    }

    // Strict User Validation
    const existingUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
    const user = existingUsers.find((u: any) => u.email === email && u.password === password);

    if (user) {
      // Store current user session
      localStorage.setItem('user_profile', JSON.stringify({
        name: user.name,
        email: user.email,
        id: user.id
      }));

      // LOGGING: Login Success
      const newLog = {
        id: `LOG-${Date.now()}`,
        type: 'LOGIN',
        message: `User ${user.email} logged in successfully.`,
        time: new Date().toLocaleTimeString()
      };
      const existingLogs = JSON.parse(localStorage.getItem('admin_system_logs') || '[]');
      localStorage.setItem('admin_system_logs', JSON.stringify([newLog, ...existingLogs]));

      setTimeout(() => {
        setIsLoading(false);
        navigate('/dashboard');
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        alert("Invalid Credentials! Please check your email and password.");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Left Section: Info Area */}
        <div className="lg:w-1/2 bg-blue-900 p-8 lg:p-24 flex flex-col justify-center text-white">
          <div className="max-w-md mx-auto lg:mx-0 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-emerald-400" size={28} />
                </div>
                <span className="text-2xl font-bold">InvestGrow India</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Welcome Back to <br />Your Wealth
              </h1>
              <p className="text-xl text-blue-200">
                Log in to monitor your SIPs, explore new funds, and manage your financial future.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h4 className="font-bold">Encrypted Access</h4>
                  <p className="text-sm text-blue-300">Your session is secured with state-of-the-art encryption protocols.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-blue-400 italic">
                *Protect your credentials. Never share your password with anyone.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Login Form */}
        <div className="lg:w-1/2 p-6 lg:p-24 flex items-center justify-center">
          <div className="w-full max-w-lg bg-white rounded-3xl lg:shadow-2xl lg:border border-slate-100 p-8 lg:p-12">
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Member Login</h2>
                <Lock className="text-slate-300" size={20} />
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email or Mobile</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent focus:border-blue-900 rounded-xl focus:ring-0 transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                    <button type="button" className="text-xs font-bold text-blue-900 hover:underline">Forgot Password?</button>
                  </div>
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
                </div>

                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-900 border-slate-300 focus:ring-blue-900" />
                    <span className="text-sm text-slate-600">Remember me</span>
                  </label>
                </div>

                <button disabled={isLoading} className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-blue-900/20 disabled:opacity-50">
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Secure Login</span>
                      <LogIn size={20} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-slate-500 text-sm">
                New to InvestGrow? <Link to="/signup" className="text-blue-900 font-bold hover:underline">Create Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs">© 2026 InvestGrow India. Secure. Transparent. Reliable.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
