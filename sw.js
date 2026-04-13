// Service Worker – OWiT Toruń
// Minimalny SW wymagany do instalacji PWA na Androidzie (Chrome)

const CACHE_NAME = 'owit-v1';
const SHELL = [
  '/',
  '/katalog.html',
  '/index.html',
  '/images/ui/logo owit.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Tylko GET, pomijaj Firebase i zewnętrzne CDN
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.hostname !== location.hostname) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
