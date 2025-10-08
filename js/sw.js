const CACHE_NAME = "topstudent-cache-v1";

// All pages, CSS, JS, images, and offline fallback
const urlsToCache = [
  // Main pages
  "/", "/index.html", "/about.html", "/resource.html", "/service.html", "/contact.html",
  "/login.html", "/press.html", "/404.html", "/offline.html",

  // Functional pages
  "/papers.html", "/guides.html", "/reminder.html", "/community.html", "/read.html",
  "/rewards.html", "/challenge.html", "/capability.html", "/scope.html", "/nsfas.html",
  "/university.html", "/options.html",

  // CSS
  "/css/index.css", "/css/about.css", "/css/resources.css",
  "/css/service.css", "/css/contact.css",

  // JS
  "/js/security.js", "/js/roles.js", "/js/plans.js", "/js/sw.js",

  // Images
  "/images/logo.png", "/images/favicon.png",

  // Add more static images if needed
];

// Install Service Worker & cache files
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
        if (!allowList.includes(key)) return caches.delete(key);
      }))
    )
  );
});

// Fetch: cache-first, fallback to network, then offline.html
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('../offline.html'))
  );
});
