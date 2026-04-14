import { GridSizeForm } from '../grid-size-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewGridSizePage() {
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
        <h1 className="text-3xl font-bold">Add Grid Size</h1>
        <p className="text-gray-600 mt-1">Create a new grid size configuration</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <GridSizeForm mode="create" />
      </div>
    </div>
  )
}
