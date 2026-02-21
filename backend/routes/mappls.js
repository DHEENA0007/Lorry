const express = require('express');
const router = express.Router();

const MAPPLS_API_KEY = process.env.MAPPLS_API_KEY || 'af3690882d893a94db76b0a6a1b02632';
const MAPPLS_CLIENT_ID = process.env.MAPPLS_CLIENT_ID || '96dHZVzsAuusq6iBFHwJcWtRa9AXCCnxao5NE7_ObYkJIS5lYGmBBP1dWu_CFCgFybSBCZNZ9N4RLUvZ_JvF5Q==';
const MAPPLS_CLIENT_SECRET = process.env.MAPPLS_CLIENT_SECRET || 'lrFxI-iSEg_gNEyeG4_dxjHUX6_PpS0Pq2PcYUNdAAXUnYzCqLcf75AbZI6ZGGDX6rBhFTcf0S3VzhKSAK2qcEve3cC9wLle';

let cachedToken = null;
let tokenExpiry = 0;

// Get Mappls OAuth2 token
async function getToken() {
    if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
    try {
        const res = await fetch('https://outpost.mappls.com/api/security/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: MAPPLS_CLIENT_ID,
                client_secret: MAPPLS_CLIENT_SECRET,
            }),
        });
        const data = await res.json();
        cachedToken = data.access_token;
        tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
        return cachedToken;
    } catch (err) {
        console.error('Token error:', err.message);
        return null;
    }
}

// ─── 1. Place Search (returns eLoc + placeName) ────────────
router.get('/search', async (req, res) => {
    const { query } = req.query;
    if (!query || query.length < 2) return res.json({ suggestedLocations: [] });

    try {
        const token = await getToken();
        const response = await fetch(
            `https://atlas.mappls.com/api/places/search/json?query=${encodeURIComponent(query)}&region=IND&tokenizeAddress=true`,
            { headers: { 'Authorization': `bearer ${token}` } }
        );
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Search error:', err.message);
        res.status(500).json({ error: 'Search failed' });
    }
});

// ─── 2. Reverse Geocode (lat/lng to address) ──────────────
router.get('/reverse-geocode', async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });

    try {
        const response = await fetch(
            `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_API_KEY}/rev_geocode?lat=${lat}&lng=${lng}`
        );
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('RevGeo error:', err.message);
        res.status(500).json({ error: 'Reverse geocode failed' });
    }
});

// ─── 3. Route using eLoc (source_eLoc;dest_eLoc) ──────────
// The Mappls route_adv API accepts eLoc directly!
// e.g., /route?sourceELoc=2KK6DX&destELoc=2UQY8X&vehicleType=2AxlesTruck
router.get('/route', async (req, res) => {
    const { sourceELoc, destELoc, startLat, startLng, endLat, endLng, vehicleType, fuelPrice } = req.query;

    // Build coordinates string: either from eLoc or lat/lng
    let coordsString;
    if (sourceELoc && destELoc) {
        coordsString = `${sourceELoc};${destELoc}`;
    } else if (startLat && startLng && endLat && endLng) {
        coordsString = `${startLng},${startLat};${endLng},${endLat}`;
    } else {
        return res.status(400).json({ error: 'Provide sourceELoc+destELoc OR startLat+startLng+endLat+endLng' });
    }

    const profile = 'trucking'; // trucking for lorry app

    try {
        const routeUrl = `https://apis.mappls.com/advancedmaps/v1/${MAPPLS_API_KEY}/route_adv/${profile}/${coordsString}?geometries=polyline&overview=full&steps=true&alternatives=false&exclude=ferry`;

        const response = await fetch(routeUrl);
        const data = await response.json();

        if (!data.routes || data.routes.length === 0) {
            return res.status(404).json({ error: data.msg || 'No route found' });
        }

        const route = data.routes[0];
        const distKm = route.distance / 1000;
        const durationHrs = route.duration / 3600;

        // Extract start/end coordinates from route steps
        const steps = route.legs?.[0]?.steps || [];
        let startCoords = null;
        let endCoords = null;

        if (steps.length > 0) {
            const firstStep = steps[0];
            const lastStep = steps[steps.length - 1];
            if (firstStep.maneuver?.location) {
                startCoords = { lat: firstStep.maneuver.location[1], lng: firstStep.maneuver.location[0] };
            }
            if (lastStep.maneuver?.location) {
                endCoords = { lat: lastStep.maneuver.location[1], lng: lastStep.maneuver.location[0] };
            }
        }

        // Vehicle type profiles (mileage in km/l, axles count)
        const vehicleProfiles = {
            // LCV
            'TataAce': { mileage: 12, axles: 2, label: 'Tata Ace' },
            'Pickup': { mileage: 10, axles: 2, label: 'Pickup' },
            'MiniTruck': { mileage: 9, axles: 2, label: 'Mini Truck' },
            'LCV': { mileage: 8, axles: 2, label: 'LCV' },
            // MCV
            'ICV': { mileage: 6, axles: 2, label: 'ICV (Intermediate)' },
            'MCV': { mileage: 5.5, axles: 2, label: 'MCV (Medium)' },
            // HCV
            '2AxlesTruck': { mileage: 4, axles: 2, label: '2-Axle Truck' },
            '3AxlesTruck': { mileage: 3.5, axles: 3, label: '3-Axle Truck' },
            'MultiAxlesTruck': { mileage: 3, axles: 4, label: 'Multi-Axle Truck' },
            'HCV': { mileage: 3.5, axles: 3, label: 'HCV' },
            // Tipper & Construction
            'Tipper': { mileage: 3.5, axles: 3, label: 'Tipper / Dumper' },
            'Bulker': { mileage: 3, axles: 3, label: 'Bulker (Cement)' },
            'EarthMover': { mileage: 2.5, axles: 4, label: 'Earth Mover' },
            // Trailers
            'Trailer20ft': { mileage: 4, axles: 3, label: 'Trailer (20ft)' },
            'Trailer40ft': { mileage: 3, axles: 4, label: 'Trailer (40ft)' },
            'FlatbedTrailer': { mileage: 3.5, axles: 3, label: 'Flatbed Trailer' },
            'LowBedTrailer': { mileage: 2.5, axles: 4, label: 'Low Bed Trailer' },
            'SemiTrailer': { mileage: 3, axles: 3, label: 'Semi Trailer' },
            'FTL': { mileage: 3.5, axles: 3, label: 'Full Truck Load' },
            // Specialized
            'Tanker': { mileage: 3, axles: 3, label: 'Tanker' },
            'Reefer': { mileage: 3, axles: 3, label: 'Reefer (Refrigerated)' },
            'ContainerTruck': { mileage: 3, axles: 3, label: 'Container Truck' },
            'CarCarrier': { mileage: 3, axles: 4, label: 'Car Carrier' },
            'OpenBody': { mileage: 4, axles: 2, label: 'Open Body Truck' },
            'ClosedBody': { mileage: 4, axles: 2, label: 'Closed Body' },
        };

        const vType = vehicleType || '2AxlesTruck';
        const vProfile = vehicleProfiles[vType] || vehicleProfiles['2AxlesTruck'];
        const dieselPrice = parseFloat(fuelPrice) || 0;

        // Fuel cost (using user-provided diesel price)
        const fuelLitres = Math.round((distKm / vProfile.mileage) * 10) / 10;
        const fuelCost = dieselPrice > 0 ? Math.round(fuelLitres * dieselPrice) : 0;

        const avgTollPerPlaza = { 2: 105, 3: 170, 4: 265 };
        const perPlazaCost = avgTollPerPlaza[vProfile.axles] || 105;

        // Fetch official Mappls Tolls using 'Along the Route' POI API
        let tollPlazas = [];
        let estimatedTollCount = 0;
        let totalTollCost = 0;

        try {
            const token = await getToken();
            const polylineEnc = encodeURIComponent(route.geometry);
            const poiUrl = `https://atlas.mappls.com/api/places/along_route?path=${polylineEnc}&category=TOLL&buffer=200`;

            const poiRes = await fetch(poiUrl, { headers: { 'Authorization': `bearer ${token}` } });
            const poiData = await poiRes.json();

            if (poiData && poiData.suggestedPOIs) {
                // Filter specifically for Toll Plazas to avoid generic POIs
                const rawTolls = poiData.suggestedPOIs.filter(p => p.category === 'TOLBRD' || (p.poi && p.poi.toLowerCase().includes('toll')));

                // Mappls API can sometimes return the same toll twice (directions vs booths), filter unique by near distance
                const uniqueTolls = [];
                rawTolls.forEach(t => {
                    const isDup = uniqueTolls.some(ut => Math.abs(ut.distance - t.distance) < 500);
                    if (!isDup) uniqueTolls.push({ ...t });
                });

                tollPlazas = uniqueTolls.map(t => ({
                    name: t.poi || t.poplrName || 'Toll Plaza',
                    address: t.address || '',
                    distance: `${(t.distance / 1000).toFixed(1)} km`,
                    cost: perPlazaCost,
                    location: t.latitude && t.longitude ? { lat: t.latitude, lng: t.longitude } : null
                }));

                estimatedTollCount = tollPlazas.length;
                totalTollCost = estimatedTollCount * perPlazaCost;
            }
        } catch (e) {
            console.error("Failed to fetch Mappls tolls:", e.message);
            // Fallback gracefully 
            estimatedTollCount = Math.max(0, Math.floor(distKm / 60));
            totalTollCost = estimatedTollCount * perPlazaCost;
        }

        // Driver costs
        const driverDailyAllowance = Math.ceil(durationHrs / 10) * 500;
        const driverDrivingPay = Math.round(durationHrs * 50);
        const driverTotal = driverDailyAllowance + driverDrivingPay;

        // Maintenance ₹2/km
        const maintenanceCost = Math.round(distKm * 2);
        const totalCost = fuelCost + totalTollCost + driverTotal + maintenanceCost;

        res.json({
            route: {
                distance: route.distance,
                duration: route.duration,
                geometry: route.geometry,
                distanceText: distKm >= 1 ? `${distKm.toFixed(1)} km` : `${route.distance} m`,
                durationText: durationHrs >= 1
                    ? `${Math.floor(durationHrs)}h ${Math.round((durationHrs % 1) * 60)} m`
                    : `${Math.round(route.duration / 60)} min`,
                startCoords,
                endCoords,
            },
            tripCost: {
                vehicleType: vType,
                vehicleLabel: vProfile.label,
                axles: vProfile.axles,
                fuel: {
                    litres: fuelLitres,
                    pricePerLitre: dieselPrice,
                    totalCost: fuelCost,
                    mileage: `${vProfile.mileage} km / l`,
                },
                tolls: {
                    count: estimatedTollCount,
                    costPerPlaza: perPlazaCost,
                    totalCost: totalTollCost,
                    plazas: tollPlazas,
                },
                driver: {
                    dailyAllowance: driverDailyAllowance,
                    drivingPay: driverDrivingPay,
                    totalCost: driverTotal,
                },
                maintenance: { ratePerKm: 2, totalCost: maintenanceCost },
                totalEstimate: totalCost,
            },
        });
    } catch (err) {
        console.error('Route error:', err.message);
        res.status(500).json({ error: 'Route calculation failed' });
    }
});

module.exports = router;
