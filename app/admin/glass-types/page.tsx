import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassTypesTable } from './glass-types-table'

export default async function GlassTypesPage() {
  const allGlassTypes = await db.query.glassTypes.findMany({
    orderBy: (glassTypes, { asc }) => [asc(glassTypes.sortOrder), asc(glassTypes.name)],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Glass Types</h1>
          <p className="text-gray-600 mt-1">
            Manage window and door glass type configurations
          </p>
        </div>
        <Link href="/admin/glass-types/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Glass Type
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <GlassTypesTable glassTypes={allGlassTypes} />
      </div>
    </div>
  )
}
