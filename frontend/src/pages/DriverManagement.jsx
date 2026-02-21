import { useState, useEffect } from 'react';
import { fetchData, postData } from '../services/api';
import { User, Phone, Mail, Plus, Trash2, ShieldCheck, ChevronRight, Briefcase, Activity, CheckCircle, Star } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-12 h-12 border-[5px] border-slate-100 border-t-orange-600 rounded-full animate-spin mb-6 shadow-xl" />
            <p className="text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase">Syncing Driver Data...</p>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            <header className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] bg-orange-50 px-2 py-1 rounded-md border border-orange-100">Human Resources</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Active Duty Rosters</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-slate-400">Directory</span>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-800">Fleet Pilots</span>
                    </div>
                </div>
            </header>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {/* Total Driver */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-800" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors">
                            <Briefcase size={20} className="text-slate-800" />
                        </div>
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">Total</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Total Driver</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">{drivers.length}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Registered Staff</span>
                        </p>
                    </div>
                </div>

                {/* Active on Duty */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                            <Activity size={20} className="text-orange-600" />
                        </div>
                        <div className="px-3 py-1 bg-orange-50 rounded-full text-[9px] font-black text-orange-600 uppercase tracking-widest border border-orange-100 animate-pulse">Live</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Active on Duty</p>
                    <h3 className="text-3xl font-black text-orange-600 tracking-tighter mb-4 pl-2">{drivers.length}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Currently Deployed</span>
                        </p>
                    </div>
                </div>

                {/* Cleared Vetting */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
                            <CheckCircle size={20} className="text-green-600" />
                        </div>
                        <div className="px-3 py-1 bg-green-50 rounded-full text-[9px] font-black text-green-600 uppercase tracking-widest border border-green-100">Verified</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Cleared Vetting</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">{drivers.length}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Status OK</span>
                        </p>
                    </div>
                </div>

                {/* Top Performers */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-yellow-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-yellow-50 rounded-2xl group-hover:bg-yellow-100 transition-colors">
                            <Star size={20} className="text-yellow-600" />
                        </div>
                        <div className="px-3 py-1 bg-yellow-50 rounded-full text-[9px] font-black text-yellow-600 uppercase tracking-widest border border-yellow-100">Elite</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Top Performers</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">4</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>High Ratings</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Registration Console */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 mb-10 overflow-hidden group hover:border-orange-500/30 transition-colors duration-500 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-bl-full pointer-events-none" />
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                        <ShieldCheck size={16} className="text-orange-500" /> Secure Driver Onboarding
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 relative z-10">
                        {[
                            { label: 'Legal Name', type: 'text', key: 'name', ph: 'John Doe' },
                            { label: 'Contact Email', type: 'email', key: 'email', ph: 'pilot@yoyo.com' },
                            { label: 'Primary Contact', type: 'tel', key: 'phone', ph: '+91 XXXXX XXXXX' },
                            { label: 'Access Code', type: 'password', key: 'password', ph: '••••••••' }
                        ].map(field => (
                            <div key={field.key} className="space-y-3">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{field.label}</label>
                                <input
                                    type={field.type}
                                    required
                                    placeholder={field.ph}
                                    className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-slate-300 placeholder:font-semibold"
                                    value={form[field.key]}
                                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end pt-2 border-t border-slate-50/50">
                        <button className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-[1.25rem] font-bold text-xs uppercase tracking-widest flex items-center gap-2.5 shadow-xl shadow-orange-600/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                            <Plus size={18} strokeWidth={2.5} /> Authorize Clearance
                        </button>
                    </div>
                </form>
            </div>

            {/* Directory Roster */}
            <div className="mb-6 px-3 flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-slate-800 rounded-sm"></div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Validated Driver Directory</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                {drivers.map(driver => (
                    <div key={driver.id} className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-6 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-slate-50 group-hover:bg-orange-500 transition-colors" />

                        <div className="flex items-center gap-4 pl-2">
                            <div className="w-16 h-16 rounded-[1.25rem] bg-orange-50 flex items-center justify-center text-orange-600 text-xl font-black border border-white shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white">
                                {driver.name.substring(0, 1).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-[15px] tracking-tight">{driver.name}</h4>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Standard</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50 pl-2">
                            <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-800 transition-colors bg-slate-50/50 p-2 rounded-xl">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                    <Mail size={14} className="text-slate-400" />
                                </div>
                                <span className="text-xs font-bold truncate">{driver.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-800 transition-colors bg-slate-50/50 p-2 rounded-xl">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                    <Phone size={14} className="text-slate-400" />
                                </div>
                                <span className="text-xs font-bold tracking-widest">{driver.phone || '+91 0000 000 000'}</span>
                            </div>
                        </div>

                        <div className="pt-5 border-t border-slate-50 flex justify-between items-center mt-auto pl-2">
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                PILOT-{driver.id.toString().padStart(4, '0')}
                            </span>
                            <button className="text-slate-300 hover:text-white hover:bg-red-500 p-2.5 rounded-xl transition-all shadow-sm group/btn hover:shadow-red-500/20">
                                <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}

                {drivers.length === 0 && !loading && (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 border border-slate-100 shadow-inner">
                            <User size={36} />
                        </div>
                        <p className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Rosters Empty</p>
                        <p className="text-[10px] font-bold text-orange-500 mt-2 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">Awaiting Human Capital Intake</p>
                    </div>
                )}
            </div>
        </div>
    );
}
