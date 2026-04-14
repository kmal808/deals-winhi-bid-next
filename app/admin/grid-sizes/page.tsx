import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GridSizesTable } from './grid-sizes-table'

export default async function GridSizesPage() {
  const allGridSizes = await db.query.gridSizes.findMany({
    orderBy: (gridSizes, { asc }) => [asc(gridSizes.sortOrder), asc(gridSizes.size)],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Grid Sizes</h1>
          <p className="text-gray-600 mt-1">
            Manage window grid size configurations
          </p>
        </div>
        <Link href="/admin/grid-sizes/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Grid Size
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <GridSizesTable gridSizes={allGridSizes} />
      </div>
    </div>
  )
}
