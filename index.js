importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);
const {
  cacheableResponse: { CacheableResponsePlugin },
  expiration: { ExpirationPlugin },
  routing: { registerRoute },
  strategies: { CacheFirst, StaleWhileRevalidate },
} = workbox;
workbox.routing.registerRoute(
  "./",
  workbox.strategies.networkFirst({
    networkTimeoutSeconds: 3,
    cacheName: "stories",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
        maxAgeSeconds: 1 * 60, // 1 minutes
      }),
    ],
  })
);
