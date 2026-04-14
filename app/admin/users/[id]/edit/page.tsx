import { db } from '@/lib/db'
import { representatives } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { UserForm } from '../../user-form'

export default async function EditUserPage({
  params,
}: {
  params: { id: string }
}) {
  const userId = parseInt(params.id)
  if (isNaN(userId)) {
    notFound()
  }

  const user = await db.query.representatives.findFirst({
    where: eq(representatives.id, userId),
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Users
        </Link>
        <h1 className="text-3xl font-bold">Edit User</h1>
        <p className="text-gray-600 mt-1">Update {user.name}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <UserForm mode="edit" user={user} />
      </div>
    </div>
  )
}
