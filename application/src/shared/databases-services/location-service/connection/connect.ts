import { MongoClient, MongoClientOptions, Db } from 'mongodb';
import { fetchConnectionSecret } from './fetch-connection-secret';
import { config } from '@config/config';

let client: MongoClient | null = null;
let db: Db | null = null;

const secretName = config.get('dbConnectionSecret');

const defaultConnOptions: MongoClientOptions = {
  // eg: maxPoolSize: 10, ssl: true, etc.
};

export async function connect(options: MongoClientOptions = {}): Promise<Db> {
  if (db) {
    return db;
  }

  //console.log('DB Service: Fetching Connection String');
  //console.log(`DB Service: **** ${secretName}`);
  const dbConnectionString = await fetchConnectionSecret(secretName);

  //console.log(`DB Service: **** ${dbConnectionString}`);
  //console.log('DB Service: Connecting to database');

  client = new MongoClient(dbConnectionString, {
    ...defaultConnOptions,
    ...options,
  });
  await client.connect();

  const dbName = config.get('databaseName') || client.options.dbName;
  db = client.db(dbName);

  console.log('DB Service: Connected');
  return db;
}

/**
 * Optionally, you might want to expose the MongoClient instance for closing the connection
 */
export function getClient(): MongoClient | null {
  return client;
}

/** Disconnects the MongoDB client and resets cached connections. */
export async function disconnect(): Promise<void> {
  if (client) {
    console.log('DB Service: Disconnecting from database');
    await client.close();
    client = null;
    db = null;
    console.log('DB Service: Disconnected');
  }
}
