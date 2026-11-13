const STORAGE_RECEIPTS_KEY = 'aura_saved_receipts'

/**
 * Calculates comprehensive itemized and summary totals for items currently in the bag.
 * @param {Array} bagItems - List of items in the user's shopping bag
 */
export function calculateOrderSummary(bagItems = []) {
  const rentalItems = bagItems.filter((i) => i.mode === 'rent')
  const buyItems = bagItems.filter((i) => i.mode === 'buy')

  // Monthly recurring rental sum
  const monthlyRentalTotal = rentalItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )

  // Direct purchase sum
  const buySubtotal = buyItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )

  // Rental security deposit: flat ₹2,500 per rental piece (100% refundable upon return or applied to buyout)
  const totalRentalPieces = rentalItems.reduce((acc, i) => acc + i.quantity, 0)
  const refundableDeposit = totalRentalPieces > 0 ? totalRentalPieces * 2500 : 0

  // 80% Buyout Equity Accrual projection over selected tenures
  const totalEquityAccrued = rentalItems.reduce((acc, item) => {
    const months = item.tenureMonths || 3
    const monthlySum = item.unitPrice * item.quantity
    return acc + Math.round(monthlySum * months * 0.8)
  }, 0)

  // Subtotal for immediate checkout
  const subtotalToday = monthlyRentalTotal + buySubtotal

  // Taxes: 18% GST on service & furniture goods
  const gstAmount = Math.round(subtotalToday * 0.18)

  // Delivery & In-Home Assembly: Complimentary for architectural clients
  const deliveryFee = 0

  // Grand Total Due Today in Indian Rupees
  const grandTotalDueToday = subtotalToday + gstAmount + refundableDeposit + deliveryFee

  return {
    totalItemsCount: bagItems.reduce((acc, i) => acc + i.quantity, 0),
    rentalCount: totalRentalPieces,
    buyCount: buyItems.reduce((acc, i) => acc + i.quantity, 0),
    monthlyRentalTotal,
    buySubtotal,
    refundableDeposit,
    totalEquityAccrued,
    gstAmount,
    deliveryFee,
    subtotalToday,
    grandTotalDueToday
  }
}

/**
 * Simulates secure payment processing across Indian payment gateways (UPI, Cards, NetBanking),
 * supporting distinct payment methods for both Rental Subscriptions and Spot Buyouts.
 * @param {Object} paymentData
 */
export function processPayment(paymentData) {
  const {
    method = 'upi',
    upiId,
    cardNumber,
    bankName,
    rentalPaymentMethod = 'UPI AutoPay Mandate (Monthly Dues)',
    buyoutPaymentMethod = 'Instant Spot Buyout Settlement',
    hasRental = false,
    hasBuyout = false
  } = paymentData

  // Basic format validations
  if (method === 'upi' && upiId && !upiId.includes('@')) {
    return {
      success: false,
      error: 'Please enter a valid UPI ID (e.g., username@okhdfcbank or phone@upi).'
    }
  }

  if (method === 'card' && cardNumber) {
    const cleanNum = cardNumber.replace(/\s+/g, '')
    if (cleanNum.length < 12) {
      return {
        success: false,
        error: 'Please enter a valid card number.'
      }
    }
  }

  // Generate unique banking & transaction reference codes
  const randomSuffix = Math.floor(100000 + Math.random() * 900000)
  const txnId = `TXN-AURA-${Date.now().toString().slice(-6)}-${randomSuffix}`
  const bankRefNo = `RBI-${Math.floor(1000000000 + Math.random() * 9000000000)}`

  // Format distinct payment protocol
  let methodDescription = ''
  if (hasRental && hasBuyout) {
    methodDescription = `Hybrid Protocol: [Rental: ${rentalPaymentMethod}] + [Spot Buyout: ${buyoutPaymentMethod}] via ${method.toUpperCase()}`
  } else if (hasRental) {
    methodDescription = `Rental Mandate: ${rentalPaymentMethod} (${method === 'upi' ? upiId || 'UPI AutoPay' : 'Card e-NACH Auto-Debit'})`
  } else {
    methodDescription = `Spot Buyout Settlement: ${buyoutPaymentMethod} (${method === 'upi' ? upiId || 'Instant UPI' : method === 'card' ? `Card ending in ${cardNumber ? cardNumber.slice(-4) : '4242'}` : bankName || 'Net Banking'})`
  }

  return {
    success: true,
    transactionId: txnId,
    bankReferenceNumber: bankRefNo,
    timestamp: new Date().toISOString(),
    status: 'AUTHORIZED_AND_CAPTURED',
    paymentMethod: methodDescription,
    rentalPaymentMethod,
    buyoutPaymentMethod
  }
}

/**
 * Generates an official Tax Invoice & Rental Agreement receipt linked to bag items and transaction.
 * @param {Object} payload
 */
export function generateReceipt({
  bagItems = [],
  customerInfo = {},
  paymentResult = {},
  orderSummary = {}
}) {
  const timestamp = new Date()
  const invoiceNumber = `INV-AURA-${timestamp.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata'
  }).format(timestamp)

  const lineItems = bagItems.map((entry, idx) => {
    const isRent = entry.mode === 'rent'
    const lineSubtotal = isRent
      ? entry.unitPrice * entry.quantity
      : entry.unitPrice * entry.quantity

    const equityCreditAccrued = isRent
      ? Math.round(lineSubtotal * (entry.tenureMonths || 3) * 0.8)
      : null

    return {
      lineNumber: idx + 1,
      id: entry.item.id,
      name: entry.item.name,
      space: entry.item.space,
      category: entry.item.category,
      finish: entry.selectedFinish?.name || 'Standard Finish',
      image: entry.selectedFinish?.image || entry.item.image,
      mode: entry.mode,
      tenureMonths: entry.tenureMonths || (isRent ? 3 : null),
      quantity: entry.quantity,
      unitPrice: entry.unitPrice,
      subtotal: lineSubtotal,
      equityCreditAccrued
    }
  })

  const receipt = {
    invoiceNumber,
    timestamp: timestamp.toISOString(),
    formattedDate,
    customer: {
      name: customerInfo.name || 'Valued Architectural Client',
      email: customerInfo.email || 'client@studio.com',
      phone: customerInfo.phone || '+91 98765 43210',
      address: customerInfo.address || 'Bengaluru, Karnataka 560001',
      gstin: customerInfo.gstin || '29AABCA1234D1Z5'
    },
    payment: {
      transactionId: paymentResult.transactionId || `TXN-AURA-${Date.now()}`,
      bankReference: paymentResult.bankReferenceNumber || 'RBI-VERIFIED',
      method: paymentResult.paymentMethod || 'UPI Instant Verification',
      status: 'PAID & CONFIRMED',
      currency: 'INR (₹)'
    },
    items: lineItems,
    summary: {
      monthlyRentalTotal: orderSummary.monthlyRentalTotal || 0,
      buySubtotal: orderSummary.buySubtotal || 0,
      refundableDeposit: orderSummary.refundableDeposit || 0,
      totalEquityAccrued: orderSummary.totalEquityAccrued || 0,
      gstAmount: orderSummary.gstAmount || 0,
      deliveryFee: 0,
      totalPaidToday: orderSummary.grandTotalDueToday || 0
    },
    rentalEquityTerms: {
      equityAccrualRate: '80% of cumulative rental payments',
      buyoutGuarantee: 'Applies at any point during or at the end of the rental agreement tenure.',
      trialPeriod: '30-Day Aesthetic Trial with complimentary pickup or swaps.'
    }
  }

  // Save receipt in localStorage
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_RECEIPTS_KEY) || '[]')
    existing.unshift(receipt)
    localStorage.setItem(STORAGE_RECEIPTS_KEY, JSON.stringify(existing.slice(0, 20)))
  } catch {
    // ignore
  }

  return receipt
}

/**
 * Retrieves all saved receipts from localStorage.
 */
export function getSavedReceipts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_RECEIPTS_KEY) || '[]')
  } catch {
    return []
  }
}

/**
 * Downloads a plaintext copy of the official receipt invoice.
 * @param {Object} receipt
 */
export function downloadReceiptAsText(receipt) {
  const content = `
================================================================================
                    AURA — HOME & OFFICE ARCHITECTURE
                  OFFICIAL TAX INVOICE & RENTAL RECEIPT
================================================================================
Invoice No:    ${receipt.invoiceNumber}
Date & Time:   ${receipt.formattedDate}
Payment Status: ${receipt.payment.status}
Txn Ref ID:    ${receipt.payment.transactionId}
Bank Ref:      ${receipt.payment.bankReference}
Payment Mode:  ${receipt.payment.method}

--------------------------------------------------------------------------------
CUSTOMER DETAILS:
Name:          ${receipt.customer.name}
Email:         ${receipt.customer.email}
Phone:         ${receipt.customer.phone}
Address:       ${receipt.customer.address}
GSTIN:         ${receipt.customer.gstin}

--------------------------------------------------------------------------------
ITEMIZED SELECTIONS LINKED FROM BAG:
${receipt.items
      .map(
        (item) => `
[#${item.lineNumber}] ${item.name}
  Finish:    ${item.finish}
  Category:  ${item.category} (${item.space.toUpperCase()})
  Plan:      ${item.mode === 'rent' ? `Rental Subscription (${item.tenureMonths} Months)` : 'Outright Purchase'}
  Quantity:  ${item.quantity}
  Rate:      ₹${item.unitPrice.toLocaleString('en-IN')}${item.mode === 'rent' ? '/mo' : ''}
  Subtotal:  ₹${item.subtotal.toLocaleString('en-IN')}
  ${item.equityCreditAccrued ? `Buyout Equity Credit: 80% (₹${item.equityCreditAccrued.toLocaleString('en-IN')} towards ownership)` : 'Warranty: 5-Year Comprehensive Architectural Warranty'}
`
      )
      .join('')}
--------------------------------------------------------------------------------
FINANCIAL BREAKDOWN:
Monthly Rental Total:          ₹${receipt.summary.monthlyRentalTotal.toLocaleString('en-IN')}/mo
Outright Purchase Total:       ₹${receipt.summary.buySubtotal.toLocaleString('en-IN')}
Refundable Security Deposit:   ₹${receipt.summary.refundableDeposit.toLocaleString('en-IN')} (100% Refundable)
Goods & Services Tax (18%):    ₹${receipt.summary.gstAmount.toLocaleString('en-IN')}
White-Glove Delivery/Assembly: ₹0 (Complimentary)
--------------------------------------------------------------------------------
TOTAL INITIAL DUE PAID TODAY:  ₹${receipt.summary.totalPaidToday.toLocaleString('en-IN')}
TOTAL BUYOUT EQUITY ACCRUED:   ₹${receipt.summary.totalEquityAccrued.toLocaleString('en-IN')} (80% Credit)
--------------------------------------------------------------------------------

AURA RENTAL EQUITY & GUARANTEE TERMS:
• Accrued rental equity (80%) automatically deducts from buyout price.
• Includes 30-Day Aesthetic Trial. If not completely harmonized, exchange or return.
• Contact support: concierge@aura.design | +91 80 4000 8800
================================================================================
Generated electronically by AURA Platform. No physical signature required.
`.trim()

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${receipt.invoiceNumber}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

