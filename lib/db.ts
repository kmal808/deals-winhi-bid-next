import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/db/schema'

// Create a singleton connection
const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create the connection
const client = postgres(connectionString)

// Create the drizzle instance
export const db = drizzle(client, { schema })

// Helper function for compatibility with old code
export function getDb() {
  return db
}
