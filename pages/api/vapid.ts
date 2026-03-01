import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const publicKey = process.env.VAPID_PUBLIC || process.env.NEXT_PUBLIC_VAPID_PUBLIC || ''
  if (!publicKey) return res.status(500).json({ error: 'VAPID public key not configured' })
  return res.status(200).json({ publicKey })
}
