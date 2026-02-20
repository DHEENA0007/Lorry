import { useState, useEffect } from 'react';
import { fetchData, updateData } from '../services/api';
import { Package, CheckCircle, XCircle, MapPin, ArrowRight, ChevronRight, Clock } from 'lucide-react';

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-xs font-semibold text-slate-500">Retrieving Booking Data...</p>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50/30 min-h-screen font-sans">
            <header className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Booking Operations</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Enquiries</span>
                    <ChevronRight size={10} className="text-slate-300" />
                    <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">Incoming Requests</span>
                </div>
            </header>

            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Live Bookings Queue</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-tighter italic">
                        <Clock size={12} /> Pending Approval: {bookings.filter(b => b.status === 'Pending').length}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
                                <th className="px-8 py-5">Order Reference</th>
                                <th className="px-8 py-5">Logistics Route</th>
                                <th className="px-8 py-5">Consignment Info</th>
                                <th className="px-8 py-5">Commercials</th>
                                <th className="px-8 py-5 text-center">Protocol Status</th>
                                <th className="px-8 py-5 text-right">Gatekeeper Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-bold text-slate-900">#{booking.id.toString().padStart(6, '0')}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">Auto-Generated UUID</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                    <span className="text-xs font-bold text-slate-700">{booking.pickupLocation}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                    <span className="text-xs font-bold text-slate-700">{booking.dropLocation}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-bold text-slate-700">{booking.goodsType}</p>
                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{booking.weight} Tons Displacement</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-bold text-emerald-600 tracking-tight">₹{booking.estimatedCost.toLocaleString()}</div>
                                        <div className="text-[10px] font-medium text-slate-400 uppercase">Estimated Quote</div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${booking.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                booking.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end gap-2">
                                            {booking.status === 'Pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(booking.id, 'Approved')}
                                                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm shadow-emerald-100"
                                                        title="Authorize Booking"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(booking.id, 'Rejected')}
                                                        className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm shadow-rose-100"
                                                        title="Restrict Booking"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="text-[9px] font-bold text-slate-300 uppercase tracking-widest cursor-default">
                                                    Log Finalized
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {bookings.length === 0 && !loading && (
                        <div className="p-20 text-center flex flex-col items-center justify-center">
                            <Package size={48} className="text-slate-100 mb-4" />
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Incoming Logistics Enquiries</p>
                            <p className="text-[10px] font-medium text-slate-300 mt-1 italic italic">Database currently synchronizing</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
