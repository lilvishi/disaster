console.log('Service Worker loaded')

self.addEventListener('install', function(event) {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...')
  event.waitUntil(clients.claim())
})

self.addEventListener('message', function(event) {
  console.log('Service Worker received message:', event.data)
  
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon } = event.data
    console.log('Showing notification:', title, body)
    
    self.registration.showNotification(title || 'Fire near your area', {
      body: body || 'An urgent update was posted to your community.',
      icon: icon || '/icons/SafeSeek192.png',
      badge: icon || '/icons/SafeSeek192.png',
      vibrate: [200, 100, 200],
      tag: 'notification',
      requireInteraction: false,
    })
  }
})

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked')
  event.notification.close()
  event.waitUntil(clients.matchAll({ type: 'window' }).then(windowClients => {
    for (let i = 0; i < windowClients.length; i++) {
      const client = windowClients[i]
      if (client.url === '/' && 'focus' in client) {
        return client.focus()
      }
    }
    if (clients.openWindow) {
      return clients.openWindow('/')
    }
  }))
})

