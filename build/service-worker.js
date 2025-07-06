const CACHE_NAME = 'tasbeeh-v3'; // Updated version
const urlsToCache = [
  './', // All paths now relative
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
  // No [hash] - will be handled dynamically
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching core assets');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('[Service Worker] Cache failed:', err);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and external resources
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith(self.location.origin)) {
    return fetch(event.request);
  }

  // Dynamic cache handling for hashed files
  if (event.request.url.includes('/static/')) {
    event.respondWith(
      caches.match(event.request)
        .then((cached) => {
          return cached || fetch(event.request)
            .then((response) => {
              return caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, response.clone());
                  return response;
                });
            });
        })
    );
  } else {
    // Network-first for other resources
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
  }
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});