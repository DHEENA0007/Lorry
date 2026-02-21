import { useState, useEffect } from 'react';
import { fetchData, updateData } from '../services/api';
import { Package, CheckCircle, XCircle, MapPin, ArrowRight, ChevronRight, Clock, Anchor, Tag, AlignLeft } from 'lucide-react';

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const data = await fetchData('bookings');
            setBookings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await updateData(`bookings/${id}/status`, { status });
            loadBookings();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading && bookings.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-12 h-12 border-[5px] border-slate-100 border-t-orange-600 rounded-full animate-spin mb-6 shadow-xl" />
            <p className="text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase">Loading Bookings...</p>
        </div>
    );

    const pendingCount = bookings.filter(b => b.status === 'Pending').length;
    const approvedCount = bookings.filter(b => b.status === 'Approved').length;
    const estRevenue = bookings.reduce((sum, b) => b.status !== 'Rejected' ? sum + Number(b.estimatedCost) : sum, 0);

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            <header className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] bg-orange-50 px-2 py-1 rounded-md border border-orange-100">Client Gateway</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bookings</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-slate-400">Operations</span>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-800">Order Approvals</span>
                    </div>
                </div>
                <button className="flex items-center gap-2.5 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-black font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98]">
                    <div className="bg-white/20 p-1 rounded-lg">
                        <AlignLeft size={16} strokeWidth={3} />
                    </div>
                    Export Ledger
                </button>
            </header>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {/* Total Enquiries */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-800" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors">
                            <Package size={20} className="text-slate-800" />
                        </div>
                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">Total</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Total Enquiries</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">{bookings.length}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Inbound Requests</span>
                        </p>
                    </div>
                </div>

                {/* Pending Review */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl group-hover:bg-red-100 transition-colors">
                            <Clock size={20} className="text-red-600" />
                        </div>
                        <div className="px-3 py-1 bg-red-50 rounded-full text-[9px] font-black text-red-600 uppercase tracking-widest border border-red-100 animate-pulse">Critical</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Pending Review</p>
                    <h3 className="text-3xl font-black text-red-600 tracking-tighter mb-4 pl-2">{pendingCount}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Awaiting Action</span>
                        </p>
                    </div>
                </div>

                {/* Active Pipeline */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-100 transition-colors">
                            <CheckCircle size={20} className="text-orange-600" />
                        </div>
                        <div className="px-3 py-1 bg-orange-50 rounded-full text-[9px] font-black text-orange-600 uppercase tracking-widest border border-orange-100">Approved</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Active Pipeline</p>
                    <h3 className="text-3xl font-black text-orange-600 tracking-tighter mb-4 pl-2">{approvedCount}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Secured Bookings</span>
                        </p>
                    </div>
                </div>

                {/* Est Deal Value */}
                <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-200/60 relative group hover:-translate-y-1 hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-100 transition-colors">
                            <Tag size={20} className="text-green-600" />
                        </div>
                        <div className="px-3 py-1 bg-green-50 rounded-full text-[9px] font-black text-green-600 uppercase tracking-widest border border-green-100">Revenue</div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 pl-2">Est. Deal Value</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 pl-2">₹{estRevenue.toLocaleString()}</h3>
                    <div className="space-y-1.5 pt-4 border-t border-slate-50 pl-2">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>Projected Income</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 overflow-hidden group hover:border-orange-500/30 transition-colors duration-500">
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                        <Anchor size={16} className="text-orange-500" /> Live Contract Queue
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50/50 border border-red-100 px-4 py-1.5 rounded-full uppercase tracking-widest italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div> Queue Active
                    </div>
                </div>

                <div className="overflow-visible pb-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 tracking-[0.15em]">
                                <th className="px-10 py-6">Identity Tag</th>
                                <th className="px-10 py-6">Transit Corridor</th>
                                <th className="px-10 py-6">Payload</th>
                                <th className="px-10 py-6">Quote Base</th>
                                <th className="px-10 py-6 text-center">Status</th>
                                <th className="px-10 py-6 text-right">Approval Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50/80">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="text-[13px] font-black text-slate-900 tracking-tight">#{booking.id.toString().padStart(6, '0')}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Automated</div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center gap-1.5 pt-1">
                                                <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 bg-white" />
                                                <div className="w-px h-6 bg-slate-200" />
                                                <div className="w-2.5 h-2.5 rounded-full border-2 border-orange-500 bg-orange-50" />
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 hover:text-orange-500 cursor-default transition-colors">Origin</span>
                                                    <span className="text-[13px] font-bold text-slate-800">{booking.pickupLocation}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 hover:text-orange-500 cursor-default transition-colors">Target</span>
                                                    <span className="text-[13px] font-bold text-slate-800">{booking.dropLocation}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <p className="text-[13px] font-bold text-slate-800 tracking-tight">{booking.goodsType}</p>
                                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1 bg-orange-50 inline-block px-2 py-0.5 rounded border border-orange-100">
                                            {booking.weight} T Displacement
                                        </p>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="text-[15px] font-black text-slate-900 tracking-tight">₹{booking.estimatedCost.toLocaleString()}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Contract Est.</div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-colors ${booking.status === 'Pending' ? 'bg-red-50 text-red-600 border-red-100 shadow-[0_2px_10px_rgba(239,68,68,0.1)]' :
                                            booking.status === 'Approved' ? 'bg-slate-900 text-white border-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.1)]' :
                                                'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {booking.status === 'Pending' && <Clock size={12} className="mr-1.5" />}
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex justify-end gap-3">
                                            {booking.status === 'Pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(booking.id, 'Approved')}
                                                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm hover:shadow-lg hover:shadow-slate-900/20 group"
                                                        title="Authorize Contract"
                                                    >
                                                        <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(booking.id, 'Rejected')}
                                                        className="p-3 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm hover:shadow-lg hover:shadow-red-500/20 group"
                                                        title="Terminate Request"
                                                    >
                                                        <XCircle size={18} className="group-hover:scale-110 transition-transform" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="px-4 py-2.5 rounded-xl text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 uppercase tracking-widest cursor-default">
                                                    Resolved
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bookings.length === 0 && !loading && (
                        <div className="p-24 text-center flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                                <Package size={36} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Zero Active Consultations</p>
                            <p className="text-[10px] font-bold text-orange-500 mt-2 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">Awaiting Client Initialization</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
