import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FrameColorsTable } from './frame-colors-table'

export default async function FrameColorsPage() {
  const allFrameColors = await db.query.frameColors.findMany({
    orderBy: (frameColors, { asc }) => [asc(frameColors.sortOrder), asc(frameColors.name)],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Frame Colors</h1>
          <p className="text-gray-600 mt-1">
            Manage window and door frame color configurations
          </p>
        </div>
        <Link href="/admin/frame-colors/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Frame Color
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <FrameColorsTable frameColors={allFrameColors} />
      </div>
    </div>
  )
}
