# Notification System Debugging Guide

## Changes Made

### 1. Fixed Missing Icons
- Created `/public/icons/` directory
- Added `icon-192.png` and `icon-512.png` (copied from placeholder.jpg)

### 2. Improved Community Page (`components/community-page.tsx`)
- Enhanced `triggerNotification()` function with:
  - Proper check for `navigator.serviceWorker.controller` existence
  - Fallback to direct `Notification` API if service worker unavailable
  - Better error handling
  
- Enhanced service worker registration in `useEffect`:
  - Added console logging to track registration status
  - Wait for `navigator.serviceWorker.ready` to ensure service worker is active
  - Added permission request logging
  - Better error catching with console.error

### 3. Improved Service Worker (`public/sw.js`)
- Added install event listener with `self.skipWaiting()`
- Added activate event listener with `clients.claim()`
- Added comprehensive console logging in message handler
- Improved notification display with additional options
- Enhanced click handler with better window matching

### 4. Updated Next.js Config (`next.config.mjs`)
- Added headers configuration for `/sw.js` to:
  - Prevent caching (max-age=0, must-revalidate)
  - Add Service-Worker-Allowed header for scope control

## How to Test

### Browser DevTools Approach
1. Open http://localhost:3000
2. Open DevTools (F12)
3. Go to Application tab → Service Workers
4. Check if "sw.js" is registered and has status "activated"
5. Check Console for logs like:
   - "Service Worker registered: [scope]"
   - "Service Worker is ready"
   - "Notification permission: granted"

### Test the Notification
1. Click "Test Push" button on Community Feed
   - An alert will display the current notification permission state.
   - If permission was not yet granted you'll be prompted to allow notifications.
2. After allowing, you should see a browser notification appear
3. In DevTools Console, you should see:
   - "Service Worker received message: {type: 'SHOW_NOTIFICATION', ...}"
   - "Showing notification: Fire near your area ..."

### Test the Update Trigger
1. Type "update" in the post composer
2. Click Send or press Enter
3. Wait 1-2 seconds (notification should appear after 1 second delay, note: comment says 10s but code has 1s)
4. A notification should appear with message "An urgent update was posted to your community."

## Common Issues & Solutions

### Issue: Service Worker won't register
**Solution**: 
- Check if `/sw.js` file exists in `/public/`
- Check DevTools → Network tab, look for `/sw.js` request
- Check DevTools → Console for registration errors

### Issue: Controller is null
**Solution**:
- Service Worker might not be activated yet
- Try hard refresh (Ctrl+Shift+R) to bypass cache
- Check DevTools → Application → Service Workers for status

### Issue: Notification doesn't appear
**Solution**:
- Check if notification permission is "granted"
  - Settings → Website Permissions → Notifications
- Some browsers suppress notifications if dev tools are open
- Check if notification.json has correct icon paths

## Files Modified

1. `components/community-page.tsx` - Service worker registration and triggerNotification
2. `public/sw.js` - Service worker logic
3. `next.config.mjs` - Header configuration
4. `public/s/*` - Added missing icon files
