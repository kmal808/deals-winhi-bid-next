import { db } from '@/lib/db'
import { gridSizes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { GridSizeForm } from '../../grid-size-form'

export default async function EditGridSizePage({
  params,
}: {
  params: { id: string }
}) {
  const gridSizeId = parseInt(params.id)
  if (isNaN(gridSizeId)) {
    notFound()
  }

  const gridSize = await db.query.gridSizes.findFirst({
    where: eq(gridSizes.id, gridSizeId),
  })

  if (!gridSize) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/grid-sizes"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Grid Sizes
        </Link>
        <h1 className="text-3xl font-bold">Edit Grid Size</h1>
        <p className="text-gray-600 mt-1">Update {gridSize.size}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <GridSizeForm mode="edit" gridSize={gridSize} />
      </div>
    </div>
  )
}
