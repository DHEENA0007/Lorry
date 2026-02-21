import { useState, useEffect } from 'react';
import { X, Truck, Info } from 'lucide-react';

export default function AddVehicleModal({ isOpen, onClose, onSave, vehicleData = null }) {
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        type: '',
        tires: '',
        batteries: '',
        loadedMileage: '',
        emptyMileage: ''
    });

    useEffect(() => {
        if (vehicleData) {
            setFormData({
                vehicleNumber: vehicleData.vehicleNumber || '',
                type: vehicleData.type || '',
                tires: vehicleData.tires || '',
                batteries: vehicleData.batteries || '',
                loadedMileage: vehicleData.loadedMileage || '',
                emptyMileage: vehicleData.emptyMileage || ''
            });
        } else {
            setFormData({
                vehicleNumber: '',
                type: '',
                tires: '',
                batteries: '',
                loadedMileage: '',
                emptyMileage: ''
            });
        }
    }, [vehicleData, isOpen]);

    if (!isOpen) return null;

    const vehicleTypes = [
        // Light Commercial Vehicles
        'Tata Ace', 'Pickup', 'Mini Truck', 'LCV (Light Commercial)',
        // Medium Commercial Vehicles
        'ICV (Intermediate)', 'MCV (Medium Commercial)',
        // Heavy Commercial Vehicles
        '2-Axle Truck', '3-Axle Truck', 'Multi-Axle Truck (4+)',
        'HCV (Heavy Commercial)',
        // Tippers & Construction
        'Tipper / Dumper', 'Bulker (Cement)', 'Earth Mover',
        // Trailers
        'Trailer (20ft)', 'Trailer (40ft)', 'Flatbed Trailer',
        'Low Bed Trailer', 'Semi Trailer', 'Full Truck Load (FTL)',
        // Specialized
        'Tanker', 'Reefer (Refrigerated)', 'Container Truck',
        'Car Carrier', 'Open Body Truck', 'Closed Body / Container',
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, vehicleData?.id);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in premium-shadow border border-white/20">
                {/* Header */}
                <div className="px-10 py-7 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                            <Truck size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                {vehicleData ? 'Refine Vehicle Profile' : 'Register New Vehicle'}
                            </h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                Fleet Management
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 hover:bg-white hover:shadow-sm rounded-2xl text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                    {/* RC Number */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                            RC Number
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            required
                            type="text"
                            name="vehicleNumber"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-slate-300"
                            placeholder="e.g. TN 12 AB 1234"
                        />
                    </div>

                    {/* Vehicle Type Selection */}
                    <div className="space-y-5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                            Vehicle Type
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                            {vehicleTypes.map((type) => (
                                <label
                                    key={type}
                                    className={`relative flex items-center justify-center px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${formData.type === type ? 'bg-orange-50 border-orange-500 ring-4 ring-orange-500/5' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                                >
                                    <input
                                        required
                                        type="radio"
                                        name="type"
                                        value={type}
                                        checked={formData.type === type}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <span className={`text-xs font-bold tracking-tight text-center ${formData.type === type ? 'text-orange-700' : 'text-slate-500'}`}>
                                        {type}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Technical Specs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                                Tires
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="tires"
                                    value={formData.tires}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-orange-500 transition-all"
                                    placeholder="0"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-white rounded-lg text-[9px] font-bold text-slate-400 uppercase border border-slate-100 shadow-sm">Units</div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
                                Batteries
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="batteries"
                                    value={formData.batteries}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200/60 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-orange-500 transition-all"
                                    placeholder="0"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-white rounded-lg text-[9px] font-bold text-slate-400 uppercase border border-slate-100 shadow-sm">Cells</div>
                            </div>
                        </div>
                    </div>

                    {/* Efficiency Metrics */}
                    <div className="bg-slate-50/50 p-7 rounded-[2rem] border border-slate-100 space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Info size={14} className="text-orange-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency Parameters</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest ml-1">
                                    Loaded (km/L)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="loadedMileage"
                                    value={formData.loadedMileage}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-orange-500 transition-all"
                                    placeholder="4.5"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest ml-1">
                                    Empty (km/L)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    name="emptyMileage"
                                    value={formData.emptyMileage}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-orange-500 transition-all"
                                    placeholder="6.0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3.5 rounded-2xl text-xs font-bold text-slate-400 hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-14 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Confirm Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
