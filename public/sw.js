self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon } = event.data
    self.registration.showNotification(title || 'Fire near your area', {
      body: body || 'An urgent update was posted to your community.',
      icon: icon || '/icons/icon-192.jpg',
      badge: icon || '/icons/icon-192.jpg',
      vibrate: [200, 100, 200],
    })
  }
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  event.waitUntil(clients.matchAll({ type: 'window' }).then(windowClients => {
    for (let i = 0; i < windowClients.length; i++) {
      const client = windowClients[i]
      if ('focus' in client) return client.focus()
    }
    if (clients.openWindow) return clients.openWindow('/')
  }))
})
