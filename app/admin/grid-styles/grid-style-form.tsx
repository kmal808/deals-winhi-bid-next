'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { createGridStyle, updateGridStyle, type GridStyleFormData } from './actions'

type GridStyleFormProps = {
  gridStyle?: {
    id: number
    name: string
    factor: string
    imagePath: string | null
    active: boolean
    sortOrder: number
  }
  mode: 'create' | 'edit'
}

export function GridStyleForm({ gridStyle, mode }: GridStyleFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<GridStyleFormData>({
    name: gridStyle?.name || '',
    factor: gridStyle?.factor || '0.00',
    imagePath: gridStyle?.imagePath || '',
    active: gridStyle?.active ?? true,
    sortOrder: gridStyle?.sortOrder || 0,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createGridStyle(formData)
          toast.success('Grid style created successfully')
        } else {
          await updateGridStyle(gridStyle!.id, formData)
          toast.success('Grid style updated successfully')
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
          <Label htmlFor="name">
            Grid Style Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Colonial, Prairie, Diamond"
          />
          <p className="text-xs text-gray-500">
            The display name for this grid style
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="factor">
            Price Factor <span className="text-red-500">*</span>
          </Label>
          <Input
            id="factor"
            name="factor"
            type="number"
            step="0.01"
            min="0"
            value={formData.factor}
            onChange={handleChange}
            required
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500">
            Multiplier for pricing (1.00 = no change, 1.25 = 25% increase)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imagePath">Image Path</Label>
          <Input
            id="imagePath"
            name="imagePath"
            value={formData.imagePath}
            onChange={handleChange}
            placeholder="/images/grid-styles/colonial.png"
          />
          <p className="text-xs text-gray-500">
            Optional path to image file for visual reference
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
              ? 'Create Grid Style'
              : 'Update Grid Style'}
        </Button>
      </div>
    </form>
  )
}
