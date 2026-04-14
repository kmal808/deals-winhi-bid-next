'use server'

import { db } from '@/lib/db'
import { disclaimers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export type DisclaimerFormData = {
  description: string
  sortOrder: number
  includeByDefault: boolean
  active: boolean
}

export async function createDisclaimer(data: DisclaimerFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.insert(disclaimers).values({
      description: data.description,
      sortOrder: data.sortOrder,
      includeByDefault: data.includeByDefault,
      active: data.active,
    })

    revalidatePath('/admin/disclaimers')
    redirect('/admin/disclaimers')
  } catch (error) {
    console.error('Failed to create disclaimer:', error)
    throw new Error('Failed to create disclaimer')
  }
}

export async function updateDisclaimer(id: number, data: DisclaimerFormData) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db
      .update(disclaimers)
      .set({
        description: data.description,
        sortOrder: data.sortOrder,
        includeByDefault: data.includeByDefault,
        active: data.active,
      })
      .where(eq(disclaimers.id, id))

    revalidatePath('/admin/disclaimers')
    redirect('/admin/disclaimers')
  } catch (error) {
    console.error('Failed to update disclaimer:', error)
    throw new Error('Failed to update disclaimer')
  }
}

export async function deleteDisclaimer(id: number) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.delete(disclaimers).where(eq(disclaimers.id, id))
    revalidatePath('/admin/disclaimers')
  } catch (error) {
    console.error('Failed to delete disclaimer:', error)
    throw new Error('Failed to delete disclaimer')
  }
}

export async function toggleDisclaimerStatus(id: number, active: boolean) {
  const session = await auth()

  if (!session?.user?.id || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  try {
    await db.update(disclaimers).set({ active }).where(eq(disclaimers.id, id))
    revalidatePath('/admin/disclaimers')
  } catch (error) {
    console.error('Failed to toggle disclaimer status:', error)
    throw new Error('Failed to toggle disclaimer status')
  }
}
