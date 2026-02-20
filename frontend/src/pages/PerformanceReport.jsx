import { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import { BarChart3, TrendingUp, DollarSign, Wallet, Calendar, Download, ChevronRight } from 'lucide-react';

export default function PerformanceReport() {
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totals, setTotals] = useState({ rev: 0, exp: 0, profit: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const trips = await fetchData('trips');
            const lorries = await fetchData('lorries');

            const aggregation = lorries.map(lorry => {
                const lorryTrips = trips.filter(t => t.LorryId === lorry.id && t.status === 'Completed');
                const rev = lorryTrips.reduce((sum, t) => sum + (t.budget || 0), 0);
                const exp = lorryTrips.reduce((sum, t) => sum + (t.expenses || 0), 0);
                return {
                    truck: lorry.vehicleNumber,
                    rev,
                    exp,
                    profit: rev - exp
                };
            });

            setPerformanceData(aggregation);

            const totalRev = aggregation.reduce((sum, d) => sum + d.rev, 0);
            const totalExp = aggregation.reduce((sum, d) => sum + d.exp, 0);
            setTotals({ rev: totalRev, exp: totalExp, profit: totalRev - totalExp });

        } catch (err) {
            console.error('Error loading performance data:', err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Revenue', value: `₹${totals.rev.toLocaleString()}`, color: 'bg-indigo-600', icon: DollarSign },
        { label: 'Total Expenses', value: `₹${totals.exp.toLocaleString()}`, color: 'bg-rose-500', icon: Wallet },
        { label: 'Total Profit', value: `₹${totals.profit.toLocaleString()}`, color: 'bg-emerald-500', icon: TrendingUp }
    ];

    if (loading) return <div className="p-8 text-center text-slate-500">Generating performance report...</div>;

    return (
        <div className="p-6 bg-slate-50/50 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Performance Report</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dashboard</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reports</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className={`${stat.color} p-6 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col justify-between overflow-hidden relative group`}>
                        <stat.icon className="absolute top-4 right-4 text-white opacity-10 w-16 h-16 -mr-4 group-hover:scale-125 transition-transform" />
                        <p className="text-[11px] font-black text-white/70 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 border-b border-slate-50 pb-2 flex items-center gap-2">
                        <BarChart3 size={14} /> Performance comparison
                    </h3>
                    <div className="h-64 flex items-end justify-around pb-8 px-4 gap-8">
                        {performanceData.length > 0 ? performanceData.map((d, i) => {
                            const maxVal = Math.max(...performanceData.map(x => x.rev), 1);
                            const hasActivity = d.rev > 0 || d.exp > 0;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                    <div className="w-full flex justify-center gap-1.5 h-full items-end">
                                        <div className={`w-4 rounded-t-sm transition-all duration-500 ${hasActivity ? 'bg-blue-400' : 'bg-slate-50 h-[5%]'}`} style={hasActivity ? { height: `${(d.rev / maxVal) * 100}%` } : {}} />
                                        <div className={`w-4 rounded-t-sm transition-all duration-500 ${hasActivity ? 'bg-rose-400' : 'bg-slate-50 h-[5%]'}`} style={hasActivity ? { height: `${(d.exp / maxVal) * 100}%` } : {}} />
                                        <div className={`w-4 rounded-t-sm transition-all duration-500 ${hasActivity ? 'bg-emerald-400' : 'bg-slate-50 h-[5%]'}`} style={hasActivity ? { height: `${(d.profit / maxVal) * 100}%` } : {}} />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter text-center">{d.truck}</span>
                                </div>
                            )
                        }) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase tracking-widest">No Performance Data Available</div>
                        )}
                    </div>
                    <div className="flex justify-center gap-6 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-400" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Revenue</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rose-400" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Expenses</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-400" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Profit</span></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 border-b border-slate-50 pb-2">Revenue Distribution</h3>
                    <div className="flex flex-col items-center justify-center h-full pb-8">
                        <div className={`w-48 h-48 rounded-full border-[30px] shadow-inner flex items-center justify-center transition-all duration-500 ${totals.rev > 0 ? 'border-blue-400' : 'border-slate-50'}`}>
                            <span className="text-xl font-black text-slate-200 uppercase tracking-widest">Fleet</span>
                        </div>
                        <div className="mt-8 space-y-2">
                            {totals.rev > 0 ? performanceData.filter(d => d.rev > 0).slice(0, 3).map((d, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-blue-400" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase">{d.truck} (₹{d.rev.toLocaleString()})</span>
                                </div>
                            )) : (
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">No segments found</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Truck Performance Breakdown</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all">
                        <Download size={14} /> Download Excel
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-5">Truck No</th>
                                <th className="px-6 py-5 text-right">Revenue</th>
                                <th className="px-6 py-5 text-right">Expenses</th>
                                <th className="px-6 py-5 text-right">Profit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {performanceData.map((d, i) => (
                                <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-6 py-4 font-black text-slate-800 text-xs italic">{d.truck}</td>
                                    <td className="px-6 py-4 text-right font-black text-slate-700 text-xs">₹{d.rev.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-black text-rose-500 text-xs">₹{d.exp.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-black text-emerald-600 text-sm">₹{d.profit.toLocaleString()}</td>
                                </tr>
                            ))}
                            <tr className="bg-slate-900 text-white">
                                <td className="px-6 py-4 font-black uppercase text-xs">Total</td>
                                <td className="px-6 py-4 text-right font-black text-xs">₹{totals.rev.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-black text-rose-400 text-xs">₹{totals.exp.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-black text-emerald-400 text-sm">₹{totals.profit.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
