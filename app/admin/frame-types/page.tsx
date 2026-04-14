import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FrameTypesTable } from './frame-types-table'

export default async function FrameTypesPage() {
  const allFrameTypes = await db.query.frameTypes.findMany({
    orderBy: (frameTypes, { asc }) => [asc(frameTypes.sortOrder), asc(frameTypes.name)],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Frame Types</h1>
          <p className="text-gray-600 mt-1">
            Manage window and door frame type configurations
          </p>
        </div>
        <Link href="/admin/frame-types/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Frame Type
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <FrameTypesTable frameTypes={allFrameTypes} />
      </div>
    </div>
  )
}
