'use client'

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import { ContractPDF } from './contract-pdf'
import { Button } from '@/components/ui/button'
import { Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

type ContractPDFViewerProps = {
  customer: any
  representative: any
  windows: any[]
}

export function ContractPDFViewer({
  customer,
  representative,
  windows,
}: ContractPDFViewerProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const fileName = `contract-${customer.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <Link
            href={`/configurator/${customer.id}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Configurator
          </Link>
          <h1 className="text-3xl font-bold mt-2">Contract Preview</h1>
          <p className="text-gray-600 mt-1">{customer.name}</p>
        </div>
        <div>
          {isClient && (
            <PDFDownloadLink
              document={
                <ContractPDF
                  customer={customer}
                  representative={representative}
                  windows={windows}
                />
              }
              fileName={fileName}
            >
              {({ loading }) => (
                <Button disabled={loading}>
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? 'Generating...' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        {isClient ? (
          <PDFViewer width="100%" height="800px" className="border-0">
            <ContractPDF
              customer={customer}
              representative={representative}
              windows={windows}
            />
          </PDFViewer>
        ) : (
          <div className="flex items-center justify-center h-[800px] bg-gray-100 rounded">
            <p className="text-gray-500">Loading PDF preview...</p>
          </div>
        )}
      </div>
    </div>
  )
}
