import { db } from '@/lib/db'
import { glassTypes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { GlassTypeForm } from '../../glass-type-form'

export default async function EditGlassTypePage({
  params,
}: {
  params: { id: string }
}) {
  const glassTypeId = parseInt(params.id)
  if (isNaN(glassTypeId)) {
    notFound()
  }

  const glassType = await db.query.glassTypes.findFirst({
    where: eq(glassTypes.id, glassTypeId),
  })

  if (!glassType) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/glass-types"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Glass Types
        </Link>
        <h1 className="text-3xl font-bold">Edit Glass Type</h1>
        <p className="text-gray-600 mt-1">Update {glassType.name}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <GlassTypeForm mode="edit" glassType={glassType} />
      </div>
    </div>
  )
}
