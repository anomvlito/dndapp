import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function init() {
  await client.connect();
  console.log('--- Conectado a Neon Database ---');

  try {
    // 0. Extensiones y Seguridad
    await client.query('CREATE EXTENSION IF NOT EXISTS pg_stat_statements;');
    
    // 1. Eliminar si existen (para resetear si es necesario en esta fase)
    await client.query('DROP TABLE IF EXISTS session_history, character_attacks, character_features, character_proficiencies, character_stats, characters, campaigns CASCADE;');

    // 2. Tabla Campaigns (Partidas)
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Tabla Characters
    await client.query(`
      CREATE TABLE IF NOT EXISTS characters (
        id SERIAL PRIMARY KEY,
        campaign_id INTEGER REFERENCES campaigns(id),
        name TEXT NOT NULL,
        class_level TEXT,
        background TEXT,
        race TEXT,
        alignment TEXT,
        current_hp INTEGER DEFAULT 10,
        max_hp INTEGER DEFAULT 10,
        temp_hp INTEGER DEFAULT 0,
        speed INTEGER DEFAULT 30,
        hit_dice_total TEXT,
        hit_dice_current INTEGER,
        death_saves_successes INTEGER DEFAULT 0,
        death_saves_failures INTEGER DEFAULT 0,
        essence TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_char_name ON characters (name);
      CREATE INDEX IF NOT EXISTS idx_char_campaign ON characters (campaign_id);
    `);

    // 4. Tabla Stats
    await client.query(`
      CREATE TABLE IF NOT EXISTS character_stats (
        character_id INTEGER PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
        fuerza INTEGER DEFAULT 10,
        destreza INTEGER DEFAULT 10,
        constitucion INTEGER DEFAULT 10,
        inteligencia INTEGER DEFAULT 10,
        sabiduria INTEGER DEFAULT 10,
        carisma INTEGER DEFAULT 10
      );
    `);

    // 5. Tabla Proficiencies (Skills & Saves)
    await client.query(`
      CREATE TABLE IF NOT EXISTS character_proficiencies (
        id SERIAL PRIMARY KEY,
        character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
        key TEXT NOT NULL,
        type TEXT CHECK (type IN ('skill', 'save')),
        UNIQUE(character_id, key, type)
      );
      CREATE INDEX IF NOT EXISTS idx_prof_char ON character_proficiencies (character_id);
    `);

    // 6. Tabla Features (Rasgos)
    await client.query(`
      CREATE TABLE IF NOT EXISTS character_features (
        id SERIAL PRIMARY KEY,
        character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        source TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Tabla Attacks
    await client.query(`
        CREATE TABLE IF NOT EXISTS character_attacks (
          id SERIAL PRIMARY KEY,
          character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          bonus TEXT,
          damage TEXT,
          type TEXT
        );
      `);

    // 8. Tabla Session History (Logs)
    await client.query(`
      CREATE TABLE IF NOT EXISTS session_history (
        id SERIAL PRIMARY KEY,
        character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
        event_type TEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_hist_char ON session_history (character_id);
    `);

    console.log('✅ Estructura Relacional Creada con éxito');

    // Inserción de prueba: Una partida inicial si no hay
    const campRes = await client.query("SELECT id FROM campaigns LIMIT 1");
    if (campRes.rowCount === 0) {
      await client.query("INSERT INTO campaigns (name, description) VALUES ('Aventuras Olvidadas', 'Una partida para aquellos que no recuerdan quiénes son.')");
      console.log('➕ Partida de ejemplo creada');
    }

  } catch (err) {
    console.error('❌ Error inicializando DB:', err);
  } finally {
    await client.end();
  }
}

init();
