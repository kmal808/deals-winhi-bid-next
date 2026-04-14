import { auth } from '@/auth'
import { db } from '@/lib/db'
import { customers, windows } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect, notFound } from 'next/navigation'
import { EstimatePDFViewer } from './pdf-viewer'

export default async function EstimatePage({
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
    with: {
      representative: true,
    },
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

  // Calculate valid through date (30 days from now)
  const validThruDate = new Date()
  validThruDate.setDate(validThruDate.getDate() + 30)
  const validThru = validThruDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  })

  return (
    <div className="container mx-auto py-8">
      <EstimatePDFViewer
        customer={customer}
        representative={customer.representative}
        windows={customerWindows}
        validThru={validThru}
      />
    </div>
  )
}
