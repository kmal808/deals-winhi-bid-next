'use server'

import { db } from '@/lib/db'
import { customers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export type CustomerFormData = {
  name: string
  address?: string
  city?: string
  state?: string
  zip?: string
  email?: string
  phone?: string
  altPhone?: string
  comments?: string
  discountPercent?: string
  downPaymentAmount?: string
  estimateStartDate?: string
  estimateEndDate?: string
  noGrid?: boolean
}

export async function createCustomer(data: CustomerFormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    const [customer] = await db
      .insert(customers)
      .values({
        representativeId: parseInt(session.user.id),
        name: data.name,
        address: data.address || null,
        city: data.city || null,
        state: data.state || 'HI',
        zip: data.zip || null,
        email: data.email || null,
        phone: data.phone || null,
        altPhone: data.altPhone || null,
        comments: data.comments || null,
        discountPercent: data.discountPercent || '0',
        downPaymentAmount: data.downPaymentAmount || null,
        estimateStartDate: data.estimateStartDate || null,
        estimateEndDate: data.estimateEndDate || null,
        noGrid: data.noGrid || false,
      })
      .returning()

    revalidatePath('/customers')
    redirect(`/customers/${customer.id}`)
  } catch (error) {
    console.error('Failed to create customer:', error)
    throw new Error('Failed to create customer')
  }
}

export async function updateCustomer(id: number, data: CustomerFormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    await db
      .update(customers)
      .set({
        name: data.name,
        address: data.address || null,
        city: data.city || null,
        state: data.state || 'HI',
        zip: data.zip || null,
        email: data.email || null,
        phone: data.phone || null,
        altPhone: data.altPhone || null,
        comments: data.comments || null,
        discountPercent: data.discountPercent || '0',
        downPaymentAmount: data.downPaymentAmount || null,
        estimateStartDate: data.estimateStartDate || null,
        estimateEndDate: data.estimateEndDate || null,
        noGrid: data.noGrid || false,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))

    revalidatePath('/customers')
    revalidatePath(`/customers/${id}`)
    redirect(`/customers/${id}`)
  } catch (error) {
    console.error('Failed to update customer:', error)
    throw new Error('Failed to update customer')
  }
}

export async function deleteCustomer(id: number) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    await db.delete(customers).where(eq(customers.id, id))
    revalidatePath('/customers')
    redirect('/customers')
  } catch (error) {
    console.error('Failed to delete customer:', error)
    throw new Error('Failed to delete customer')
  }
}
