import { useState, useEffect } from 'react';
import { Camera, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { fetchData, updateData } from '../services/api';

export default function PODVerification() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchData('trips');
            // Filter trips that have a POD image uploaded or are completed but POD status is pending
            // For now, let's just show all completed trips or trips with podImageUrl
            const pendingPODs = data.filter(t => t.status === 'Completed' || t.podImageUrl);
            setTrips(pendingPODs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id, status) => {
        try {
            await updateData(`trips/${id}`, { podStatus: status });
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-slate-800">POD Verification</h2>

            {loading ? (
                <div className="text-slate-500">Loading PODs...</div>
            ) : trips.length === 0 ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400">
                    <Camera size={48} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-slate-600">No Pending PODs</h3>
                    <p>All delivery proofs have been verified.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            {/* Image Section */}
                            <div className="relative bg-slate-100 aspect-video flex items-center justify-center text-slate-400 group cursor-pointer">
                                {trip.podImageUrl ? (
                                    <img src={trip.podImageUrl} alt="POD" className="object-cover w-full h-full" />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Camera size={32} />
                                        <span className="text-sm mt-2">No Image Uploaded</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <span className="font-medium text-sm">Click to Enlarge</span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">Trip #{trip.id}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{trip.source} &rarr; {trip.destination}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide 
                                        ${trip.podStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                                            trip.podStatus === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {trip.podStatus || 'Pending'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <span className="font-semibold text-xs uppercase text-slate-400 w-16">Driver</span>
                                        <span>{trip.Driver?.name || 'Unassigned'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <span className="font-semibold text-xs uppercase text-slate-400 w-16">Vehicle</span>
                                        <span>{trip.Lorry?.vehicleNumber || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <MapPin size={14} className="text-slate-400" />
                                        <span>Delivered on {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="mt-auto grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleVerify(trip.id, 'Verified')}
                                        disabled={trip.podStatus === 'Verified'}
                                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95">
                                        <CheckCircle size={16} /> Verify
                                    </button>
                                    <button
                                        onClick={() => handleVerify(trip.id, 'Rejected')}
                                        disabled={trip.podStatus === 'Rejected'}
                                        className="py-2.5 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95">
                                        <XCircle size={16} /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
