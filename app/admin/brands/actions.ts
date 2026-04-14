'use server'

import { db } from '@/lib/db'
import { brands } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export type BrandFormData = {
  name: string
  factor: string
  active: boolean
  sortOrder: number
}

export async function createBrand(data: BrandFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.insert(brands).values({
      name: data.name,
      factor: data.factor,
      active: data.active,
      sortOrder: data.sortOrder,
    })

    revalidatePath('/admin/brands')
    redirect('/admin/brands')
  } catch (error) {
    console.error('Failed to create brand:', error)
    throw new Error('Failed to create brand')
  }
}

export async function updateBrand(id: number, data: BrandFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db
      .update(brands)
      .set({
        name: data.name,
        factor: data.factor,
        active: data.active,
        sortOrder: data.sortOrder,
      })
      .where(eq(brands.id, id))

    revalidatePath('/admin/brands')
    redirect('/admin/brands')
  } catch (error) {
    console.error('Failed to update brand:', error)
    throw new Error('Failed to update brand')
  }
}

export async function deleteBrand(id: number) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.delete(brands).where(eq(brands.id, id))
    revalidatePath('/admin/brands')
  } catch (error) {
    console.error('Failed to delete brand:', error)
    throw new Error('Failed to delete brand')
  }
}

export async function toggleBrandStatus(id: number, active: boolean) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.update(brands).set({ active }).where(eq(brands.id, id))
    revalidatePath('/admin/brands')
  } catch (error) {
    console.error('Failed to toggle brand status:', error)
    throw new Error('Failed to toggle brand status')
  }
}
