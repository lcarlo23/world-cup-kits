import { MongoClient } from 'mongodb';

let db;
let mongoClient;

export async function initDb() {
  if (db) {
    console.log('Database already initialized!');
    return;
  }

  try {
    mongoClient = await MongoClient.connect(process.env.MONGODB_URI);
    db = mongoClient.db('world-cup-kits');
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

export async function closeDb() {
  if (mongoClient) {
    await mongoClient.close();
  }
}
