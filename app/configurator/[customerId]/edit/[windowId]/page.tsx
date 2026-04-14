import { auth } from '@/auth'
import { db } from '@/lib/db'
import { customers, windows } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { WindowForm } from '../../window-form'

export default async function EditWindowPage({
  params,
}: {
  params: { customerId: string; windowId: string }
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const customerId = parseInt(params.customerId)
  const windowId = parseInt(params.windowId)

  if (isNaN(customerId) || isNaN(windowId)) {
    notFound()
  }

  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, customerId),
  })

  if (!customer) {
    notFound()
  }

  const window = await db.query.windows.findFirst({
    where: eq(windows.id, windowId),
  })

  if (!window || window.customerId !== customerId) {
    notFound()
  }

  // Fetch all configuration options
  const [brands, productConfigs, frameTypes, frameColors, glassTypes, gridStyles, gridSizes] =
    await Promise.all([
      db.query.brands.findMany({
        where: (brands, { eq }) => eq(brands.active, true),
        orderBy: (brands, { asc }) => [asc(brands.sortOrder), asc(brands.name)],
      }),
      db.query.productConfigs.findMany({
        where: (productConfigs, { eq }) => eq(productConfigs.active, true),
        orderBy: (productConfigs, { asc }) => [
          asc(productConfigs.sortOrder),
          asc(productConfigs.name),
        ],
      }),
      db.query.frameTypes.findMany({
        where: (frameTypes, { eq }) => eq(frameTypes.active, true),
        orderBy: (frameTypes, { asc }) => [
          asc(frameTypes.sortOrder),
          asc(frameTypes.name),
        ],
      }),
      db.query.frameColors.findMany({
        where: (frameColors, { eq }) => eq(frameColors.active, true),
        orderBy: (frameColors, { asc }) => [
          asc(frameColors.sortOrder),
          asc(frameColors.name),
        ],
      }),
      db.query.glassTypes.findMany({
        where: (glassTypes, { eq }) => eq(glassTypes.active, true),
        orderBy: (glassTypes, { asc }) => [
          asc(glassTypes.sortOrder),
          asc(glassTypes.name),
        ],
      }),
      db.query.gridStyles.findMany({
        where: (gridStyles, { eq }) => eq(gridStyles.active, true),
        orderBy: (gridStyles, { asc }) => [
          asc(gridStyles.sortOrder),
          asc(gridStyles.name),
        ],
      }),
      db.query.gridSizes.findMany({
        where: (gridSizes, { eq }) => eq(gridSizes.active, true),
        orderBy: (gridSizes, { asc }) => [asc(gridSizes.sortOrder)],
      }),
    ])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link
          href={`/configurator/${customerId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Configurator
        </Link>
        <h1 className="text-3xl font-bold">Edit Window/Door</h1>
        <p className="text-gray-600 mt-1">
          Update configuration for {customer.name}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <WindowForm
          mode="edit"
          customerId={customerId}
          window={window}
          brands={brands}
          productConfigs={productConfigs}
          frameTypes={frameTypes}
          frameColors={frameColors}
          glassTypes={glassTypes}
          gridStyles={gridStyles}
          gridSizes={gridSizes}
        />
      </div>
    </div>
  )
}
