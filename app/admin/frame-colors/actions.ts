'use server'

import { db } from '@/lib/db'
import { frameColors } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export type FrameColorFormData = {
  name: string
  hexColor: string
  factor: string
  active: boolean
  sortOrder: number
}

export async function createFrameColor(data: FrameColorFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.insert(frameColors).values({
      name: data.name,
      hexColor: data.hexColor,
      factor: data.factor,
      active: data.active,
      sortOrder: data.sortOrder,
    })

    revalidatePath('/admin/frame-colors')
    redirect('/admin/frame-colors')
  } catch (error) {
    console.error('Failed to create frame color:', error)
    throw new Error('Failed to create frame color')
  }
}

export async function updateFrameColor(id: number, data: FrameColorFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db
      .update(frameColors)
      .set({
        name: data.name,
        hexColor: data.hexColor,
        factor: data.factor,
        active: data.active,
        sortOrder: data.sortOrder,
      })
      .where(eq(frameColors.id, id))

    revalidatePath('/admin/frame-colors')
    redirect('/admin/frame-colors')
  } catch (error) {
    console.error('Failed to update frame color:', error)
    throw new Error('Failed to update frame color')
  }
}

export async function deleteFrameColor(id: number) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.delete(frameColors).where(eq(frameColors.id, id))
    revalidatePath('/admin/frame-colors')
  } catch (error) {
    console.error('Failed to delete frame color:', error)
    throw new Error('Failed to delete frame color')
  }
}

export async function toggleFrameColorStatus(id: number, active: boolean) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.update(frameColors).set({ active }).where(eq(frameColors.id, id))
    revalidatePath('/admin/frame-colors')
  } catch (error) {
    console.error('Failed to toggle frame color status:', error)
    throw new Error('Failed to toggle frame color status')
  }
}
