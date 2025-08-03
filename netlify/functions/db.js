import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const connectionString = 'Buraya Neon bağlantı dizesini yapıştır';

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool);
