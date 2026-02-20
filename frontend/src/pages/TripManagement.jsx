import { useState, useEffect } from 'react';
import { fetchData, postData } from '../services/api';
import {
    Calendar, User, Truck, DollarSign, MapPin,
    Navigation, ArrowRight, Clock, ShieldCheck, ChevronRight, Plus, Filter
} from 'lucide-react';

export default function TripManagement() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [lorries, setLorries] = useState([]);
    const [form, setForm] = useState({
        driverId: '',
        lorryId: '',
        source: '',
        destination: '',
        budget: '',
        startDate: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tripsData, driversData, lorriesData] = await Promise.all([
                fetchData('trips'),
                fetchData('users?role=driver'),
                fetchData('lorries')
            ]);
            setTrips(tripsData);
            setDrivers(driversData);
            setLorries(lorriesData.filter(l => l.status === 'Available'));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await postData('trips', form);
            setForm({ driverId: '', lorryId: '', source: '', destination: '', budget: '', startDate: '' });
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading && trips.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-xs font-semibold text-slate-500">Mapping Global Logistics...</p>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50/30 min-h-screen font-sans">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Trip Dispatch Console</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Operations</span>
                        <ChevronRight size={10} className="text-slate-300" />
                        <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">Route Scheduling</span>
                    </div>
                </div>
                <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                    <Calendar size={16} /> Historic Schedule
                </button>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Deployment Form */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden sticky top-8">
                        <div className="p-8 border-b border-slate-100 bg-white">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-3 uppercase tracking-wider">
                                <Plus size={18} className="text-indigo-600" />
                                Initiate Deployment
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {[
                                { label: 'Active Driver', icon: <User size={18} />, key: 'driverId', options: drivers },
                                { label: 'Assigned Vehicle', icon: <Truck size={18} />, key: 'lorryId', options: lorries, display: l => `${l.vehicleNumber} • ${l.capacity}T` }
                            ].map(field => (
                                <div key={field.key} className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{field.label}</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{field.icon}</div>
                                        <select
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-sm appearance-none"
                                            value={form[field.key]}
                                            onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                            required
                                        >
                                            <option value="">Choose Registry...</option>
                                            {field.options.map(opt => <option key={opt.id} value={opt.id}>{field.display ? field.display(opt) : opt.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            ))}

                            <div className="grid grid-cols-2 gap-4">
                                {['Source', 'Destination'].map((label, i) => (
                                    <div key={label} className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{label}</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="text"
                                                placeholder={label === 'Source' ? 'Origin' : 'Dropoff'}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-sm"
                                                required
                                                value={i === 0 ? form.source : form.destination}
                                                onChange={e => setForm({ ...form, [i === 0 ? 'source' : 'destination']: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Route Budget</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="number"
                                            placeholder="₹ 0.00"
                                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-sm"
                                            required
                                            value={form.budget}
                                            onChange={e => setForm({ ...form, budget: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Deployment Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all shadow-sm"
                                        required
                                        value={form.startDate}
                                        onChange={e => setForm({ ...form, startDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95">
                                <ShieldCheck size={20} />
                                Confirm Deployment
                            </button>
                        </form>
                    </div>
                </div>

                {/* Tracking View */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <Navigation size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Live Fleet Logistics</h3>
                                <p className="text-[11px] font-medium text-slate-400 italic mt-0.5">Active deployments in transit</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${showFilters ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            <Filter size={14} /> Filter Routes
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {trips.map((trip) => (
                            <div key={trip.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-1.5 h-full bg-slate-50 group-hover:bg-indigo-500 transition-colors" />

                                <div className="flex flex-col md:flex-row justify-between gap-8">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">ID: #{trip.id.toString().padStart(6, '0')}</span>
                                            <div className="h-px w-8 bg-slate-100" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(trip.startDate).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-3 h-3 rounded-full border-2 border-indigo-600 bg-white" />
                                                <div className="w-0.5 h-10 bg-slate-100 rounded-full" />
                                                <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-lg shadow-indigo-100" />
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Origin Node</p>
                                                    <p className="text-sm font-bold text-slate-800">{trip.source}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Destination Node</p>
                                                    <p className="text-sm font-bold text-slate-800">{trip.destination}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 grid grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Personnel</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[9px] font-bold text-indigo-500">DR</div>
                                                <p className="text-[11px] font-bold text-slate-700">{trip.Driver?.name || 'In Transit'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Asset ID</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[9px] font-bold text-indigo-500">VH</div>
                                                <p className="text-[11px] font-bold text-slate-700 italic">{trip.Lorry?.vehicleNumber || 'Unlinked'}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-2 pt-2 border-t border-slate-200/50 flex justify-between items-center">
                                            <div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Route Budget</p>
                                                <p className="text-sm font-bold text-emerald-600">₹{trip.budget?.toLocaleString()}</p>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-indigo-100 bg-indigo-50 text-indigo-600`}>
                                                {trip.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {trips.length === 0 && !loading && (
                            <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                                <Clock size={40} className="text-slate-100 mb-4" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Awaiting Logistics Data</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
