const { response } = require("express");

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
        return fetch(e.request).then((res) => {
          return cache.put(e.request.url, res.clone()).then(() => {
            return response;
          });
        });
      })
    );
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request).then((res) => {
        if (res) {
          return res;
        } else if (e.request.headers.get("accept").includes("text/html")) {
          return caches.match("/");
        }
      });
    })
  );
});
