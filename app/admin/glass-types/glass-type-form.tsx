'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { createGlassType, updateGlassType, type GlassTypeFormData } from './actions'

type GlassTypeFormProps = {
  glassType?: {
    id: number
    name: string
    description: string | null
    factor: string
    imagePath: string | null
    active: boolean
    sortOrder: number
  }
  mode: 'create' | 'edit'
}

export function GlassTypeForm({ glassType, mode }: GlassTypeFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<GlassTypeFormData>({
    name: glassType?.name || '',
    description: glassType?.description || '',
    factor: glassType?.factor || '0.00',
    imagePath: glassType?.imagePath || '',
    active: glassType?.active ?? true,
    sortOrder: glassType?.sortOrder || 0,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createGlassType(formData)
          toast.success('Glass type created successfully')
        } else {
          await updateGlassType(glassType!.id, formData)
          toast.success('Glass type updated successfully')
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An error occurred')
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            Glass Type Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Clear, Obscure, Tempered"
          />
          <p className="text-xs text-gray-500">
            The display name for this glass type
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

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description of this glass type"
            rows={3}
          />
          <p className="text-xs text-gray-500">
            Additional details about this glass type
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imagePath">Image Path</Label>
          <Input
            id="imagePath"
            name="imagePath"
            value={formData.imagePath}
            onChange={handleChange}
            placeholder="/images/glass-types/clear.png"
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
              ? 'Create Glass Type'
              : 'Update Glass Type'}
        </Button>
      </div>
    </form>
  )
}
