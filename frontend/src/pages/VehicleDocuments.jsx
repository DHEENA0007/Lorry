import { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import {
    FileText, Plus, Filter, ChevronRight, Eye, Edit2, RotateCcw, Trash2,
    ChevronUp, ChevronDown, Download, Printer, FileSpreadsheet, FileJson
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
            if (days < 30) return `Expired ${days} days ago`;
            const months = Math.floor(days / 30);
            return `Expired ${months} months ago`;
        }

        const daysTotal = Math.floor(diff / (1000 * 60 * 60 * 24));
        const years = Math.floor(daysTotal / 365);
        const remainingDaysAfterYears = daysTotal % 365;
        const months = Math.floor(remainingDaysAfterYears / 30);
        const days = remainingDaysAfterYears % 30;

        let parts = [];
        if (years > 0) parts.push(`${years} years`);
        if (months > 0) parts.push(`${months} months`);
        if (days > 0 || parts.length === 0) parts.push(`${days} days`);

        return parts.join(', ') + ' left';
    };

    const stats = [
        {
            label: 'Total Documents',
            value: docs.length,
            sub: 'Excluding renewed documents',
            badge: 'Total',
            badgeColor: 'bg-indigo-600'
        },
        {
            label: 'Active Documents',
            value: docs.filter(d => getStatus(d.expiryDate) === 'Active').length,
            sub: 'Valid documents',
            badge: 'Active',
            badgeColor: 'bg-emerald-500'
        },
        {
            label: 'Expired Documents',
            value: docs.filter(d => getStatus(d.expiryDate) === 'Expired').length,
            sub: 'Need Immediate Attention',
            badge: 'Expired',
            badgeColor: 'bg-rose-500'
        },
        {
            label: 'Expiring Soon',
            value: docs.filter(d => getStatus(d.expiryDate) === 'Expiring Soon').length,
            sub: 'Requires Renewal',
            badge: 'Next 30 Days',
            badgeColor: 'bg-amber-500'
        }
    ];

    if (loading) return <div className="p-8 text-center text-slate-500">Loading documents...</div>;

    return (
        <div className="p-6 bg-[#f8f9fa] min-h-screen font-sans">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        Vehicle Documents
                        <span className="text-[10px] font-normal text-slate-400 flex items-center gap-1 ml-2">
                            Dashboard <ChevronRight size={10} /> Vehicle Documents
                        </span>
                    </h2>
                </div>
                <button
                    onClick={() => setShowStats(!showStats)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-indigo-200 text-indigo-600 rounded text-[11px] font-bold uppercase tracking-tight hover:bg-indigo-50 transition-colors"
                >
                    {showStats ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {showStats ? 'Hide Statistics & Charts' : 'Show Statistics & Charts'}
                </button>
            </div>

            {showStats && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 relative group">
                                <div className={`absolute top-4 right-4 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase ${stat.badgeColor}`}>
                                    {stat.badge}
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</h3>
                                <p className="text-[10px] text-slate-400">{stat.sub}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-6 px-1">Document Status Distribution</h3>
                            <div className="flex flex-col items-center py-4">
                                <div className={`w-48 h-48 rounded-full border-[24px] shadow-inner relative flex items-center justify-center transition-all duration-500 ${docs.length > 0
                                        ? 'border-slate-50 border-t-emerald-500 border-l-rose-500 border-r-amber-500'
                                        : 'border-slate-100'
                                    }`}>
                                    <div className="text-center">
                                        <span className="text-2xl font-black text-slate-800 font-bold">{docs.length}</span>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                                    </div>
                                </div>
                                <div className="mt-8 flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded ${docs.length > 0 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Active</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded ${docs.length > 0 ? 'bg-rose-500' : 'bg-slate-200'}`} />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Expired</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded ${docs.length > 0 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Expiring Soon</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-6 px-1">
                                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Document Expiry Timeline</h3>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded ${docs.length > 0 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Next 6 Months</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-64 flex flex-col justify-end">
                                <div className="flex-1 border-b border-slate-100 relative">
                                    <div className="absolute bottom-0 left-10 w-full h-full flex justify-around items-end px-10">
                                        {['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, idx) => {
                                            // Simple logic to show bars only if data exists for that month
                                            // For now, if docs > 0, we show a small bar as placeholder for "active" documents in that month
                                            const hasData = docs.length > 0;
                                            return (
                                                <div key={idx} className="flex flex-col items-center gap-2 group relative">
                                                    <div className={`w-4 rounded-t transition-all duration-500 ${hasData ? 'bg-emerald-100 h-10 group-hover:bg-emerald-200' : 'bg-slate-50 h-2'
                                                        }`} />
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase">{m}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="bg-[#f0f2f5] px-6 py-2 rounded-lg border border-slate-200 mb-6 flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight cursor-pointer hover:text-indigo-600 transition-colors">
                    <ChevronDown size={14} className="text-slate-400" />
                    <Filter size={14} className="text-indigo-600" /> Filter Options <span className="text-slate-400 font-normal ml-1">(Alt+F)</span>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 flex justify-between items-center border-b border-slate-50">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Vehicle Documents List</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-all">
                        <Plus size={16} /> Add Document
                    </button>
                </div>

                <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4 bg-white">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        Show
                        <select className="border border-slate-200 rounded px-2 py-1 bg-white outline-none">
                            <option>25</option>
                            <option>50</option>
                            <option>100</option>
                        </select>
                        entries
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1.5 border border-slate-200 rounded text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-colors flex items-center gap-1.5"><Printer size={12} /> Print</button>
                        <button className="px-3 py-1.5 border border-slate-200 rounded text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-colors flex items-center gap-1.5"><FileSpreadsheet size={12} className="text-emerald-500" /> Excel</button>
                        <button className="px-3 py-1.5 border border-slate-200 rounded text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-colors flex items-center gap-1.5"><FileJson size={12} className="text-rose-500" /> PDF</button>
                        <button className="px-3 py-1.5 border border-slate-200 rounded text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-colors flex items-center gap-1.5"><FileText size={12} className="text-blue-500" /> CSV</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-medium">Search:</span>
                        <input type="text" className="border border-slate-200 rounded px-3 py-1.5 text-xs outline-none focus:border-indigo-500 transition-colors w-48" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#fcfdfe] text-[10px] font-bold uppercase text-slate-500 border-y border-slate-100">
                            <tr>
                                <th className="px-6 py-4 border-r border-slate-50">Vehicle</th>
                                <th className="px-6 py-4 border-r border-slate-50">Document Type</th>
                                <th className="px-6 py-4 border-r border-slate-50">Document Number</th>
                                <th className="px-6 py-4 border-r border-slate-50 text-center">Issue Date</th>
                                <th className="px-6 py-4 border-r border-slate-50 text-center">Expiry Date</th>
                                <th className="px-6 py-4 border-r border-slate-50 text-center">Status</th>
                                <th className="px-6 py-4 border-r border-slate-50">Reminder</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {docs.map((doc, i) => {
                                const status = getStatus(doc.expiryDate);
                                return (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-800 text-xs border-r border-slate-50">{doc.Lorry?.vehicleNumber || 'Unassigned'}</td>
                                        <td className="px-6 py-4 text-[11px] text-slate-600 font-medium border-r border-slate-50">{doc.documentType}</td>
                                        <td className="px-6 py-4 text-[11px] font-medium text-slate-600 border-r border-slate-50">{doc.documentNumber}</td>
                                        <td className="px-6 py-4 text-center text-[11px] text-slate-500 border-r border-slate-50">{doc.issueDate}</td>
                                        <td className="px-6 py-4 text-center text-[11px] text-slate-500 border-r border-slate-50">{doc.expiryDate}</td>
                                        <td className="px-6 py-4 text-center border-r border-slate-50">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter 
                                                ${status === 'Active' ? 'bg-[#edf7ee] text-[#4caf50]' :
                                                    status === 'Expired' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 border-r border-slate-50">
                                            <span className={`text-[11px] font-medium ${status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {getRemainingTime(doc.expiryDate)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded transition-colors"><Eye size={12} /></button>
                                                <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"><Edit2 size={12} /></button>
                                                <button className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded transition-colors"><RotateCcw size={12} /></button>
                                                <button className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors"><Trash2 size={12} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {docs.length === 0 && (
                        <div className="p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No Documents Found</div>
                    )}
                </div>

                <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end">
                    <div className="flex border border-slate-200 rounded overflow-hidden">
                        <button className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 bg-[#f8f9fa] border-r border-slate-200">Previous</button>
                        <button className="px-3 py-1.5 text-[10px] font-bold text-white bg-indigo-700">1</button>
                        <button className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-600 hover:bg-slate-50">Next</button>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                <div>© 2026 - Lorio</div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-indigo-600 rounded flex items-center justify-center text-[8px] text-white">L</div>
                    Lorio | All rights reserved
                </div>
            </div>
        </div>
    );
}
