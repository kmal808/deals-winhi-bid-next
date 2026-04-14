import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { CustomerForm } from '../customer-form'

export default async function NewCustomerPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link
          href="/customers"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Customers
        </Link>
        <h1 className="text-3xl font-bold">New Customer</h1>
        <p className="text-gray-600 mt-1">Create a new customer record</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <CustomerForm mode="create" />
      </div>
    </div>
  )
}
