const APP_PREFIX = 'my-site-cache-';
const VERSION = 'v1';
const CACHE_NAME = APP_PREFIX + VERSION;
const DATA_CACHE_NAME = `data-cache-${VERSION}`;

const FILES_TO_CACHE = [
  "/",
  "./index.html",
  "./css/styles.css",
  "./js/idb.js",
  "./js/index.js",
  "./manifest.json",
  "./icons/icon-72x72.png",
  "./icons/icon-96x96.png",
  "./icons/icon-128x128.png",
  "./icons/icon-144x144.png",
  "./icons/icon-152x152.png",
  "./icons/icon-192x192.png",
  "./icons/icon-384x384.png",
  "./icons/icon-512x512.png"
];

// Cache resources
self.addEventListener("install", (e) => {
  // Perform install steps
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(`installing cache : ${CACHE_NAME}`)
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Respond with cached resources
self.addEventListener("fetch", (e) => {
  // cache all get requests to /api routes
  if (e.request.url.includes("/api/")) {
    e.respondWith(
      caches.open(DATA_CACHE_NAME).then(async cache => {
        try {
          const response = await fetch(e.request);
          // If the response was good, clone it and store it in the cache.
          if (response.status === 200) {
            cache.put(e.request.url, response.clone());
          }
          return response;
        } catch (err) {
          return
        }
      }).catch(err => console.log(err))
    );

    return;
  }

  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request).then((response) => {
      if (response) {
        return response;
      } else if (e.request.headers.get("accept").includes("text/html")) {
        // return the cached home page for all requests for html pages
        return caches.match("/");
      }
    }))
  );
});

// Delete outdated caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      const cacheKeepList = keyList.filter((key) => key.indexOf(APP_PREFIX))
      // add current cache name to white list
      cacheKeepList.push(CACHE_NAME);

      return Promise.all(keyList.map((key, i) => {
        if (cacheKeepList.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});
