'use client'

import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Window = {
  id: number
  location: string
  width: string
  height: string
  lowE: boolean | null
  isDoor: boolean | null
  calculatedPrice: string | null
  manualPrice: string | null
  applyCustomDiscount: boolean | null
  customDiscountPercent: string | null
  specialInstructions: string | null
  brand: { id: number; name: string } | null
  productConfig: { id: number; name: string; imagePath: string } | null
  frameType: { id: number; name: string } | null
  frameColor: { id: number; name: string } | null
  glassType: { id: number; name: string } | null
  gridStyle: { id: number; name: string } | null
  gridSize: { id: number; size: string } | null
}

export function WindowsTable({
  windows,
  customerId,
}: {
  windows: Window[]
  customerId: number
}) {
  if (windows.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 mb-4">
          No windows or doors configured yet.
        </p>
        <Link href={`/configurator/${customerId}/add`}>
          <Button>Add Your First Window/Door</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Location</th>
            <th className="px-3 py-2 text-left font-semibold">Brand</th>
            <th className="px-3 py-2 text-left font-semibold">Config</th>
            <th className="px-3 py-2 text-left font-semibold">Picture</th>
            <th className="px-3 py-2 text-left font-semibold">Frame Type</th>
            <th className="px-3 py-2 text-left font-semibold">Width</th>
            <th className="px-3 py-2 text-left font-semibold">Height</th>
            <th className="px-3 py-2 text-left font-semibold">Frame Color</th>
            <th className="px-3 py-2 text-center font-semibold">Low E²</th>
            <th className="px-3 py-2 text-left font-semibold">Glass</th>
            <th className="px-3 py-2 text-left font-semibold">Grid Style</th>
            <th className="px-3 py-2 text-right font-semibold">List Price</th>
            <th className="px-3 py-2 text-right font-semibold">Price</th>
            <th className="px-3 py-2 text-left font-semibold">
              Special Instructions
            </th>
            <th className="px-3 py-2 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {windows.map((window, index) => {
            const listPrice = window.calculatedPrice
              ? parseFloat(window.calculatedPrice)
              : 0
            const finalPrice = window.manualPrice
              ? parseFloat(window.manualPrice)
              : listPrice

            return (
              <tr
                key={window.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-3 py-2 font-medium">{window.location}</td>
                <td className="px-3 py-2">{window.brand?.name || '—'}</td>
                <td className="px-3 py-2">
                  {window.productConfig?.name || '—'}
                </td>
                <td className="px-3 py-2">
                  {window.productConfig?.imagePath ? (
                    <img
                      src={window.productConfig.imagePath}
                      alt={window.productConfig.name}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-3 py-2">{window.frameType?.name || '—'}</td>
                <td className="px-3 py-2">{window.width}"</td>
                <td className="px-3 py-2">{window.height}"</td>
                <td className="px-3 py-2">{window.frameColor?.name || '—'}</td>
                <td className="px-3 py-2 text-center">
                  {window.lowE ? 'Y' : ''}
                </td>
                <td className="px-3 py-2">{window.glassType?.name || '—'}</td>
                <td className="px-3 py-2">
                  {window.gridStyle?.name || '—'}
                  {window.gridSize && ` (${window.gridSize.size})`}
                </td>
                <td className="px-3 py-2 text-right">
                  ${listPrice.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-right font-medium">
                  ${finalPrice.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-xs text-gray-600">
                  {window.specialInstructions || ''}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1 justify-center">
                    <Link href={`/configurator/${customerId}/edit/${window.id}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="w-3 h-3" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
