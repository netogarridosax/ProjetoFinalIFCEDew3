self.addEventListener('install', function (event) {
    console.log('install2', event);
});
self.addEventListener('activate', function (event) {
    console.log('activate2', event);
    self.registration.showNotification("ativando!!", { body: 'haha' })
});
self.addEventListener('fetch', function (event) {
    console.log('fetch2', event);
});
self.addEventListener('message', function (event) {
    console.log('message2', event);

    event.ports[0].postMessage({ 'test': 'This is my response.' });
});
self.addEventListener('push', function (event) {
    console.log('push2', event.data);
    self.registration.showNotification("push message!!", { body: 'hihi' + event.data })
});
self.addEventListener('sync', function (event) {
    console.log('sync2', event);
});
self.addEventListener('notificationclick', function (event) {
    console.log('notificationclick2', event);
});