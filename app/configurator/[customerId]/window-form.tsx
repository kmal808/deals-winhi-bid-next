'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createWindow, updateWindow, type WindowFormData } from '../actions'

type WindowFormProps = {
  mode: 'create' | 'edit'
  customerId: number
  window?: any
  brands: Array<{ id: number; name: string; factor: string }>
  productConfigs: Array<{ id: number; name: string; imagePath: string }>
  frameTypes: Array<{ id: number; name: string; factor: string }>
  frameColors: Array<{ id: number; name: string; factor: string }>
  glassTypes: Array<{ id: number; name: string; factor: string }>
  gridStyles: Array<{ id: number; name: string; factor: string }>
  gridSizes: Array<{ id: number; size: string }>
}

export function WindowForm({
  mode,
  customerId,
  window: existingWindow,
  brands,
  productConfigs,
  frameTypes,
  frameColors,
  glassTypes,
  gridStyles,
  gridSizes,
}: WindowFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<WindowFormData>({
    location: existingWindow?.location || '',
    brandId: existingWindow?.brandId || undefined,
    productConfigId: existingWindow?.productConfigId || undefined,
    frameTypeId: existingWindow?.frameTypeId || undefined,
    frameColorId: existingWindow?.frameColorId || undefined,
    glassTypeId: existingWindow?.glassTypeId || undefined,
    gridStyleId: existingWindow?.gridStyleId || undefined,
    gridSizeId: existingWindow?.gridSizeId || undefined,
    width: existingWindow?.width || '',
    height: existingWindow?.height || '',
    lowE: existingWindow?.lowE || true,
    isDoor: existingWindow?.isDoor || false,
    calculatedPrice: existingWindow?.calculatedPrice || '',
    manualPrice: existingWindow?.manualPrice || '',
    applyCustomDiscount: existingWindow?.applyCustomDiscount || false,
    customDiscountPercent: existingWindow?.customDiscountPercent || '0',
    specialInstructions: existingWindow?.specialInstructions || '',
  })

  // Calculate price based on selections
  const calculatePrice = () => {
    if (!formData.width || !formData.height) return 0

    const width = parseFloat(formData.width)
    const height = parseFloat(formData.height)
    const sqft = (width * height) / 144 // Convert square inches to square feet

    let basePrice = 100 // Base price per sqft
    let totalFactor = 1.0

    // Apply brand factor
    if (formData.brandId) {
      const brand = brands.find((b) => b.id === formData.brandId)
      if (brand) {
        totalFactor *= parseFloat(brand.factor)
      }
    }

    // Apply frame type factor
    if (formData.frameTypeId) {
      const frameType = frameTypes.find((f) => f.id === formData.frameTypeId)
      if (frameType) {
        totalFactor *= 1 + parseFloat(frameType.factor)
      }
    }

    // Apply frame color factor
    if (formData.frameColorId) {
      const frameColor = frameColors.find((f) => f.id === formData.frameColorId)
      if (frameColor) {
        totalFactor *= 1 + parseFloat(frameColor.factor)
      }
    }

    // Apply glass type factor
    if (formData.glassTypeId) {
      const glassType = glassTypes.find((g) => g.id === formData.glassTypeId)
      if (glassType) {
        totalFactor *= 1 + parseFloat(glassType.factor)
      }
    }

    // Apply grid style factor
    if (formData.gridStyleId) {
      const gridStyle = gridStyles.find((g) => g.id === formData.gridStyleId)
      if (gridStyle) {
        totalFactor *= 1 + parseFloat(gridStyle.factor)
      }
    }

    // Apply Low-E multiplier
    if (formData.lowE) {
      totalFactor *= 1.15
    }

    return sqft * basePrice * totalFactor
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Calculate and set price before submission
    const calculatedPrice = calculatePrice().toFixed(2)
    const dataToSubmit = {
      ...formData,
      calculatedPrice,
    }

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createWindow(customerId, dataToSubmit)
          toast.success('Window/Door added successfully')
        } else {
          await updateWindow(customerId, existingWindow!.id, dataToSubmit)
          toast.success('Window/Door updated successfully')
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An error occurred')
      }
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const estimatedPrice = calculatePrice()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g., LIVING ROOM, KITCHEN"
          />
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label htmlFor="brandId">Brand</Label>
          <Select
            value={formData.brandId?.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, brandId: parseInt(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product Config */}
        <div className="space-y-2">
          <Label htmlFor="productConfigId">Configuration</Label>
          <Select
            value={formData.productConfigId?.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                productConfigId: parseInt(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select config (XO, XOX, etc.)" />
            </SelectTrigger>
            <SelectContent>
              {productConfigs.map((config) => (
                <SelectItem key={config.id} value={config.id.toString()}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Frame Type */}
        <div className="space-y-2">
          <Label htmlFor="frameTypeId">Frame Type</Label>
          <Select
            value={formData.frameTypeId?.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, frameTypeId: parseInt(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frame type" />
            </SelectTrigger>
            <SelectContent>
              {frameTypes.map((frameType) => (
                <SelectItem key={frameType.id} value={frameType.id.toString()}>
                  {frameType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Width */}
        <div className="space-y-2">
          <Label htmlFor="width">
            Width (inches) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="width"
            name="width"
            type="number"
            step="0.125"
            value={formData.width}
            onChange={handleChange}
            required
            placeholder="72"
          />
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height">
            Height (inches) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="height"
            name="height"
            type="number"
            step="0.125"
            value={formData.height}
            onChange={handleChange}
            required
            placeholder="36"
          />
        </div>

        {/* Frame Color */}
        <div className="space-y-2">
          <Label htmlFor="frameColorId">Frame Color</Label>
          <Select
            value={formData.frameColorId?.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                frameColorId: parseInt(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {frameColors.map((color) => (
                <SelectItem key={color.id} value={color.id.toString()}>
                  {color.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Glass Type */}
        <div className="space-y-2">
          <Label htmlFor="glassTypeId">Glass Type</Label>
          <Select
            value={formData.glassTypeId?.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, glassTypeId: parseInt(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select glass type" />
            </SelectTrigger>
            <SelectContent>
              {glassTypes.map((glassType) => (
                <SelectItem key={glassType.id} value={glassType.id.toString()}>
                  {glassType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid Style */}
        <div className="space-y-2">
          <Label htmlFor="gridStyleId">Grid Style</Label>
          <Select
            value={formData.gridStyleId?.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                gridStyleId: parseInt(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grid style" />
            </SelectTrigger>
            <SelectContent>
              {gridStyles.map((gridStyle) => (
                <SelectItem key={gridStyle.id} value={gridStyle.id.toString()}>
                  {gridStyle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid Size */}
        {formData.gridStyleId && (
          <div className="space-y-2">
            <Label htmlFor="gridSizeId">Grid Size</Label>
            <Select
              value={formData.gridSizeId?.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  gridSizeId: parseInt(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grid size" />
              </SelectTrigger>
              <SelectContent>
                {gridSizes.map((gridSize) => (
                  <SelectItem key={gridSize.id} value={gridSize.id.toString()}>
                    {gridSize.size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Low-E Checkbox */}
        <div className="flex items-center space-x-2 pt-8">
          <Checkbox
            id="lowE"
            checked={formData.lowE}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, lowE: checked as boolean }))
            }
          />
          <Label htmlFor="lowE" className="cursor-pointer">
            Low-E² Glass
          </Label>
        </div>

        {/* Is Door Checkbox */}
        <div className="flex items-center space-x-2 pt-8">
          <Checkbox
            id="isDoor"
            checked={formData.isDoor}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isDoor: checked as boolean }))
            }
          />
          <Label htmlFor="isDoor" className="cursor-pointer">
            This is a Door
          </Label>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Calculated Price</Label>
            <div className="text-2xl font-bold text-green-600">
              ${estimatedPrice.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">
              Based on dimensions and selected options
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manualPrice">Manual Price Override</Label>
            <Input
              id="manualPrice"
              name="manualPrice"
              type="number"
              step="0.01"
              value={formData.manualPrice}
              onChange={handleChange}
              placeholder="Leave empty to use calculated"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="applyCustomDiscount"
                checked={formData.applyCustomDiscount}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    applyCustomDiscount: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="applyCustomDiscount" className="cursor-pointer">
                Custom Discount
              </Label>
            </div>
            {formData.applyCustomDiscount && (
              <Input
                id="customDiscountPercent"
                name="customDiscountPercent"
                type="number"
                step="0.01"
                value={formData.customDiscountPercent}
                onChange={handleChange}
                placeholder="0.00"
              />
            )}
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="space-y-2">
        <Label htmlFor="specialInstructions">Special Instructions</Label>
        <Textarea
          id="specialInstructions"
          name="specialInstructions"
          value={formData.specialInstructions}
          onChange={handleChange}
          placeholder="Any special notes or requirements..."
          rows={3}
        />
      </div>

      {/* Form Actions */}
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
              ? 'Adding...'
              : 'Updating...'
            : mode === 'create'
              ? 'Add Window/Door'
              : 'Update Window/Door'}
        </Button>
      </div>
    </form>
  )
}
