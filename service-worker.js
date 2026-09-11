const CACHE = 'lumen-v46-images-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './images/annunciation.svg',
  './images/assumption.svg',
  './images/bible.svg',
  './images/church.svg',
  './images/family.svg',
  './images/gospel.svg',
  './images/intentions.svg',
  './images/journal.svg',
  './images/journey.svg',
  './images/mercy.svg',
  './images/music.svg',
  './images/nativity.svg',
  './images/novena-anthony.svg',
  './images/novena-holy-spirit.svg',
  './images/novena-joseph-family.svg',
  './images/novena-joseph.svg',
  './images/novena-mary-trust.svg',
  './images/novena-mary.svg',
  './images/novena-michael.svg',
  './images/novena-rita.svg',
  './images/novena-sacred-heart.svg',
  './images/novena-star.svg',
  './images/novena-therese.svg',
  './images/oratory.svg',
  './images/prayer.svg',
  './images/profile.svg',
  './images/psalms.svg',
  './images/rosary.svg',
  './images/saints.svg',
  './images/search.svg',
  './images/themes.svg',
  './images/wisdom.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;

        if (event.request.mode === 'navigate') {
          return (await caches.match('./index.html')) || caches.match('./');
        }
        return Response.error();
      })
  );
});
