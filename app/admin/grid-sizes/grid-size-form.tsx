'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { createGridSize, updateGridSize, type GridSizeFormData } from './actions'

type GridSizeFormProps = {
  gridSize?: {
    id: number
    size: string
    active: boolean
    sortOrder: number
  }
  mode: 'create' | 'edit'
}

export function GridSizeForm({ gridSize, mode }: GridSizeFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<GridSizeFormData>({
    size: gridSize?.size || '',
    active: gridSize?.active ?? true,
    sortOrder: gridSize?.sortOrder || 0,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createGridSize(formData)
          toast.success('Grid size created successfully')
        } else {
          await updateGridSize(gridSize!.id, formData)
          toast.success('Grid size updated successfully')
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An error occurred')
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="size">
            Grid Size <span className="text-red-500">*</span>
          </Label>
          <Input
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
            placeholder="e.g., 5/8, 3/4, 1 inch"
          />
          <p className="text-xs text-gray-500">
            The size specification for this grid (e.g., dimensions or type)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={handleChange}
            placeholder="0"
          />
          <p className="text-xs text-gray-500">
            Lower numbers appear first in dropdown lists
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <Checkbox
            id="active"
            checked={formData.active}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, active: checked as boolean }))
            }
          />
          <Label htmlFor="active" className="cursor-pointer">
            Active (shown in configuration forms)
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? mode === 'create'
              ? 'Creating...'
              : 'Updating...'
            : mode === 'create'
              ? 'Create Grid Size'
              : 'Update Grid Size'}
        </Button>
      </div>
    </form>
  )
}
