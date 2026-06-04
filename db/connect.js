import { MongoClient } from 'mongodb';

let db;

export async function initDb() {
  if (db) {
    console.log('Database already initialized!');
    return;
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    db = client.db('world-cup-kits');
  } catch (error) {
    console.error(error);
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }

  return db;
}
