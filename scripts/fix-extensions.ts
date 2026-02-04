import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from the root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const VECTOR_DATABASE_URL = process.env.VECTOR_DATABASE_URL;

async function fixExtensions() {
  if (!VECTOR_DATABASE_URL) {
    console.error('VECTOR_DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: VECTOR_DATABASE_URL });

  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    
    console.log('Enabling pg_trgm extension...');
    await client.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
    
    console.log('Enabling vector extension...');
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');

    console.log('Successfully enabled extensions!');
  } catch (err) {
    console.error('Error enabling extensions:', err);
  } finally {
    await client.end();
  }
}

fixExtensions();
