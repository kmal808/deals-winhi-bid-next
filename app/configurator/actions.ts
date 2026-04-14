'use server'

import { db } from '@/lib/db'
import { windows } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export type WindowFormData = {
  location: string
  brandId?: number
  productConfigId?: number
  frameTypeId?: number
  frameColorId?: number
  glassTypeId?: number
  gridStyleId?: number
  gridSizeId?: number
  width: string
  height: string
  lowE?: boolean
  isDoor?: boolean
  calculatedPrice?: string
  manualPrice?: string
  applyCustomDiscount?: boolean
  customDiscountPercent?: string
  specialInstructions?: string
}

export async function createWindow(customerId: number, data: WindowFormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    await db.insert(windows).values({
      customerId,
      location: data.location,
      brandId: data.brandId || null,
      productConfigId: data.productConfigId || null,
      frameTypeId: data.frameTypeId || null,
      frameColorId: data.frameColorId || null,
      glassTypeId: data.glassTypeId || null,
      gridStyleId: data.gridStyleId || null,
      gridSizeId: data.gridSizeId || null,
      width: data.width,
      height: data.height,
      lowE: data.lowE || false,
      isDoor: data.isDoor || false,
      calculatedPrice: data.calculatedPrice || null,
      manualPrice: data.manualPrice || null,
      applyCustomDiscount: data.applyCustomDiscount || false,
      customDiscountPercent: data.customDiscountPercent || '0',
      specialInstructions: data.specialInstructions || null,
    })

    revalidatePath(`/configurator/${customerId}`)
    redirect(`/configurator/${customerId}`)
  } catch (error) {
    console.error('Failed to create window:', error)
    throw new Error('Failed to create window')
  }
}

export async function updateWindow(
  customerId: number,
  windowId: number,
  data: WindowFormData
) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    await db
      .update(windows)
      .set({
        location: data.location,
        brandId: data.brandId || null,
        productConfigId: data.productConfigId || null,
        frameTypeId: data.frameTypeId || null,
        frameColorId: data.frameColorId || null,
        glassTypeId: data.glassTypeId || null,
        gridStyleId: data.gridStyleId || null,
        gridSizeId: data.gridSizeId || null,
        width: data.width,
        height: data.height,
        lowE: data.lowE || false,
        isDoor: data.isDoor || false,
        calculatedPrice: data.calculatedPrice || null,
        manualPrice: data.manualPrice || null,
        applyCustomDiscount: data.applyCustomDiscount || false,
        customDiscountPercent: data.customDiscountPercent || '0',
        specialInstructions: data.specialInstructions || null,
        updatedAt: new Date(),
      })
      .where(eq(windows.id, windowId))

    revalidatePath(`/configurator/${customerId}`)
    redirect(`/configurator/${customerId}`)
  } catch (error) {
    console.error('Failed to update window:', error)
    throw new Error('Failed to update window')
  }
}

export async function deleteWindow(customerId: number, windowId: number) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    await db.delete(windows).where(eq(windows.id, windowId))
    revalidatePath(`/configurator/${customerId}`)
  } catch (error) {
    console.error('Failed to delete window:', error)
    throw new Error('Failed to delete window')
  }
}
