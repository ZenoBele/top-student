const CACHE_NAME = "topstudent-cache-v1";

const urlsToCache = [
  "/", "/index.html", "/about.html", "/resources.html", "/service.html", "/contact.html",
  "/papers.html", "/challenge.html", "/reminder.html", "/community.html",
  "/read.html", "/rewards.html",

  // CSS
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

 // Offline fallback
  "/offline.html"
];

// Install service worker & cache files
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

// Activate SW & remove old caches
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

// Fetch: cache first, fallback to network, then offline.html
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});