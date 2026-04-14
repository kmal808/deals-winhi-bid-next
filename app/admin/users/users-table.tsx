'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteUser, toggleUserStatus } from './actions'

type User = {
  id: number
  name: string
  username: string
  email: string | null
  phone: string | null
  role: 'admin' | 'representative'
  active: boolean
  createdAt: Date | null
}

export function UsersTable({ users }: { users: User[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: number) => {
    if (deletingId === id) {
      startTransition(async () => {
        try {
          await deleteUser(id)
          toast.success('User deleted successfully')
        } catch (error) {
          toast.error('Failed to delete user')
        }
      })
    } else {
      setDeletingId(id)
      setTimeout(() => setDeletingId(null), 3000)
    }
  }

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleUserStatus(id, !currentStatus)
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`)
      } catch (error) {
        toast.error('Failed to update user status')
      }
    })
  }

  if (users.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 mb-4">No users configured yet.</p>
        <Link href="/admin/users/new">
          <Button>Add Your First User</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {user.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {user.email || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {user.phone || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleToggleStatus(user.id, user.active)}
                  disabled={isPending}
                  className="flex items-center gap-1"
                >
                  {user.active ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-600">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">Inactive</span>
                    </>
                  )}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div className="flex gap-2 justify-end">
                  <Link href={`/admin/users/${user.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(user.id)}
                    disabled={isPending}
                    title={
                      deletingId === user.id
                        ? 'Click again to confirm'
                        : 'Delete'
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
