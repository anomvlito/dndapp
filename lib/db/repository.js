import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const CharacterRepository = {
  async getAll() {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT c.*, s.fuerza, s.destreza, s.constitucion, s.inteligencia, s.sabiduria, s.carisma
        FROM characters c
        JOIN character_stats s ON c.id = s.character_id
        ORDER BY c.created_at DESC
      `);
      return rows;
    } finally {
      client.release();
    }
  },

  async getById(id) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT c.*, s.fuerza, s.destreza, s.constitucion, s.inteligencia, s.sabiduria, s.carisma
        FROM characters c
        JOIN character_stats s ON c.id = s.character_id
        WHERE c.id = $1
      `, [id]);
      return rows[0];
    } finally {
      client.release();
    }
  },

  async create(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const charRes = await client.query(
        'INSERT INTO characters (name, campaign_id, class_level, race) VALUES ($1, $2, $3, $4) RETURNING id',
        [data.name, data.campaign_id || null, data.class_level, data.race]
      );
      const charId = charRes.rows[0].id;

      const s = data.stats || { fuerza: 10, destreza: 10, constitucion: 10, inteligencia: 10, sabiduria: 10, carisma: 10 };
      await client.query(
        'INSERT INTO character_stats (character_id, fuerza, destreza, constitucion, inteligencia, sabiduria, carisma) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [charId, s.fuerza, s.destreza, s.constitucion, s.inteligencia, s.sabiduria, s.carisma]
      );

      await client.query('COMMIT');
      return charId;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  async updateHP(id, current, temp) {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE characters SET current_hp = $1, temp_hp = $2, updated_at = NOW() WHERE id = $3',
        [current, temp, id]
      );
      // Log event
      await client.query(
        'INSERT INTO session_history (character_id, event_type, content) VALUES ($1, $2, $3)',
        [id, 'HP_CHANGE', `HP actualizado a ${current} (${temp} temp)`]
      );
    } finally {
      client.release();
    }
  },

  async updateStats(id, s) {
    const client = await pool.connect();
    try {
      await client.query(`
        UPDATE character_stats 
        SET fuerza = $1, destreza = $2, constitucion = $3, inteligencia = $4, sabiduria = $5, carisma = $6
        WHERE character_id = $7
      `, [s.fuerza, s.destreza, s.constitucion, s.inteligencia, s.sabiduria, s.carisma, id]);
      
      await client.query('UPDATE characters SET updated_at = NOW() WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  },

  async updateBasics(id, data) {
    const client = await pool.connect();
    try {
      await client.query(`
        UPDATE characters 
        SET name = $1, class_level = $2, race = $3, background = $4, alignment = $5, updated_at = NOW()
        WHERE id = $6
      `, [data.name, data.class_level, data.race, data.background, data.alignment, id]);
    } finally {
      client.release();
    }
  }
};
