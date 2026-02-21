import { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import {
    FileText, Plus, Filter, ChevronRight, Eye, Edit2, RotateCcw, Trash2,
    ChevronUp, ChevronDown, Download, Printer, FileSpreadsheet, FileJson,
    FolderOpen, AlertTriangle, ShieldCheck, Clock
} from 'lucide-react';

export default function VehicleDocuments() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStats, setShowStats] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchData('vehicle-documents');
            setDocs(data);
        } catch (err) {
            console.error('Error fetching docs:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatus = (expiryDate) => {
        const now = new Date();
        const expiry = new Date(expiryDate);
        if (expiry < now) return 'Expired';
        const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30) return 'Expiring Soon';
        return 'Active';
    };

    const getRemainingTime = (expiryDate) => {
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diff = expiry - now;

        if (diff < 0) {
            const absDiff = Math.abs(diff);
            const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
            if (days < 30) return `Expired ${days}d ago`;
            const months = Math.floor(days / 30);
            return `Expired ${months}m ago`;
        }

        const daysTotal = Math.floor(diff / (1000 * 60 * 60 * 24));
        const years = Math.floor(daysTotal / 365);
        const remainingDaysAfterYears = daysTotal % 365;
        const months = Math.floor(remainingDaysAfterYears / 30);
        const days = remainingDaysAfterYears % 30;

        let parts = [];
        if (years > 0) parts.push(`${years}y`);
        if (months > 0) parts.push(`${months}m`);
        if (days > 0 || parts.length === 0) parts.push(`${days}d`);

        return parts.join(' ') + ' left';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-12 h-12 border-[5px] border-slate-100 border-t-orange-600 rounded-full animate-spin mb-6 shadow-xl" />
            <p className="text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase">Authenticating Vault...</p>
        </div>
    );

    const activeDocs = docs.filter(d => getStatus(d.expiryDate) === 'Active').length;
    const expiredDocs = docs.filter(d => getStatus(d.expiryDate) === 'Expired').length;
    const expiringSoonDocs = docs.filter(d => getStatus(d.expiryDate) === 'Expiring Soon').length;

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            <header className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] bg-orange-50 px-2 py-1 rounded-md border border-orange-100">Compliance Vault</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Vehicle Documents</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-slate-400">Dashboard</span>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-800">Compliance Vault</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className={`flex items-center gap-2 px-6 py-3.5 rounded-[1.25rem] text-[11px] font-bold uppercase transition-all shadow-sm border ${showStats ? 'bg-orange-600 border-orange-600 text-white shadow-orange-600/20' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-md'}`}
                    >
                        {showStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {showStats ? 'Hide Overview' : 'Show Overview'}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-[1.25rem] hover:bg-black font-bold text-[11px] uppercase transition-all shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98]">
                        <Plus size={16} /> Import Record
                    </button>
                </div>
            </header>

            {showStats && (
                <div className="animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Total Docs */}
                        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-slate-800" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-50 rounded-2xl">
                                    <FolderOpen size={20} className="text-slate-800" />
                                </div>
                                <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">Total</div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Vault Records</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">{docs.length}</h3>
                            <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                    <span>Excluding Renewals</span>
                                </p>
                            </div>
                        </div>

                        {/* Active Docs */}
                        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-green-50 rounded-2xl">
                                    <ShieldCheck size={20} className="text-green-600" />
                                </div>
                                <div className="px-3 py-1 bg-green-50 rounded-full text-[9px] font-black text-green-600 uppercase tracking-widest border border-green-100">Compliant</div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Active Documents</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">{activeDocs}</h3>
                            <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                    <span>Verified Secure</span>
                                </p>
                            </div>
                        </div>

                        {/* Expiring Soon */}
                        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-orange-50 rounded-2xl">
                                    <Clock size={20} className="text-orange-600" />
                                </div>
                                <div className="px-3 py-1 bg-orange-50 rounded-full text-[9px] font-black text-orange-600 uppercase tracking-widest border border-orange-100">Action Required</div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Expiring Soon</p>
                            <h3 className="text-3xl font-black text-orange-600 tracking-tighter mb-4 pl-2">{expiringSoonDocs}</h3>
                            <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                    <span>Next 30 Days</span>
                                </p>
                            </div>
                        </div>

                        {/* Expired */}
                        <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-red-50 rounded-2xl">
                                    <AlertTriangle size={20} className="text-red-600" />
                                </div>
                                <div className="px-3 py-1 bg-red-50 rounded-full text-[9px] font-black text-red-600 uppercase tracking-widest border border-red-100 animate-pulse">Critical</div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Expired Records</p>
                            <h3 className="text-3xl font-black text-red-600 tracking-tighter mb-4 pl-2">{expiredDocs}</h3>
                            <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                    <span>Immediate Renewal Required</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 flex flex-col">
                            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
                                <ShieldCheck size={16} className="text-orange-500" /> Compliance Distribution
                            </h3>
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className={`relative w-48 h-48 rounded-full border-[24px] shadow-inner transition-all duration-500 ${docs.length > 0
                                    ? 'border-slate-50 border-t-green-500 border-l-red-500 border-r-orange-500'
                                    : 'border-slate-50'
                                    }`}>
                                    {docs.length > 0 && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-4xl font-black text-slate-900 tracking-tighter">{docs.length}</span>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-10 grid grid-cols-1 gap-y-4 w-full px-6">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Active</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900">{activeDocs}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100 bg-red-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-sm bg-red-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Expired</span>
                                        </div>
                                        <span className="text-xs font-black text-red-600">{expiredDocs}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Expiring Soon</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-900">{expiringSoonDocs}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 flex flex-col">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Clock size={16} className="text-orange-500" /> Expiry Timeline
                                </h3>
                                <div className="flex gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 px-2">
                                        <div className={`w-2.5 h-2.5 rounded-sm ${docs.length > 0 ? 'bg-orange-500' : 'bg-slate-300'}`} />
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Next 6 Months</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 border-b-2 border-slate-100 relative mt-4 mx-4 mb-6">
                                <div className="absolute inset-x-0 bottom-0 h-full flex justify-around items-end px-8 gap-6 z-10">
                                    {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m) => {
                                        const hasData = docs.length > 0;
                                        return (
                                            <div key={m} className="flex-1 flex flex-col items-center gap-4 group relative h-full justify-end">
                                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap z-20 shadow-xl pointer-events-none">
                                                    {m} Expiries
                                                </div>
                                                <div className="relative w-full max-w-[48px] h-full flex items-end">
                                                    <div className={`w-full rounded-t-xl transition-all duration-700 ease-out flex flex-col justify-end
                                                        ${hasData ? 'bg-orange-100 shadow-[0_-4px_20px_rgba(249,115,22,0.1)] h-[35%] group-hover:h-[40%]' : 'bg-slate-50 h-[5%]'}`}
                                                    >
                                                        <div className={`w-full rounded-t-xl ${hasData ? 'bg-orange-500' : ''}`} style={{ height: '70%' }}></div>
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

            <div className="bg-white px-8 py-5 rounded-[1.5rem] border border-slate-200/80 mb-6 flex items-center justify-between text-slate-600 cursor-pointer hover:border-orange-500/50 hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                        <Filter size={18} className="text-orange-600" />
                    </div>
                    <div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 block">Search & Filter</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5 block">Configure Vault View Criteria</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-orange-200 group-hover:bg-orange-50 transition-colors">
                        <ChevronDown size={16} className="text-slate-400 group-hover:text-orange-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden group/table hover:border-orange-500/30 transition-colors duration-500">
                <div className="px-8 py-6 flex justify-between items-center bg-slate-50/50 border-b border-slate-50">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                        <FileText size={16} className="text-orange-500" /> Vault Ledger
                    </h3>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02]">
                        <Plus size={14} strokeWidth={3} /> Record Document
                    </button>
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
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-white hover:border-orange-500/50 hover:text-orange-600 transition-all flex items-center gap-2"><Printer size={14} /> Print</button>
                        <button className="px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-white hover:border-orange-500/50 hover:text-orange-600 transition-all flex items-center gap-2"><FileSpreadsheet size={14} /> Excel</button>
                        <button className="px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-white hover:border-red-500/50 hover:text-red-600 transition-all flex items-center gap-2"><FileJson size={14} /> PDF</button>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Search:</span>
                        <input type="text" placeholder="Search parameters..." className="border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all w-64 bg-slate-50 placeholder:text-slate-300 placeholder:font-semibold" />
                    </div>
                </div>

                <div className="overflow-x-auto pb-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/30 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 tracking-[0.15em]">
                                <th className="px-8 py-6">Vehicle</th>
                                <th className="px-8 py-6">Classification</th>
                                <th className="px-8 py-6">Reference No.</th>
                                <th className="px-8 py-6 text-center">Origination</th>
                                <th className="px-8 py-6 text-center">Expiration</th>
                                <th className="px-8 py-6 text-center">Validity</th>
                                <th className="px-8 py-6 text-right">Horizon</th>
                                <th className="px-8 py-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50/80 text-[11px]">
                            {docs.map((doc, i) => {
                                const status = getStatus(doc.expiryDate);
                                return (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors bg-white group">
                                        <td className="px-8 py-5">
                                            <div className="text-[14px] font-black text-slate-900 tracking-tight">{doc.Lorry?.vehicleNumber || 'Unassigned'}</div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Heavy Carrier</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-[10px] font-bold uppercase border border-slate-200 tracking-[0.1em]">
                                                {doc.documentType}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-xs font-black text-orange-600 tracking-tight">{doc.documentNumber}</div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">Official Identifier</div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="text-[11px] font-bold text-slate-600 tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg inline-block">{doc.issueDate}</div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="text-[11px] font-bold text-slate-800 tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg inline-block border border-slate-200">{doc.expiryDate}</div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm
                                                ${status === 'Active' ? 'bg-green-500 text-white' :
                                                    status === 'Expired' ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-500 text-white'}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <span className={`text-[12px] font-black tracking-tighter ${status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                                                {getRemainingTime(doc.expiryDate)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 bg-slate-50 border border-slate-200 text-orange-500 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition-colors shadow-sm"><Eye size={14} /></button>
                                                <button className="p-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"><Edit2 size={14} /></button>
                                                <button className="p-2 bg-slate-50 border border-slate-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {docs.length === 0 && (
                        <div className="p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <FolderOpen size={24} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">No Documents Found</p>
                            <p className="text-[11px] text-slate-400 mt-2 font-medium">Vault query returned zero results</p>
                        </div>
                    )}
                </div>

                <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Displaying Resource 1 to {Math.max(docs.length, 1)} of {docs.length} Entries
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
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Vault Secured</span>
                </div>
            </div>
        </div>
    );
}
