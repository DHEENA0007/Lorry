import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchData, postData } from '../services/api';
import {
    Calendar, User, Truck, DollarSign, MapPin,
    Navigation, ChevronRight, Plus, Filter, ShieldCheck, ClipboardList,
    Map as MapIcon, Fuel, Timer, Route as RouteIcon, Loader2, Gauge,
    CircleDot, Wrench, Banknote, Package, Container, Snowflake,
    Car, Droplets, HardHat, Weight, ArrowDownUp, Box, Search,
    Activity, Clock, TrendingUp, AlertCircle, ArrowRight
} from 'lucide-react';
import {
    searchPlaces, reverseGeocode, getRouteWithCost, decodePolyline
} from '../services/mapplsService';

const MAPPLS_KEY = import.meta.env.VITE_MAPPLS_API_KEY;

const VEHICLE_TYPES = [
    { value: 'TataAce', label: 'Tata Ace', Icon: Truck },
    { value: 'Pickup', label: 'Pickup', Icon: Truck },
    { value: 'MiniTruck', label: 'Mini Truck', Icon: Truck },
    { value: 'LCV', label: 'LCV', Icon: Package },
    { value: 'ICV', label: 'ICV', Icon: Truck },
    { value: 'MCV', label: 'MCV', Icon: Truck },
    { value: '2AxlesTruck', label: '2-Axle Truck', Icon: Truck },
    { value: '3AxlesTruck', label: '3-Axle Truck', Icon: Truck },
    { value: 'MultiAxlesTruck', label: 'Multi-Axle (4+)', Icon: Weight },
    { value: 'HCV', label: 'HCV', Icon: HardHat },
    { value: 'Tipper', label: 'Tipper / Dumper', Icon: ArrowDownUp },
    { value: 'Bulker', label: 'Bulker (Cement)', Icon: Container },
    { value: 'EarthMover', label: 'Earth Mover', Icon: HardHat },
    { value: 'Trailer20ft', label: 'Trailer (20ft)', Icon: Container },
    { value: 'Trailer40ft', label: 'Trailer (40ft)', Icon: Container },
    { value: 'FlatbedTrailer', label: 'Flatbed Trailer', Icon: Truck },
    { value: 'LowBedTrailer', label: 'Low Bed Trailer', Icon: Truck },
    { value: 'SemiTrailer', label: 'Semi Trailer', Icon: Truck },
    { value: 'FTL', label: 'FTL', Icon: Package },
    { value: 'Tanker', label: 'Tanker', Icon: Droplets },
    { value: 'Reefer', label: 'Reefer (Refrigerated)', Icon: Snowflake },
    { value: 'ContainerTruck', label: 'Container Truck', Icon: Box },
    { value: 'CarCarrier', label: 'Car Carrier', Icon: Car },
    { value: 'OpenBody', label: 'Open Body Truck', Icon: Truck },
    { value: 'ClosedBody', label: 'Closed Body', Icon: Box },
];

export default function TripManagement() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [lorries, setLorries] = useState([]);
    const [form, setForm] = useState({
        driverId: '', lorryId: '', source: '', destination: '', budget: '', startDate: ''
    });

    // Map & route state
    const [mapReady, setMapReady] = useState(false);
    const [routeData, setRouteData] = useState(null);
    const [tripCost, setTripCost] = useState(null);
    const [mapSelectionMode, setMapSelectionMode] = useState(null);
    const [selectedVehicleType, setSelectedVehicleType] = useState('2AxlesTruck');
    const [fuelPrice, setFuelPrice] = useState('');
    const [calculatingRoute, setCalculatingRoute] = useState(false);

    // eLoc based selection
    const [sourceELoc, setSourceELoc] = useState(null);
    const [destELoc, setDestELoc] = useState(null);
    const [sourceCoords, setSourceCoords] = useState(null);
    const [destCoords, setDestCoords] = useState(null);

    // Autocomplete
    const [sourceSuggestions, setSourceSuggestions] = useState([]);
    const [destSuggestions, setDestSuggestions] = useState([]);
    const [showSourceDrop, setShowSourceDrop] = useState(false);
    const [showDestDrop, setShowDestDrop] = useState(false);
    const [searchingSource, setSearchingSource] = useState(false);
    const [searchingDest, setSearchingDest] = useState(false);

    // Map refs
    const mapRef = useRef(null);
    const sourceMarkerRef = useRef(null);
    const destMarkerRef = useRef(null);
    const polylineRef = useRef(null);
    const directionPluginRef = useRef(null);
    const mapSelectionModeRef = useRef(null);
    const truckMarkerRef = useRef(null);
    const [trackingTripId, setTrackingTripId] = useState(null);

    useEffect(() => { mapSelectionModeRef.current = mapSelectionMode; }, [mapSelectionMode]);

    // ─── Map SDK Initialization ──────────────────────────────
    useEffect(() => {
        const initMap = () => {
            if (!window.mappls || mapRef.current) return;
            try {
                const map = new window.mappls.Map('mappls-map-container', {
                    center: [20.5937, 78.9629],
                    zoom: 4,
                    zoomControl: false,
                    search: false,
                });

                map.addListener('load', () => {
                    mapRef.current = map;
                    setMapReady(true);
                    map.addListener('click', async (e) => {
                        const mode = mapSelectionModeRef.current;
                        if (!mode) return;
                        let lat, lng;
                        if (e.lngLat) { lat = e.lngLat.lat; lng = e.lngLat.lng; }
                        else if (e.latlng) { lat = e.latlng.lat; lng = e.latlng.lng; }
                        else return;

                        const result = await reverseGeocode(lat, lng);
                        if (mode === 'source') {
                            setForm(p => ({ ...p, source: result.address }));
                            setSourceCoords({ lat, lng });
                            setSourceELoc(result.eLoc);
                            placeMarker('source', lat, lng);
                        } else {
                            setForm(p => ({ ...p, destination: result.address }));
                            setDestCoords({ lat, lng });
                            setDestELoc(result.eLoc);
                            placeMarker('destination', lat, lng);
                        }
                        setMapSelectionMode(null);
                    });
                });
            } catch (err) { console.error('Map init error:', err); }
        };

        const existing = document.getElementById('mappls-sdk');
        if (existing) {
            if (window.mappls) initMap();
            else existing.addEventListener('load', () => {
                const check = setInterval(() => { if (window.mappls) { clearInterval(check); initMap(); } }, 200);
            });
            return;
        }

        const script = document.createElement('script');
        script.id = 'mappls-sdk';
        script.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk?layer=vector&v=3.0`;
        script.async = true;

        script.onload = () => {
            const pluginScript = document.createElement('script');
            pluginScript.id = 'mappls-sdk-plugin';
            pluginScript.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk_plugins?v=3.0&libraries=direction`;
            pluginScript.async = true;
            pluginScript.onload = () => {
                const check = setInterval(() => { if (window.mappls && window.mappls.direction) { clearInterval(check); initMap(); } }, 200);
            };
            document.head.appendChild(pluginScript);
        };
        document.head.appendChild(script);

        return () => {
            if (mapRef.current) {
                try { mapRef.current.remove(); } catch (e) { /* */ }
                mapRef.current = null;
            }
        };
    }, []);

    const placeMarker = (type, lat, lng) => {
        const map = mapRef.current;
        if (!map || !window.mappls) return;
        const ref = type === 'source' ? sourceMarkerRef : destMarkerRef;
        if (ref.current) try { ref.current.remove(); } catch (e) { /* */ }
        try {
            const marker = new window.mappls.Marker({
                map,
                position: { lat, lng },
                popupHtml: `<div class="px-2 py-1 font-bold text-xs">${type === 'source' ? '📍 Source' : '🏁 Destination'}</div>`,
            });
            ref.current = marker;
        } catch (e) { console.error('Marker error:', e); }
    };

    const drawGoogleStyleRoute = (sEloc, dEloc, sCoords, dCoords, startCoordsFallback, endCoordsFallback) => {
        const map = mapRef.current;
        if (!map || !window.mappls || !window.mappls.direction) return;

        // Clear manual components
        if (polylineRef.current) try { polylineRef.current.remove(); polylineRef.current = null; } catch (e) { }
        if (sourceMarkerRef.current) try { sourceMarkerRef.current.remove(); sourceMarkerRef.current = null; } catch (e) { }
        if (destMarkerRef.current) try { destMarkerRef.current.remove(); destMarkerRef.current = null; } catch (e) { }

        // Clear existing direction plugin instance
        if (directionPluginRef.current) {
            try { directionPluginRef.current.remove(); } catch (e) { }
        }

        let startParam = sEloc ? { eLoc: sEloc } : (sCoords ? { lat: sCoords.lat, lng: sCoords.lng } : { lat: startCoordsFallback.lat, lng: startCoordsFallback.lng });
        let endParam = dEloc ? { eLoc: dEloc } : (dCoords ? { lat: dCoords.lat, lng: dCoords.lng } : { lat: endCoordsFallback.lat, lng: endCoordsFallback.lng });

        if (!startParam || !endParam) return;

        try {
            directionPluginRef.current = window.mappls.direction({
                map: map,
                start: startParam,
                end: endParam,
                profile: 'driving',
                search: false, // Turn off plugin's search bar
                UI_options: {
                    routeOptions: false // Hides left panel
                }
            });
        } catch (e) { console.error('Direction plugin error:', e); }
    };

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tripsData, driversData, lorriesData] = await Promise.all([
                fetchData('trips'), fetchData('users?role=driver'), fetchData('lorries')
            ]);
            setTrips(tripsData);
            setDrivers(driversData);
            setLorries(lorriesData.filter(l => l.status === 'Available'));
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    // ─── Autocomplete Effects ─────────────────────────────────
    useEffect(() => {
        if (!form.source || form.source.length < 3 || sourceELoc) {
            setSourceSuggestions([]);
            setShowSourceDrop(false);
            return;
        }
        setSearchingSource(true);
        const t = setTimeout(async () => {
            try {
                const results = await searchPlaces(form.source);
                setSourceSuggestions(results);
                setShowSourceDrop(results.length > 0);
            } catch (e) { console.error(e); }
            setSearchingSource(false);
        }, 300);
        return () => clearTimeout(t);
    }, [form.source, sourceELoc]);

    useEffect(() => {
        if (!form.destination || form.destination.length < 3 || destELoc) {
            setDestSuggestions([]);
            setShowDestDrop(false);
            return;
        }
        setSearchingDest(true);
        const t = setTimeout(async () => {
            try {
                const results = await searchPlaces(form.destination);
                setDestSuggestions(results);
                setShowDestDrop(results.length > 0);
            } catch (e) { console.error(e); }
            setSearchingDest(false);
        }, 300);
        return () => clearTimeout(t);
    }, [form.destination, destELoc]);

    useEffect(() => {
        const hasSource = sourceELoc || sourceCoords;
        const hasDest = destELoc || destCoords;
        if (!hasSource || !hasDest) {
            setRouteData(null); setTripCost(null); return;
        }

        const calc = async () => {
            setCalculatingRoute(true);
            try {
                const data = await getRouteWithCost({
                    sourceELoc,
                    destELoc,
                    startLat: sourceCoords?.lat,
                    startLng: sourceCoords?.lng,
                    endLat: destCoords?.lat,
                    endLng: destCoords?.lng,
                    vehicleType: selectedVehicleType,
                    fuelPrice: parseFloat(fuelPrice) || 0,
                });
                if (data?.route) {
                    setRouteData(data.route);
                    setTripCost(data.tripCost);
                    drawGoogleStyleRoute(
                        sourceELoc, destELoc,
                        sourceCoords, destCoords,
                        data.route.startCoords, data.route.endCoords
                    );
                }
            } catch (e) { console.error(e); }
            finally { setCalculatingRoute(false); }
        };

        const timer = setTimeout(calc, 300);
        return () => clearTimeout(timer);
    }, [sourceELoc, destELoc, sourceCoords, destCoords, selectedVehicleType, fuelPrice]);

    const selectPlace = (place, field) => {
        const name = place.placeName || '';
        const eLoc = place.eLoc || null;
        if (field === 'source') {
            setForm(p => ({ ...p, source: name + (place.placeAddress ? ', ' + place.placeAddress : '') }));
            setSourceELoc(eLoc);
            setSourceCoords(null);
            setShowSourceDrop(false);
        } else {
            setForm(p => ({ ...p, destination: name + (place.placeAddress ? ', ' + place.placeAddress : '') }));
            setDestELoc(eLoc);
            setDestCoords(null);
            setShowDestDrop(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await postData('trips', {
                ...form,
                routeDistance: routeData?.distanceText || '',
                routeDuration: routeData?.durationText || '',
                estimatedCost: tripCost?.totalEstimate || 0,
            });
            setForm({ driverId: '', lorryId: '', source: '', destination: '', budget: '', startDate: '' });
            setRouteData(null); setTripCost(null);
            setSourceELoc(null); setDestELoc(null);
            setSourceCoords(null); setDestCoords(null);
            if (sourceMarkerRef.current) try { sourceMarkerRef.current.remove(); } catch (e) { /* */ }
            if (destMarkerRef.current) try { destMarkerRef.current.remove(); } catch (e) { /* */ }
            if (polylineRef.current) try { polylineRef.current.remove(); } catch (e) { /* */ }
            if (directionPluginRef.current) try { directionPluginRef.current.remove(); } catch (e) { /* */ }
            loadData();
        } catch (err) { console.error(err); }
    };

    // ─── Live Driver Tracking Polling ──────────────────────────────────
    useEffect(() => {
        let interval;
        const fetchLocation = async () => {
            if (!trackingTripId) return;
            try {
                const data = await fetchData(`trips/${trackingTripId}/location`);
                if (data && data.currentLocation) {
                    const [latStr, lngStr] = data.currentLocation.split(',');
                    const lat = parseFloat(latStr);
                    const lng = parseFloat(lngStr);
                    const map = mapRef.current;

                    if (map && window.mappls) {
                        if (truckMarkerRef.current) {
                            try { truckMarkerRef.current.setPosition({ lat, lng }); } catch (e) { }
                        } else {
                            try {
                                truckMarkerRef.current = new window.mappls.Marker({
                                    map,
                                    position: { lat, lng },
                                    popupHtml: '<div class="px-3 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-2xl">🚚 Live Target Located</div>',
                                });
                            } catch (e) { }
                        }
                        try { map.panTo([lng, lat]); } catch (e) { } // Mappls often expects [lng, lat] for panTo or {lat, lng}
                    }
                }
            } catch (err) { console.error('Error fetching live location', err); }
        };

        if (trackingTripId) {
            // Clear planning UI
            if (sourceMarkerRef.current) try { sourceMarkerRef.current.remove(); sourceMarkerRef.current = null; } catch (e) { }
            if (destMarkerRef.current) try { destMarkerRef.current.remove(); destMarkerRef.current = null; } catch (e) { }
            if (directionPluginRef.current) { try { directionPluginRef.current.remove(); } catch (e) { } directionPluginRef.current = null; }

            fetchLocation();
            interval = setInterval(fetchLocation, 3000); // 3-second rapid polling
        } else {
            if (truckMarkerRef.current) {
                try { truckMarkerRef.current.remove(); truckMarkerRef.current = null; } catch (e) { }
            }
        }
        return () => clearInterval(interval);
    }, [trackingTripId]);

    // ─── Render Components ─────────────────────────────────────
    const SuggestionList = ({ suggestions, onSelect, field }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl z-[100] max-h-64 overflow-y-auto"
        >
            <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggestions</span>
                <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">{suggestions.length} Found</span>
            </div>
            {suggestions.map((place, idx) => (
                <button key={`${place.eLoc || idx}`} type="button"
                    onMouseDown={(e) => { e.preventDefault(); onSelect(place, field); }}
                    className="w-full px-5 py-4 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 flex items-start gap-4 group"
                >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <MapPin size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 truncate">{place.placeName}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 leading-tight">{place.placeAddress}</p>
                    </div>
                </button>
            ))}
        </motion.div>
    );

    const stats = useMemo(() => [
        { label: 'Total Trips', value: trips.length, icon: RouteIcon, trend: '+4% from last week', color: 'indigo' },
        { label: 'Active Fleet', value: trips.filter(t => t.status === 'In Transit').length, icon: Activity, trend: 'Live Monitoring', color: 'orange' },
        { label: 'Completed', value: trips.filter(t => t.status === 'Completed').length, icon: ShieldCheck, trend: '98.2% Success', color: 'green' },
        { label: 'Pending', value: trips.filter(t => t.status === 'Pending').length, icon: Clock, trend: 'Awaiting Driver', color: 'blue' }
    ], [trips]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-8 font-sans">
            {/* Header Area */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="px-2.5 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">Controller</div>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <p className="text-slate-400 text-xs font-semibold">Trip Analytics Dashboard</p>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">Trip Command Hub</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                        <Filter size={20} />
                    </button>
                    <button onClick={loadData} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
                        {loading ? <Loader2 size={18} className="animate-spin text-indigo-500" /> : <Calendar size={18} className="text-indigo-500" />}
                        Refresh Data
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 rounded-[2.5rem] premium-shadow border border-white/40 flex items-start justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform"
                    >
                        <div className="space-y-4 relative z-10">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-${stat.color}-600 bg-${stat.color}-50 shadow-sm border border-${stat.color}-100/50`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</h4>
                                <p className="text-3xl font-black text-slate-900 mt-1 uppercase tracking-tight">{stat.value}</p>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                                <TrendingUp size={12} className="text-green-500" />
                                {stat.trend}
                            </p>
                        </div>
                        <div className={`absolute -right-4 -bottom-4 text-slate-100 group-hover:text-${stat.color}-100 transition-colors duration-500 opacity-20 group-hover:opacity-40`}>
                            <stat.icon size={120} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Layout Split */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Planning Center */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-visible relative">
                        <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/30 rounded-t-[3rem] flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600"><Plus size={18} /></div>
                                Fleet Planner
                            </h3>
                            {calculatingRoute ? <Loader2 size={16} className="animate-spin text-orange-500" /> : <RouteIcon size={16} className="text-slate-300" />}
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-10">
                            {/* Trip Participants */}
                            <div className="grid grid-cols-1 gap-6">
                                {[
                                    { label: 'Assigned Pilot', icon: <User size={18} />, key: 'driverId', options: drivers, placeholder: 'Search Driver...' },
                                    { label: 'Deployment Lorry', icon: <Truck size={18} />, key: 'lorryId', options: lorries, placeholder: 'Search Vehicle...', display: l => `${l.vehicleNumber} (${l.capacity}T)` }
                                ].map(f => (
                                    <div key={f.key} className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{f.label}</label>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">{f.icon}</div>
                                            <select
                                                required
                                                className="w-full pl-14 pr-10 py-4.5 bg-slate-50 border border-slate-200/60 rounded-[1.5rem] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                                                value={form[f.key]}
                                                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            >
                                                <option value="">{f.placeholder}</option>
                                                {f.options.map(o => <option key={o.id} value={o.id}>{f.display ? f.display(o) : o.name}</option>)}
                                            </select>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300"><ChevronRight size={16} className="rotate-90" /></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Logistics Route */}
                            <div className="space-y-6 relative">
                                <div className="absolute left-[20px] top-[40px] bottom-[20px] w-0.5 bg-indigo-50 z-0 border-l border-dashed border-indigo-200/50"></div>

                                <div className="space-y-2 relative z-10">
                                    <div className="flex justify-between items-center pr-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Collection Point</label>
                                        <button type="button" onClick={() => setMapSelectionMode('source')} className={`text-[10px] font-bold ${mapSelectionMode === 'source' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'} px-2 py-1 rounded-lg transition-colors`}>Select On Map</button>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-[3px] border-indigo-500 bg-white z-20"></div>
                                        <input
                                            type="text"
                                            placeholder="Type Loading Location..."
                                            required
                                            className="w-full pl-11 pr-5 py-4 bg-slate-50 border border-slate-200/60 rounded-[1.5rem] text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-500 transition-all"
                                            value={form.source}
                                            onChange={e => { setForm(p => ({ ...p, source: e.target.value })); setSourceELoc(null); setSourceCoords(null); }}
                                            onFocus={() => sourceSuggestions.length > 0 && setShowSourceDrop(true)}
                                            onBlur={() => setTimeout(() => setShowSourceDrop(false), 300)}
                                        />
                                        {searchingSource && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 animate-spin z-20" size={16} />}
                                        <AnimatePresence>{showSourceDrop && <SuggestionList suggestions={sourceSuggestions} onSelect={selectPlace} field="source" />}</AnimatePresence>
                                    </div>
                                </div>

                                <div className="space-y-2 relative z-10">
                                    <div className="flex justify-between items-center pr-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Destination</label>
                                        <button type="button" onClick={() => setMapSelectionMode('destination')} className={`text-[10px] font-bold ${mapSelectionMode === 'destination' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'} px-2 py-1 rounded-lg transition-colors`}>Select On Map</button>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-800 z-20"></div>
                                        <input
                                            type="text"
                                            placeholder="Type Unloading Place..."
                                            required
                                            className="w-full pl-11 pr-5 py-4 bg-slate-50 border border-slate-200/60 rounded-[1.5rem] text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-500 transition-all"
                                            value={form.destination}
                                            onChange={e => { setForm(p => ({ ...p, destination: e.target.value })); setDestELoc(null); setDestCoords(null); }}
                                            onFocus={() => destSuggestions.length > 0 && setShowDestDrop(true)}
                                            onBlur={() => setTimeout(() => setShowDestDrop(false), 300)}
                                        />
                                        {searchingDest && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 animate-spin z-20" size={16} />}
                                        <AnimatePresence>{showDestDrop && <SuggestionList suggestions={destSuggestions} onSelect={selectPlace} field="destination" />}</AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle & Fuel Integration */}
                            <div className="space-y-6 pt-4 border-t border-slate-100">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Classification</label>
                                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        {VEHICLE_TYPES.map(vt => (
                                            <button
                                                key={vt.value}
                                                type="button"
                                                onClick={() => setSelectedVehicleType(vt.value)}
                                                className={`px-3 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-2
                                                    ${selectedVehicleType === vt.value ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-200' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50 hover:border-slate-300'}`}
                                            >
                                                <vt.Icon size={14} /> {vt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-indigo-500">Real-time Diesel Rate (₹/L)</label>
                                    <div className="relative">
                                        <Fuel className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                        <input
                                            type="number" step="0.01" placeholder="Price / L"
                                            className="w-full pl-14 pr-12 py-4.5 bg-slate-50 border border-indigo-100 rounded-[1.5rem] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-600 transition-all"
                                            value={fuelPrice} onChange={e => setFuelPrice(e.target.value)} required
                                        />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-xs text-indigo-500 tracking-widest">₹ / L</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trip Cost Reveal Card */}
                            <AnimatePresence>
                                {tripCost && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl animate-pulse rounded-full"></div>
                                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center"><TrendingUp size={20} className="text-indigo-400" /></div>
                                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Est. Operation Budget</p>
                                            </div>
                                            <p className="text-3xl font-black text-white leading-none">₹{tripCost.totalEstimate.toLocaleString()}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                            <div>
                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Fuel Cost</p>
                                                <p className="text-sm font-black text-white/90">₹{tripCost.fuel.totalCost.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">No. of Tolls</p>
                                                <p className="text-sm font-black text-white/90">{tripCost.tolls.count}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Toll Fees</p>
                                                <p className="text-sm font-black text-white/90">₹{tripCost.tolls.totalCost.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Pilot Pay</p>
                                                <p className="text-sm font-black text-white/90">₹{tripCost.driver.totalCost.toLocaleString()}</p>
                                            </div>
                                            <div className="group relative">
                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Maintenance</p>
                                                <p className="text-sm font-black text-white/90 cursor-help">₹{tripCost.maintenance.totalCost.toLocaleString()}</p>

                                                {/* Tooltip on Hover */}
                                                <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] rounded px-3 py-2 -top-10 left-0 w-max shadow-xl border border-white/10 pointer-events-none z-50">
                                                    Calculated dynamically at <strong className="text-indigo-300">₹{tripCost.maintenance.ratePerKm} per km</strong>
                                                    <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-800 border-b border-r border-white/10 rotate-45"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Vehicle Type</p>
                                                <p className="text-sm font-black text-white/90">{tripCost.vehicleLabel}</p>
                                            </div>
                                        </div>

                                        {tripCost.tolls?.plazas?.length > 0 && (
                                            <div className="mt-8 pt-6 border-t border-white/10">
                                                <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Official Mappls Toll Data</p>
                                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                    {tripCost.tolls.plazas.map((toll, i) => (
                                                        <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                                                            <div className="flex items-start gap-3 min-w-0">
                                                                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                                                                    <Banknote size={12} className="text-indigo-400" />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-bold text-white/90 truncate">{toll.name}</p>
                                                                    <p className="text-[9px] font-semibold text-white/40 mt-0.5">{toll.distance} into trip</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs font-black text-indigo-300 ml-4 shrink-0">₹{toll.cost}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Approved Budget</label>
                                    <input type="number" placeholder="0.00" required
                                        className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200/60 rounded-[1.5rem] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500 shadow-sm"
                                        value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Execution Date</label>
                                    <input type="date" required
                                        className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200/60 rounded-[1.5rem] text-sm font-bold text-slate-700 outline-none hover:border-slate-300 transition-all"
                                        value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5.5 bg-slate-900 border border-white/10 text-white font-black text-sm uppercase tracking-[0.25em] rounded-[2rem] shadow-2xl shadow-indigo-500/20 hover:bg-black hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-4">
                                <ShieldCheck size={20} className="text-green-500" /> Deploy Trip Mission
                            </button>
                        </form>
                    </div>
                </div>

                {/* Fleet Monitor & Map */}
                <div className="xl:col-span-8 space-y-8 flex flex-col">
                    {/* Live Command Map */}
                    <div className="bg-white p-2 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-white relative overflow-hidden flex-shrink-0 group">
                        <div id="mappls-map-container" className="w-full h-[450px] rounded-[3rem] bg-slate-100 z-10" />
                    </div>

                    {/* Active Missions List */}
                    <div className="flex-1 space-y-6 pt-4">
                        <div className="flex items-center justify-between px-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Live Tracking Feed</h2>
                                <span className="px-2.5 py-1 bg-slate-200 text-slate-600 text-[10px] font-black rounded-lg">{trips.filter(t => t.status === 'In Transit').length} ACTIVE</span>
                            </div>
                            <button className="text-xs font-bold text-indigo-600 flex items-center gap-2 group hover:underline">
                                View Logistics Ledger <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-8">
                            <AnimatePresence>
                                {trips.slice(0, 4).map((trip, idx) => (
                                    <motion.div
                                        key={trip.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100/80 group hover:border-indigo-500/40 transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-1.5 h-full bg-slate-100 group-hover:bg-indigo-500 transition-colors"></div>

                                        <div className="flex justify-between items-start mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-colors">
                                                    <Truck size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{trip.Lorry?.vehicleNumber || 'No VH ID'}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TRIAL_LOGISTICS_B0{idx + 1}</p>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${trip.status === 'In Transit' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                                {trip.status}
                                            </div>
                                        </div>

                                        <div className="space-y-6 relative ml-3">
                                            <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-slate-100"></div>
                                            <div className="flex items-start gap-4 h-12">
                                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)] mt-1.5 -ml-[5px] z-10"></div>
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">Departure</p>
                                                    <p className="text-[13px] font-black text-slate-800 truncate leading-tight">{trip.source.split(',')[0]}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mt-1 -ml-[5px] z-10"></div>
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5">Arrival</p>
                                                    <p className="text-[13px] font-black text-slate-800 truncate leading-tight">{trip.destination.split(',')[0]}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white shadow-sm">{trip.Driver?.name?.[0] || 'D'}</div>
                                                <div>
                                                    <p className="text-[11px] font-black text-slate-700 leading-none">{trip.Driver?.name || 'Pilot Unknown'}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Certified Operator</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        setTrackingTripId(trackingTripId === trip.id ? null : trip.id);
                                                    }}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 ${trackingTripId === trip.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-500/20' : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 hover:shadow-md'}`}
                                                >
                                                    {trackingTripId === trip.id ? (
                                                        <><div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> Active Tracking</>
                                                    ) : (
                                                        <><MapPin size={12} /> Track Driver Live</>
                                                    )}
                                                </button>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Finance</p>
                                                    <p className="text-sm font-black text-indigo-600">₹{trip.budget?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {trips.length === 0 && !loading && (
                                <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6"><ClipboardList size={40} /></div>
                                    <h5 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">No Active Mission Data</h5>
                                    <p className="text-[11px] text-slate-300 mt-3">Initiate a new trip from the planner panel</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
