import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const SUB_FILE = path.resolve(process.cwd(), 'subscriptions.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const sub = req.body
  if (!sub || !sub.endpoint) return res.status(400).json({ error: 'invalid subscription' })

  let subs: any[] = []
  try {
    if (fs.existsSync(SUB_FILE)) {
      subs = JSON.parse(fs.readFileSync(SUB_FILE, 'utf8') || '[]')
    }
  } catch (e) {
    subs = []
  }

  // avoid duplicates by endpoint
  const exists = subs.find(s => s.endpoint === sub.endpoint)
  if (!exists) subs.push(sub)

  fs.writeFileSync(SUB_FILE, JSON.stringify(subs, null, 2))
  return res.status(201).json({ ok: true })
}
