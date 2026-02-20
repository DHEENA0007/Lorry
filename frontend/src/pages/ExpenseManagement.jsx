import { useState, useEffect } from 'react';
import { DollarSign, FileText, CheckCircle, XCircle, AlertTriangle, Filter, Download, ChevronRight, Calculator, PieChart } from 'lucide-react';
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-xs font-semibold text-slate-500">Processing Expenditure Records...</p>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50/30 min-h-screen font-sans">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Expense Reconciliation</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Financials</span>
                        <ChevronRight size={10} className="text-slate-300" />
                        <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">Claims & Vouchers</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all shadow-sm border ${showFilters ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-100' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Filter size={16} /> Filter Module
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-black font-bold text-xs uppercase transition-all shadow-lg shadow-slate-100">
                        <Download size={16} /> Export Logs
                    </button>
                </div>
            </header>

            {showFilters && (
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 mb-10 shadow-md grid grid-cols-1 md:grid-cols-4 gap-8 animate-in slide-in-from-top-4 duration-300">
                    {[
                        { label: 'Category', options: ['All Categories', 'Fuel', 'Toll', 'Maintenance', 'Medical'] },
                        { label: 'Minimum Value', placeholder: '₹ 0.00', type: 'number' },
                        { label: 'Driver Lookup', placeholder: 'Search name...', type: 'text' },
                        { label: 'Evidence Status', options: ['Any', 'With Attachment', 'Missing Receipt'] }
                    ].map((f, i) => (
                        <div key={i} className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{f.label}</label>
                            {f.options ? (
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all">
                                    {f.options.map(o => <option key={o}>{o}</option>)}
                                </select>
                            ) : (
                                <input type={f.type} placeholder={f.placeholder} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all" />
                            )}
                        </div>
                    ))}
                    <div className="md:col-span-4 flex justify-end gap-3 pt-6 border-t border-slate-50">
                        <button className="px-6 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 rounded-xl transition-all">Reset</button>
                        <button className="px-8 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100">Apply Filters</button>
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: 'Awaiting Approval', value: `₹${totalPending.toLocaleString()}`, sub: 'Pending Review', icon: <Clock size={20} className="text-amber-500" /> },
                    { label: 'High Value Claims', value: overBudgetCount, sub: 'Claims > ₹5,000', icon: <AlertTriangle size={20} className="text-rose-500" /> },
                    { label: 'Processed (MTD)', value: `₹${totalApproved.toLocaleString()}`, sub: 'Approved Funds', icon: <CheckCircle size={20} className="text-emerald-500" /> }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60 flex flex-col justify-between group hover:border-indigo-100 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</h3>
                                <p className={`text-3xl font-bold tracking-tight ${i === 2 ? 'text-emerald-600' : 'text-slate-900'}`}>{stat.value}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors border border-slate-100">
                                {stat.icon}
                            </div>
                        </div>
                        <p className="mt-6 text-[10px] font-semibold text-slate-400 uppercase italic tracking-wider">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* View Switcher - Premium Pills */}
            <div className="flex gap-3 mb-10 bg-white p-2 rounded-2xl border border-slate-200 w-fit shadow-sm">
                {['All', 'Pending', 'Approved', 'Rejected'].map(state => (
                    <button
                        key={state}
                        onClick={() => setFilter(state)}
                        className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all rounded-xl ${filter === state
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        {state} Requests
                    </button>
                ))}
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 bg-white flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Expense Ledger</h3>
                    <div className="text-[10px] font-bold text-slate-400 uppercase italic tracking-tighter">Verified Operations Active</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                                <th className="px-8 py-5">Subsidized Detail</th>
                                <th className="px-8 py-5">Asset Classification</th>
                                <th className="px-8 py-5">Expenditure</th>
                                <th className="px-8 py-5">Verification Link</th>
                                <th className="px-8 py-5 text-center">Lifecycle Status</th>
                                <th className="px-8 py-5 text-right">Approval Gate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredExpenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-bold text-slate-900 tracking-tight">Assignment #{expense.TripId}</div>
                                        <div className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 tracking-tighter">
                                            {expense.Driver?.name || 'Unassigned Personnel'} • {new Date(expense.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase border border-indigo-100 tracking-widest">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-bold text-slate-800 tracking-tighter">₹{expense.amount.toLocaleString()}</div>
                                        <div className="text-[9px] font-medium text-slate-400 uppercase italic">INR Standard</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {expense.proofUrl ? (
                                            <a href={expense.proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-[11px] font-bold uppercase tracking-tighter hover:underline transition-all">
                                                <div className="p-1.5 bg-indigo-50 rounded-lg group-hover:bg-white transition-colors">
                                                    <FileText size={14} />
                                                </div>
                                                Audit Evidence
                                            </a>
                                        ) : (
                                            <span className="text-slate-300 text-[10px] font-medium italic">No Entry Found</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${expense.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            expense.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                            {expense.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end gap-2">
                                            {expense.status === 'Pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(expense.id, 'Approved')}
                                                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-100"
                                                        title="Authorize Claim"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(expense.id, 'Rejected')}
                                                        className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm shadow-rose-100"
                                                        title="Refuse Claim"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="text-[9px] font-bold text-slate-300 uppercase italic tracking-widest px-2 group-hover:text-slate-400">Archived Record</div>
                                            )}
                                        </div>
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

const Clock = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
