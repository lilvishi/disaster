import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import webpush from 'web-push'

const SUB_FILE = path.resolve(process.cwd(), 'subscriptions.json')

// VAPID keys must be generated and placed into environment variables
const VAPID_PUBLIC = process.env.VAPID_PUBLIC || ''
const VAPID_PRIVATE = process.env.VAPID_PRIVATE || ''

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails('mailto:example@example.com', VAPID_PUBLIC, VAPID_PRIVATE)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const payload = req.body || { title: 'Fire near your area', body: 'An urgent update was posted to your community.' }

  let subs: any[] = []
  try {
    if (fs.existsSync(SUB_FILE)) subs = JSON.parse(fs.readFileSync(SUB_FILE, 'utf8') || '[]')
  } catch (e) {
    subs = []
  }

  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    return res.status(500).json({ error: 'VAPID keys not configured' })
  }

  const results = []
  for (const s of subs) {
    try {
      await webpush.sendNotification(s, JSON.stringify(payload))
      results.push({ endpoint: s.endpoint, ok: true })
    } catch (e) {
      results.push({ endpoint: s.endpoint, ok: false, error: String(e) })
    }
  }

  return res.status(200).json({ results })
}
