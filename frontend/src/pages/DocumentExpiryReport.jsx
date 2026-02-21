import { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import {
    ChevronRight, RefreshCcw, FileSpreadsheet, Download
} from 'lucide-react';

export default function DocumentExpiryReport() {
    const [vehicles, setVehicles] = useState([]);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    const docTypes = [
        'Fitness Certificate',
        'Local Permit',
        'Motor Vehicle Insurance',
        'National Permit',
        'Pollution PUC',
        'Registration Certificate (RC)',
        'Road Tax'
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [vData, dData] = await Promise.all([
                fetchData('lorries'),
                fetchData('vehicle-documents')
            ]);
            setVehicles(vData);
            setDocs(dData);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getDocStatus = (expiryDate) => {
        if (!expiryDate) return 'na';
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'expired';
        if (diffDays <= 30) return 'soon';
        return 'valid';
    };

    const formatShortDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB'); // dd/mm/yyyy
    };

    // Summary calculations
    const totalDocs = docs.length;
    const expiredCount = docs.filter(d => getDocStatus(d.expiryDate) === 'expired').length;
    const soonCount = docs.filter(d => getDocStatus(d.expiryDate) === 'soon').length;
    const validCount = docs.filter(d => getDocStatus(d.expiryDate) === 'valid').length;

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Expiring Documents...</div>;

    return (
        <div className="p-6 bg-[#f8f9fa] min-h-screen font-sans">
            {/* Header */}
            <header className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    Vehicle Document Expiry Report
                    <span className="text-[10px] font-normal text-slate-400 flex items-center gap-1 ml-2">
                        Dashboard <ChevronRight size={10} /> Reports <ChevronRight size={10} /> Vehicle Document Expiry
                    </span>
                </h2>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Total Docs */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-800" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors">
                            <FileSpreadsheet size={20} className="text-slate-800" />
                        </div>
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">Total</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Total Documents</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">{totalDocs}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Tracked Records</span>
                        </p>
                    </div>
                </div>

                {/* Expired Docs */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl group-hover:bg-red-100 transition-colors">
                            <span className="text-lg font-bold text-red-600">⚠</span>
                        </div>
                        <div className="px-3 py-1 bg-red-50 rounded-full text-[9px] font-black text-red-600 uppercase tracking-widest border border-red-100 animate-pulse">Critical</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Expired</p>
                    <h3 className="text-3xl font-black text-red-600 tracking-tighter mb-4 pl-2">{expiredCount}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Immediate Action</span>
                        </p>
                    </div>
                </div>

                {/* Expiring Soon */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                            <span className="text-lg font-bold text-orange-600">⏱</span>
                        </div>
                        <div className="px-3 py-1 bg-orange-50 rounded-full text-[9px] font-black text-orange-600 uppercase tracking-widest border border-orange-100">Warning</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Expiring Soon</p>
                    <h3 className="text-3xl font-black text-orange-600 tracking-tighter mb-4 pl-2">{soonCount}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Next 30 Days</span>
                        </p>
                    </div>
                </div>

                {/* Valid Docs */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
                            <span className="text-lg font-bold text-green-600">✓</span>
                        </div>
                        <div className="px-3 py-1 bg-green-50 rounded-full text-[9px] font-black text-green-600 uppercase tracking-widest border border-green-100">Secure</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Valid</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">{validCount}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Compliant Records</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Legend Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 mb-8">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-6 px-1">Legend</h4>
                <div className="flex flex-wrap gap-x-12 gap-y-4">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-[#4caf50] text-white text-[9px] font-black uppercase rounded shadow-sm">Valid</span>
                        <span className="text-[10px] font-bold text-slate-500">More than 30 days</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase rounded shadow-sm">Expiring Soon</span>
                        <span className="text-[10px] font-bold text-slate-500">Within 30 days</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-[#d32f2f] text-white text-[9px] font-black uppercase rounded shadow-sm">Expired</span>
                        <span className="text-[10px] font-bold text-slate-500">Past expiry date</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-[#455a64] text-white text-[9px] font-black uppercase rounded shadow-sm">N/A</span>
                        <span className="text-[10px] font-bold text-slate-500">No document available</span>
                    </div>
                </div>
            </div>

            {/* Expiry Matrix Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 flex justify-between items-center border-b border-slate-50 bg-[#fafafa]">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Expiring Documents Table</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={loadData}
                            className="flex items-center gap-2 px-3 py-1.5 border border-orange-200 text-orange-600 rounded text-[10px] font-black uppercase tracking-widest bg-white hover:bg-slate-50 transition-colors"
                        >
                            <RefreshCcw size={12} /> Refresh
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#4caf50] text-white rounded text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-[#43a047] transition-colors">
                            <FileSpreadsheet size={12} /> Export Excel
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#fcfdfe] text-[10px] font-black uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-4 border border-slate-100 min-w-[200px]">Vehicle</th>
                                {docTypes.map(type => (
                                    <th key={type} className="px-4 py-4 border border-slate-100 text-center text-[9px] max-w-[120px]">
                                        {type}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[10px]">
                            {vehicles.map(vehicle => (
                                <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-4 font-bold text-slate-700 border border-slate-100">
                                        {vehicle.vehicleNumber} <span className="font-normal text-slate-400">( )</span>
                                    </td>
                                    {docTypes.map(type => {
                                        const doc = docs.find(d => d.LorryId === vehicle.id && (d.documentType === type || (type === 'Motor Vehicle Insurance' && d.documentType === 'Insurance')));
                                        const status = getDocStatus(doc?.expiryDate);

                                        let cellClass = "bg-[#546e7a] text-white/80"; // N/A style
                                        if (status === 'valid') cellClass = "bg-[#2e7d32] text-white";
                                        if (status === 'soon') cellClass = "bg-red-500 text-white";
                                        if (status === 'expired') cellClass = "bg-[#c62828] text-white";

                                        return (
                                            <td key={type} className={`px-2 py-4 border border-slate-100 text-center font-bold tracking-tight ${cellClass}`}>
                                                {doc ? formatShortDate(doc.expiryDate) : 'N/A'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                th { white-space: normal; line-height: 1.2; vertical-align: middle; }
            `}</style>
        </div>
    );
}
