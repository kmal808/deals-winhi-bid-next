import { auth } from '@/auth'
import { db } from '@/lib/db'
import { customers, windows } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, FileText, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WindowsTable } from './windows-table'

export default async function ConfiguratorPage({
  params,
}: {
  params: { customerId: string }
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const customerId = parseInt(params.customerId)
  if (isNaN(customerId)) {
    notFound()
  }

  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, customerId),
  })

  if (!customer) {
    notFound()
  }

  const customerWindows = await db.query.windows.findMany({
    where: eq(windows.customerId, customerId),
    with: {
      brand: true,
      productConfig: true,
      frameType: true,
      frameColor: true,
      glassType: true,
      gridStyle: true,
      gridSize: true,
    },
    orderBy: (windows, { asc }) => [asc(windows.sortOrder)],
  })

  // Calculate totals
  const listPrice = customerWindows.reduce((sum, window) => {
    const price = window.calculatedPrice ? parseFloat(window.calculatedPrice) : 0
    return sum + price
  }, 0)

  const discountPercent = customer.discountPercent
    ? parseFloat(customer.discountPercent)
    : 0
  const discountAmount = (listPrice * discountPercent) / 100
  const subtotal = listPrice - discountAmount

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

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Configurator</h1>
            <p className="text-gray-600 mt-1">
              {customer.name} - Configure Windows & Doors
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/configurator/${customer.id}/add`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Window/Door
              </Button>
            </Link>
            <Link href={`/estimate/${customer.id}`}>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Generate Estimate
              </Button>
            </Link>
            <Link href={`/contract/${customer.id}`}>
              <Button variant="outline">
                <FileCheck className="w-4 h-4 mr-2" />
                Generate Contract
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Customer Info Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Address:</span>{' '}
            {customer.address ? (
              <>
                {customer.address}, {customer.city}, {customer.state}{' '}
                {customer.zip}
              </>
            ) : (
              '—'
            )}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {customer.phone || '—'}
          </div>
          <div>
            <span className="font-medium">Email:</span> {customer.email || '—'}
          </div>
        </div>
      </div>

      {/* Windows/Doors Table */}
      <div className="bg-white rounded-lg shadow mb-6">
        <WindowsTable windows={customerWindows} customerId={customerId} />
      </div>

      {/* Pricing Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pricing Summary</h2>
        <div className="space-y-2 max-w-md ml-auto">
          <div className="flex justify-between text-lg">
            <span>List Price:</span>
            <span className="font-medium">${listPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg text-red-600">
            <span>
              Discount ({discountPercent.toFixed(0)}%):
            </span>
            <span className="font-medium">-${discountAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t pt-2">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 text-right">
            * Discount does not apply to doors/some select windows
            <br />* TAX NOT INCLUDED IN SUBTOTAL
          </p>
        </div>
      </div>
    </div>
  )
}
