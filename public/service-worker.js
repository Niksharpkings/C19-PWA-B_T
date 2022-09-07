const APP_PREFIX = 'my-site-cache';
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
self.addEventListener("install", function(e) {
    e.waitUntil(
      caches
        .open(CACHE_NAME)
        .then((cache) => {
          console.log(`📲installing cache : ${CACHE_NAME}`);
          return cache
            .addAll(FILES_TO_CACHE);
        })
    );
    self
      .skipWaiting();
  });
self
  .addEventListener("fetch", function (e) {
      if (e.request.url.includes("/api/")) {
        e
          .respondWith(
            caches
              .open(DATA_CACHE_NAME)
              .then(async function(cache) {
                try {
                  const response = await fetch(e.request);
                  if (200 === response.status) {
                    cache.put(
                      e.request.url,
                      response.clone()
                    );
                  }
                  return response;
                } catch (err) {
                  return;
                }
              }).catch(err => console.log(err))
          );
        return;
      }
      e.respondWith(
        fetch(e.request)
          .catch(async function() {
            const res = await caches
              .match(e.request);
            if (res) {
              return res;
            }
            if (e.request.headers
              .get("accept")
              .includes("text/html")) {
              return caches.match("/");
            }
          })
      );
    });

self.addEventListener('activate', function(e) {
    e.waitUntil(
      caches
        .keys()
        .then(function(keyList) {
          const cacheKeepList = keyList.filter((key) => key.indexOf(APP_PREFIX));
          cacheKeepList.push(CACHE_NAME);
          return Promise.all(keyList.map(function(key, i) {
            if (!cacheKeepList.includes(key)) {
              console.log(`deleting cache : ${keyList[i]}`);
              return caches.delete(keyList[i]);
            }
          }));
        })
    );
  });
