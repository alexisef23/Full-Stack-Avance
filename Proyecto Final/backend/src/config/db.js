const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const ssl =
  process.env.DB_SSL === 'true' || process.env.PGSSLMODE === 'require' || !!connectionString
    ? { rejectUnauthorized: false }
    : undefined;

const pool = connectionString
  ? new Pool({ connectionString, ssl })
  : new Pool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
      database: process.env.DB_NAME,
      ssl,
    });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
