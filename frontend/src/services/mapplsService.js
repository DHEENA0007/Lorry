const API_URL = 'http://localhost:5000/api/mappls';

// Search places — returns eLoc + placeName (no lat/lng)
export const searchPlaces = async (query) => {
    if (!query || query.length < 2) return [];
    try {
        const res = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data.suggestedLocations || [];
    } catch (err) {
        console.error('Search failed:', err);
        return [];
    }
};

// Reverse geocode (lat/lng → address + eLoc)
export const reverseGeocode = async (lat, lng) => {
    try {
        const res = await fetch(`${API_URL}/reverse-geocode?lat=${lat}&lng=${lng}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            const r = data.results[0];
            return {
                address: r.formatted_address || r.area || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                eLoc: r.eLoc || null,
            };
        }
        return { address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, eLoc: null };
    } catch (err) {
        console.error('RevGeo failed:', err);
        return { address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, eLoc: null };
    }
};

// Route using eLoc (source & dest are eLoc strings)
// Falls back to lat/lng if eLoc not available
export const getRouteWithCost = async ({ sourceELoc, destELoc, startLat, startLng, endLat, endLng, vehicleType = '2AxlesTruck', fuelPrice = 0 }) => {
    try {
        let url;
        const fpParam = fuelPrice > 0 ? `&fuelPrice=${fuelPrice}` : '';
        if (sourceELoc && destELoc) {
            url = `${API_URL}/route?sourceELoc=${sourceELoc}&destELoc=${destELoc}&vehicleType=${vehicleType}${fpParam}`;
        } else if (startLat && startLng && endLat && endLng) {
            url = `${API_URL}/route?startLat=${startLat}&startLng=${startLng}&endLat=${endLat}&endLng=${endLng}&vehicleType=${vehicleType}${fpParam}`;
        } else {
            return null;
        }
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error('Route failed:', err);
        return null;
    }
};

// Decode encoded polyline
export function decodePolyline(encoded) {
    const points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
        let shift = 0, result = 0, byte;
        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);
        lat += result & 1 ? ~(result >> 1) : result >> 1;

        shift = 0; result = 0;
        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);
        lng += result & 1 ? ~(result >> 1) : result >> 1;

        points.push([lat / 1e6, lng / 1e6]);
    }
    return points;
}
