'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createUser, updateUser, type UserFormData } from './actions'

type UserFormProps = {
  user?: {
    id: number
    name: string
    username: string
    email: string | null
    phone: string | null
    role: 'admin' | 'representative'
    active: boolean
  }
  mode: 'create' | 'edit'
}

export function UserForm({ user, mode }: UserFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState<UserFormData>({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'representative',
    active: user?.active ?? true,
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate password for create mode
    if (mode === 'create' && !formData.password) {
      toast.error('Password is required')
      return
    }

    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createUser(formData)
          toast.success('User created successfully')
        } else {
          await updateUser(user!.id, formData)
          toast.success('User updated successfully')
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'An error occurred')
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., John Doe"
          />
          <p className="text-xs text-gray-500">
            The full name of the user
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">
            Username <span className="text-red-500">*</span>
          </Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="e.g., johndoe"
          />
          <p className="text-xs text-gray-500">
            Unique username for login (lowercase, no spaces)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
          <p className="text-xs text-gray-500">
            Optional email address
          </p>
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
          <p className="text-xs text-gray-500">
            Optional phone number
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Password {mode === 'create' && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={mode === 'create'}
            placeholder={mode === 'edit' ? 'Leave blank to keep current password' : 'Enter password'}
          />
          <p className="text-xs text-gray-500">
            {mode === 'edit'
              ? 'Leave blank to keep the current password'
              : 'Minimum 6 characters recommended'}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">
            Role <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.role}
            onValueChange={(value: 'admin' | 'representative') =>
              setFormData((prev) => ({ ...prev, role: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="representative">Representative</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Admin has full access, Representative has limited access
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
            Active (can log in to the system)
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
              ? 'Create User'
              : 'Update User'}
        </Button>
      </div>
    </form>
  )
}
