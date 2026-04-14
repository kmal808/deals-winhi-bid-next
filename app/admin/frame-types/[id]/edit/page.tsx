import { db } from '@/lib/db'
import { frameTypes } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { FrameTypeForm } from '../../frame-type-form'

export default async function EditFrameTypePage({
  params,
}: {
  params: { id: string }
}) {
  const frameTypeId = parseInt(params.id)
  if (isNaN(frameTypeId)) {
    notFound()
  }

  const frameType = await db.query.frameTypes.findFirst({
    where: eq(frameTypes.id, frameTypeId),
  })

  if (!frameType) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/frame-types"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Frame Types
        </Link>
        <h1 className="text-3xl font-bold">Edit Frame Type</h1>
        <p className="text-gray-600 mt-1">Update {frameType.name}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <FrameTypeForm mode="edit" frameType={frameType} />
      </div>
    </div>
  )
}
