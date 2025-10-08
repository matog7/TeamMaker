import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5546),
  user: process.env.PGUSER || "teammaker",
  password: process.env.PGPASSWORD || "teammaker",
  database: process.env.PGDATABASE || "teammaker",
});

export const query = (text: string, params?: unknown[]) =>
  pool.query(text, params);
export default pool;
