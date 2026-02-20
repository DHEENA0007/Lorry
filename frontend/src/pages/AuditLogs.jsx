import { useState, useEffect } from 'react';
import { fetchData } from '../services/api';
import {
    History, Search, Filter, Download,
    Activity, Shield, User, Clock, ChevronRight,
    Terminal, Database, HardDrive, ShieldAlert
} from 'lucide-react';

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await fetchData('audit');
            setLogs(data);
        } catch (err) {
            console.error('Error loading logs:', err);
        } finally {
            setLoading(false);
        }
    };

    const getActionStyle = (action) => {
        if (action.includes('CREATE')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (action.includes('UPDATE')) return 'bg-amber-50 text-amber-600 border-amber-100';
        if (action.includes('DELETE')) return 'bg-rose-50 text-rose-600 border-rose-100';
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-xs font-semibold text-slate-500">Accessing System Core Logs...</p>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50/30 min-h-screen font-sans">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Terminal size={24} className="text-indigo-600" />
                        System Forensic Logs
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Security</span>
                        <ChevronRight size={10} className="text-slate-300" />
                        <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">Audit Trail</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter by action or user..."
                            className="bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 shadow-sm w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-black font-bold text-xs uppercase transition-all shadow-lg shadow-slate-100">
                        <Download size={16} /> Export Logs
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Events', value: logs.length, icon: <Activity size={20} className="text-indigo-600" /> },
                    { label: 'Security Critical', value: logs.filter(l => l.action.includes('DELETE') || l.action.includes('UPDATE')).length, icon: <ShieldAlert size={20} className="text-rose-500" /> },
                    { label: 'Database Health', value: 'Optimal', icon: <Database size={20} className="text-emerald-500" /> },
                    { label: 'Storage Node', value: 'Secure', icon: <HardDrive size={20} className="text-blue-500" /> }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-100 transition-all">
                        <div>
                            <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                            <p className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Chronological Forensic History</h3>
                    <div className="text-[10px] font-bold text-slate-400 uppercase italic tracking-tighter">Live Monitor: Connected</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                                <th className="px-8 py-5">Event Timestamp</th>
                                <th className="px-8 py-5">Operation Type</th>
                                <th className="px-8 py-5">Functional Module</th>
                                <th className="px-8 py-5">System Administrator</th>
                                <th className="px-8 py-5">Record Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {logs.filter(l =>
                                l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                l.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                l.details.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((log, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                                                <Clock size={16} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-700">
                                                    {new Date(log.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-medium">
                                                    {new Date(log.createdAt).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getActionStyle(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-tight opacity-70">
                                            {log.module}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                                                {log.performedBy.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-slate-800">{log.performedBy}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-medium text-slate-600 italic leading-relaxed max-w-md">
                                            "{log.details}"
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {logs.length === 0 && !loading && (
                        <div className="py-24 flex flex-col items-center justify-center text-center">
                            <History size={48} className="text-slate-100 mb-4" />
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Forensic Repository Empty</p>
                            <p className="text-[10px] font-medium text-slate-300 mt-1 italic italic">No system events recorded in the current session</p>
                        </div>
                    )}
                </div>
            </div>

            <footer className="mt-16 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4">
                <div className="flex items-center gap-3">
                    <Shield size={14} className="text-slate-300" />
                    <span>LORIO FORENSIC NODE</span>
                </div>
                <div>ENCRYPTED LOG CHANNEL: 0x882A</div>
            </footer>
        </div>
    );
}
