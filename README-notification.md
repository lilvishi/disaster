Setup web-push (server-side) for real push notifications

1. Install dependency:

```bash
npm install
```

2. Generate VAPID keys (one-time):

```bash
npx web-push generate-vapid-keys --json
```

Copy the output publicKey and privateKey into environment variables:

- `VAPID_PUBLIC`
- `VAPID_PRIVATE`

You can add them to a `.env.local` file at project root:

```
VAPID_PUBLIC=BN...yourpublic...
VAPID_PRIVATE=...yourprivate...
```

3. Start the dev server:

```bash
npm run dev
```

4. In the app, allow notifications when prompted. The client will POST the subscription to `/api/subscribe`.

5. When a post with content exactly `update` is created, the client will call `/api/send-push` after a 10 second delay to broadcast the notification to saved subscriptions.

Notes:
- Real "phone off" notifications require the browser's push service and that the device's OS allows background push. Service worker + push plus proper VAPID keys + subscription and server send are required.
- If you want I can also implement a small CLI script to send a test push from your environment.
