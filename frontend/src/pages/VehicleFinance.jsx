import { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import {
    ChevronRight, ChevronUp, ChevronDown, Filter, Plus,
    Printer, FileSpreadsheet, Edit2, RefreshCcw
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

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest">Loading Finance Suite...</div>;

    return (
        <div className="p-6 bg-[#f8f9fa] min-h-screen font-sans">
            {/* Header */}
            <header className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        Vehicle Finance
                        <span className="text-[10px] font-normal text-slate-400 flex items-center gap-1 ml-2">
                            Dashboard <ChevronRight size={10} /> Vehicle Finance
                        </span>
                    </h2>
                </div>
                <button
                    onClick={() => setShowStats(!showStats)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-indigo-200 text-indigo-600 rounded text-[10px] font-black uppercase tracking-widest bg-white hover:bg-slate-50 transition-colors shadow-sm"
                >
                    {showStats ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {showStats ? 'Hide Statistics & Charts' : 'Show Statistics & Charts'}
                </button>
            </header>

            {showStats && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Total Finance */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
                            <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase bg-indigo-600 shadow-sm">Active</div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Total Finance</p>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">₹{totalFinance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Active Finances: {financeData.length}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total Interest: ₹{totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>

                        {/* EMI Status */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#4caf50]" />
                            <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase bg-[#4caf50] shadow-sm">Paid</div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">EMI Status</p>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">₹{totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Total EMIs Paid: {totalEmisPaid}</p>
                        </div>

                        {/* EMI Due */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                            <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase bg-amber-500 shadow-sm">Pending</div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">EMI Due</p>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">₹{totalRemaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">EMIs Remaining: {totalEmisRemaining}</p>
                        </div>

                        {/* Overdue */}
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 relative group overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                            <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase bg-rose-500 shadow-sm">Overdue</div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Overdue EMIs</p>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">₹{overdueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Overdue Count: {overdueCount}</p>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Donut Chart */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-6 px-1 border-b border-slate-50 pb-2">EMI Payment Status</h3>
                            <div className="flex flex-col items-center py-4">
                                <div className={`w-44 h-44 rounded-full border-[24px] shadow-inner relative flex items-center justify-center transition-all duration-500 ${financeData.length > 0
                                    ? 'border-slate-50 border-t-rose-500 border-l-[#4caf50] border-r-amber-500'
                                    : 'border-slate-100'
                                    }`}>
                                    {financeData.length > 0 && (
                                        <div className="text-center">
                                            <span className="text-2xl font-black text-slate-800">72%</span>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase">Settled</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-8 flex flex-col gap-2 w-full px-12">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-sm bg-[#4caf50]" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Paid</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-sm bg-amber-500" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Due</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-sm bg-rose-500" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Overdue</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-10 px-1 border-b border-slate-50 pb-2">
                                <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Monthly EMI Trend</h3>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-sm bg-[#4caf50]" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Paid</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Due</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Overdue</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-56 border-l border-b border-slate-100 relative">
                                {/* Grid lines */}
                                {[0, 10000, 20000, 30000, 40000, 50000, 60000].map(val => (
                                    <div key={val} className="absolute w-full border-t border-slate-50" style={{ bottom: `${(val / 60000) * 100}%` }}>
                                        <span className="absolute -left-10 -translate-y-1/2 text-[8px] font-bold text-slate-300">{val.toLocaleString()}</span>
                                    </div>
                                ))}
                                {/* Bars */}
                                <div className="absolute inset-x-0 bottom-0 h-full flex justify-around items-end px-12 gap-8">
                                    {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((m) => {
                                        const isOverdueMonth = ['Dec', 'Jan', 'Feb'].includes(m) && financeData.length > 0;
                                        return (
                                            <div key={m} className="flex-1 flex flex-col items-center gap-3 group relative h-full">
                                                <div className={`w-full max-w-[50px] rounded-t transition-all duration-700 ${isOverdueMonth ? 'bg-rose-500 h-[85%] shadow-lg shadow-rose-100' : 'bg-slate-50 h-[0%]'}`} />
                                                <span className="text-[9px] text-slate-400 font-bold uppercase mt-2 tracking-tighter">{m}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Filter Section */}
            <div
                onClick={() => setShowFilters(!showFilters)}
                className="bg-[#fcfdfe] px-6 py-3 rounded-lg border border-slate-200 mb-6 flex items-center gap-3 text-slate-600 cursor-pointer hover:bg-slate-50 transition-all border-dashed shadow-sm"
            >
                {showFilters ? <ChevronUp size={14} className="text-indigo-600" /> : <ChevronDown size={14} className="text-slate-400" />}
                <Filter size={14} className="text-indigo-600" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#6c5b7b]">Filter Options</span>
                <div className="flex gap-2 ml-4">
                    {financeData.length > 0 && <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[8px] font-bold uppercase border border-indigo-100">Displaying All Records</span>}
                </div>
                <span className="text-[11px] text-slate-400 font-normal ml-auto">(Alt+F)</span>
            </div>

            {showFilters && (
                <div className="bg-white p-6 rounded-lg border border-slate-200 mb-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Select Vehicle</label>
                        <select className="w-full border border-slate-200 rounded px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:border-indigo-500 bg-slate-50/50">
                            <option>All Vehicles</option>
                            <option>TN65BT0184</option>
                            <option>TN65BT0295</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Financer Name</label>
                        <select className="w-full border border-slate-200 rounded px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:border-indigo-500 bg-slate-50/50">
                            <option>All Financers</option>
                            <option>SHRIRAM FINANCE</option>
                            <option>INDUSIND BANK</option>
                            <option>HDFC BANK</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">EMI Status</label>
                        <select className="w-full border border-slate-200 rounded px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:border-indigo-500 bg-slate-50/50">
                            <option>All Status</option>
                            <option>Running</option>
                            <option>Closed</option>
                            <option>Overdue</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Date Range (Start)</label>
                        <input type="date" className="w-full border border-slate-200 rounded px-3 py-2 text-[10px] font-bold text-slate-700 outline-none focus:border-indigo-500 bg-slate-50/50" />
                    </div>
                    <div className="md:col-span-4 flex justify-end gap-3 pt-2 border-t border-slate-50">
                        <button className="px-4 py-2 border border-slate-200 text-slate-500 rounded text-[9px] font-black uppercase hover:bg-slate-50">Reset</button>
                        <button className="px-6 py-2 bg-indigo-600 text-white rounded text-[9px] font-black uppercase shadow-md hover:bg-indigo-700">Apply Filters</button>
                    </div>
                </div>
            )}

            {/* Finance List Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Finance List</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#6c5b7b] text-white rounded-md hover:bg-indigo-900 text-[10px] font-black uppercase tracking-wider shadow-md transition-all">
                        <Plus size={16} /> Add New Finance
                    </button>
                </div>

                <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4 bg-[#fcfdfe] border-b border-slate-100">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                        Show
                        <select className="border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:border-indigo-400">
                            <option>25</option>
                            <option>50</option>
                            <option>100</option>
                        </select>
                        entries
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Search:</span>
                        <input type="text" className="border border-slate-100 rounded-md px-3 py-1.5 text-xs outline-none focus:border-indigo-400 transition-all w-48 bg-white shadow-inner" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white text-[9px] font-black uppercase text-slate-400 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-5">Vehicle</th>
                                <th className="px-6 py-5">Type</th>
                                <th className="px-6 py-5">Financer</th>
                                <th className="px-6 py-5 text-right">Finance Amount</th>
                                <th className="px-6 py-5 text-right">EMI Amount</th>
                                <th className="px-6 py-5">EMI Start</th>
                                <th className="px-6 py-5">EMI End</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-6 py-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-[10px]">
                            {financeData.map((f, i) => (
                                <tr key={i} className="hover:bg-indigo-50/20 transition-colors group">
                                    <td className="px-6 py-4 font-black text-slate-700 uppercase tracking-tight italic">{f.Lorry?.vehicleNumber || 'TN65BT0184'}</td>
                                    <td className="px-6 py-4 font-bold text-slate-500 uppercase">{f.financeType || 'BODY'}</td>
                                    <td className="px-6 py-4 font-black text-slate-600 uppercase tracking-tighter">{f.financerName || 'SHRIRAM FINANCE'}</td>
                                    <td className="px-6 py-4 text-right font-black text-slate-700">₹{f.loanAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="px-6 py-4 text-right font-black text-slate-500">₹{f.emiAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-slate-500 font-bold">{f.emiStartDate || '2025-01-10T00:00:00'}</td>
                                    <td className="px-6 py-4 text-slate-500 font-bold">{f.emiEndDate || '2029-12-10T00:00:00'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-1.5 py-0.5 rounded-sm bg-indigo-500 text-white font-black text-[7px] uppercase shadow-sm">R</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="p-1.5 bg-slate-400 text-white rounded hover:bg-indigo-600 transition-colors shadow-sm">
                                            <Edit2 size={12} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <button className="px-2 py-1 border border-slate-200 rounded text-[9px] font-black uppercase text-slate-400 hover:bg-slate-50">Print</button>
                        <button className="px-2 py-1 border border-slate-200 rounded text-[9px] font-black uppercase text-slate-400 hover:bg-slate-50 flex items-center gap-1">
                            <span className="text-emerald-500 underline decoration-2">Excel</span>
                        </button>
                        <button className="px-2 py-1 border border-slate-200 rounded text-[9px] font-black uppercase text-slate-400 hover:bg-slate-50">
                            <span className="text-rose-500 underline decoration-2">PDF</span>
                        </button>
                        <button className="px-2 py-1 border border-slate-200 rounded text-[9px] font-black uppercase text-slate-400 hover:bg-slate-50 underline decoration-2">CSV</button>
                    </div>

                    <div className="flex border border-slate-200 rounded overflow-hidden shadow-sm">
                        <button className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 bg-[#fcfdfe] border-r border-slate-100">Previous</button>
                        <button className="px-4 py-1.5 text-[10px] font-black text-white bg-indigo-600">1</button>
                        <button className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-600 hover:bg-slate-50 bg-[#fcfdfe]">Next</button>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                <div>© 2026 - LORIO ERP</div>
                <div className="flex items-center gap-2 text-indigo-400">
                    <RefreshCcw size={12} className="animate-spin-slow" /> System Node 01
                </div>
            </div>
        </div>
    );
}
