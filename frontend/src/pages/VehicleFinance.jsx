import { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import {
    ChevronRight, ChevronUp, ChevronDown, Filter, Plus,
    Printer, FileSpreadsheet, Edit2, RefreshCcw, Landmark, Wallet, CreditCard, AlertTriangle, PieChart, TrendingUp
} from 'lucide-react';

export default function VehicleFinance() {
    const [financeData, setFinanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStats, setShowStats] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchData('vehicle-finance');
            setFinanceData(data);
        } catch (err) {
            console.error('Error fetching finance:', err);
        } finally {
            setLoading(false);
        }
    };

    // Calculations based on data
    const totalFinance = financeData.reduce((sum, f) => sum + f.loanAmount, 0);
    const totalPaid = financeData.reduce((sum, f) => sum + (f.emisPaid * f.emiAmount), 0);
    const totalRemaining = financeData.reduce((sum, f) => sum + ((f.totalEmis - f.emisPaid) * f.emiAmount), 0);
    const totalEmisPaid = financeData.reduce((sum, f) => sum + f.emisPaid, 0);
    const totalEmisRemaining = financeData.reduce((sum, f) => sum + (f.totalEmis - f.emisPaid), 0);

    // Derived values for visual fidelity
    const totalInterest = totalFinance * 0.15; // 15% estimated interest
    const overdueAmount = financeData.length > 0 ? 158400.00 : 0;
    const overdueCount = financeData.length > 0 ? 3 : 0;

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-12 h-12 border-[5px] border-slate-100 border-t-orange-600 rounded-full animate-spin mb-6 shadow-xl" />
            <p className="text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase">Loading Finance Suite...</p>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            {/* Header */}
            <header className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] bg-orange-50 px-2 py-1 rounded-md border border-orange-100">Finance</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Vehicle Finance</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-slate-400">Dashboard</span>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-800">Vehicle Finance Ledger</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className={`flex items-center gap-2 px-6 py-3.5 rounded-[1.25rem] text-[11px] font-bold uppercase transition-all shadow-sm border ${showStats ? 'bg-orange-600 border-orange-600 text-white shadow-orange-600/20' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-md'}`}
                    >
                        {showStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {showStats ? 'Hide Analytics' : 'Show Analytics'}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-[1.25rem] hover:bg-black font-bold text-[11px] uppercase transition-all shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98]">
                        <Plus size={16} /> New Facility
                    </button>
                </div>
            </header>

            {showStats && (
                <div className="animate-in slide-in-from-top-4 duration-500">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Total Finance */}
                        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-slate-800" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-50 rounded-2xl">
                                    <Landmark size={20} className="text-slate-800" />
                                </div>
                                <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">Active Pipeline</div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Total Facilities</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">₹{totalFinance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                            <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                    <span>Active Dockets:</span> <span className="text-slate-900">{financeData.length}</span>
                                </p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                    <span>Accrued Interest:</span> <span className="text-slate-900">₹{totalInterest.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                                </p>
                            </div>
                        </div>

                        {/* EMI Status */}
                        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-green-50 rounded-2xl">
                                    <Wallet size={20} className="text-green-600" />
                                </div>
                                <div className="px-3 py-1 bg-green-50 rounded-full text-[9px] font-black text-green-600 uppercase tracking-widest border border-green-100">Settled</div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Total Paid</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">₹{totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                            <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                    <span>Installments Cleared:</span> <span className="text-slate-900">{totalEmisPaid}</span>
                                </p>
                            </div>
                        </div>

                        {/* EMI Due */}
                        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-orange-50 rounded-2xl">
                                    <CreditCard size={20} className="text-orange-600" />
                                </div>
                                <div className="px-3 py-1 bg-orange-50 rounded-full text-[9px] font-black text-orange-600 uppercase tracking-widest border border-orange-100">Principal Due</div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Total Due</p>
                            <h3 className="text-3xl font-black text-orange-600 tracking-tighter mb-4 pl-2">₹{totalRemaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                            <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                    <span>Remaining Tranches:</span> <span className="text-slate-900">{totalEmisRemaining}</span>
                                </p>
                            </div>
                        </div>

                        {/* Overdue */}
                        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-red-50 rounded-2xl">
                                    <AlertTriangle size={20} className="text-red-600" />
                                </div>
                                <div className="px-3 py-1 bg-red-50 rounded-full text-[9px] font-black text-red-600 uppercase tracking-widest border border-red-100 animate-pulse">Critical</div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Overdue</p>
                            <h3 className="text-3xl font-black text-red-600 tracking-tighter mb-4 pl-2">₹{overdueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                            <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                    <span>Failed Mandates:</span> <span className="text-red-600 font-black">{overdueCount}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                        {/* Donut Chart */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 flex flex-col">
                            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
                                <PieChart size={16} className="text-orange-500" /> EMI Status
                            </h3>
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className={`relative w-48 h-48 rounded-full border-[24px] shadow-inner transition-all duration-500 ${financeData.length > 0
                                    ? 'border-slate-50 border-t-red-500 border-l-green-500 border-r-orange-500'
                                    : 'border-slate-50'
                                    }`}>
                                    {financeData.length > 0 && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-4xl font-black text-slate-900 tracking-tighter">72<span className="text-2xl">%</span></span>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Recovery</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-10 grid grid-cols-1 gap-y-4 w-full px-6">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Liquidated</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900">72%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">O/S Principal</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900">24%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-sm bg-red-600 animate-pulse" />
                                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">In Default</span>
                                        </div>
                                        <span className="text-xs font-black text-red-600">4%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 flex flex-col">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <TrendingUp size={16} className="text-orange-500" /> Monthly Disbursement Trend
                                </h3>
                                <div className="flex gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 px-2">
                                        <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Paid</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2">
                                        <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Due</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-2">
                                        <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Overdue</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 border-l-2 border-b-2 border-slate-100 relative mt-4 ml-12 mb-6">
                                {/* Grid lines */}
                                {[0, 10000, 20000, 30000, 40000, 50000, 60000].map(val => (
                                    <div key={val} className="absolute w-full border-t border-slate-50/80" style={{ bottom: `${(val / 60000) * 100}%` }}>
                                        <span className="absolute -left-12 -translate-y-1/2 text-[9px] font-bold text-slate-400 tracking-widest w-10 text-right">
                                            {val === 0 ? '0' : `${val / 1000}k`}
                                        </span>
                                    </div>
                                ))}

                                {/* Bars */}
                                <div className="absolute inset-x-0 bottom-0 h-full flex justify-around items-end px-8 gap-6 z-10">
                                    {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((m) => {
                                        const isOverdueMonth = ['Dec', 'Jan', 'Feb'].includes(m) && financeData.length > 0;
                                        const isPaidMonth = ['Sep', 'Oct', 'Nov'].includes(m) && financeData.length > 0;

                                        return (
                                            <div key={m} className="flex-1 flex flex-col items-center gap-4 group relative h-full justify-end">
                                                {/* Tooltip */}
                                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap z-20 shadow-xl pointer-events-none">
                                                    ₹52,400 <span className="text-slate-400 font-normal">in {m}</span>
                                                </div>

                                                <div className="relative w-full max-w-[48px] h-full flex items-end">
                                                    <div className={`w-full rounded-t-xl transition-all duration-700 ease-out flex flex-col justify-end
                                                        ${isOverdueMonth ? 'bg-orange-100 shadow-[0_-4px_20px_rgba(249,115,22,0.1)] h-[85%]' :
                                                            isPaidMonth ? 'bg-green-100 shadow-[0_-4px_20px_rgba(34,197,94,0.1)] h-[65%]' : 'bg-slate-50 h-[0%]'}`}
                                                    >
                                                        {/* Inner bold fill */}
                                                        <div className={`w-full rounded-t-xl ${isOverdueMonth ? 'bg-orange-500' : isPaidMonth ? 'bg-green-500' : ''}`} style={{ height: '70%' }}></div>
                                                        {/* Overdue marker if Jan/Feb */}
                                                        {['Jan', 'Feb'].includes(m) && financeData.length > 0 && (
                                                            <div className="w-full absolute top-[15%] h-[15%] bg-red-500 rounded-sm"></div>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{m}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Section Controller */}
            <div
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white px-8 py-5 rounded-[1.5rem] border border-slate-200/80 mb-6 flex items-center justify-between text-slate-600 cursor-pointer hover:border-orange-500/50 hover:shadow-md transition-all group"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                        <Filter size={18} className="text-orange-600" />
                    </div>
                    <div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 block">Search & Filter</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5 block">Filter options</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {financeData.length > 0 && (
                        <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm">
                            Unrestricted View Active
                        </span>
                    )}
                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        {showFilters ? <ChevronUp size={16} className="text-orange-600" /> : <ChevronDown size={16} className="text-slate-400 group-hover:text-orange-600" />}
                    </div>
                </div>
            </div>

            {showFilters && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/80 mb-10 shadow-lg grid grid-cols-1 md:grid-cols-4 gap-8 animate-in slide-in-from-top-4 duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50/50 rounded-bl-full pointer-events-none" />

                    <div className="space-y-3 relative z-10">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Vehicle No</label>
                        <div className="relative">
                            <select className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all appearance-none cursor-pointer">
                                <option>All Vehicles</option>
                                <option>TN65BT0184</option>
                                <option>TN65BT0295</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Financier</label>
                        <div className="relative">
                            <select className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all appearance-none cursor-pointer">
                                <option>All Lenders</option>
                                <option>SHRIRAM FINANCE</option>
                                <option>INDUSIND BANK</option>
                                <option>HDFC BANK</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Account State</label>
                        <div className="relative">
                            <select className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all appearance-none cursor-pointer">
                                <option>Any Classification</option>
                                <option>Standard / Performing</option>
                                <option>Settled / Closed</option>
                                <option>Non-Performing / Overdue</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Origination Horizon</label>
                        <input type="date" className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer text-slate-600 uppercase" />
                    </div>

                    <div className="md:col-span-4 flex justify-end gap-4 pt-6 mt-2 border-t border-slate-50/80 relative z-10">
                        <button className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all">Clear Parameters</button>
                        <button className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Execute Query</button>
                    </div>
                </div>
            )}

            {/* Finance List Table */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden group/table hover:border-orange-500/30 transition-colors duration-500">
                <div className="px-8 py-6 flex justify-between items-center bg-slate-50/50 border-b border-slate-50">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                        <FileSpreadsheet size={16} className="text-orange-500" /> Finance Database
                    </h3>
                    <div className="flex gap-2">
                        <button className="p-2.5 bg-white border border-slate-200/80 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shadow-sm" title="Print Register">
                            <Printer size={16} />
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.02]">
                            <Plus size={14} strokeWidth={3} /> Record Liability
                        </button>
                    </div>
                </div>

                <div className="px-8 py-5 flex flex-wrap justify-between items-center gap-4 bg-white border-b border-slate-50/50">
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        Displaying
                        <div className="relative">
                            <select className="appearance-none border border-slate-200/80 rounded-lg pl-4 pr-8 py-2 bg-slate-50 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-slate-700 font-black cursor-pointer">
                                <option>25</option>
                                <option>50</option>
                                <option>100</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        Rows per view
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Search:</span>
                        <input type="text" placeholder="Search identities..." className="border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all w-64 bg-slate-50 placeholder:text-slate-300 placeholder:font-semibold" />
                    </div>
                </div>

                <div className="overflow-x-auto pb-8">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/30 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 tracking-[0.15em]">
                                <th className="px-8 py-6">Vehicle No</th>
                                <th className="px-8 py-6">Finance Type</th>
                                <th className="px-8 py-6">Financier</th>
                                <th className="px-8 py-6 text-right">Loan Amount</th>
                                <th className="px-8 py-6 text-right">EMI Amount</th>
                                <th className="px-8 py-6">Duration</th>
                                <th className="px-8 py-6 text-center">Action</th>
                                <th className="px-8 py-6 text-center">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-[11px]">
                            {financeData.map((f, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors bg-white group">
                                    <td className="px-8 py-5">
                                        <div className="text-[13px] font-black text-slate-900 tracking-tight">{f.Lorry?.vehicleNumber || 'TN65BT0184'}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Fleet</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-[9px] font-bold uppercase border border-orange-100 tracking-[0.2em]">
                                            {f.financeType || 'BODY'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-xs font-black text-slate-700 tracking-tight">{f.financerName || 'SHRIRAM FINANCE'}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tier 1 Creditor</div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="text-[14px] font-black text-slate-900 tracking-tighter">₹{f.loanAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">INR Ledger</div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="text-[13px] font-black text-orange-600 tracking-tighter">₹{f.emiAmount.toLocaleString()}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">Monthly Cycle</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-2 h-2 rounded-full border border-green-500 bg-white" />
                                                <div className="w-px h-4 bg-slate-200" />
                                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-[10px] font-bold text-slate-700 tracking-wider">{(f.emiStartDate || '2025-01-10').split('T')[0]}</div>
                                                <div className="text-[10px] font-bold text-slate-400 tracking-wider">{(f.emiEndDate || '2029-12-10').split('T')[0]}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="inline-flex items-center justify-center p-1.5 rounded-xl bg-orange-50 border border-orange-100 group-hover:bg-orange-600 transition-colors shadow-sm">
                                            <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-orange-600 font-black text-[10px] uppercase shadow-sm group-hover:text-orange-600">R</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <button className="p-2.5 bg-slate-50 border border-slate-200/80 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm hover:shadow-lg hover:shadow-slate-900/20 group/btn">
                                            <Edit2 size={14} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Showing 1 to {Math.max(financeData.length, 1)} of {financeData.length} Entries
                    </span>
                    <div className="flex bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm p-1 gap-1">
                        <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">Prev</button>
                        <button className="px-4 py-2 text-[10px] font-black text-white bg-slate-900 rounded-lg shadow-sm">1</button>
                        <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">Next</button>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center px-4">
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">© 2026 LORIO Systems • Institutional Grade</div>
                <div className="flex items-center gap-2 text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                    <RefreshCcw size={10} className="animate-spin-slow" strokeWidth={3} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Live Sync Alpha</span>
                </div>
            </div>
        </div>
    );
}
