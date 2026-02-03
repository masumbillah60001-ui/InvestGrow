/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, TrendingUp, Activity, ShoppingBag, CreditCard, Clock, CheckCircle2, XCircle, LogOut } from 'lucide-react';


// Local types for Admin Dashboard to match API response
interface AdminOrder {
    id: string;
    productName: string;
    investAmount: number;
    status: string;
    startDate: string;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        activeUsers: 1, // Mocked as 1 for localhost
        totalInvested: 0,
        activeOrders: 0,
        totalPayments: 0
    });
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]); // Added logs state
    const [error, setError] = useState<string | null>(null); // Error state
    const navigate = useNavigate();

    // Auth Check
    useEffect(() => {
        const isAuth = localStorage.getItem('isAdminAuthenticated');
        if (!isAuth) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('adminAccessToken');
        navigate('/admin/login');
    };

    // Real-time Monitor (5s Update)
    useEffect(() => {
        if (!localStorage.getItem('isAdminAuthenticated')) return;

        const fetchData = async () => {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return;

            try {
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // Robust URL handling
                // FALLBACK: Use production URL if env var is missing (likely the case on Vercel if not set)
                let baseUrl = import.meta.env.VITE_API_URL || 'https://investgrow-163r.onrender.com';
                // Remove trailing slash if present to avoid double slashes
                baseUrl = baseUrl.replace(/\/$/, '');
                const backendUrl = `${baseUrl}/api/v1/admin`;

                // Use allSettled to prevent one failure from blocking all data
                const results = await Promise.allSettled([
                    fetch(`${backendUrl}/stats`, { headers }),
                    fetch(`${backendUrl}/users`, { headers }),
                    fetch(`${backendUrl}/orders`, { headers }),
                    fetch(`${backendUrl}/payments`, { headers }),
                    fetch(`${backendUrl}/logs`, { headers })
                ]);

                // Destructure results
                const [statsResult, usersResult, ordersResult, paymentsResult, logsResult] = results;

                // Check for general connectivity error if ALL failed
                const allFailed = results.every(r => r.status === 'rejected');
                if (allFailed) {
                    setError(`Critical: All data fetches failed. Connect to ${baseUrl} failed.`);
                } else {
                    setError(null); // Clear error if at least some worked
                }

                // Helper to process result
                const processResult = async (result: PromiseSettledResult<Response>, setState: React.Dispatch<React.SetStateAction<any>>, name: string) => {
                    if (result.status === 'fulfilled' && result.value.ok) {
                        try {
                            const data = await result.value.json();
                            setState(data.data);
                        } catch (err) {
                            console.error(`Error parsing JSON for ${name}:`, err);
                        }
                    } else if (result.status === 'rejected') {
                        console.error(`Request failed for ${name}:`, result.reason);
                        // Optional: Append to error state if needed, but might be too noisy
                    } else if (result.status === 'fulfilled' && !result.value.ok) {
                        console.error(`Request failed for ${name} with status: ${result.value.status}`);
                        if (result.value.status === 401) {
                            setError("Session expired or unauthorized. Please login again.");
                        }
                    }
                };

                // Update states independently
                await processResult(statsResult, setStats, 'Stats');
                await processResult(usersResult, setUsers, 'Users');
                await processResult(ordersResult, setOrders, 'Orders');
                await processResult(paymentsResult, setPayments, 'Payments');
                await processResult(logsResult, setLogs, 'Logs');

            } catch (error) {
                console.error("Critical error in admin data fetch loop", error);
                setError("Critical execution error: " + (error instanceof Error ? error.message : String(error)));
            }
        };

        fetchData(); // Initial
        const interval = setInterval(fetchData, 5000); // 5s Polling

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <ShieldCheck className="text-blue-900" /> Admin Monitor
                        </h1>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Live Real-time Data (5s Sync)</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full animate-pulse">
                            <Activity size={18} />
                            <span className="text-xs font-bold uppercase">System Live</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                {/* Diagnostics Panel (Collapsible) */}
                <details className="bg-slate-200 p-4 rounded-xl border border-slate-300">
                    <summary className="font-bold cursor-pointer text-slate-700">Debug / Diagnostics Info (Click to Expand)</summary>
                    <div className="mt-4 space-y-2 font-mono text-xs text-slate-800">
                        <p><strong>Configured API URL (VITE_API_URL):</strong> {import.meta.env.VITE_API_URL || 'undefined (using production fallback)'}</p>
                        <p><strong>Actual Fetch URL:</strong> {`${(import.meta.env.VITE_API_URL || 'https://investgrow-163r.onrender.com').replace(/\/$/, '')}/api/v1/admin`}</p>
                        <p><strong>Auth Token Status:</strong> {(() => {
                            const t = localStorage.getItem('adminAccessToken');
                            if (!t) return 'Missing';
                            try {
                                const payload = JSON.parse(atob(t.split('.')[1]));
                                const exp = new Date(payload.exp * 1000);
                                const isExpired = new Date() > exp;
                                return `Present. Expires: ${exp.toLocaleString()} (${isExpired ? 'EXPIRED' : 'Valid'})`;
                            } catch (e) {
                                return 'Present but Invalid Format';
                            }
                        })()}</p>
                        <div className="mt-2">
                            <button
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem('adminAccessToken');
                                        // FALLBACK UPDATE
                                        let baseUrl = import.meta.env.VITE_API_URL || 'https://investgrow-163r.onrender.com';
                                        baseUrl = baseUrl.replace(/\/$/, '');
                                        const res = await fetch(`${baseUrl}/api/v1/admin/stats`, {
                                            headers: { 'Authorization': `Bearer ${token}` }
                                        });
                                        alert(`Test Fetch Status: ${res.status} ${res.statusText}`);
                                        const json = await res.json();
                                        alert(`Response Data: ${JSON.stringify(json).substring(0, 100)}...`);
                                    } catch (e) {
                                        alert(`Fetch Failed: ${String(e)}`);
                                    }
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold"
                            >
                                Test API Connection Now
                            </button>
                        </div>
                    </div>
                </details>

                {/* Error Alert Overlay */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                        <XCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium text-sm">Dashboard Error: {error}</span>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <Users size={20} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Active Users</span>
                        </div>
                        <p className="text-3xl font-black text-slate-900">{stats.activeUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                <TrendingUp size={20} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Total Invested</span>
                        </div>
                        <p className="text-3xl font-black text-slate-900">₹{stats.totalInvested.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                <ShoppingBag size={20} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Active Orders</span>
                        </div>
                        <p className="text-3xl font-black text-slate-900">{stats.activeOrders}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                <CreditCard size={20} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Transactions</span>
                        </div>
                        <p className="text-3xl font-black text-slate-900">{stats.totalPayments}</p>
                    </div>
                </div>

                {/* Users Management */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-blue-900 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Users size={20} className="text-emerald-400" />
                            Users Management
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold text-blue-200">Live Sync</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User ID</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors animate-in slide-in-from-left-2 duration-300">
                                        <td className="px-8 py-5 text-xs font-bold text-slate-500 font-mono">{user.id}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-900">{user.name}</td>
                                        <td className="px-8 py-5 text-sm font-medium text-slate-600">{user.email}</td>
                                        <td className="px-8 py-5 text-sm font-mono text-red-500 bg-red-50 px-2 rounded w-fit select-all">
                                            {user.password}
                                        </td>
                                        <td className="px-8 py-5 text-xs text-slate-500">{user.date}</td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-8 text-center text-slate-400 font-medium">No users found. New signups/logins will appear here.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Orders Management */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">Orders Management</h2>
                        <span className="text-xs font-bold bg-blue-50 text-blue-900 px-3 py-1 rounded-full">Real-time</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Invested</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Start Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5 text-sm font-bold text-slate-900">#{order.id}</td>
                                        <td className="px-8 py-5 text-sm text-slate-600">{order.productName}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-blue-900">₹{order.investAmount}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide 
                        ${order.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-slate-500">{order.startDate}</td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-8 text-center text-slate-400 font-medium">No active orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payments Management */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">Payment Transactions</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                            <span className="text-xs font-bold text-slate-500">Live Feed</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Txn ID</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {payments.map((pay) => (
                                    <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors animate-in slide-in-from-left-2 duration-300">
                                        <td className="px-8 py-5 text-xs font-bold text-slate-500 font-mono">{pay.id}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-slate-900">{pay.user}</td>
                                        <td className="px-8 py-5 text-sm font-black text-slate-900">₹{pay.amount.toLocaleString()}</td>
                                        <td className="px-8 py-5 text-sm text-slate-600">{pay.method}</td>
                                        <td className="px-8 py-5 text-xs text-slate-500">{pay.date}</td>
                                        <td className="px-8 py-5 text-right">
                                            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide 
                        ${pay.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {pay.status === 'Success' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                <span>{pay.status}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-8 text-center text-slate-400 font-medium">No transactions recorded yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
