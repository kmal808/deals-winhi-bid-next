'use server'

import { db } from '@/lib/db'
import { productConfigs } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export type ProductConfigFormData = {
  name: string
  category: 'window' | 'door'
  operationType: string
  liteCount: number
  description: string
  imagePath: string
  svgTemplate?: string
  active: boolean
  sortOrder: number
}

export async function createProductConfig(data: ProductConfigFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.insert(productConfigs).values({
      name: data.name,
      category: data.category,
      operationType: data.operationType,
      liteCount: data.liteCount,
      description: data.description,
      imagePath: data.imagePath,
      svgTemplate: data.svgTemplate || null,
      active: data.active,
      sortOrder: data.sortOrder,
    })

    revalidatePath('/admin/product-configs')
    redirect('/admin/product-configs')
  } catch (error) {
    console.error('Failed to create product config:', error)
    throw new Error('Failed to create product config')
  }
}

export async function updateProductConfig(id: number, data: ProductConfigFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db
      .update(productConfigs)
      .set({
        name: data.name,
        category: data.category,
        operationType: data.operationType,
        liteCount: data.liteCount,
        description: data.description,
        imagePath: data.imagePath,
        svgTemplate: data.svgTemplate || null,
        active: data.active,
        sortOrder: data.sortOrder,
      })
      .where(eq(productConfigs.id, id))

    revalidatePath('/admin/product-configs')
    redirect('/admin/product-configs')
  } catch (error) {
    console.error('Failed to update product config:', error)
    throw new Error('Failed to update product config')
  }
}

export async function deleteProductConfig(id: number) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.delete(productConfigs).where(eq(productConfigs.id, id))
    revalidatePath('/admin/product-configs')
  } catch (error) {
    console.error('Failed to delete product config:', error)
    throw new Error('Failed to delete product config')
  }
}

export async function toggleProductConfigStatus(id: number, active: boolean) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.update(productConfigs).set({ active }).where(eq(productConfigs.id, id))
    revalidatePath('/admin/product-configs')
  } catch (error) {
    console.error('Failed to toggle product config status:', error)
    throw new Error('Failed to toggle product config status')
  }
}
