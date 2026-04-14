'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createProductConfig, updateProductConfig, type ProductConfigFormData } from './actions'

type ProductConfigFormProps = {
  productConfig?: {
    id: number
    name: string
    category: 'window' | 'door'
    operationType: string | null
    liteCount: number | null
    description: string | null
    imagePath: string
    svgTemplate: string | null
    active: boolean
    sortOrder: number | null
  }
  mode: 'create' | 'edit'
}

export function ProductConfigForm({ productConfig, mode }: ProductConfigFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<ProductConfigFormData>({
    name: productConfig?.name || '',
    category: productConfig?.category || 'window',
    operationType: productConfig?.operationType || '',
    liteCount: productConfig?.liteCount || 1,
    description: productConfig?.description || '',
    imagePath: productConfig?.imagePath || '',
    svgTemplate: productConfig?.svgTemplate || '',
    active: productConfig?.active ?? true,
    sortOrder: productConfig?.sortOrder || 0,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createProductConfig(formData)
          toast.success('Product config created successfully')
        } else {
          await updateProductConfig(productConfig!.id, formData)
          toast.success('Product config updated successfully')
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
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Single Hung, Slider"
          />
          <p className="text-xs text-gray-500">
            The display name for this product configuration
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value: 'window' | 'door') =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="window">Window</SelectItem>
              <SelectItem value="door">Door</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Whether this is a window or door product
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="operationType">Operation Type</Label>
          <Input
            id="operationType"
            name="operationType"
            value={formData.operationType}
            onChange={handleChange}
            placeholder="e.g., XO, OX, XOX, SH, DH"
          />
          <p className="text-xs text-gray-500">
            The operation type code (e.g., XO, OX, XOX, SH, DH)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="liteCount">Lite Count</Label>
          <Input
            id="liteCount"
            name="liteCount"
            type="number"
            min="1"
            value={formData.liteCount}
            onChange={handleChange}
            placeholder="1"
          />
          <p className="text-xs text-gray-500">
            Number of glass lites (default: 1)
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Detailed description of this product configuration"
          />
          <p className="text-xs text-gray-500">
            Optional description for internal reference
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="imagePath">
            Image Path <span className="text-red-500">*</span>
          </Label>
          <Input
            id="imagePath"
            name="imagePath"
            value={formData.imagePath}
            onChange={handleChange}
            required
            placeholder="/images/products/window-single-hung.png"
          />
          <p className="text-xs text-gray-500">
            Path to the product image (relative or absolute URL)
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

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="svgTemplate">SVG Template (Optional)</Label>
          <Textarea
            id="svgTemplate"
            name="svgTemplate"
            value={formData.svgTemplate}
            onChange={handleChange}
            rows={4}
            placeholder="<svg>...</svg>"
          />
          <p className="text-xs text-gray-500">
            Optional SVG template for dynamic rendering
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
              ? 'Create Product Config'
              : 'Update Product Config'}
        </Button>
      </div>
    </form>
  )
}
