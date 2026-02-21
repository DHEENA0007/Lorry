const fetch = require('node-fetch');
const KEY = 'af3690882d893a94db76b0a6a1b02632';
(async () => {
    try {
        const url = 'https://apis.mappls.com/advancedmaps/v1/' + KEY + '/route_adv/driving/77.2090,28.6139;77.0697,28.4595?geometries=polyline&overview=full&steps=true&toll=true';
        const res = await fetch(url);
        const data = await res.json();
        console.log("Keys in routes:", Object.keys(data.routes[0]));
        console.log("Keys in legs:", Object.keys(data.routes[0].legs[0]));
        if (data.routes[0].legs[0].annotation) {
            console.log("Annotation:", Object.keys(data.routes[0].legs[0].annotation));
        } else {
            console.log("No Annotation.");
        }
    } catch (e) { console.error(e) }
})();
