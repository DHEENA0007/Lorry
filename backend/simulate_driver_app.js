const fs = require('fs');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Change LORRY_ID to the ID of the lorry assigned to your active trip
const LORRY_ID = 1;

console.log(`📡 Starting SIMULATED Driver App tracking for Lorry #${LORRY_ID}`);

// Starting coordinates (somewhere near Patna)
let lat = 25.5941;
let lng = 85.1376;

setInterval(async () => {
    // Simulate moving slightly over time
    lat += (Math.random() - 0.3) * 0.005;
    lng += (Math.random() - 0.3) * 0.005;

    const locationStr = `${lat.toFixed(5)},${lng.toFixed(5)}`;

    try {
        const res = await fetch(`http://localhost:5000/api/lorries/${LORRY_ID}/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: locationStr })
        });

        if (res.ok) {
            console.log(`✅ Push Success: ${locationStr}`);
        } else {
            console.error(`❌ Push Failed: Server returned ${res.status}`);
        }
    } catch (err) {
        console.error(`❌ Connection Error: Ensure backend is running!`);
    }
}, 3000); // 3-second rapid updates Matches the UI polling
