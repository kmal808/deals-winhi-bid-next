'use server'

import { db } from '@/lib/db'
import { frameTypes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export type FrameTypeFormData = {
  name: string
  description: string
  factor: string
  active: boolean
  sortOrder: number
}

export async function createFrameType(data: FrameTypeFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.insert(frameTypes).values({
      name: data.name,
      description: data.description,
      factor: data.factor,
      active: data.active,
      sortOrder: data.sortOrder,
    })

    revalidatePath('/admin/frame-types')
    redirect('/admin/frame-types')
  } catch (error) {
    console.error('Failed to create frame type:', error)
    throw new Error('Failed to create frame type')
  }
}

export async function updateFrameType(id: number, data: FrameTypeFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db
      .update(frameTypes)
      .set({
        name: data.name,
        description: data.description,
        factor: data.factor,
        active: data.active,
        sortOrder: data.sortOrder,
      })
      .where(eq(frameTypes.id, id))

    revalidatePath('/admin/frame-types')
    redirect('/admin/frame-types')
  } catch (error) {
    console.error('Failed to update frame type:', error)
    throw new Error('Failed to update frame type')
  }
}

export async function deleteFrameType(id: number) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.delete(frameTypes).where(eq(frameTypes.id, id))
    revalidatePath('/admin/frame-types')
  } catch (error) {
    console.error('Failed to delete frame type:', error)
    throw new Error('Failed to delete frame type')
  }
}

export async function toggleFrameTypeStatus(id: number, active: boolean) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.update(frameTypes).set({ active }).where(eq(frameTypes.id, id))
    revalidatePath('/admin/frame-types')
  } catch (error) {
    console.error('Failed to toggle frame type status:', error)
    throw new Error('Failed to toggle frame type status')
  }
}
