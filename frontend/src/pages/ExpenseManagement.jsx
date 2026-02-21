import { useState, useEffect } from 'react';
import { DollarSign, FileText, CheckCircle, XCircle, AlertTriangle, Filter, Download, ChevronRight, Calculator, PieChart, Activity } from 'lucide-react';
import { fetchData, updateData } from '../services/api';

export default function ExpenseManagement() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            setLoading(true);
            const data = await fetchData('expenses');
            setExpenses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            await updateData(`expenses/${id}`, { status });
            loadExpenses();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredExpenses = filter === 'All' ? expenses : expenses.filter(e => e.status === filter);
    const totalPending = expenses.filter(e => e.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
    const totalApproved = expenses.filter(e => e.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0);
    const overBudgetCount = expenses.filter(e => e.amount > 5000).length;

    if (loading && expenses.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-12 h-12 border-[5px] border-slate-100 border-t-orange-600 rounded-full animate-spin mb-6 shadow-xl" />
            <p className="text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase">Processing Expenditure Records...</p>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            <header className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] bg-orange-50 px-2 py-1 rounded-md border border-orange-100">Capital Ledger</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Expense Reconciliation</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-slate-400">Financials</span>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-800">Claims & Vouchers</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[11px] font-bold uppercase transition-all shadow-sm border ${showFilters ? 'bg-orange-600 border-orange-600 text-white shadow-orange-600/20' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-md'}`}
                    >
                        <Filter size={16} /> Filter Module
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-black font-bold text-[11px] uppercase transition-all shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98]">
                        <Download size={16} /> Export Logs
                    </button>
                </div>
            </header>

            {showFilters && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 mb-10 shadow-lg grid grid-cols-1 md:grid-cols-4 gap-8 animate-in slide-in-from-top-4 duration-500">
                    {[
                        { label: 'Category', options: ['All Categories', 'Fuel', 'Toll', 'Maintenance', 'Medical'] },
                        { label: 'Minimum Value', placeholder: '₹ 0.00', type: 'number' },
                        { label: 'Driver Lookup', placeholder: 'Search name...', type: 'text' },
                        { label: 'Evidence Status', options: ['Any', 'With Attachment', 'Missing Receipt'] }
                    ].map((f, i) => (
                        <div key={i} className="space-y-3">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{f.label}</label>
                            {f.options ? (
                                <select className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer">
                                    {f.options.map(o => <option key={o}>{o}</option>)}
                                </select>
                            ) : (
                                <input type={f.type} placeholder={f.placeholder} className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-300" />
                            )}
                        </div>
                    ))}
                    <div className="md:col-span-4 flex justify-end gap-3 pt-6 border-t border-slate-50/80">
                        <button className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">Reset Filters</button>
                        <button className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-[11px] uppercase tracking-widest font-bold shadow-xl shadow-orange-600/20 transition-all transform hover:scale-[1.02]">Apply Parameters</button>
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Awaiting Approval */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl group-hover:bg-red-100 transition-colors">
                            <Clock size={20} className="text-red-600" />
                        </div>
                        <div className="px-3 py-1 bg-red-50 rounded-full text-[9px] font-black text-red-600 uppercase tracking-widest border border-red-100 animate-pulse">Pending Review</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Awaiting Approval</p>
                    <h3 className="text-3xl font-black text-red-600 tracking-tighter mb-4 pl-2">₹{totalPending.toLocaleString()}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Pending Review</span>
                        </p>
                    </div>
                </div>

                {/* High Value Claims */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                            <AlertTriangle size={20} className="text-orange-600" />
                        </div>
                        <div className="px-3 py-1 bg-orange-50 rounded-full text-[9px] font-black text-orange-600 uppercase tracking-widest border border-orange-100">Claims &gt; ₹5,000</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">High Value Claims</p>
                    <h3 className="text-3xl font-black text-orange-600 tracking-tighter mb-4 pl-2">{overBudgetCount}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Claims &gt; ₹5,000</span>
                        </p>
                    </div>
                </div>

                {/* Processed (MTD) */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-800" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors">
                            <CheckCircle size={20} className="text-slate-800" />
                        </div>
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">Approved Funds</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Processed (MTD)</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">₹{totalApproved.toLocaleString()}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Approved Funds</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden group hover:border-orange-500/30 transition-colors duration-500 relative">
                <div className="absolute top-0 left-0 w-32 h-32 bg-orange-50/50 rounded-br-full pointer-events-none" />

                <div className="px-8 py-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/30 gap-6 relative z-10">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                        <PieChart size={18} className="text-orange-500" /> Corporate Expense Ledger
                    </h3>

                    {/* View Switcher - Premium Pills */}
                    <div className="flex gap-2 bg-white p-1.5 rounded-[1.25rem] border border-slate-200 shadow-sm overflow-x-auto w-full md:w-auto">
                        {['All', 'Pending', 'Approved', 'Rejected'].map(state => (
                            <button
                                key={state}
                                onClick={() => setFilter(state)}
                                className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl whitespace-nowrap ${filter === state
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                {state}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto pb-10">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 tracking-[0.15em]">
                                <th className="px-10 py-6">Subsidized Detail</th>
                                <th className="px-10 py-6">Vehicle</th>
                                <th className="px-10 py-6">Expenditure</th>
                                <th className="px-10 py-6">Audit Link</th>
                                <th className="px-10 py-6 text-center">Lifecycle</th>
                                <th className="px-10 py-6 text-right">Approval Gate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50/80">
                            {filteredExpenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                                    <td className="px-10 py-6">
                                        <div className="text-[13px] font-black text-slate-900 tracking-tight">Assignment #{expense.TripId}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                                            {expense.Driver?.name || 'Unassigned'}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[9px] font-bold uppercase border border-slate-200 tracking-[0.2em] shadow-sm">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="text-[15px] font-black text-slate-900 tracking-tight">₹{expense.amount.toLocaleString()}</div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">INR Standard</div>
                                    </td>
                                    <td className="px-10 py-6">
                                        {expense.proofUrl ? (
                                            <a href={expense.proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-[10px] font-bold uppercase tracking-[0.15em] hover:underline transition-all bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 shadow-sm group">
                                                <FileText size={14} className="group-hover:scale-110 transition-transform" /> Evidence Link
                                            </a>
                                        ) : (
                                            <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 inline-block">No Entry</span>
                                        )}
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-colors ${expense.status === 'Pending' ? 'bg-red-50 text-red-600 border-red-100 shadow-[0_2px_10px_rgba(239,68,68,0.1)]' :
                                            expense.status === 'Approved' ? 'bg-slate-900 text-white border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.1)]' :
                                                'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {expense.status === 'Pending' && <Clock size={12} className="mr-1.5" />}
                                            {expense.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex justify-end gap-3">
                                            {expense.status === 'Pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(expense.id, 'Approved')}
                                                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm hover:shadow-lg hover:shadow-slate-900/20 group"
                                                        title="Authorize Claim"
                                                    >
                                                        <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(expense.id, 'Rejected')}
                                                        className="p-3 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm hover:shadow-lg hover:shadow-red-500/20 group"
                                                        title="Refuse Claim"
                                                    >
                                                        <XCircle size={18} className="group-hover:scale-110 transition-transform" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="text-[9px] font-bold text-slate-300 uppercase italic tracking-widest px-2 cursor-default">Archived Record</div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredExpenses.length === 0 && !loading && (
                        <div className="p-24 text-center flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                                <FileText size={36} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Zero Financial Claims</p>
                            <p className="text-[10px] font-bold text-orange-500 mt-2 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">Database Synchronized</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const Clock = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)

