import { useState, useEffect } from 'react';
import { fetchData, postData } from '../services/api';
import { User, Phone, Mail, Plus, Trash2, ShieldCheck, ChevronRight } from 'lucide-react';

export default function DriverManagement() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'driver' });

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        try {
            setLoading(true);
            const data = await fetchData('users?role=driver');
            setDrivers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await postData('auth/signup', form);
            setForm({ name: '', email: '', phone: '', password: '', role: 'driver' });
            loadDrivers();
        } catch (err) {
            alert('Failed to add driver: ' + err.message);
        }
    };

    if (loading && drivers.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-xs font-semibold text-slate-500">Syncing Personnel Data...</p>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50/30 min-h-screen font-sans">
            <header className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Personnel Management</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Directory</span>
                    <ChevronRight size={10} className="text-slate-300" />
                    <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">Active Fleet Drivers</span>
                </div>
            </header>

            {/* Registration Console */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 mb-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full pointer-events-none" />
                <h3 className="text-sm font-bold mb-6 text-slate-800 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-indigo-600" />
                    Register New Driver
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative z-10">
                    {[
                        { label: 'Full Name', type: 'text', key: 'name' },
                        { label: 'Email Address', type: 'email', key: 'email' },
                        { label: 'Phone Number', type: 'tel', key: 'phone' },
                        { label: 'System Password', type: 'password', key: 'password' }
                    ].map(field => (
                        <div key={field.key} className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">{field.label}</label>
                            <input
                                type={field.type}
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-sm"
                                value={form[field.key]}
                                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                            />
                        </div>
                    ))}
                    <div className="md:col-span-4 flex justify-end mt-4">
                        <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all transform active:scale-95">
                            <Plus size={18} /> Enroll Personnel
                        </button>
                    </div>
                </form>
            </div>

            {/* Directory Cards */}
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-2">Registered Drivers ({drivers.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {drivers.map(driver => (
                    <div key={driver.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-6 hover:border-indigo-200 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-white shadow-sm transition-transform group-hover:scale-110">
                                {driver.name.substring(0, 1).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-base tracking-tight">{driver.name}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active Duty</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 pt-2 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-700 transition-colors">
                                <Mail size={14} className="opacity-50" />
                                <span className="text-[11px] font-semibold truncate">{driver.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-700 transition-colors">
                                <Phone size={14} className="opacity-50" />
                                <span className="text-[11px] font-semibold">{driver.phone || '+91 000-000-0000'}</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center mt-auto">
                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">ID: {driver.id.toString().padStart(4, '0')}</span>
                            <button className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {drivers.length === 0 && !loading && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                            <User size={32} />
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Personnel Enrolled</p>
                        <p className="text-[10px] font-medium text-slate-300 mt-2 italic">Awaiting registration through the console above</p>
                    </div>
                )}
            </div>
        </div>
    );
}
