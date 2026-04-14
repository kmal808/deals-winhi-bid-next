'use server'

import { db } from '@/lib/db'
import { gridStyles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export type GridStyleFormData = {
  name: string
  factor: string
  imagePath: string
  active: boolean
  sortOrder: number
}

export async function createGridStyle(data: GridStyleFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.insert(gridStyles).values({
      name: data.name,
      factor: data.factor,
      imagePath: data.imagePath || null,
      active: data.active,
      sortOrder: data.sortOrder,
    })

    revalidatePath('/admin/grid-styles')
    redirect('/admin/grid-styles')
  } catch (error) {
    console.error('Failed to create grid style:', error)
    throw new Error('Failed to create grid style')
  }
}

export async function updateGridStyle(id: number, data: GridStyleFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db
      .update(gridStyles)
      .set({
        name: data.name,
        factor: data.factor,
        imagePath: data.imagePath || null,
        active: data.active,
        sortOrder: data.sortOrder,
      })
      .where(eq(gridStyles.id, id))

    revalidatePath('/admin/grid-styles')
    redirect('/admin/grid-styles')
  } catch (error) {
    console.error('Failed to update grid style:', error)
    throw new Error('Failed to update grid style')
  }
}

export async function deleteGridStyle(id: number) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.delete(gridStyles).where(eq(gridStyles.id, id))
    revalidatePath('/admin/grid-styles')
  } catch (error) {
    console.error('Failed to delete grid style:', error)
    throw new Error('Failed to delete grid style')
  }
}

export async function toggleGridStyleStatus(id: number, active: boolean) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.update(gridStyles).set({ active }).where(eq(gridStyles.id, id))
    revalidatePath('/admin/grid-styles')
  } catch (error) {
    console.error('Failed to toggle grid style status:', error)
    throw new Error('Failed to toggle grid style status')
  }
}
