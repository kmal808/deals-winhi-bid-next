'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, ToggleLeft, ToggleRight, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteGlassType, toggleGlassTypeStatus } from './actions'

type GlassType = {
  id: number
  name: string
  description: string | null
  factor: string
  imagePath: string | null
  active: boolean
  sortOrder: number
}

export function GlassTypesTable({ glassTypes }: { glassTypes: GlassType[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: number) => {
    if (deletingId === id) {
      startTransition(async () => {
        try {
          await deleteGlassType(id)
          toast.success('Glass type deleted successfully')
        } catch (error) {
          toast.error('Failed to delete glass type')
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
        await toggleGlassTypeStatus(id, !currentStatus)
        toast.success(`Glass type ${!currentStatus ? 'activated' : 'deactivated'}`)
      } catch (error) {
        toast.error('Failed to update glass type status')
      }
    })
  }

  if (glassTypes.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 mb-4">No glass types configured yet.</p>
        <Link href="/admin/glass-types/new">
          <Button>Add Your First Glass Type</Button>
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
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Factor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Sort Order
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
          {glassTypes.map((glassType) => (
            <tr key={glassType.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                {glassType.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                {glassType.description || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {parseFloat(glassType.factor).toFixed(2)}x
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {glassType.imagePath ? (
                  <Image className="w-4 h-4 text-green-600" />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {glassType.sortOrder}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleToggleStatus(glassType.id, glassType.active)}
                  disabled={isPending}
                  className="flex items-center gap-1"
                >
                  {glassType.active ? (
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
                  <Link href={`/admin/glass-types/${glassType.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(glassType.id)}
                    disabled={isPending}
                    title={
                      deletingId === glassType.id
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
