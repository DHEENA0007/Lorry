const fetch = require('node-fetch');
const MAPPLS_CLIENT_ID = '96dHZVzsAuusq6iBFHwJcWtRa9AXCCnxao5NE7_ObYkJIS5lYGmBBP1dWu_CFCgFybSBCZNZ9N4RLUvZ_JvF5Q==';
const MAPPLS_CLIENT_SECRET = 'lrFxI-iSEg_gNEyeG4_dxjHUX6_PpS0Pq2PcYUNdAAXUnYzCqLcf75AbZI6ZGGDX6rBhFTcf0S3VzhKSAK2qcEve3cC9wLle';
const KEY = 'af3690882d893a94db76b0a6a1b02632';

async function getToken() {
    const res = await fetch('https://outpost.mappls.com/api/security/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: 'client_credentials', client_id: MAPPLS_CLIENT_ID, client_secret: MAPPLS_CLIENT_SECRET }),
    });
    return (await res.json()).access_token;
}

(async () => {
    try {
        const url = 'https://apis.mappls.com/advancedmaps/v1/' + KEY + '/route_adv/driving/77.2090,28.6139;77.0697,28.4595';
        let data = await (await fetch(url)).json();
        const polyline = data.routes[0].geometry;

        const token = await getToken();
        // The Mappls POI API requires `category` which is probably 'TOLL' or similar
        const poiUrl = `https://atlas.mappls.com/api/places/along_route?path=${encodeURIComponent(polyline)}&category=TOLL&buffer=200`;
        const poiRes = await fetch(poiUrl, { headers: { 'Authorization': `bearer ${token}` } });
        console.log("Along the route response:");
        console.log(await poiRes.text());
    } catch (e) { console.error(e) }
})();
