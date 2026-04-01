const CACHE_NAME = "gym-planner-cache-v1";
const ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./assets/img/iconx48.png",
    "./assets/img/iconx512.png"
];

// Installazione: cache dei file
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

// Attivazione: pulizia cache vecchie
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            )
        )
    );
});

// Fetch: rispondi dalla cache se offline
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});