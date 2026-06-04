const CACHE_NAME = "digi-home-cache-v1";
const API_CACHE_NAME = "digi-home-api-cache-v1";
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== API_CACHE_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Helper to determine if a request is a GET API request
function isApiGetRequest(request) {
  const url = new URL(request.url);
  return request.method === "GET" && (
    url.pathname.includes("/api/") || 
    url.port === "8000" || 
    url.hostname === "localhost" && url.pathname.startsWith("/api")
  );
}

// Helper to determine if a request is a static asset
function isStaticAsset(request) {
  const url = new URL(request.url);
  // Avoid caching websocket, hot module reloading, or non-GET requests
  if (request.method !== "GET") return false;
  if (url.pathname.startsWith("/@") || url.pathname.includes("hot-update") || url.pathname.includes("/ws")) {
    return false;
  }
  return (
    request.mode === "navigate" ||
    request.destination === "document" ||
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font" ||
    STATIC_ASSETS.includes(url.pathname)
  );
}

// Fetch event handler
self.addEventListener("fetch", (e) => {
  const request = e.request;

  // Handle API GET requests with 5-minute caching
  if (isApiGetRequest(request)) {
    e.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
          const cachedAt = cachedResponse.headers.get("x-sw-cached-at");
          if (cachedAt) {
            const age = Date.now() - parseInt(cachedAt, 10);
            if (age < API_CACHE_DURATION) {
              console.log("[Service Worker] Serving cached API response (fresh):", request.url);
              return cachedResponse;
            }
            console.log("[Service Worker] Cached API response expired:", request.url);
          }
        }

        // Fetch from network and update cache
        try {
          const response = await fetch(request);
          if (response.status === 200) {
            const responseClone = response.clone();
            const headers = new Headers(responseClone.headers);
            headers.append("x-sw-cached-at", Date.now().toString());

            const blob = await responseClone.blob();
            const customResponse = new Response(blob, {
              status: responseClone.status,
              statusText: responseClone.statusText,
              headers: headers
            });

            await cache.put(request, customResponse);
          }
          return response;
        } catch (err) {
          // If offline and we have an expired cache, serve it as fallback
          if (cachedResponse) {
            console.log("[Service Worker] Offline fallback: serving expired API cache:", request.url);
            return cachedResponse;
          }
          throw err;
        }
      })
    );
    return;
  }

  // Handle Static Assets (Cache-First)
  if (isStaticAsset(request)) {
    e.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch in background to update cache (stale-while-revalidate)
          fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {/* Ignore network offline errors */});
          
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }
});
