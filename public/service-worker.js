const CACHE = "site-cache-v1";
const DATA_CACHE = "data-cache-v1";
const URL_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/db.js",
  "/style.css",
  "/manifest.webmanifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(URL_CACHE)));
});

self.addEventListener("fetch", (e) => {
  if (e.request.url.includes("/api/")) {
    e.respondWith(
      caches.open(DATA_CACHE).then((cache) => {
        return fetch(e.request).then((response) => {
          return cache.put(e.request.url, response.clone()).then(() => {
            return response;
        });
      })
    );
  }
});
