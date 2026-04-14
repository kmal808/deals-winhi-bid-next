'use server'

import { db } from '@/lib/db'
import { glassTypes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export type GlassTypeFormData = {
  name: string
  description: string
  factor: string
  imagePath: string
  active: boolean
  sortOrder: number
}

export async function createGlassType(data: GlassTypeFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.insert(glassTypes).values({
      name: data.name,
      description: data.description,
      factor: data.factor,
      imagePath: data.imagePath || null,
      active: data.active,
      sortOrder: data.sortOrder,
    })

    revalidatePath('/admin/glass-types')
    redirect('/admin/glass-types')
  } catch (error) {
    console.error('Failed to create glass type:', error)
    throw new Error('Failed to create glass type')
  }
}

export async function updateGlassType(id: number, data: GlassTypeFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db
      .update(glassTypes)
      .set({
        name: data.name,
        description: data.description,
        factor: data.factor,
        imagePath: data.imagePath || null,
        active: data.active,
        sortOrder: data.sortOrder,
      })
      .where(eq(glassTypes.id, id))

    revalidatePath('/admin/glass-types')
    redirect('/admin/glass-types')
  } catch (error) {
    console.error('Failed to update glass type:', error)
    throw new Error('Failed to update glass type')
  }
}

export async function deleteGlassType(id: number) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.delete(glassTypes).where(eq(glassTypes.id, id))
    revalidatePath('/admin/glass-types')
  } catch (error) {
    console.error('Failed to delete glass type:', error)
    throw new Error('Failed to delete glass type')
  }
}

export async function toggleGlassTypeStatus(id: number, active: boolean) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.update(glassTypes).set({ active }).where(eq(glassTypes.id, id))
    revalidatePath('/admin/glass-types')
  } catch (error) {
    console.error('Failed to toggle glass type status:', error)
    throw new Error('Failed to toggle glass type status')
  }
}
