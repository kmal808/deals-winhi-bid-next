import { auth } from '@/auth'
import { db } from '@/lib/db'
import { customers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { CustomerForm } from '../../customer-form'

export default async function EditCustomerPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const customerId = parseInt(params.id)
  if (isNaN(customerId)) {
    notFound()
  }

  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, customerId),
  })

  if (!customer) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link
          href={`/customers/${customer.id}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Customer
        </Link>
        <h1 className="text-3xl font-bold">Edit Customer</h1>
        <p className="text-gray-600 mt-1">Update {customer.name}'s information</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <CustomerForm mode="edit" customer={customer} />
      </div>
    </div>
  )
}
