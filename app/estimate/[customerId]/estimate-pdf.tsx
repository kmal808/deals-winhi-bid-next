'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// Register fonts if needed
// Font.register({ family: 'Arial', src: '/fonts/Arial.ttf' })

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: '#2F855A',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 2,
  },
  licenseNumber: {
    fontSize: 9,
    textAlign: 'center',
    color: '#2F855A',
    marginBottom: 15,
  },
  customerInfo: {
    marginBottom: 15,
  },
  customerName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  infoLabel: {
    width: 60,
    fontWeight: 'bold',
  },
  infoValue: {
    flex: 1,
  },
  table: {
    marginTop: 10,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2F855A',
    color: 'white',
    padding: 4,
    fontSize: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 4,
    fontSize: 8,
  },
  tableRowAlt: {
    backgroundColor: '#F9FAFB',
  },
  col1: { width: '12%' },
  col2: { width: '8%' },
  col3: { width: '8%' },
  col4: { width: '10%' },
  col5: { width: '8%' },
  col6: { width: '6%' },
  col7: { width: '8%' },
  col8: { width: '5%' },
  col9: { width: '10%' },
  col10: { width: '10%' },
  col11: { width: '15%' },
  pricingSummary: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
    width: 300,
  },
  pricingLabel: {
    fontSize: 11,
    marginRight: 20,
    textAlign: 'right',
    flex: 1,
  },
  pricingValue: {
    fontSize: 11,
    fontWeight: 'bold',
    width: 100,
    textAlign: 'right',
  },
  discount: {
    color: '#DC2626',
  },
  footer: {
    marginTop: 20,
    fontSize: 8,
    color: '#6B7280',
  },
  footerNote: {
    marginBottom: 2,
  },
  validThru: {
    marginTop: 10,
    textAlign: 'right',
    fontSize: 10,
  },
  repInfo: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 9,
  },
})

type EstimatePDFProps = {
  customer: {
    name: string
    address: string | null
    city: string | null
    state: string | null
    zip: string | null
    phone: string | null
    email: string | null
    discountPercent: string | null
  }
  representative: {
    name: string
    phone: string | null
  }
  windows: Array<{
    location: string
    brand: { name: string } | null
    productConfig: { name: string } | null
    frameType: { name: string } | null
    width: string
    height: string
    frameColor: { name: string } | null
    lowE: boolean | null
    glassType: { name: string } | null
    gridStyle: { name: string } | null
    calculatedPrice: string | null
    manualPrice: string | null
    specialInstructions: string | null
  }>
  validThru: string
}

export function EstimatePDF({
  customer,
  representative,
  windows,
  validThru,
}: EstimatePDFProps) {
  const listPrice = windows.reduce((sum, window) => {
    const price = window.calculatedPrice ? parseFloat(window.calculatedPrice) : 0
    return sum + price
  }, 0)

  const discountPercent = customer.discountPercent
    ? parseFloat(customer.discountPercent)
    : 0
  const discountAmount = (listPrice * discountPercent) / 100
  const subtotal = listPrice - discountAmount

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Windows Hawaii</Text>
          <Text style={styles.subtitle}>A DIVISION OF NORTHWEST EXTERIORS</Text>
          <Text style={styles.licenseNumber}>General Cont. Lic # C30910</Text>
          <Text
            style={{
              ...styles.title,
              fontSize: 14,
              color: '#2F855A',
              marginTop: 10,
            }}
          >
            Estimate
          </Text>
        </View>

        {/* Customer Info */}
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>Name: {customer.name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{customer.address || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>City:</Text>
            <Text style={styles.infoValue}>{customer.city || ''}</Text>
            <Text style={{ ...styles.infoLabel, width: 40 }}>State:</Text>
            <Text style={{ ...styles.infoValue, width: 30 }}>
              {customer.state || 'HI'}
            </Text>
            <Text style={{ ...styles.infoLabel, width: 30 }}>Zip:</Text>
            <Text style={styles.infoValue}>{customer.zip || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{customer.phone || ''}</Text>
            <Text style={{ ...styles.infoLabel, marginLeft: 20 }}>Alt:</Text>
            <Text style={styles.infoValue}></Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{customer.email || ''}</Text>
          </View>
        </View>

        {/* Specification Header */}
        <Text
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            backgroundColor: '#2F855A',
            color: 'white',
            padding: 4,
            marginBottom: 2,
          }}
        >
          Specification
        </Text>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Location</Text>
            <Text style={styles.col2}>Brand</Text>
            <Text style={styles.col3}>Config</Text>
            <Text style={styles.col4}>Frame Type</Text>
            <Text style={styles.col5}>Width</Text>
            <Text style={styles.col6}>Height</Text>
            <Text style={styles.col7}>Frame Color</Text>
            <Text style={styles.col8}>Low E²</Text>
            <Text style={styles.col9}>Glass</Text>
            <Text style={styles.col10}>Grid Style</Text>
            <Text style={styles.col11}>List Price / Price</Text>
          </View>

          {/* Table Rows */}
          {windows.map((window, index) => {
            const price = window.manualPrice
              ? parseFloat(window.manualPrice)
              : window.calculatedPrice
                ? parseFloat(window.calculatedPrice)
                : 0
            const discount = (price * discountPercent) / 100
            const finalPrice = price - discount

            return (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 1 && styles.tableRowAlt,
                ]}
              >
                <Text style={styles.col1}>{window.location}</Text>
                <Text style={styles.col2}>{window.brand?.name || ''}</Text>
                <Text style={styles.col3}>
                  {window.productConfig?.name || ''}
                </Text>
                <Text style={styles.col4}>{window.frameType?.name || ''}</Text>
                <Text style={styles.col5}>{window.width}"</Text>
                <Text style={styles.col6}>{window.height}"</Text>
                <Text style={styles.col7}>
                  {window.frameColor?.name || ''}
                </Text>
                <Text style={styles.col8}>{window.lowE ? '1' : ''}</Text>
                <Text style={styles.col9}>{window.glassType?.name || ''}</Text>
                <Text style={styles.col10}>
                  {window.gridStyle?.name || ''}
                </Text>
                <Text style={styles.col11}>
                  ${price.toFixed(2)}{'\n'}
                  <Text style={styles.discount}>
                    -${discount.toFixed(2)}
                  </Text>{' '}
                  ${finalPrice.toFixed(2)}
                </Text>
              </View>
            )
          })}
        </View>

        {/* Pricing Summary */}
        <View style={styles.pricingSummary}>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>List Price:</Text>
            <Text style={styles.pricingValue}>${listPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={{ ...styles.pricingLabel, ...styles.discount }}>
              Discount: ${discountAmount.toFixed(2)} ({discountPercent.toFixed(0)}
              %) *
            </Text>
            <Text style={styles.pricingValue}></Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={{ ...styles.pricingLabel, fontWeight: 'bold' }}>
              Subtotal:
            </Text>
            <Text style={{ ...styles.pricingValue, fontWeight: 'bold' }}>
              ${subtotal.toFixed(2)} *
            </Text>
          </View>
          <View style={styles.validThru}>
            <Text>Estimate Valid Thru:</Text>
            <Text style={{ fontWeight: 'bold', marginTop: 2 }}>{validThru}</Text>
          </View>
        </View>

        {/* Footer Notes */}
        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            * Discount does not apply to doors/some select windows
          </Text>
          <Text style={styles.footerNote}>
            * TAX NOT INCLUDED IN SUBTOTAL
          </Text>
        </View>

        {/* Representative Info */}
        <View style={styles.repInfo}>
          <Text>
            Representative: {representative.name} Phone: {representative.phone || ''}
          </Text>
        </View>

        {/* Page Number */}
        <Text
          style={{
            position: 'absolute',
            bottom: 20,
            right: 30,
            fontSize: 8,
          }}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>
    </Document>
  )
}
