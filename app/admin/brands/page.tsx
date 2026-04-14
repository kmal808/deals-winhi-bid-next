import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BrandsTable } from './brands-table'

export default async function BrandsPage() {
  const allBrands = await db.query.brands.findMany({
    orderBy: (brands, { asc }) => [asc(brands.sortOrder), asc(brands.name)],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>
          <p className="text-gray-600 mt-1">
            Manage window and door brand configurations
          </p>
        </div>
        <Link href="/admin/brands/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Brand
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <BrandsTable brands={allBrands} />
      </div>
    </div>
  )
}
