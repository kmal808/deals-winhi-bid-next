'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, ToggleLeft, ToggleRight, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteGridStyle, toggleGridStyleStatus } from './actions'

type GridStyle = {
  id: number
  name: string
  factor: string
  imagePath: string | null
  active: boolean
  sortOrder: number
}

export function GridStylesTable({ gridStyles }: { gridStyles: GridStyle[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: number) => {
    if (deletingId === id) {
      startTransition(async () => {
        try {
          await deleteGridStyle(id)
          toast.success('Grid style deleted successfully')
        } catch (error) {
          toast.error('Failed to delete grid style')
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
        await toggleGridStyleStatus(id, !currentStatus)
        toast.success(`Grid style ${!currentStatus ? 'activated' : 'deactivated'}`)
      } catch (error) {
        toast.error('Failed to update grid style status')
      }
    })
  }

  if (gridStyles.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 mb-4">No grid styles configured yet.</p>
        <Link href="/admin/grid-styles/new">
          <Button>Add Your First Grid Style</Button>
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
          {gridStyles.map((gridStyle) => (
            <tr key={gridStyle.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                {gridStyle.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {parseFloat(gridStyle.factor).toFixed(2)}x
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {gridStyle.imagePath ? (
                  <Image className="w-4 h-4 text-green-600" />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {gridStyle.sortOrder}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleToggleStatus(gridStyle.id, gridStyle.active)}
                  disabled={isPending}
                  className="flex items-center gap-1"
                >
                  {gridStyle.active ? (
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
                  <Link href={`/admin/grid-styles/${gridStyle.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(gridStyle.id)}
                    disabled={isPending}
                    title={
                      deletingId === gridStyle.id
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
