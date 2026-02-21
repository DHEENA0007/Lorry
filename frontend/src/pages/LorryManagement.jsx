import { useState, useEffect } from 'react';
import { fetchData, postData, updateData } from '../services/api';
import { Truck, Plus, Filter, ChevronRight, Settings, MoreVertical, Edit2, UserPlus, FileText, CircleDot } from 'lucide-react';
import AddVehicleModal from './AddVehicleModal';

export default function LorryManagement() {
    const [lorries, setLorries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const [selectedVehicle, setSelectedVehicle] = useState(null);

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

    const handleSave = async (formData, id = null) => {
        try {
            if (id) {
                await updateData(`lorries/${id}`, formData);
            } else {
                await postData('lorries', formData);
            }
            await loadData();
            setIsModalOpen(false);
            setSelectedVehicle(null);
        } catch (err) {
            console.error(err);
            alert(`Failed to ${id ? 'update' : 'save'} vehicle. Please check if RC Number is unique.`);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateData(`lorries/${id}`, { status });
            await loadData();
            setOpenDropdown(null);
        } catch (err) {
            console.error(err);
            alert('Failed to update status.');
        }
    };

    const handleEdit = (lorry) => {
        setSelectedVehicle(lorry);
        setIsModalOpen(true);
        setOpenDropdown(null);
    };

    const stats = [
        { label: 'Total Vehicles', value: lorries.length, color: 'bg-orange-600' },
        { label: 'Under Maintenance', value: lorries.filter(l => l.status === 'Maintenance').length, color: 'bg-red-500' },
        { label: 'Monthly Revenue', value: '₹0', color: 'bg-slate-500' },
        { label: 'Document Status', value: '7', color: 'bg-slate-500' }
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-orange-600 rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-slate-500">Loading Fleet Data...</p>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50/50 min-h-screen animate-fade-in">
            {/* Header */}
            <header className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] bg-orange-50 px-2 py-1 rounded-md">Fleet Hub</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Vehicle Management</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium text-slate-400">Dashboard</span>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-xs font-semibold text-orange-600">All Vehicles</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2.5 px-6 py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 font-semibold text-sm tracking-tight transition-all shadow-xl shadow-orange-600/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="bg-white/20 p-1 rounded-lg">
                        <Plus size={16} strokeWidth={3} />
                    </div>
                    Add New Vehicle
                </button>
            </header>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {/* Total Vehicles */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-800" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors">
                            <Truck size={20} className="text-slate-800" />
                        </div>
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">Total</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Total Vehicles</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">{lorries.length}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Active Fleet</span>
                        </p>
                    </div>
                </div>

                {/* Under Maintenance */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl group-hover:bg-red-100 transition-colors">
                            <Settings size={20} className="text-red-600" />
                        </div>
                        <div className="px-3 py-1 bg-red-50 rounded-full text-[9px] font-black text-red-600 uppercase tracking-widest border border-red-100 animate-pulse">Critical</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Maintenance</p>
                    <h3 className="text-3xl font-black text-red-600 tracking-tighter mb-4 pl-2">{lorries.filter(l => l.status === 'Maintenance').length}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Needs Attention</span>
                        </p>
                    </div>
                </div>

                {/* Monthly Revenue */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
                            <span className="text-lg font-bold text-green-600">₹</span>
                        </div>
                        <div className="px-3 py-1 bg-green-50 rounded-full text-[9px] font-black text-green-600 uppercase tracking-widest border border-green-100">Income</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Monthly Revenue</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">₹0</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Current Month</span>
                        </p>
                    </div>
                </div>

                {/* Document Status */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                            <FileText size={20} className="text-orange-600" />
                        </div>
                        <div className="px-3 py-1 bg-orange-50 rounded-full text-[9px] font-black text-orange-600 uppercase tracking-widest border border-orange-100">Alerts</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Document Status</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">7</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Pending Items</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Vehicle Distribution */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Fleet Mix</h3>
                        <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-orange-600 transition-colors">
                            <Truck size={16} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`w-44 h-44 rounded-full border-[14px] shadow-inner relative flex items-center justify-center transition-all duration-1000 ${lorries.length > 0 ? 'border-orange-50/50 border-t-orange-600 border-r-orange-400' : 'border-slate-50'}`}>
                            <div className="text-center">
                                <span className="text-3xl font-bold text-slate-900 tracking-tight">{lorries.length > 0 ? '100' : '0'}<span className="text-sm font-semibold text-slate-400 ml-0.5">%</span></span>
                                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{lorries.length > 0 ? 'Heavy Duty' : 'N/A'}</p>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-6">
                            <div className="flex items-center gap-2.5">
                                <div className={`w-2.5 h-2.5 rounded-full ${lorries.length > 0 ? 'bg-orange-600' : 'bg-slate-200'} shadow-[0_0_8px_rgba(79,70,229,0.3)]`} />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HCV Trucks</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue Trends */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Revenue Flow</h3>
                        <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-slate-600 transition-colors">
                            <CircleDot size={16} />
                        </div>
                    </div>
                    <div className="h-44 flex items-end gap-3 px-2">
                        {[40, 65, 45, 90, 55].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-50 rounded-2xl overflow-hidden relative group/bar h-full">
                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-500 to-teal-400 rounded-2xl transition-all duration-1000 ease-out group-hover/bar:brightness-110" style={{ height: `${h}%` }} />
                                <div className="absolute top-0 left-0 right-0 h-full bg-white opacity-0 group-hover/bar:opacity-10 transition-opacity" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 px-3">
                        {['Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map(month => (
                            <span key={month} className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{month}</span>
                        ))}
                    </div>
                </div>

                {/* Utilization */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">Real-time Status</h3>
                        <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-red-600 transition-colors">
                            <Settings size={16} />
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center h-full pb-8">
                        <div className={`w-40 h-40 rounded-full border-[10px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] relative flex items-center justify-center transition-all duration-1000 ${lorries.filter(l => l.status === 'Available').length > 0 ? 'border-slate-50 border-l-red-500 border-b-red-200' : 'border-slate-50'}`}>
                            <div className="text-center">
                                <span className="text-4xl font-bold text-slate-900 tracking-tighter">{lorries.filter(l => l.status === 'Available').length}</span>
                                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Active Ready</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Toggle */}
            <div
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white px-8 py-5 rounded-3xl shadow-sm border border-slate-100 mb-10 flex items-center gap-4 text-slate-600 cursor-pointer hover:bg-slate-50 transition-all duration-300 group"
            >
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <Filter size={18} strokeWidth={2.5} />
                </div>
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-800">Advanced Filters</span>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Narrow down your fleet search</p>
                </div>
                <ChevronRight size={18} className={`ml-auto transition-transform duration-500 text-slate-300 ${showFilters ? 'rotate-90 text-orange-500' : ''}`} />
            </div>

            {showFilters && (
                <div className="bg-white p-10 rounded-3xl border border-slate-100 mb-10 shadow-xl shadow-slate-200/40 grid grid-cols-1 md:grid-cols-4 gap-10 animate-fade-in">
                    {[
                        { label: 'Status', options: ['All Status', 'Available', 'On Trip', 'Maintenance'] },
                        { label: 'Type', options: ['All Types', '10 Wheeler', '12 Wheeler', 'Trailor'] },
                        { label: 'Maintenance', options: ['Any', 'This Week', 'This Month', 'Overdue'] },
                        { label: 'Fastag', options: ['Any', 'Low Balance', 'Critical'] }
                    ].map((filter, i) => (
                        <div key={i} className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-1">{filter.label}</label>
                            <select className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all appearance-none cursor-pointer">
                                {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                    ))}
                    <div className="md:col-span-4 flex justify-end gap-4 pt-8 border-t border-slate-100">
                        <button className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-100 transition-all">Reset All</button>
                        <button className="px-10 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-black transition-all">Apply Parameters</button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
                <div className="px-10 py-8 border-b border-slate-50 bg-white flex justify-between items-center rounded-t-[2.5rem]">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em]">Fleet Directory</h3>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">Managing {lorries.length} units in service</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    <UserPlus size={12} />
                                </div>
                            ))}
                        </div>
                        <div className="h-8 w-[1px] bg-slate-100 mx-2" />
                        <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest italic flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                            Live Sync Active
                        </div>
                    </div>
                </div>
                <div className="overflow-visible pb-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 tracking-[0.15em]">
                                <th className="px-10 py-6 rounded-tl-[2.5rem]">Unit Designation</th>
                                <th className="px-10 py-6">Configuration</th>
                                <th className="px-10 py-6">Driver / Vehicle</th>
                                <th className="px-10 py-6">Driver</th>
                                <th className="px-10 py-6 text-center">Operation Status</th>
                                <th className="px-10 py-6 text-right rounded-tr-[2.5rem]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {lorries.map((lorry, index) => (
                                <tr key={lorry.id} className="hover:bg-orange-50/20 transition-all group">
                                    <td className={`px-10 py-7 ${index === lorries.length - 1 ? 'rounded-bl-[2.5rem]' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-orange-600 transition-colors group-hover:bg-white group-hover:shadow-sm">
                                                <Truck size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-[15px] tracking-tight mb-0.5">{lorry.vehicleNumber}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Series: 2024-X1</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                            <div className="text-xs font-bold text-slate-700">{lorry.type || 'HCV Truck'}</div>
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-semibold mt-1 uppercase ml-1">Commercial</div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex gap-6">
                                            <div className="group/stat">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tires</p>
                                                <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-orange-600">{lorry.tires || '12'}</p>
                                            </div>
                                            <div className="h-8 w-[1px] bg-slate-100 mt-1" />
                                            <div className="group/stat">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Battery</p>
                                                <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-orange-600">{lorry.batteries || '2'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-3">
                                            {lorry.activeDriver ? (
                                                <>
                                                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-green-50 to-emerald-100 flex items-center justify-center text-[11px] font-bold text-emerald-600 border border-white shadow-sm transition-transform group-hover:scale-105">
                                                        {lorry.activeDriver.name.slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-800 mb-0.5">{lorry.activeDriver.name}</p>
                                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                                                            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                                            {lorry.activeDriver.phone || "On Trip"}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-500 border border-white shadow-sm transition-transform group-hover:scale-105">
                                                        DR
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-800 mb-0.5">Assign Driver</p>
                                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-orange-500 uppercase tracking-wider opacity-60">
                                                            <span className="w-1 h-1 bg-orange-400 rounded-full" />
                                                            Pending Driver
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 text-center">
                                        <span className={`px-5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.1em] border shadow-sm ${lorry.status === 'Available' ? 'bg-slate-50 text-slate-600 border-slate-100 shadow-slate-100/20' :
                                            lorry.status === 'Maintenance' ? 'bg-red-50 text-red-600 border-red-100 shadow-red-100/20' :
                                                'bg-orange-50 text-orange-600 border-orange-100 shadow-orange-100/20'
                                            }`}>
                                            {lorry.status}
                                        </span>
                                    </td>
                                    <td className={`px-10 py-7 text-right relative ${index === lorries.length - 1 ? 'rounded-br-[2.5rem]' : ''} ${openDropdown === lorry.id ? 'z-[60]' : 'z-auto'}`}>
                                        <button
                                            onClick={() => setOpenDropdown(openDropdown === lorry.id ? null : lorry.id)}
                                            className={`p-3 rounded-2xl transition-all duration-300 relative z-[70] ${openDropdown === lorry.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/30 rotate-90 scale-110' : 'text-slate-300 hover:text-orange-600 hover:bg-orange-50'}`}
                                        >
                                            <MoreVertical size={20} />
                                        </button>

                                        {openDropdown === lorry.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setOpenDropdown(null)}
                                                />
                                                <div className="absolute right-0 top-full mt-4 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-50 py-4 animate-fade-in premium-shadow">
                                                    <div className="px-6 py-3 border-b border-slate-50 mb-2">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Management Suite</p>
                                                        <p className="text-[9px] font-medium text-slate-300 mt-0.5">Control center for {lorry.vehicleNumber}</p>
                                                    </div>

                                                    <div className="px-3 space-y-1">
                                                        <div className="group/sub relative">
                                                            <button className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-all group/btn">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover/sub:bg-orange-600 group-hover/sub:text-white transition-all shadow-sm">
                                                                        <Settings size={16} />
                                                                    </div>
                                                                    Operation Status
                                                                </div>
                                                                <ChevronRight size={14} className="text-slate-300 group-hover/sub:translate-x-1 transition-transform" />
                                                            </button>
                                                            {/* Status Submenu */}
                                                            <div className="hidden group-hover/sub:block absolute right-full top-0 mr-3 w-48 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 animate-fade-in premium-shadow">
                                                                {[
                                                                    { label: 'Maintenance', icon: 'bg-red-500', color: 'amber', status: 'Maintenance' },
                                                                    { label: 'Decommission', icon: 'bg-red-500', color: 'rose', status: 'Inactive' },
                                                                    { label: 'Set Available', icon: 'bg-slate-500', color: 'emerald', status: 'Available' }
                                                                ].map(st => (
                                                                    <button
                                                                        key={st.status}
                                                                        onClick={() => handleUpdateStatus(lorry.id, st.status)}
                                                                        className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold text-slate-600 hover:bg-${st.color}-50 hover:text-${st.color}-700 rounded-2xl transition-all`}
                                                                    >
                                                                        <div className={`w-2 h-2 rounded-full ${st.icon} shadow-[0_0_8px_currentcolor]`} />
                                                                        {st.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {[
                                                            { label: 'Edit Parameters', icon: <Edit2 size={16} />, color: 'indigo', onClick: () => handleEdit(lorry) },
                                                            { label: 'Driver Assign', icon: <UserPlus size={16} />, color: 'emerald' },
                                                            { label: 'Transit Logs', icon: <FileText size={16} />, color: 'blue' },
                                                            { label: 'Tyre Inventory', icon: <CircleDot size={16} />, color: 'slate' }
                                                        ].map((item) => (
                                                            <button
                                                                key={item.label}
                                                                onClick={item.onClick}
                                                                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-all group/item"
                                                            >
                                                                <div className={`w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-orange-600 group-hover/item:text-white transition-all shadow-sm`}>
                                                                    {item.icon}
                                                                </div>
                                                                {item.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddVehicleModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedVehicle(null);
                }}
                onSave={handleSave}
                vehicleData={selectedVehicle}
            />
        </div>
    );
}
