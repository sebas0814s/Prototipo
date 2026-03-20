import { Pool, PoolClient, QueryResult } from 'pg';
import { ENV } from './env';

/** Singleton PostgreSQL connection pool */
class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      host: ENV.DB_HOST,
      port: ENV.DB_PORT,
      database: ENV.DB_NAME,
      user: ENV.DB_USER,
      password: ENV.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      console.error('[Database] Unexpected pool error:', err);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
    const result = await this.pool.query(text, params);
    return result.rows as T[];
  }

  public async queryWithResult(text: string, params?: unknown[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }

  public async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  public async connect(): Promise<void> {
    const client = await this.pool.connect();
    console.log('[Database] PostgreSQL connected successfully');
    client.release();
  }
}

export const db = Database.getInstance();
