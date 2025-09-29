const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/App.js',
  '/Profile.js',
  '/style.css',
  '/logo.png',
];

// Instalação do SW e cache dos arquivos
self.addEventListener('install', (event) => {
  console.log('SW: install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Arquivos em cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // força ativação imediata
});

// Ativação do SW e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  console.log('SW: activate');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (!cacheWhitelist.includes(key)) {
          console.log('Deletando cache antigo:', key);
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim(); // assume o controle imediato das páginas
});

// Interceptação de requisições para usar cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Servindo do cache:', event.request.url);
          return response;
        }
        console.log('Buscando da rede:', event.request.url);
        return fetch(event.request)
          .catch(() => {
            // fallback se offline
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});
