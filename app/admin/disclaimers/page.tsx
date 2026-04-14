import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DisclaimersTable } from './disclaimers-table'

export default async function DisclaimersPage() {
  const allDisclaimers = await db.query.disclaimers.findMany({
    orderBy: (disclaimers, { asc }) => [asc(disclaimers.sortOrder)],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Disclaimers</h1>
          <p className="text-gray-600 mt-1">
            Manage contract disclaimer templates
          </p>
        </div>
        <Link href="/admin/disclaimers/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Disclaimer
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DisclaimersTable disclaimers={allDisclaimers} />
      </div>
    </div>
  )
}
