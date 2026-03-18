import { pool } from '../../../lib/db/repository.js'

export default async function handler(req, res) {
  const { token } = req.query
  const { user_clerk_id } = req.body

  try {
    // Verify invite
    const invRes = await pool.query(`
      SELECT i.*, c.id AS campaign_id
      FROM invitations i
      JOIN campaigns c ON c.id = i.campaign_id
      WHERE i.token = $1 AND i.status = 'pending' AND i.expires_at > NOW()
    `, [token])

    if (invRes.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or expired invitation' })
    }
    const invite = invRes.rows[0]

    // Get user
    const userRes = await pool.query(`SELECT id FROM users WHERE clerk_id = $1`, [user_clerk_id])
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' })
    const userId = userRes.rows[0].id

    // Add to campaign
    await pool.query(`
      INSERT INTO campaign_members (campaign_id, user_id, role)
      VALUES ($1, $2, 'player')
      ON CONFLICT DO NOTHING
    `, [invite.campaign_id, userId])

    // Mark invite as used
    await pool.query(`
      UPDATE invitations SET status = 'accepted' WHERE token = $1
    `, [token])

    res.json({ success: true, campaign_id: invite.campaign_id })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
