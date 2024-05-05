self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('cache-v1').then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/_js/Autor.js',
        '/_js/CrudeServicos.js',
        '/_js/Detalhes.js',
        '/_js/LisServicos.js',
        '/_js/ServicoStore.js',
        '/manifest.json',
        '/worker.js',
        '/views/admins.ejs',
        '/views/cabecalho.ejs',
        '/views/servicos.ejs',
        '/views/criar_admin.ejs',
        '/views/editar.ejs',
        '/views/index.ejs',
        '/views/login.ejs',
        '/views/push.ejs',
        '/views/sobre.ejs'
      ]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request).catch(function () {
        // Lidar com erros de cache ou falhas de rede aqui
        console.error('Falha ao buscar recurso:', event.request.url);
      });
    })
  );
});
