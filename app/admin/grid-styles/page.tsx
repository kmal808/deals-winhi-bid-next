import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GridStylesTable } from './grid-styles-table'

export default async function GridStylesPage() {
  const allGridStyles = await db.query.gridStyles.findMany({
    orderBy: (gridStyles, { asc }) => [asc(gridStyles.sortOrder), asc(gridStyles.name)],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Grid Styles</h1>
          <p className="text-gray-600 mt-1">
            Manage window grid style configurations
          </p>
        </div>
        <Link href="/admin/grid-styles/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Grid Style
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <GridStylesTable gridStyles={allGridStyles} />
      </div>
    </div>
  )
}
