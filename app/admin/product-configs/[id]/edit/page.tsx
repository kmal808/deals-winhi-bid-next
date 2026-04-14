import { db } from '@/lib/db'
import { productConfigs } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ProductConfigForm } from '../../product-config-form'

export default async function EditProductConfigPage({
  params,
}: {
  params: { id: string }
}) {
  const configId = parseInt(params.id)
  if (isNaN(configId)) {
    notFound()
  }

  const productConfig = await db.query.productConfigs.findFirst({
    where: eq(productConfigs.id, configId),
  })

  if (!productConfig) {
    notFound()
  }

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
        <h1 className="text-3xl font-bold">Edit Product Configuration</h1>
        <p className="text-gray-600 mt-1">Update {productConfig.name}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ProductConfigForm mode="edit" productConfig={productConfig} />
      </div>
    </div>
  )
}
