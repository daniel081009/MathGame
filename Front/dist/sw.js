importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js"
);

workbox.routing.registerRoute(
  new RegExp(".*"),
  workbox.strategies.networkFirst({
    cacheName: "all",
  })
);

self.addEventListener("fetch", function (event) {
  event.respondWith(fetch(event.request));
});
