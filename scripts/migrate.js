import 'dotenv/config'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function migrate() {
  console.log('🔮 Running migrations...')

  const statements = [
    // USERS
    `CREATE TABLE IF NOT EXISTS users (
      id          SERIAL PRIMARY KEY,
      clerk_id    TEXT UNIQUE NOT NULL,
      email       TEXT UNIQUE NOT NULL,
      name        TEXT,
      avatar      TEXT,
      role        TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('dm', 'player')),
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,

    // CAMPAIGNS
    `CREATE TABLE IF NOT EXISTS campaigns (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      description   TEXT,
      dm_user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      session_count INT NOT NULL DEFAULT 1,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,

    // CAMPAIGN MEMBERS
    `CREATE TABLE IF NOT EXISTS campaign_members (
      campaign_id INT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role        TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('dm', 'player')),
      joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (campaign_id, user_id)
    )`,

    // INVITATIONS
    `CREATE TABLE IF NOT EXISTS invitations (
      id          SERIAL PRIMARY KEY,
      campaign_id INT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      token       TEXT UNIQUE NOT NULL,
      status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
      expires_at  TIMESTAMPTZ NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,

    // ADD COLUMNS to existing characters table
    `ALTER TABLE characters ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id)`,
    `ALTER TABLE characters ADD COLUMN IF NOT EXISTS campaign_id INT REFERENCES campaigns(id)`,

    // INDEXES (after tables exist)
    `CREATE INDEX IF NOT EXISTS idx_campaigns_dm_user ON campaigns(dm_user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_members_user      ON campaign_members(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_chars_user        ON characters(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_chars_campaign    ON characters(campaign_id)`,
    `CREATE INDEX IF NOT EXISTS idx_invites_token     ON invitations(token)`,
  ]

  for (const sql of statements) {
    await pool.query(sql)
  }

  console.log('✅ Migrations complete!')
  await pool.end()
}


migrate().catch((e) => { console.error('❌ Migration failed:', e); process.exit(1) })
