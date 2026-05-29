// ============================================================
//  Zygal Engineer Starter Kit — Service Worker v3
//  Cache-First + Auto-update on version bump
// ============================================================

const CACHE_VERSION = 'zygal-v3';

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png',
];

// ── INSTALL ───────────────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => {
        console.log('[SW] Pre-caching shell');
        return cache.addAll(PRECACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: delete ALL old caches ──────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION)
          .map((k) => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: Cache-First, fall back to network ──────────────────
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (!e.request.url.startsWith('http')) return;

  const url = new URL(e.request.url);

  // Navigation: network-first so HTML is always fresh
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Everything else: cache-first, refresh cache in bg
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const networkFetch = fetch(e.request).then((res) => {
        if (res && res.status === 200 &&
            (res.type === 'basic' || res.type === 'cors')) {
          caches.open(CACHE_VERSION).then((c) => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => null);

      return cached || networkFetch;
    })
  );
});

// ── MESSAGE: force update ─────────────────────────────────────
self.addEventListener('message', (e) => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
