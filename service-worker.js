const CACHE_NAME = "gym-planner-cache-v2";
const ROOT = "/gym-app/"; 

const ASSETS = [
    ROOT,
    ROOT + "index.html",
    ROOT + "style.css",
    ROOT + "script.js",
    ROOT + "assets/img/iconx48.png",
    ROOT + "assets/img/iconx512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
        )
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request);
        })
    );
});