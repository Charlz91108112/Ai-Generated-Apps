import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

class LocalDBClient {
  private db: any = null;

  constructor() {
    // Initialize in-memory database
    this.initDB();
  }

  private async initDB() {
    // Initialize an in-memory database
    const SQL = await initSqlJs();
    this.db = new SQL.Database();
    this.initializeTables();
  }

  private initializeTables() {
    // Create necessary tables if they don't exist
    this.db.run(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE
      );
      
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        amount REAL,
        category TEXT,
        date TEXT,
        currency TEXT,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES profiles(id)
      );
      
      CREATE TABLE IF NOT EXISTS shared_expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        expense_id TEXT,
        shared_with TEXT,
        FOREIGN KEY (expense_id) REFERENCES expenses(id),
        FOREIGN KEY (shared_with) REFERENCES profiles(id)
      );
    `);
  }

  auth = {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const stmt = this.db.prepare('SELECT * FROM profiles WHERE email = ?');
      const result = stmt.getAsObject([email]);
      if (!result.id) {
        return { error: { message: 'Invalid credentials' } };
      }
      return { data: { user: result }, error: null };
    },
    signUp: async ({ email, password, data }: { email: string; password: string; data: any }) => {
      try {
        const id = Math.random().toString(36).substring(7);
        const stmt = this.db.prepare(
          'INSERT INTO profiles (id, email, username) VALUES (?, ?, ?)'
        );
        stmt.run([id, email, data.username]);
        return { data: { user: { id, email } }, error: null };
      } catch (error) {
        return { error: { message: 'Error creating user' } };
      }
    },
    getSession: async () => {
      return { data: { session: null } };
    },
    onAuthStateChange: () => {
      return {
        data: { subscription: { unsubscribe: () => {} } }
      };
    }
  };

  from = (table: string) => ({
    insert: async (data: any) => {
      try {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map(() => '?').join(', ');
        
        const stmt = this.db.prepare(
          `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`
        );
        stmt.run(values);
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => {
          try {
            const stmt = this.db.prepare(
              `SELECT ${columns} FROM ${table} WHERE ${column} = ?`
            );
            const result = stmt.getAsObject([value]);
            return { data: result, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      })
    })
  });
}

// Create and export the appropriate client based on environment variables
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new LocalDBClient();