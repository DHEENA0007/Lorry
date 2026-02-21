import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { fetchData } from '../services/api';

export default function Analytics() {
    const [data, setData] = useState({ revenueChart: [], driverPerformance: [], kpi: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const result = await fetchData('analytics');
                if (result) setData(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadAnalytics();
    }, []);

    if (loading) return <div className="p-8 text-slate-500">Loading analytics...</div>;

    const { revenueChart, driverPerformance, kpi } = data;

    return (
        <div className="p-8">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] bg-orange-50 px-2.5 py-1 rounded-md">Analytics</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics & Reports</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium text-slate-400">System</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-xs font-semibold text-orange-600">Performance Metrics</span>
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Avg Cost */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-800" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors">
                            <span className="text-lg font-bold text-slate-800">₹</span>
                        </div>
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">Metric</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Avg. Cost per KM</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">₹{kpi.avgCostPerKM || '0.00'}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>From Completed Trips</span>
                        </p>
                    </div>
                </div>

                {/* On-Time Deliveries */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
                            <span className="text-lg font-bold text-green-600">✓</span>
                        </div>
                        <div className="px-3 py-1 bg-green-50 rounded-full text-[9px] font-black text-green-600 uppercase tracking-widest border border-green-100">Performance</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">On-Time Deliveries</p>
                    <h3 className="text-3xl font-black text-green-600 tracking-tighter mb-4 pl-2">{kpi.onTime || 'N/A'}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Recent Performance</span>
                        </p>
                    </div>
                </div>

                {/* Utilization */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                            <span className="text-lg font-bold text-orange-600">Activity</span>
                        </div>
                        <div className="px-3 py-1 bg-orange-50 rounded-full text-[9px] font-black text-orange-600 uppercase tracking-widest border border-orange-100">Fleet</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Vehicle Utilization</p>
                    <h3 className="text-3xl font-black text-orange-600 tracking-tighter mb-4 pl-2">{kpi.utilization || 'N/A'}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Engagement Rate</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 h-[450px]">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] mb-8">Financial Overview</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueChart}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} name="Revenue" />
                                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} name="Expenses" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Driver Efficiency */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 h-[450px]">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] mb-8">Top Drivers by Volume</h3>
                    <div className="h-[300px]">
                        {driverPerformance.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={driverPerformance} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" stroke="#94a3b8" />
                                    <YAxis dataKey="name" type="category" stroke="#64748b" width={80} tick={{ fontSize: 12, fontWeight: 500 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend />
                                    <Bar dataKey="efficiency" stackId="a" fill="#10b981" name="Efficiency Score" barSize={20} radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="trips" stackId="a" fill="#6366f1" name="Trips Completed" barSize={20} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">Not enough driver data</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
