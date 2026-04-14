import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UsersTable } from './users-table'

export default async function UsersPage() {
  const allUsers = await db.query.representatives.findMany({
    orderBy: (representatives, { asc }) => [asc(representatives.name)],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users & Representatives</h1>
          <p className="text-gray-600 mt-1">
            Manage system users and sales representatives
          </p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <UsersTable users={allUsers} />
      </div>
    </div>
  )
}
