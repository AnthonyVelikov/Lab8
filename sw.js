// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter';



// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  vent.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // Combine your shell files and recipe URLs into one array
        return cache.addAll(SHELL_FILES.concat(RECIPE_URLS));
      })
      .then(function() {
        // Activate this worker immediately once installed
        return self.skipWaiting();
      })
  );
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // We added some known URLs to the cache above, but tracking down every
  // subsequent network request URL and adding it manually would be very taxing.
  // We will be adding all of the resources not specified in the intiial cache
  // list to the cache as they come in.
  /*******************************/
  // This article from Google will help with this portion. Before asking ANY
  // questions about this section, read this article.
  // NOTE: In the article's code REPLACE fetch(event.request.url) with
  //       fetch(event.request)
  // https://developer.chrome.com/docs/workbox/caching-strategies-overview/
  /*******************************/
  // B7. TODO - Respond to the event by opening the cache using the name we gave
  //            above (CACHE_NAME)
  // B8. TODO - If the request is in the cache, return with the cached version.
  //            Otherwise fetch the resource, add it to the cache, and return
  //            network response.
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        if (response) {
          // B8.1 - If the response is in the cache, return it
          return response;
        }
        // B8.2 - Otherwise, fetch the resource from the network
        return fetch(event.request).then(function (networkResponse) {
          // B8.3 - Add the network response to the cache
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );


});