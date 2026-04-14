'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteFrameColor, toggleFrameColorStatus } from './actions'

type FrameColor = {
  id: number
  name: string
  hexColor: string | null
  factor: string
  active: boolean
  sortOrder: number
}

export function FrameColorsTable({ frameColors }: { frameColors: FrameColor[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: number) => {
    if (deletingId === id) {
      startTransition(async () => {
        try {
          await deleteFrameColor(id)
          toast.success('Frame color deleted successfully')
        } catch (error) {
          toast.error('Failed to delete frame color')
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
        await toggleFrameColorStatus(id, !currentStatus)
        toast.success(`Frame color ${!currentStatus ? 'activated' : 'deactivated'}`)
      } catch (error) {
        toast.error('Failed to update frame color status')
      }
    })
  }

  if (frameColors.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 mb-4">No frame colors configured yet.</p>
        <Link href="/admin/frame-colors/new">
          <Button>Add Your First Frame Color</Button>
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
              Color
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Factor
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
          {frameColors.map((frameColor) => (
            <tr key={frameColor.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: frameColor.hexColor || '#cccccc' }}
                    title={frameColor.hexColor || 'No color set'}
                  />
                  <span className="text-xs text-gray-500">
                    {frameColor.hexColor || '-'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                {frameColor.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {parseFloat(frameColor.factor).toFixed(2)}x
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {frameColor.sortOrder}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleToggleStatus(frameColor.id, frameColor.active)}
                  disabled={isPending}
                  className="flex items-center gap-1"
                >
                  {frameColor.active ? (
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
                  <Link href={`/admin/frame-colors/${frameColor.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(frameColor.id)}
                    disabled={isPending}
                    title={
                      deletingId === frameColor.id
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
