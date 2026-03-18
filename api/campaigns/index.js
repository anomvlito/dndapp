import { pool } from '../../lib/db/repository.js'

export default async function handler(req, res) {
  const { method, query, body } = req

  try {
    if (method === 'GET') {
      const { dm_id, user_id } = query

      if (dm_id) {
        // DM gets all their campaigns with stats
        const result = await pool.query(`
          SELECT c.*,
                 u.name AS dm_name,
                 COUNT(DISTINCT cm.user_id) AS player_count,
                 COUNT(DISTINCT ch.id) AS character_count
          FROM campaigns c
          JOIN users u ON u.id = c.dm_user_id
          LEFT JOIN campaign_members cm ON cm.campaign_id = c.id
          LEFT JOIN characters ch ON ch.campaign_id = c.id
          WHERE u.clerk_id = $1
          GROUP BY c.id, u.name
          ORDER BY c.created_at DESC
        `, [dm_id])
        return res.json(result.rows)
      }

      if (user_id) {
        // Player gets campaigns they're in
        const result = await pool.query(`
          SELECT c.*, u.name AS dm_name,
                 COUNT(DISTINCT cm2.user_id) AS player_count
          FROM campaigns c
          JOIN campaign_members cm ON cm.campaign_id = c.id
          JOIN users cur ON cur.clerk_id = $1
          JOIN users u ON u.id = c.dm_user_id
          LEFT JOIN campaign_members cm2 ON cm2.campaign_id = c.id
          WHERE cm.user_id = cur.id
          GROUP BY c.id, u.name
          ORDER BY c.created_at DESC
        `, [user_id])
        return res.json(result.rows)
      }

      return res.json([])
    }

    if (method === 'POST') {
      const { name, description, dm_clerk_id } = body

      const dmRes = await pool.query(`SELECT id FROM users WHERE clerk_id = $1`, [dm_clerk_id])
      if (dmRes.rows.length === 0) return res.status(404).json({ error: 'DM user not found' })

      const result = await pool.query(`
        INSERT INTO campaigns (name, description, dm_user_id)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [name, description, dmRes.rows[0].id])

      // Also add DM as a member
      await pool.query(`
        INSERT INTO campaign_members (campaign_id, user_id, role)
        VALUES ($1, $2, 'dm')
        ON CONFLICT DO NOTHING
      `, [result.rows[0].id, dmRes.rows[0].id])

      return res.status(201).json(result.rows[0])
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
