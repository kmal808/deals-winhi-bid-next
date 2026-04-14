'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { createDisclaimer, updateDisclaimer, type DisclaimerFormData } from './actions'

type DisclaimerFormProps = {
  disclaimer?: {
    id: number
    description: string
    sortOrder: number | null
    includeByDefault: boolean | null
    active: boolean
  }
  mode: 'create' | 'edit'
}

export function DisclaimerForm({ disclaimer, mode }: DisclaimerFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<DisclaimerFormData>({
    description: disclaimer?.description || '',
    sortOrder: disclaimer?.sortOrder || 0,
    includeByDefault: disclaimer?.includeByDefault ?? true,
    active: disclaimer?.active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createDisclaimer(formData)
          toast.success('Disclaimer created successfully')
        } else {
          await updateDisclaimer(disclaimer!.id, formData)
          toast.success('Disclaimer updated successfully')
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
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Enter the disclaimer text that will appear on contracts..."
          />
          <p className="text-xs text-gray-500">
            The disclaimer text that will be displayed on customer contracts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Lower numbers appear first in the list
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeByDefault"
                checked={formData.includeByDefault}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, includeByDefault: checked as boolean }))
                }
              />
              <Label htmlFor="includeByDefault" className="cursor-pointer">
                Include by default on new contracts
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, active: checked as boolean }))
                }
              />
              <Label htmlFor="active" className="cursor-pointer">
                Active (available for use)
              </Label>
            </div>
          </div>
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
              ? 'Create Disclaimer'
              : 'Update Disclaimer'}
        </Button>
      </div>
    </form>
  )
}
