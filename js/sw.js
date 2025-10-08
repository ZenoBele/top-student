const CACHE_NAME = "topstudent-cache-v1";

// Files to cache for offline / PWA
const urlsToCache = [
  "/",                     // Root / homepage
  "/index.html",
  "/about.html",
  "/resources.html",
  "/service.html",
  "/contact.html",

  // CSS files
  "/css/index.css",
  "/css/about.css",
  "/css/resources.css",
  "/css/service.css",
  "/css/contact.css",

  // JS files needed for functionality
  "/js/security.js",

  // Images
  "/images/logo.png",
  "/images/favicon.png"
  // Add more static images if needed
];

// Install SW & cache static resources
self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn("❌ Failed to cache:", url, err);
        }
      }
    })()
  );
});

// Activate SW & clean old caches
self.addEventListener("activate", event => {
  const allowList = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (!allowList.includes(key)) {
          return caches.delete(key);
        }
      }))
    )
  );
});

// Fetch handler: serve cache first, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});