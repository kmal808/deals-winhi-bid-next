'use server'

import { db } from '@/lib/db'
import { representatives } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import bcrypt from 'bcryptjs'

export type UserFormData = {
  name: string
  username: string
  email: string
  phone: string
  role: 'admin' | 'representative'
  active: boolean
  password?: string
}

export async function createUser(data: UserFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  if (!data.password) {
    throw new Error('Password is required')
  }

  try {
    const passwordHash = await bcrypt.hash(data.password, 10)

    await db.insert(representatives).values({
      name: data.name,
      username: data.username,
      passwordHash,
      email: data.email || null,
      phone: data.phone || null,
      role: data.role,
      active: data.active,
    })

    revalidatePath('/admin/users')
    redirect('/admin/users')
  } catch (error) {
    console.error('Failed to create user:', error)
    throw new Error('Failed to create user')
  }
}

export async function updateUser(id: number, data: UserFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    const updateData: any = {
      name: data.name,
      username: data.username,
      email: data.email || null,
      phone: data.phone || null,
      role: data.role,
      active: data.active,
    }

    // Only update password if provided
    if (data.password && data.password.trim() !== '') {
      updateData.passwordHash = await bcrypt.hash(data.password, 10)
    }

    await db
      .update(representatives)
      .set(updateData)
      .where(eq(representatives.id, id))

    revalidatePath('/admin/users')
    redirect('/admin/users')
  } catch (error) {
    console.error('Failed to update user:', error)
    throw new Error('Failed to update user')
  }
}

export async function deleteUser(id: number) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.delete(representatives).where(eq(representatives.id, id))
    revalidatePath('/admin/users')
  } catch (error) {
    console.error('Failed to delete user:', error)
    throw new Error('Failed to delete user')
  }
}

export async function toggleUserStatus(id: number, active: boolean) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.update(representatives).set({ active }).where(eq(representatives.id, id))
    revalidatePath('/admin/users')
  } catch (error) {
    console.error('Failed to toggle user status:', error)
    throw new Error('Failed to toggle user status')
  }
}
