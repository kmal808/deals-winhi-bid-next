import { db } from '@/lib/db'
import { gridStyles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { GridStyleForm } from '../../grid-style-form'

export default async function EditGridStylePage({
  params,
}: {
  params: { id: string }
}) {
  const gridStyleId = parseInt(params.id)
  if (isNaN(gridStyleId)) {
    notFound()
  }

  const gridStyle = await db.query.gridStyles.findFirst({
    where: eq(gridStyles.id, gridStyleId),
  })

  if (!gridStyle) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/grid-styles"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Grid Styles
        </Link>
        <h1 className="text-3xl font-bold">Edit Grid Style</h1>
        <p className="text-gray-600 mt-1">Update {gridStyle.name}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <GridStyleForm mode="edit" gridStyle={gridStyle} />
      </div>
    </div>
  )
}
