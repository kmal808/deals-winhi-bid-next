import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, Users, Package, Settings, LogOut } from 'lucide-react'
import { SignOutButton } from '../customers/sign-out-button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Only admins can access admin panel
  if (session.user.role !== 'admin') {
    redirect('/customers')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/customers" className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span className="font-semibold text-lg">Windows Hawaii</span>
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/customers"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Customers
                </Link>
                <Link
                  href="/admin"
                  className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Panel
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session.user.name} ({session.user.role})
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                Settings
              </h2>
              <nav className="space-y-1">
                <Link
                  href="/admin"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Overview
                </Link>
                <Link
                  href="/admin/brands"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Package className="w-4 h-4 mr-3" />
                  Brands
                </Link>
                <Link
                  href="/admin/frame-types"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Package className="w-4 h-4 mr-3" />
                  Frame Types
                </Link>
                <Link
                  href="/admin/frame-colors"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Package className="w-4 h-4 mr-3" />
                  Frame Colors
                </Link>
                <Link
                  href="/admin/glass-types"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Package className="w-4 h-4 mr-3" />
                  Glass Types
                </Link>
                <Link
                  href="/admin/grid-styles"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Package className="w-4 h-4 mr-3" />
                  Grid Styles
                </Link>
                <Link
                  href="/admin/grid-sizes"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Package className="w-4 h-4 mr-3" />
                  Grid Sizes
                </Link>
                <Link
                  href="/admin/product-configs"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Package className="w-4 h-4 mr-3" />
                  Product Configs
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Users className="w-4 h-4 mr-3" />
                  Users
                </Link>
                <Link
                  href="/admin/disclaimers"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <Package className="w-4 h-4 mr-3" />
                  Disclaimers
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
