/* ═══════════════════════════════════════════════════════════════════
   NexGen Admin Control Room — Service Worker
   Offline caching of admin shell + background sync
   ═══════════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'nextgen-admin-v2';
const SHELL_URLS = [
    '/admin',
    '/admin/admin.css',
    '/admin/admin.js',
    '/portal/emblem.jpg',
];

// Install: Cache the admin shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(SHELL_URLS);
        })
    );
    self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            );
        })
    );
    self.clients.claim();
});

// Fetch: Network-first for API, cache-first for shell
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // API calls: always network
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Shell assets: cache-first
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                // Cache new shell assets
                if (response.ok && SHELL_URLS.some(u => url.pathname === u)) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                }
                return response;
            });
        })
    );
});
