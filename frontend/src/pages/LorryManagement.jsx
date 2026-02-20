import { useState, useEffect } from 'react';
import { fetchData, postData } from '../services/api';
import { Truck, Plus, Filter, ChevronLeft, ChevronRight, Settings, MoreVertical } from 'lucide-react';

export default function LorryManagement() {
    const [lorries, setLorries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchData('lorries');
            setLorries(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Vehicles', value: lorries.length, color: 'bg-indigo-600' },
        { label: 'Under Maintenance', value: lorries.filter(l => l.status === 'Maintenance').length, color: 'bg-amber-500' },
        { label: 'Monthly Revenue', value: '₹0', color: 'bg-emerald-500' },
        { label: 'Document Status', value: '7', color: 'bg-blue-500' }
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-slate-500">Loading Fleet Data...</p>
        </div>
    );

    return (
        <div className="p-6 bg-slate-50/50 min-h-screen font-sans">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fleet Management</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Dashboard</span>
                        <ChevronRight size={10} className="text-slate-300" />
                        <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">Vehicles</span>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold text-xs tracking-wide transition-all shadow-lg shadow-indigo-100">
                    <Plus size={16} /> Add Vehicle
                </button>
            </header>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                        <div>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                        </div>
                        <div className={`w-1.5 h-12 rounded-full ${stat.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Vehicle Distribution */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-50 pb-3">Vehicle Distribution</h3>
                    <div className="flex flex-col items-center">
                        <div className={`w-48 h-48 rounded-full border-[12px] shadow-inner relative flex items-center justify-center transition-all duration-700 ${lorries.length > 0 ? 'border-slate-50 border-t-emerald-500' : 'border-slate-100'}`}>
                            <div className="text-center">
                                <span className="text-3xl font-bold text-slate-900">{lorries.length > 0 ? '100%' : '0%'}</span>
                                <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">{lorries.length > 0 ? 'Trucks' : 'N/A'}</p>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-6">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${lorries.length > 0 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                <span className="text-[11px] font-semibold text-slate-600 uppercase">Trucks</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue Trends */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-50 pb-3">Revenue Performance</h3>
                    <div className="h-48 flex items-end gap-3 px-2">
                        {[40, 60, 45, 80, 50].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-50 rounded-t-xl overflow-hidden relative group h-full">
                                <div className="absolute bottom-0 w-full bg-indigo-500/10 rounded-t-xl group-hover:bg-indigo-500/20 transition-all duration-700" style={{ height: `${h}%` }} />
                                <div className="absolute bottom-0 w-full bg-indigo-500 h-1 hidden group-hover:block transition-all" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 px-2">
                        {['Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map(month => (
                            <span key={month} className="text-[10px] font-bold text-slate-400 uppercase">{month}</span>
                        ))}
                    </div>
                </div>

                {/* Utilization */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-50 pb-3">Vehicle Utilization</h3>
                    <div className="flex flex-col items-center justify-center h-full pb-8">
                        <div className={`w-40 h-40 rounded-full border-[10px] shadow-inner relative flex items-center justify-center transition-all duration-700 ${lorries.filter(l => l.status === 'Available').length > 0 ? 'border-slate-50 border-l-amber-500' : 'border-slate-100'}`}>
                            <div className="text-center">
                                <span className="text-2xl font-bold text-slate-900">{lorries.filter(l => l.status === 'Available').length}</span>
                                <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">Empty Vehicles</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Toggle */}
            <div
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex items-center gap-3 text-slate-600 cursor-pointer hover:bg-slate-50 transition-all"
            >
                <Filter size={16} className="text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-700">Filter Management</span>
                <ChevronRight size={14} className={`ml-auto transition-transform ${showFilters ? 'rotate-90' : ''}`} />
            </div>

            {showFilters && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 mb-8 shadow-md grid grid-cols-1 md:grid-cols-4 gap-8 animate-in slide-in-from-top-4 duration-300">
                    {[
                        { label: 'Status', options: ['All Status', 'Available', 'On Trip', 'Maintenance'] },
                        { label: 'Type', options: ['All Types', '10 Wheeler', '12 Wheeler', 'Trailor'] },
                        { label: 'Maintenance', options: ['Any', 'This Week', 'This Month', 'Overdue'] },
                        { label: 'Fastag', options: ['Any', 'Low Balance', 'Critical'] }
                    ].map((filter, i) => (
                        <div key={i} className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{filter.label}</label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all">
                                {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                    ))}
                    <div className="md:col-span-4 flex justify-end gap-3 pt-6 border-t border-slate-50">
                        <button className="px-6 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-50 transition-all">Clear Filters</button>
                        <button className="px-8 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Apply</button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-white flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Active Fleet Directory</h3>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase italic">Last Sync: Just Now</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                                <th className="px-8 py-5">Vehicle Number</th>
                                <th className="px-8 py-5">Configuration</th>
                                <th className="px-8 py-5">Fleet Assets</th>
                                <th className="px-8 py-5">Personnel</th>
                                <th className="px-8 py-5 text-center">Operation Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {lorries.map((lorry) => (
                                <tr key={lorry.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-slate-900 text-sm tracking-tight">{lorry.vehicleNumber}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">Model: 2024 Series</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-xs font-semibold text-slate-700">{lorry.type || 'HCV Truck'}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">Heavy Commercial</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Tires</p>
                                                <p className="text-xs font-bold text-slate-700">{lorry.tires || '12'}</p>
                                            </div>
                                            <div className="h-6 w-[1px] bg-slate-100 mt-1" />
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Battery</p>
                                                <p className="text-xs font-bold text-slate-700">{lorry.batteries || '2'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                                                DR
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">Assign Driver</p>
                                                <p className="text-[10px] font-medium text-slate-400 italic">No Active Personnel</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${lorry.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                lorry.status === 'Maintenance' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                    'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                            }`}>
                                            {lorry.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
