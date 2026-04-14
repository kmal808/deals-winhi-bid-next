'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 15,
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
    marginBottom: 10,
  },
  customerInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 2,
    fontSize: 8,
  },
  infoLabel: {
    width: 50,
    fontWeight: 'bold',
  },
  table: {
    marginTop: 8,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2F855A',
    color: 'white',
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 3,
    fontSize: 7,
  },
  col1: { width: '14%' },
  col2: { width: '9%' },
  col3: { width: '9%' },
  col4: { width: '11%' },
  col5: { width: '8%' },
  col6: { width: '7%' },
  col7: { width: '9%' },
  col8: { width: '6%' },
  col9: { width: '11%' },
  col10: { width: '10%' },
  col11: { width: '6%' },
  signatureLine: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
  },
  signatureText: {
    fontSize: 9,
    marginBottom: 15,
  },
  signatureUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 4,
  },
  termsPage: {
    padding: 30,
    fontSize: 8,
  },
  termsHeader: {
    backgroundColor: '#2F855A',
    color: 'white',
    padding: 4,
    marginBottom: 8,
    fontSize: 9,
    fontWeight: 'bold',
  },
  termRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 10,
  },
  termText: {
    flex: 1,
    lineHeight: 1.4,
  },
  initialBox: {
    width: 60,
    height: 15,
    borderWidth: 1,
    borderColor: '#DC2626',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialBoxText: {
    color: '#DC2626',
    fontSize: 8,
  },
  pricingTable: {
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#000',
  },
  pricingRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    padding: 4,
  },
  pricingLabel: {
    flex: 1,
    fontSize: 9,
  },
  pricingValue: {
    width: 100,
    textAlign: 'right',
    fontSize: 9,
    fontWeight: 'bold',
  },
  legalText: {
    fontSize: 7,
    lineHeight: 1.5,
    marginBottom: 8,
  },
  legalHeading: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 8,
  },
})

type ContractPDFProps = {
  customer: any
  representative: any
  windows: any[]
}

export function ContractPDF({
  customer,
  representative,
  windows,
}: ContractPDFProps) {
  const listPrice = windows.reduce((sum, window) => {
    const price = window.calculatedPrice ? parseFloat(window.calculatedPrice) : 0
    return sum + price
  }, 0)

  const discountPercent = customer.discountPercent
    ? parseFloat(customer.discountPercent)
    : 0
  const discountAmount = (listPrice * discountPercent) / 100
  const subtotal = listPrice - discountAmount
  const salesTax = subtotal * 0.0472 // Hawaii GET 4.72%
  const cashTotal = subtotal + salesTax
  const downPayment = cashTotal * 0.5 // 50% down
  const balanceDue = cashTotal - downPayment

  const todayDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  })

  return (
    <Document>
      {/* Page 1: Agreement Spec Sheet */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Windows Hawaii</Text>
          <Text style={styles.subtitle}>A DIVISION OF NORTHWEST EXTERIORS</Text>
          <Text style={styles.licenseNumber}>General Cont. Lic # C30910</Text>
          <Text
            style={{
              ...styles.title,
              fontSize: 14,
              color: '#2F855A',
              marginTop: 8,
            }}
          >
            Agreement
          </Text>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>Name: {customer.name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text>{customer.address || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>City:</Text>
            <Text>{customer.city || ''}</Text>
            <Text style={{ marginLeft: 10 }}>State:</Text>
            <Text style={{ marginLeft: 5 }}>{customer.state || 'HI'}</Text>
            <Text style={{ marginLeft: 10 }}>Zip:</Text>
            <Text style={{ marginLeft: 5 }}>{customer.zip || ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text>{customer.phone || ''}</Text>
            <Text style={{ marginLeft: 10 }}>Alt:</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text>{customer.email || ''}</Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 9,
            fontWeight: 'bold',
            backgroundColor: '#2F855A',
            color: 'white',
            padding: 3,
            marginBottom: 2,
          }}
        >
          Specification
        </Text>

        <View style={styles.table}>
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
            <Text style={styles.col11}>Special Instr.</Text>
          </View>

          {windows.map((window, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.col1}>{window.location}</Text>
              <Text style={styles.col2}>{window.brand?.name || ''}</Text>
              <Text style={styles.col3}>{window.productConfig?.name || ''}</Text>
              <Text style={styles.col4}>{window.frameType?.name || ''}</Text>
              <Text style={styles.col5}>{window.width}"</Text>
              <Text style={styles.col6}>{window.height}"</Text>
              <Text style={styles.col7}>{window.frameColor?.name || ''}</Text>
              <Text style={styles.col8}>{window.lowE ? 'Y' : ''}</Text>
              <Text style={styles.col9}>{window.glassType?.name || ''}</Text>
              <Text style={styles.col10}>{window.gridStyle?.name || ''}</Text>
              <Text style={styles.col11}>
                {window.specialInstructions || ''}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.signatureLine}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>Customer's Signature:</Text>
            <View style={styles.signatureUnderline} />
            <Text style={{ fontSize: 8 }}>Date: {todayDate}</Text>
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        } />
      </Page>

      {/* Page 2: Terms and Pricing */}
      <Page size="A4" style={styles.termsPage}>
        <View style={styles.header}>
          <Text style={styles.title}>Windows Hawaii</Text>
          <Text style={styles.subtitle}>A DIVISION OF NORTHWEST EXTERIORS</Text>
          <Text style={styles.licenseNumber}>General Cont. Lic # C30910</Text>
          <Text
            style={{
              ...styles.title,
              fontSize: 14,
              color: '#2F855A',
              marginTop: 8,
            }}
          >
            Agreement
          </Text>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>Name: {customer.name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text>{customer.address || ''}</Text>
          </View>
        </View>

        <View style={styles.termsHeader}>
          <Text>Specification</Text>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termText}>
            Material to be used will closely match existing / if wood is used, it
            will be paint ready primed lumber - NO PAINT - Recommend customer to
            paint within 7 to 30 days of installation
          </Text>
          <View style={styles.initialBox}>
            <Text style={styles.initialBoxText}>Initials</Text>
          </View>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termText}>
            All discounts available have been applied {discountPercent.toFixed(0)}%
            off Friends and Family Discount
          </Text>
          <View style={styles.initialBox}>
            <Text style={styles.initialBoxText}>Initials</Text>
          </View>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termText}>
            Arrival/ Installation will be approximately 28 to 32 weeks from SPEC.
            All debris will be removed @ time of job completion
          </Text>
          <View style={styles.initialBox}>
            <Text style={styles.initialBoxText}>Initials</Text>
          </View>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termText}>
            20% of contracted amount for ORDER CANCELLATION fee will be assessed
            after final SPEC's completed
          </Text>
          <View style={styles.initialBox}>
            <Text style={styles.initialBoxText}>Initials</Text>
          </View>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termText}>
            DOUBLE LIFETIME WARRANTY, screen frame, hardware, accidental glass
            breakage and any condensation in IGU.
          </Text>
          <View style={styles.initialBox}>
            <Text style={styles.initialBoxText}>Initials</Text>
          </View>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termText}>
            WINDOW SCREENS warranty limited to 2 years starting at installation
            date. After 2 years customer can bring to shop FOR REPAIR @ NO CHARGE.
          </Text>
          <View style={styles.initialBox}>
            <Text style={styles.initialBoxText}>Initials</Text>
          </View>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termText}>
            If found, DRY ROT 'n WATER DAMAGE WILL BE ADDRESSED @ time o'
            INSTALLATION additional charges will be assessed through a Change Order
            @ that time.
          </Text>
          <View style={styles.initialBox}>
            <Text style={styles.initialBoxText}>Initials</Text>
          </View>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termText}>
            Any additional work other than stated on this contract, will be
            addressed separately and additional charges may apply.
          </Text>
          <View style={styles.initialBox}>
            <Text style={styles.initialBoxText}>Initials</Text>
          </View>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termText}>
            ALL configurations are LOOKING from the OUTSIDE LEFT to RIGHT X= sash
            that moves O= sash that is stationary ALL CONFIGURATIONS HAVE BEEN
            VERIFIED BY OWNER
          </Text>
          <View style={styles.initialBox}>
            <Text style={styles.initialBoxText}>Initials</Text>
          </View>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termText}>
            Customer is responsible to remove/replace blinds, curtains and/or
            shutters / these may not fit back as they were after windows
            installation
          </Text>
          <View style={styles.initialBox}>
            <Text style={styles.initialBoxText}>Initials</Text>
          </View>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termText}>
            50% initial investment @ signing / balance @ time of job completion
          </Text>
          <View style={styles.initialBox}>
            <Text style={styles.initialBoxText}>Initials</Text>
          </View>
        </View>

        <View style={styles.pricingTable}>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Subtotal</Text>
            <Text style={styles.pricingValue}>${listPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Discount</Text>
            <Text style={styles.pricingValue}>
              -${discountAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Sales Tax</Text>
            <Text style={styles.pricingValue}>${salesTax.toFixed(2)}</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Cash Total</Text>
            <Text style={styles.pricingValue}>${cashTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Down Payment</Text>
            <Text style={styles.pricingValue}>${downPayment.toFixed(2)}</Text>
          </View>
          <View style={{ ...styles.pricingRow, borderBottomWidth: 0 }}>
            <Text style={styles.pricingLabel}>Balance Due on Completion</Text>
            <Text style={styles.pricingValue}>${balanceDue.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ marginTop: 15 }}>
          <View style={styles.signatureLine}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureText}>Customer's Signature:</Text>
              <View style={styles.signatureUnderline} />
              <Text style={{ fontSize: 8 }}>Date: {todayDate}</Text>
            </View>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureText}>Submitted By:</Text>
              <View style={styles.signatureUnderline} />
              <Text style={{ fontSize: 8 }}>Date: {todayDate}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        } />
      </Page>

      {/* Page 3: Customer Information Sheet */}
      <Page size="A4" style={styles.termsPage}>
        <View style={styles.header}>
          <Text style={styles.title}>Windows Hawaii</Text>
          <Text style={styles.licenseNumber}>General Cont. Lic # C30910</Text>
          <Text
            style={{
              ...styles.title,
              fontSize: 12,
              color: '#2F855A',
              marginTop: 8,
            }}
          >
            Customer Information Sheet
          </Text>
        </View>

        <Text style={styles.legalText}>
          Windows Hawaii uses various mainland manufacturers. These products are
          custom made for your home and once manufactured, cannot be re-used or
          re-sold.
        </Text>

        <Text style={styles.legalText}>
          Once your contract and sales information has been received by our
          production department we immediately begin the ordering process, and an
          appointment will be set to do a final measurement by our production
          supervisor. At this inspection, we may advise changes if we see fit to
          enhance your project. If changes are needed, these will be explained to
          you and meet with your agreement. Once the inspection is complete your
          order will be finalized. Manufacturing and shipping typically takes 22 to
          24 weeks.
        </Text>

        <Text style={styles.legalText}>
          The installers will need access to the areas of your home where the work
          is to be completed. Window and door installers require access on both the
          interior and exterior. Please accommodate them by clearing away furniture
          or any other items that may block access, a minimum of 3 feet from walls,
          windows, and/or doors.
        </Text>

        <Text style={styles.legalText}>
          When the installation is complete, we will provide you with the written
          manufacturers warranty as well as the Windows Hawaii installation
          warranty, and a brief survey to evaluate your job, your satisfaction with
          your new products, and with your installation crews. Your final payment
          for new products and services will be due once the installation is
          complete.
        </Text>

        <Text style={styles.legalText}>
          In addition, if our installers find dry rot, termite, or other damage,
          that could not be seen at the time of the sale, they will point this out
          to you and estimate the time and materials needed to repair the damage.
          These costs will be in addition to your contracted price.
        </Text>

        <Text style={{ ...styles.legalText, fontWeight: 'bold', marginTop: 15 }}>
          CHAPTER 672E OF THE HAWAII REVISED STATUTES CONTAINS IMPORTANT
          REQUIREMENTS YOU MUST FOLLOW BEFORE YOU MAY FILE A LAWSUIT OR OTHER
          ACTION FOR DEFECTIVE CONSTRUCTION AGAINST THE CONTRACTOR WHO DESIGNED,
          REPAIRED, OR CONSTRUCTED YOUR HOME OR FACILITY.
        </Text>

        <Text style={{ ...styles.legalText, fontWeight: 'bold' }}>
          YOU, THE BUYER, MAY CANCEL THIS TRANSACTION AT ANY TIME PRIOR TO
          MIDNIGHT OF THE THIRD BUSINESS DAY AFTER THE DATE OF THIS TRANSACTION.
          SEE THE ATTACHED NOTICE OF CANCELLATION FORM FOR AN EXPLANATION OF THIS
          RIGHT.
        </Text>

        <Text style={{ ...styles.legalText, marginTop: 15 }}>
          Our goal is for you to be completely satisfied with your new windows and
          their installation, to the point that you refer your friends and family
          to us.
        </Text>

        <View style={{ ...styles.signatureLine, marginTop: 30 }}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>
              I understand and agree with the explanation above:
            </Text>
            <View style={styles.signatureUnderline} />
            <Text style={{ fontSize: 8 }}>
              Customer's Signature                                   Date: {todayDate}
            </Text>
          </View>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        } />
      </Page>
    </Document>
  )
}
