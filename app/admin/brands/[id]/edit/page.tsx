import { db } from '@/lib/db'
import { brands } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { BrandForm } from '../../brand-form'

export default async function EditBrandPage({
  params,
}: {
  params: { id: string }
}) {
  const brandId = parseInt(params.id)
  if (isNaN(brandId)) {
    notFound()
  }

  const brand = await db.query.brands.findFirst({
    where: eq(brands.id, brandId),
  })

  if (!brand) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/brands"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Brands
        </Link>
        <h1 className="text-3xl font-bold">Edit Brand</h1>
        <p className="text-gray-600 mt-1">Update {brand.name}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <BrandForm mode="edit" brand={brand} />
      </div>
    </div>
  )
}
