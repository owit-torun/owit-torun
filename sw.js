// Service Worker – OWiT Toruń
const CACHE_NAME = 'owit-v2';

self.addEventListener('install', e => {
    // Nie blokuj instalacji cachem – nawet jeśli zasoby są niedostępne
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(['/katalog.html', '/index.html'])
                .catch(() => { /* ignoruj błędy cache przy instalacji */ }))
            .finally(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);
    // Nie przechwytuj zewnętrznych CDN (Firebase, Tailwind, Lucide, Google Fonts)
    if (url.origin !== self.location.origin) return;

    e.respondWith(
        fetch(e.request)
            .then(res => {
                if (res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                }
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
