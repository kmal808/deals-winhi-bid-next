'use server'

import { db } from '@/lib/db'
import { gridSizes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export type GridSizeFormData = {
  size: string
  active: boolean
  sortOrder: number
}

export async function createGridSize(data: GridSizeFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.insert(gridSizes).values({
      size: data.size,
      active: data.active,
      sortOrder: data.sortOrder,
    })

    revalidatePath('/admin/grid-sizes')
    redirect('/admin/grid-sizes')
  } catch (error) {
    console.error('Failed to create grid size:', error)
    throw new Error('Failed to create grid size')
  }
}

export async function updateGridSize(id: number, data: GridSizeFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db
      .update(gridSizes)
      .set({
        size: data.size,
        active: data.active,
        sortOrder: data.sortOrder,
      })
      .where(eq(gridSizes.id, id))

    revalidatePath('/admin/grid-sizes')
    redirect('/admin/grid-sizes')
  } catch (error) {
    console.error('Failed to update grid size:', error)
    throw new Error('Failed to update grid size')
  }
}

export async function deleteGridSize(id: number) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.delete(gridSizes).where(eq(gridSizes.id, id))
    revalidatePath('/admin/grid-sizes')
  } catch (error) {
    console.error('Failed to delete grid size:', error)
    throw new Error('Failed to delete grid size')
  }
}

export async function toggleGridSizeStatus(id: number, active: boolean) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.update(gridSizes).set({ active }).where(eq(gridSizes.id, id))
    revalidatePath('/admin/grid-sizes')
  } catch (error) {
    console.error('Failed to toggle grid size status:', error)
    throw new Error('Failed to toggle grid size status')
  }
}
