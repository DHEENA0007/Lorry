import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Download, PieChart, BarChart2, DollarSign, ChevronRight, Activity } from 'lucide-react';
import { fetchData } from '../services/api';

export default function Financials() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFinancials = async () => {
            try {
                const result = await fetchData('financials');
                setData(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadFinancials();
    }, []);


    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-xs font-semibold text-slate-500">Compiling Financial Ledger...</p>
        </div>
    );

    if (!data) return (
        <div className="p-8 text-slate-500 font-semibold text-center mt-20">
            <Activity size={48} className="mx-auto text-slate-200 mb-4" />
            Connection Error: Detailed records could not be retrieved.
        </div>
    );

    const { summary, monthlyData, transactions } = data;

    return (
        <div className="p-8 bg-slate-50/30 min-h-screen font-sans">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Performance</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Accounts</span>
                        <ChevronRight size={10} className="text-slate-300" />
                        <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">P&L Analytics</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold text-xs transition-all shadow-sm">
                    <Download size={16} /> Export Statement
                </button>
            </header>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Revenue', value: summary.totalRevenue, trend: 'up', icon: <TrendingUp size={16} className="text-emerald-500" /> },
                    { label: 'Total Expenses', value: summary.totalExpenses, trend: 'down', icon: <TrendingDown size={16} className="text-rose-500" /> },
                    { label: 'Net Profit', value: summary.netProfit, highlight: true },
                    { label: 'Profit Margin', value: `${summary.margin}%`, color: 'text-indigo-600' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:border-indigo-100 transition-all">
                        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</h3>
                        <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold tracking-tight ${stat.highlight ? (summary.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600') : (stat.color || 'text-slate-800')}`}>
                                {typeof stat.value === 'number' ? `₹${stat.value.toLocaleString()}` : stat.value}
                            </span>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <BarChart2 size={16} className="text-indigo-400" /> Monthly Revenue Trend
                        </h3>
                    </div>
                    <div className="h-64 flex items-end gap-6 border-b border-slate-100 pb-3 p-4">
                        {Object.entries(monthlyData).map(([month, value]) => {
                            const maxVal = Math.max(...Object.values(monthlyData), 1);
                            const height = (value / maxVal) * 100;
                            return (
                                <div key={month} className="flex-1 flex flex-col items-center gap-3 group h-full">
                                    <div className="w-full relative flex flex-col items-center h-full justify-end">
                                        <div className="absolute -top-10 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all font-bold z-10 whitespace-nowrap shadow-xl">
                                            ₹{value.toLocaleString()}
                                        </div>
                                        <div
                                            className="w-full bg-slate-50 group-hover:bg-indigo-600 rounded-t-xl transition-all duration-700 shadow-sm"
                                            style={{ height: `${height}%`, minHeight: value > 0 ? '6px' : '0' }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{month}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-8">
                        <PieChart size={16} className="text-indigo-400" /> Allocation Breakdown
                    </h3>
                    <div className="h-56 flex items-center justify-center relative mb-8">
                        <div
                            className="w-44 h-44 rounded-full flex items-center justify-center transition-all duration-1000 relative shadow-inner"
                            style={{
                                background: `conic-gradient(
                                    #6366f1 ${Object.values(data.costDistribution)[0] / summary.totalExpenses * 360 || 0}deg, 
                                    #10b981 ${Object.values(data.costDistribution)[0] / summary.totalExpenses * 360 || 0}deg ${(Object.values(data.costDistribution)[0] + (Object.values(data.costDistribution)[1] || 0)) / summary.totalExpenses * 360}deg,
                                    #f43f5e ${(Object.values(data.costDistribution)[0] + (Object.values(data.costDistribution)[1] || 0)) / summary.totalExpenses * 360}deg ${(Object.values(data.costDistribution)[0] + (Object.values(data.costDistribution)[1] || 0) + (Object.values(data.costDistribution)[2] || 0)) / summary.totalExpenses * 360}deg,
                                    #f59e0b ${(Object.values(data.costDistribution)[0] + (Object.values(data.costDistribution)[1] || 0) + (Object.values(data.costDistribution)[2] || 0)) / summary.totalExpenses * 360}deg
                                )`
                            }}
                        >
                            <div className="w-[78%] h-[78%] bg-white rounded-full flex flex-col items-center justify-center shadow-lg border border-slate-50">
                                <span className="text-lg font-bold text-slate-800">₹{summary.totalExpenses.toLocaleString()}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">OpEx</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {Object.entries(data.costDistribution).map(([category, amount], idx) => {
                            const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'];
                            const total = Object.values(data.costDistribution).reduce((a, b) => a + b, 0);
                            const perc = total > 0 ? Math.round((amount / total) * 100) : 0;
                            return (
                                <div key={category} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`}></div>
                                        <span className="text-[11px] font-semibold text-slate-500">{category}</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-800">{perc}%</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Ledger */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Account Ledger</h3>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Live Accounting System Active</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                                <th className="px-8 py-5">Date of Entry</th>
                                <th className="px-8 py-5">System ID</th>
                                <th className="px-8 py-5">Transaction Details</th>
                                <th className="px-8 py-5 text-right">Value</th>
                                <th className="px-8 py-5 text-right">Accounting Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.map((t, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5 text-slate-500 font-semibold text-xs">{new Date(t.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td className="px-8 py-5 font-mono text-[10px] text-slate-400 font-semibold">{t.id}</td>
                                    <td className="px-8 py-5 font-bold text-slate-800 text-xs tracking-tight uppercase">{t.desc}</td>
                                    <td className={`px-8 py-5 text-right font-bold text-xs ${t.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${t.type === 'credit' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <footer className="mt-16 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4">
                <div className="flex items-center gap-3">
                    <DollarSign size={14} className="text-slate-300" />
                    <span>LORIO FISCAL GATEWAY</span>
                </div>
                <div>SECURE ACCOUNTING NODE: 2026-FIM-01</div>
            </footer>
        </div>
    );
}
