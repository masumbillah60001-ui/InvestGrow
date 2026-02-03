/// <reference types="vite/client" />
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // FALLBACK: Use production URL if env var is missing
            let baseUrl = import.meta.env.VITE_API_URL || 'https://investgrow-163r.onrender.com';

            // FORCE HTTPS: Prevent redirects stripping headers
            if (baseUrl.startsWith('http://')) {
                baseUrl = baseUrl.replace('http://', 'https://');
            }

            baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
            const API_BASE_URL = baseUrl;
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Check if user is admin
            if (data.data.user.role !== 'ADMIN') {
                throw new Error('Access Denied: Not an Administrator');
            }

            localStorage.setItem('isAdminAuthenticated', 'true');
            localStorage.setItem('adminAccessToken', data.data.accessToken);
            navigate('/admin/dashboard'); // Navigating to dashboard specifically
        } catch (err: any) {
            // Fallback for demo/hardcoded credentials if DB is empty or connection fails
            if (email === 'Admininvest@gmail.com' && password === 'Admininvest123') {
                localStorage.setItem('isAdminAuthenticated', 'true');
                // Note: Real API features won't work without a token, but basic access allows viewing static parts
                // However, we want real monitoring, so we warn the user.
                alert("Warning: Using demo credentials. Real-time data sync requires a valid backend Admin account.");
                navigate('/admin/dashboard');
            } else {
                setError(err.message || 'Invalid Credentials');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-blue-900 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <ShieldCheck className="text-emerald-400" size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-white">Admin Portal</h1>
                    <p className="text-blue-200 text-sm font-medium mt-1">Authorized Personnel Only</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Admin Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                                    placeholder="admin@company.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Security Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                                    placeholder="••••••••••••"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 rounded-xl flex items-center space-x-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle size={20} className="flex-shrink-0" />
                                <span className="text-sm font-bold">{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <span>Access Dashboard</span>
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
