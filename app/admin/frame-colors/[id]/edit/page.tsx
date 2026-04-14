import { db } from '@/lib/db'
import { frameColors } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { FrameColorForm } from '../../frame-color-form'

export default async function EditFrameColorPage({
  params,
}: {
  params: { id: string }
}) {
  const frameColorId = parseInt(params.id)
  if (isNaN(frameColorId)) {
    notFound()
  }

  const frameColor = await db.query.frameColors.findFirst({
    where: eq(frameColors.id, frameColorId),
  })

  if (!frameColor) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/frame-colors"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Frame Colors
        </Link>
        <h1 className="text-3xl font-bold">Edit Frame Color</h1>
        <p className="text-gray-600 mt-1">Update {frameColor.name}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <FrameColorForm mode="edit" frameColor={frameColor} />
      </div>
    </div>
  )
}
