import { BrandForm } from '../brand-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewBrandPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/brands"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Brands
        </Link>
        <h1 className="text-3xl font-bold">Add Brand</h1>
        <p className="text-gray-600 mt-1">Create a new brand configuration</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <BrandForm mode="create" />
      </div>
    </div>
  )
}
