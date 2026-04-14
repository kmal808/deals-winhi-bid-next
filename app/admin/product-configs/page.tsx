import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductConfigsTable } from './product-configs-table'

export default async function ProductConfigsPage() {
  const allProductConfigs = await db.query.productConfigs.findMany({
    orderBy: (productConfigs, { asc }) => [asc(productConfigs.sortOrder), asc(productConfigs.name)],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Configurations</h1>
          <p className="text-gray-600 mt-1">
            Manage window and door product types and configurations
          </p>
        </div>
        <Link href="/admin/product-configs/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product Config
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <ProductConfigsTable productConfigs={allProductConfigs} />
      </div>
    </div>
  )
}
