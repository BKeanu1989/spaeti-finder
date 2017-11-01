const CACHE_NAME = "spaeti-finder-v1";
const CACHED_URLS = ["/intern/js/vue.js", "/intern/js/app.js", "index-offline.html", "index.html"];

self.addEventListener("install", function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(CACHED_URLS);
  }))
});

self.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.map(function(cacheName) {
      if (CACHE_NAME !== cacheName && cacheName.startsWith("sw-cache")) {
        return caches.delete(cacheName);
      }
    }));
  }))
});

self.addEventListener("fetch", function(event) {
  event.respondWith(fetch(event.request).catch(function() {
    return caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      } else if (event.request.headers.get("accept").includes("text/html")) {
        return caches.match("/index-offline.html");
      }
    })
  }))
})
