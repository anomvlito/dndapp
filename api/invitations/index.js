import { pool } from '../../lib/db/repository.js'
import crypto from 'node:crypto'

export default async function handler(req, res) {
  const { method, query } = req

  try {
    if (method === 'GET') {
      // Get by token
      const { token } = query
      if (!token) return res.status(400).json({ error: 'Token required' })

      const result = await pool.query(`
        SELECT i.*, c.name AS campaign_name, u.name AS dm_name,
               (SELECT COUNT(*) FROM campaign_members WHERE campaign_id = c.id) AS player_count
        FROM invitations i
        JOIN campaigns c ON c.id = i.campaign_id
        JOIN users u ON u.id = c.dm_user_id
        WHERE i.token = $1 AND i.status = 'pending' AND i.expires_at > NOW()
      `, [token])

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Invalid or expired invitation' })
      }
      return res.json(result.rows[0])
    }

    if (method === 'POST') {
      // Create invitation
      const { campaign_id, dm_clerk_id } = req.body
      const token = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      await pool.query(`
        INSERT INTO invitations (campaign_id, token, status, expires_at)
        VALUES ($1, $2, 'pending', $3)
      `, [campaign_id, token, expiresAt])

      return res.status(201).json({ token })
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
