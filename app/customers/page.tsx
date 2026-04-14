import { auth } from '@/auth'
import { db } from '@/lib/db'
import { customers } from '@/db/schema'
import { desc, or, ilike } from 'drizzle-orm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignOutButton } from './sign-out-button'
import { CustomerSearch } from './customer-search'
import { Suspense } from 'react'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const session = await auth()
  const searchQuery = searchParams.q

  // Build the query with search filter
  let allCustomers
  if (searchQuery) {
    allCustomers = await db
      .select()
      .from(customers)
      .where(
        or(
          ilike(customers.name, `%${searchQuery}%`),
          ilike(customers.email, `%${searchQuery}%`),
          ilike(customers.phone, `%${searchQuery}%`),
          ilike(customers.address, `%${searchQuery}%`),
          ilike(customers.city, `%${searchQuery}%`)
        )
      )
      .orderBy(desc(customers.createdAt))
  } else {
    allCustomers = await db.select().from(customers).orderBy(desc(customers.createdAt))
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {session?.user?.name}!
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/customers/new">
              <Button>New Customer</Button>
            </Link>
            {session?.user?.role === 'admin' && (
              <Link href="/admin">
                <Button variant="outline">Admin Panel</Button>
              </Link>
            )}
            <SignOutButton />
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 items-center">
          <Suspense fallback={<div className="h-10 flex-1 max-w-md bg-gray-100 rounded animate-pulse" />}>
            <CustomerSearch />
          </Suspense>
          {searchQuery && (
            <p className="text-sm text-gray-600">
              Found {allCustomers.length} customer{allCustomers.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery
                      ? `No customers found matching "${searchQuery}"`
                      : 'No customers yet. Create your first customer to get started.'}
                  </td>
                </tr>
              ) : (
                allCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {customer.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/configurator/${customer.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Configure
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
