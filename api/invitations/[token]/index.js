import { pool } from '../../../lib/db/repository.js'

export default async function handler(req, res) {
  const { token } = req.query

  try {
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
    res.json(result.rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
