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
            <h2 className="text-3xl font-bold mb-6 text-slate-800">Analytics & Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Avg. Cost per KM</h4>
                    <p className="text-3xl font-bold text-blue-900 mt-2">${kpi.avgCostPerKM || '0.00'}</p>
                    <span className="text-xs text-blue-600">Calculated from completed trips</span>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                    <h4 className="text-sm font-semibold text-purple-800 uppercase tracking-wide">On-Time Deliveries</h4>
                    <p className="text-3xl font-bold text-purple-900 mt-2">{kpi.onTime || 'N/A'}</p>
                    <span className="text-xs text-purple-600">Based on recent performance</span>
                </div>
                <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                    <h4 className="text-sm font-semibold text-amber-800 uppercase tracking-wide">Vehicle Utilization</h4>
                    <p className="text-3xl font-bold text-amber-900 mt-2">{kpi.utilization || 'N/A'}</p>
                    <span className="text-xs text-amber-600">Fleet engagement rate</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[400px]">
                    <h3 className="text-lg font-semibold mb-4 text-slate-700">Financial Overview (Latest)</h3>
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

                {/* Driver Efficiency */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[400px]">
                    <h3 className="text-lg font-semibold mb-4 text-slate-700">Top Drivers by Volume</h3>
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
                        <div className="h-full flex items-center justify-center text-slate-400">Not enough driver data</div>
                    )}
                </div>
            </div>
        </div>
    );
}
