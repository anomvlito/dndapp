import { pool } from '../../../lib/db/repository.js'

export default async function handler(req, res) {
  const { method, body } = req

  if (method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { clerk_id, email, name, avatar } = body

  try {
    // Upsert user
    const result = await pool.query(`
      INSERT INTO users (clerk_id, email, name, avatar)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (clerk_id)
      DO UPDATE SET name = EXCLUDED.name, avatar = EXCLUDED.avatar, updated_at = NOW()
      RETURNING id, role, name, email, avatar
    `, [clerk_id, email, name, avatar])

    res.json(result.rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
}
