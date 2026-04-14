import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { representatives } from '@/db/schema'
import { eq } from 'drizzle-orm'

export interface SessionUser {
  id: number
  username: string
  name: string
  email: string
  role: 'admin' | 'representative'
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<SessionUser | null> {
  const user = await db.query.representatives.findFirst({
    where: eq(representatives.username, username),
  })

  if (!user || !user.active) {
    return null
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return null
  }

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}
