import { db } from '@/lib/db'
import { disclaimers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { DisclaimerForm } from '../../disclaimer-form'

export default async function EditDisclaimerPage({
  params,
}: {
  params: { id: string }
}) {
  const disclaimerId = parseInt(params.id)
  if (isNaN(disclaimerId)) {
    notFound()
  }

  const disclaimer = await db.query.disclaimers.findFirst({
    where: eq(disclaimers.id, disclaimerId),
  })

  if (!disclaimer) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/disclaimers"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Disclaimers
        </Link>
        <h1 className="text-3xl font-bold">Edit Disclaimer</h1>
        <p className="text-gray-600 mt-1">Update disclaimer text</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DisclaimerForm mode="edit" disclaimer={disclaimer} />
      </div>
    </div>
  )
}
