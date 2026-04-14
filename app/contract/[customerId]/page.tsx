import { auth } from '@/auth'
import { db } from '@/lib/db'
import { customers, windows } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect, notFound } from 'next/navigation'
import { ContractPDFViewer } from './pdf-viewer'

export default async function ContractPage({
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

  return (
    <div className="container mx-auto py-8">
      <ContractPDFViewer
        customer={customer}
        representative={customer.representative}
        windows={customerWindows}
      />
    </div>
  )
}
