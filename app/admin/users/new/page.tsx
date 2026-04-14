import { UserForm } from '../user-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewUserPage() {
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
        <h1 className="text-3xl font-bold">Add User</h1>
        <p className="text-gray-600 mt-1">Create a new user or representative</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <UserForm mode="create" />
      </div>
    </div>
  )
}
