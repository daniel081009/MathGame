importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js"
);

const {
  cacheableResponse,
  core,
  expiration,
  googleAnalytics,
  routing,
  strategies,
} = workbox;
const { CacheableResponsePlugin } = cacheableResponse;
const { ExpirationPlugin } = expiration;
const { registerRoute } = routing;
const { CacheFirst, StaleWhileRevalidate } = strategies;

core.clientsClaim();
core.skipWaiting();

// Cache JavaScript and CSS
registerRoute(/\.(?:js|css)$/, new StaleWhileRevalidate());

// Cache Images
registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60, // 7 Days
      }),
    ],
  })
);
