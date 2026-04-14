import { FrameTypeForm } from '../frame-type-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewFrameTypePage() {
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
        <h1 className="text-3xl font-bold">Add Frame Type</h1>
        <p className="text-gray-600 mt-1">Create a new frame type configuration</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <FrameTypeForm mode="create" />
      </div>
    </div>
  )
}
