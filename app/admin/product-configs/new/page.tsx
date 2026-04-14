import { ProductConfigForm } from '../product-config-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewProductConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/product-configs"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Product Configs
        </Link>
        <h1 className="text-3xl font-bold">Add Product Configuration</h1>
        <p className="text-gray-600 mt-1">Create a new product configuration</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ProductConfigForm mode="create" />
      </div>
    </div>
  )
}
