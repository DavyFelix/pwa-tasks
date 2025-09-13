self.addEventListener('install', (event) => {
  console.log('SW: install');
  self.skipWaiting(); // força ativação imediata
});

self.addEventListener('activate', (event) => {
  console.log('SW: activate');
});
