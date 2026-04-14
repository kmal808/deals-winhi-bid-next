import { auth } from '@/auth'
import { db } from '@/lib/db'
import { customers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteCustomerButton } from './delete-button'

export default async function CustomerDetailPage({
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
          href="/customers"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Customers
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-gray-600 mt-1">Customer Details</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/customers/${customer.id}/edit`}>
              <Button>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <DeleteCustomerButton customerId={customer.id} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Basic Information
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.email || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.phone || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Alternate Phone
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.altPhone || '—'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Address</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Street Address
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.address || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.city || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">State</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.state || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">ZIP Code</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.zip || '—'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Contract Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Contract Details
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Discount (%)
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.discountPercent || '0'}%
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Down Payment
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.downPaymentAmount
                    ? `$${parseFloat(customer.downPaymentAmount).toFixed(2)}`
                    : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Estimate Start Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.estimateStartDate || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Estimate End Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.estimateEndDate || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Grid Option</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.noGrid ? 'No Grid' : 'Grid Enabled'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Comments */}
          {customer.comments && (
            <div>
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
                Comments
              </h2>
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {customer.comments}
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Quick Actions
            </h2>
            <div className="flex gap-2">
              <Link href={`/configurator/${customer.id}`}>
                <Button variant="outline">Configure Windows/Doors</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
