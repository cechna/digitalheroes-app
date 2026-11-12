/**
 * Service Worker per Digital Heroes PWA
 * Sicurezza: Non memorizza indiscriminatamente contenuti riservati o risposte API nella cache offline.
 */

const CACHE_NAME = 'dh-pwa-v1';
const STATIC_ASSETS = ['/favicon.ico', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Mai memorizzare in cache le chiamate API o i download di file riservati
  if (url.pathname.startsWith('/api/') || url.pathname.includes('/download')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network-first con fallback per asset statici di shell
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
