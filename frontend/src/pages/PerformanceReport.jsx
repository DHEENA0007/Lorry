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
        { label: 'Total Revenue', value: `₹${totals.rev.toLocaleString()}`, color: 'bg-orange-600', icon: DollarSign },
        { label: 'Total Expenses', value: `₹${totals.exp.toLocaleString()}`, color: 'bg-red-500', icon: Wallet },
        { label: 'Total Profit', value: `₹${totals.profit.toLocaleString()}`, color: 'bg-slate-500', icon: TrendingUp }
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Total Revenue */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-800" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors">
                            <DollarSign size={20} className="text-slate-800" />
                        </div>
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">Income</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Total Revenue</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">₹{totals.rev.toLocaleString()}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Gross Earnings</span>
                        </p>
                    </div>
                </div>

                {/* Total Expenses */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl group-hover:bg-red-100 transition-colors">
                            <Wallet size={20} className="text-red-600" />
                        </div>
                        <div className="px-3 py-1 bg-red-50 rounded-full text-[9px] font-black text-red-600 uppercase tracking-widest border border-red-100">Outflow</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Total Expenses</p>
                    <h3 className="text-3xl font-black text-red-600 tracking-tighter mb-4 pl-2">₹{totals.exp.toLocaleString()}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Operational Costs</span>
                        </p>
                    </div>
                </div>

                {/* Total Profit */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
                            <TrendingUp size={20} className="text-green-600" />
                        </div>
                        <div className="px-3 py-1 bg-green-50 rounded-full text-[9px] font-black text-green-600 uppercase tracking-widest border border-green-100">Net</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Total Profit</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">₹{totals.profit.toLocaleString()}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Net Earnings</span>
                        </p>
                    </div>
                </div>
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
                                        <div className={`w-4 rounded-t-sm transition-all duration-500 ${hasActivity ? 'bg-slate-400' : 'bg-slate-50 h-[5%]'}`} style={hasActivity ? { height: `${(d.rev / maxVal) * 100}%` } : {}} />
                                        <div className={`w-4 rounded-t-sm transition-all duration-500 ${hasActivity ? 'bg-red-400' : 'bg-slate-50 h-[5%]'}`} style={hasActivity ? { height: `${(d.exp / maxVal) * 100}%` } : {}} />
                                        <div className={`w-4 rounded-t-sm transition-all duration-500 ${hasActivity ? 'bg-slate-400' : 'bg-slate-50 h-[5%]'}`} style={hasActivity ? { height: `${(d.profit / maxVal) * 100}%` } : {}} />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter text-center">{d.truck}</span>
                                </div>
                            )
                        }) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase tracking-widest">No Performance Data Available</div>
                        )}
                    </div>
                    <div className="flex justify-center gap-6 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-400" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Revenue</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-400" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Expenses</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-400" /><span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Profit</span></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 border-b border-slate-50 pb-2">Revenue Distribution</h3>
                    <div className="flex flex-col items-center justify-center h-full pb-8">
                        <div className={`w-48 h-48 rounded-full border-[30px] shadow-inner flex items-center justify-center transition-all duration-500 ${totals.rev > 0 ? 'border-slate-400' : 'border-slate-50'}`}>
                            <span className="text-xl font-black text-slate-200 uppercase tracking-widest">Fleet</span>
                        </div>
                        <div className="mt-8 space-y-2">
                            {totals.rev > 0 ? performanceData.filter(d => d.rev > 0).slice(0, 3).map((d, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-slate-400" />
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
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-all">
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
                                <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                                    <td className="px-6 py-4 font-black text-slate-800 text-xs italic">{d.truck}</td>
                                    <td className="px-6 py-4 text-right font-black text-slate-700 text-xs">₹{d.rev.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-black text-red-500 text-xs">₹{d.exp.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-black text-slate-600 text-sm">₹{d.profit.toLocaleString()}</td>
                                </tr>
                            ))}
                            <tr className="bg-slate-900 text-white">
                                <td className="px-6 py-4 font-black uppercase text-xs">Total</td>
                                <td className="px-6 py-4 text-right font-black text-xs">₹{totals.rev.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-black text-red-400 text-xs">₹{totals.exp.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-black text-slate-400 text-sm">₹{totals.profit.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
