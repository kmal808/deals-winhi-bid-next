'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { createCustomer, updateCustomer, type CustomerFormData } from './actions'

type CustomerFormProps = {
  customer?: {
    id: number
    name: string
    address: string | null
    city: string | null
    state: string | null
    zip: string | null
    email: string | null
    phone: string | null
    altPhone: string | null
    comments: string | null
    discountPercent: string | null
    downPaymentAmount: string | null
    estimateStartDate: string | null
    estimateEndDate: string | null
    noGrid: boolean | null
  }
  mode: 'create' | 'edit'
}

export function CustomerForm({ customer, mode }: CustomerFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<CustomerFormData>({
    name: customer?.name || '',
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || 'HI',
    zip: customer?.zip || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    altPhone: customer?.altPhone || '',
    comments: customer?.comments || '',
    discountPercent: customer?.discountPercent || '0',
    downPaymentAmount: customer?.downPaymentAmount || '',
    estimateStartDate: customer?.estimateStartDate || '',
    estimateEndDate: customer?.estimateEndDate || '',
    noGrid: customer?.noGrid || false,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createCustomer(formData)
          toast.success('Customer created successfully')
        } else {
          await updateCustomer(customer!.id, formData)
          toast.success('Customer updated successfully')
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

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
              placeholder="Customer name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="customer@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(808) 555-1234"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="altPhone">Alternate Phone</Label>
            <Input
              id="altPhone"
              name="altPhone"
              type="tel"
              value={formData.altPhone}
              onChange={handleChange}
              placeholder="(808) 555-5678"
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Address</h3>

          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Honolulu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="HI"
                maxLength={2}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              placeholder="96813"
            />
          </div>
        </div>

        {/* Contract Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contract Details</h3>

          <div className="space-y-2">
            <Label htmlFor="discountPercent">Discount (%)</Label>
            <Input
              id="discountPercent"
              name="discountPercent"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.discountPercent}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="downPaymentAmount">Down Payment ($)</Label>
            <Input
              id="downPaymentAmount"
              name="downPaymentAmount"
              type="number"
              step="0.01"
              min="0"
              value={formData.downPaymentAmount}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimateStartDate">Estimate Start Date</Label>
            <Input
              id="estimateStartDate"
              name="estimateStartDate"
              type="date"
              value={formData.estimateStartDate}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimateEndDate">Estimate End Date</Label>
            <Input
              id="estimateEndDate"
              name="estimateEndDate"
              type="date"
              value={formData.estimateEndDate}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="noGrid"
              checked={formData.noGrid}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, noGrid: checked as boolean }))
              }
            />
            <Label htmlFor="noGrid" className="cursor-pointer">
              No Grid
            </Label>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Notes</h3>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Add any additional notes about this customer..."
              rows={8}
            />
          </div>
        </div>
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
              ? 'Creating...'
              : 'Updating...'
            : mode === 'create'
              ? 'Create Customer'
              : 'Update Customer'}
        </Button>
      </div>
    </form>
  )
}
