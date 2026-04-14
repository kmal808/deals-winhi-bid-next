'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteGridSize, toggleGridSizeStatus } from './actions'

type GridSize = {
  id: number
  size: string
  active: boolean
  sortOrder: number
}

export function GridSizesTable({ gridSizes }: { gridSizes: GridSize[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: number) => {
    if (deletingId === id) {
      startTransition(async () => {
        try {
          await deleteGridSize(id)
          toast.success('Grid size deleted successfully')
        } catch (error) {
          toast.error('Failed to delete grid size')
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
        await toggleGridSizeStatus(id, !currentStatus)
        toast.success(`Grid size ${!currentStatus ? 'activated' : 'deactivated'}`)
      } catch (error) {
        toast.error('Failed to update grid size status')
      }
    })
  }

  if (gridSizes.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 mb-4">No grid sizes configured yet.</p>
        <Link href="/admin/grid-sizes/new">
          <Button>Add Your First Grid Size</Button>
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
              Size
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
          {gridSizes.map((gridSize) => (
            <tr key={gridSize.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                {gridSize.size}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {gridSize.sortOrder}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleToggleStatus(gridSize.id, gridSize.active)}
                  disabled={isPending}
                  className="flex items-center gap-1"
                >
                  {gridSize.active ? (
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
                  <Link href={`/admin/grid-sizes/${gridSize.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(gridSize.id)}
                    disabled={isPending}
                    title={
                      deletingId === gridSize.id
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
