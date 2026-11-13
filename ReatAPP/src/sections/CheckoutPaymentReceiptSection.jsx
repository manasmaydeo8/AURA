import { useState, useMemo } from 'react'
import { PaymentQRCode } from '../components/payment/PaymentQRCode'
import {
  calculateOrderSummary,
  processPayment,
  generateReceipt,
  downloadReceiptAsText,
  getSavedReceipts
} from '../services/paymentAndReceipt'

export function CheckoutPaymentReceiptSection({
  bagItems = [],
  currentUser = null,
  onClearBag,
  onViewChange,
  initialReceipt = null
}) {
  const [activeStep, setActiveStep] = useState(initialReceipt ? 'receipt' : 'checkout')
  const [activeReceipt, setActiveReceipt] = useState(initialReceipt)
  const [paymentMethod, setPaymentMethod] = useState('upi') // 'upi' | 'card' | 'netbanking'
  const [rentalMethod, setRentalMethod] = useState('upi_autopay') // 'upi_autopay' | 'card_enach' | 'prepaid_tenure'
  const [buyoutMethod, setBuyoutMethod] = useState('upi_spot') // 'upi_spot' | 'card_spot' | 'netbanking_spot'
  const [qrTarget, setQrTarget] = useState('all') // 'all' | 'rental' | 'buyout'

  const [paymentForm, setPaymentForm] = useState({
    upiId: 'eleanor@okhdfcbank',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '11/29',
    cardCvv: '842',
    bankName: 'HDFC Corporate Banking'
  })

  const [customerForm, setCustomerForm] = useState({
    name: currentUser?.name || 'Eleanor Vance',
    email: currentUser?.email || 'eleanor.vance@studioarch.com',
    phone: currentUser?.phone || '+91 98765 43210',
    address: currentUser?.address || '428 Mercer St, Floor 4, Bengaluru, Karnataka 560001',
    gstin: '29AABCA1234D1Z5'
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [showSavedList, setShowSavedList] = useState(false)

  // Link bag data to calculations in paymentAndReceipt.js
  const summary = useMemo(() => calculateOrderSummary(bagItems), [bagItems])

  const rentalMethodLabels = {
    upi_autopay: 'UPI AutoPay Recurring Mandate (Monthly Dues)',
    card_enach: 'Credit Card e-NACH Auto-Debit',
    prepaid_tenure: 'Pre-paid Full Rental Commitment Upfront'
  }

  const buyoutMethodLabels = {
    upi_spot: 'Instant Spot Buyout UPI Settlement',
    card_spot: 'One-Time Card Clearance with 5-Yr Warranty',
    netbanking_spot: 'Corporate Net Banking RTGS/NEFT'
  }

  const activeQrAmount = useMemo(() => {
    if (qrTarget === 'rental') {
      return summary.monthlyRentalTotal + summary.refundableDeposit
    }
    if (qrTarget === 'buyout') {
      return summary.buySubtotal
    }
    return summary.grandTotalDueToday
  }, [qrTarget, summary])

  const activeQrTitle = useMemo(() => {
    if (qrTarget === 'rental') {
      return 'AURA Rental Furniture Plan'
    }
    if (qrTarget === 'buyout') {
      return 'AURA Instant Spot Buyout'
    }
    return bagItems.length === 1 ? bagItems[0].item.name : `AURA Order (${bagItems.length} items)`
  }, [qrTarget, bagItems])

  const handlePayAndGenerateReceipt = (e) => {
    e.preventDefault()
    setPaymentError('')
    setIsProcessing(true)

    setTimeout(() => {
      // 1. Process payment through paymentAndReceipt.js with distinct methods for rental and buyout
      const paymentResult = processPayment({
        method: paymentMethod,
        upiId: paymentForm.upiId,
        cardNumber: paymentForm.cardNumber,
        bankName: paymentForm.bankName,
        rentalPaymentMethod: rentalMethodLabels[rentalMethod],
        buyoutPaymentMethod: buyoutMethodLabels[buyoutMethod],
        hasRental: summary.rentalCount > 0,
        hasBuyout: summary.buyCount > 0
      })

      if (!paymentResult.success) {
        setIsProcessing(false)
        setPaymentError(paymentResult.error || 'Payment authorization failed.')
        return
      }

      // 2. Generate and save the official receipt linked to bag items
      const newReceipt = generateReceipt({
        bagItems,
        customerInfo: customerForm,
        paymentResult,
        orderSummary: summary
      })

      // 3. Clear the bag and switch to receipt view
      onClearBag()
      setActiveReceipt(newReceipt)
      setActiveStep('receipt')
      setIsProcessing(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 900)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSelectPastReceipt = (receipt) => {
    setActiveReceipt(receipt)
    setActiveStep('receipt')
    setShowSavedList(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const savedReceipts = getSavedReceipts()

  // If bag is empty and no receipt being viewed
  if (bagItems.length === 0 && !activeReceipt) {
    return (
      <div className="checkout-page-container">
        <div className="container">
          <div className="checkout-empty-card">
            <span className="empty-cart-pill">Shopping Bag Empty</span>
            <h2>No furniture items currently in your bag</h2>
            <p>
              Select pieces from our Rental Collection or Buy Catalog to process secure payment and generate your itemized tax receipt.
            </p>
            <div className="empty-actions-row">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => onViewChange('rent')}
              >
                Browse Rental Pieces →
              </button>
              {savedReceipts.length > 0 && (
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => setShowSavedList(true)}
                >
                  View Past Receipts ({savedReceipts.length})
                </button>
              )}
            </div>

            {showSavedList && savedReceipts.length > 0 && (
              <div className="past-receipts-drawer">
                <h3>Archived Tax Invoices & Receipts</h3>
                <div className="past-receipts-list">
                  {savedReceipts.map((rec) => (
                    <div
                      key={rec.invoiceNumber}
                      className="past-receipt-row"
                      onClick={() => handleSelectPastReceipt(rec)}
                    >
                      <div>
                        <strong>{rec.invoiceNumber}</strong>
                        <small>{rec.formattedDate}</small>
                      </div>
                      <div className="past-receipt-right">
                        <span className="tabular-nums">
                          ₹{rec.summary.totalPaidToday.toLocaleString('en-IN')}
                        </span>
                        <span className="badge-view">View Invoice →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page-container">
      <div className="container">
        {/* Navigation Breadcrumb / Header */}
        <div className="checkout-nav-bar">
          <button
            type="button"
            className="checkout-back-btn"
            onClick={() => onViewChange('overview')}
          >
            ← Return to Overview
          </button>

          <div className="checkout-steps-tracker" aria-label="Acquisition progress">
            <span
              className={`step-bubble ${activeStep === 'checkout' ? 'step-bubble--active' : 'step-bubble--done'}`}
            >
              1. Bag Review & Billing
            </span>
            <span className="step-connector"></span>
            <span
              className={`step-bubble ${activeStep === 'receipt' ? 'step-bubble--active' : ''}`}
            >
              2. Verified Tax Receipt
            </span>
          </div>

          {savedReceipts.length > 0 && (
            <button
              type="button"
              className="btn btn--subtle btn--sm"
              onClick={() => setShowSavedList(!showSavedList)}
            >
              Past Receipts ({savedReceipts.length})
            </button>
          )}
        </div>

        {/* Saved Receipts Modal / Drawer */}
        {showSavedList && (
          <div className="saved-receipts-modal-card">
            <div className="modal-card-header">
              <h3>Archived Orders & Invoices</h3>
              <button
                type="button"
                className="close-sm-btn"
                onClick={() => setShowSavedList(false)}
              >
                ✕
              </button>
            </div>
            <div className="past-receipts-list">
              {savedReceipts.map((rec) => (
                <div
                  key={rec.invoiceNumber}
                  className="past-receipt-row"
                  onClick={() => handleSelectPastReceipt(rec)}
                >
                  <div>
                    <strong>{rec.invoiceNumber}</strong>
                    <small>{rec.formattedDate} · {rec.customer.name}</small>
                  </div>
                  <div className="past-receipt-right">
                    <span className="tabular-nums font-bold">
                      ₹{rec.summary.totalPaidToday.toLocaleString('en-IN')}
                    </span>
                    <span className="badge-view">Load Receipt →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: CHECKOUT & PAYMENT */}
        {activeStep === 'checkout' && (
          <div className="checkout-main-grid">
            {/* Left: Customer & Payment Form */}
            <div className="checkout-form-column">
              <form onSubmit={handlePayAndGenerateReceipt} className="checkout-form">
                {/* Section 1: Customer Contact & Delivery Details */}
                <div className="checkout-card-box">
                  <div className="card-box-header">
                    <span className="box-step-num">1</span>
                    <div>
                      <h3 className="box-title">Client Details & Delivery Destination</h3>
                      <p className="box-subtitle">
                        White-glove assembly scheduled within 48-72 hours.
                      </p>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-field">
                      <label htmlFor="chk-cust-name">Full Name</label>
                      <input
                        id="chk-cust-name"
                        type="text"
                        required
                        value={customerForm.name}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, name: e.target.value })
                        }
                        className="auth-input"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="chk-cust-email">Email Address</label>
                      <input
                        id="chk-cust-email"
                        type="email"
                        required
                        value={customerForm.email}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, email: e.target.value })
                        }
                        className="auth-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-field">
                      <label htmlFor="chk-cust-phone">Phone Number (+91)</label>
                      <input
                        id="chk-cust-phone"
                        type="tel"
                        required
                        value={customerForm.phone}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, phone: e.target.value })
                        }
                        className="auth-input"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="chk-cust-gstin">GSTIN (Optional for Tax Invoice)</label>
                      <input
                        id="chk-cust-gstin"
                        type="text"
                        placeholder="29AABCA1234D1Z5"
                        value={customerForm.gstin}
                        onChange={(e) =>
                          setCustomerForm({ ...customerForm, gstin: e.target.value })
                        }
                        className="auth-input"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="chk-cust-address">Delivery & Installation Address</label>
                    <textarea
                      id="chk-cust-address"
                      rows="2"
                      required
                      value={customerForm.address}
                      onChange={(e) =>
                        setCustomerForm({ ...customerForm, address: e.target.value })
                      }
                      className="auth-input auth-textarea"
                    />
                  </div>
                </div>

                {/* Section 2: Secure Payment Processing */}
                <div className="checkout-card-box">
                  <div className="card-box-header">
                    <span className="box-step-num">2</span>
                    <div>
                      <h3 className="box-title">Payment Method & Authorization</h3>
                      <p className="box-subtitle">
                        End-to-end encrypted 256-bit gateway. Instant tax receipt generation.
                      </p>
                    </div>
                  </div>

                  {/* DEDICATED PAYMENT PROTOCOLS FOR RENTAL & BUYOUT */}
                  {summary.rentalCount > 0 && (
                    <div className="payment-subgroup">
                      <div className="subgroup-title-row">
                        <span className="badge-rent-pill">Rental Furniture Payment Method</span>
                        <small>Monthly recurring flex dues with 80% buyout equity credit</small>
                      </div>
                      <div className="method-pill-grid">
                        <button
                          type="button"
                          className={`method-subpill ${rentalMethod === 'upi_autopay' ? 'method-subpill--active' : ''}`}
                          onClick={() => setRentalMethod('upi_autopay')}
                        >
                          <span className="method-subpill-icon">⚡</span>
                          <strong>UPI AutoPay Mandate</strong>
                          <small>Recurring monthly debit via GPay / PhonePe</small>
                        </button>
                        <button
                          type="button"
                          className={`method-subpill ${rentalMethod === 'card_enach' ? 'method-subpill--active' : ''}`}
                          onClick={() => setRentalMethod('card_enach')}
                        >
                          <span className="method-subpill-icon">💳</span>
                          <strong>Card e-NACH Auto-Debit</strong>
                          <small>Standing instructions on Debit or Credit card</small>
                        </button>
                        <button
                          type="button"
                          className={`method-subpill ${rentalMethod === 'prepaid_tenure' ? 'method-subpill--active' : ''}`}
                          onClick={() => setRentalMethod('prepaid_tenure')}
                        >
                          <span className="method-subpill-icon">💼</span>
                          <strong>Pre-paid Full Tenure</strong>
                          <small>Pay upfront with locked 80% equity credit</small>
                        </button>
                      </div>
                    </div>
                  )}

                  {summary.buyCount > 0 && (
                    <div className="payment-subgroup">
                      <div className="subgroup-title-row">
                        <span className="badge-buy-pill">Spot Buyout Settlement Payment Method</span>
                        <small>Instant full buyout clearance · Permanent piece ownership</small>
                      </div>
                      <div className="method-pill-grid">
                        <button
                          type="button"
                          className={`method-subpill ${buyoutMethod === 'upi_spot' ? 'method-subpill--active' : ''}`}
                          onClick={() => setBuyoutMethod('upi_spot')}
                        >
                          <span className="method-subpill-icon">⚡</span>
                          <strong>Instant UPI Buyout</strong>
                          <small>One-time settlement via GPay / QR scan</small>
                        </button>
                        <button
                          type="button"
                          className={`method-subpill ${buyoutMethod === 'card_spot' ? 'method-subpill--active' : ''}`}
                          onClick={() => setBuyoutMethod('card_spot')}
                        >
                          <span className="method-subpill-icon">💳</span>
                          <strong>Spot Card Purchase</strong>
                          <small>One-time clearance with 5-Yr warranty</small>
                        </button>
                        <button
                          type="button"
                          className={`method-subpill ${buyoutMethod === 'netbanking_spot' ? 'method-subpill--active' : ''}`}
                          onClick={() => setBuyoutMethod('netbanking_spot')}
                        >
                          <span className="method-subpill-icon">🏛️</span>
                          <strong>Corporate Net Banking</strong>
                          <small>Direct RTGS / NEFT transfer</small>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Gateway Gateway Mode Switcher */}
                  <div className="payment-method-selector" role="radiogroup">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={paymentMethod === 'upi'}
                      className={`payment-tab-pill ${paymentMethod === 'upi' ? 'payment-tab-pill--active' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <span className="payment-tab-icon">⚡</span>
                      <span>Scan UPI QR Code</span>
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={paymentMethod === 'card'}
                      className={`payment-tab-pill ${paymentMethod === 'card' ? 'payment-tab-pill--active' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <span className="payment-tab-icon">💳</span>
                      <span>Credit / Debit Card</span>
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={paymentMethod === 'netbanking'}
                      className={`payment-tab-pill ${paymentMethod === 'netbanking' ? 'payment-tab-pill--active' : ''}`}
                      onClick={() => setPaymentMethod('netbanking')}
                    >
                      <span className="payment-tab-icon">🏛️</span>
                      <span>Net Banking</span>
                    </button>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="payment-fields-panel">
                      {summary.rentalCount > 0 && summary.buyCount > 0 && (
                        <div className="qr-filter-tabs">
                          <button
                            type="button"
                            className={`qr-filter-btn ${qrTarget === 'all' ? 'qr-filter-btn--active' : ''}`}
                            onClick={() => setQrTarget('all')}
                          >
                            Combined Total (₹{summary.grandTotalDueToday})
                          </button>
                          <button
                            type="button"
                            className={`qr-filter-btn ${qrTarget === 'rental' ? 'qr-filter-btn--active' : ''}`}
                            onClick={() => setQrTarget('rental')}
                          >
                            Rental Pieces Only (₹{summary.monthlyRentalTotal + summary.refundableDeposit})
                          </button>
                          <button
                            type="button"
                            className={`qr-filter-btn ${qrTarget === 'buyout' ? 'qr-filter-btn--active' : ''}`}
                            onClick={() => setQrTarget('buyout')}
                          >
                            Spot Buyout Pieces (₹{summary.buySubtotal})
                          </button>
                        </div>
                      )}

                      <div className="upi-qr-section">
                        <PaymentQRCode
                          amount={activeQrAmount}
                          productName={activeQrTitle}
                          payeeVpa="aura.concierge@okhdfcbank"
                          payeeName="AURA Architecture"
                          size={220}
                        />
                        <div className="upi-id-input-wrap">
                          <label htmlFor="chk-upi-id">Or Authorize via Virtual Payment Address (VPA)</label>
                          <input
                            id="chk-upi-id"
                            type="text"
                            placeholder="username@okhdfcbank"
                            value={paymentForm.upiId}
                            onChange={(e) =>
                              setPaymentForm({ ...paymentForm, upiId: e.target.value })
                            }
                            className="auth-input"
                          />
                          <small className="help-text">
                            Scan above with Google Pay, PhonePe, Paytm, or BHIM. Amount of ₹{activeQrAmount.toLocaleString('en-IN')} is pre-filled on scan.
                          </small>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="payment-fields-panel">
                      <div className="form-field">
                        <label htmlFor="chk-card-num">Card Number</label>
                        <input
                          id="chk-card-num"
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          value={paymentForm.cardNumber}
                          onChange={(e) =>
                            setPaymentForm({ ...paymentForm, cardNumber: e.target.value })
                          }
                          className="auth-input"
                        />
                      </div>
                      <div className="form-grid-2">
                        <div className="form-field">
                          <label htmlFor="chk-card-exp">Expiry (MM/YY)</label>
                          <input
                            id="chk-card-exp"
                            type="text"
                            placeholder="11/29"
                            value={paymentForm.cardExp}
                            onChange={(e) =>
                              setPaymentForm({ ...paymentForm, cardExp: e.target.value })
                            }
                            className="auth-input"
                          />
                        </div>
                        <div className="form-field">
                          <label htmlFor="chk-card-cvv">CVV</label>
                          <input
                            id="chk-card-cvv"
                            type="password"
                            maxLength="4"
                            placeholder="842"
                            value={paymentForm.cardCvv}
                            onChange={(e) =>
                              setPaymentForm({ ...paymentForm, cardCvv: e.target.value })
                            }
                            className="auth-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="payment-fields-panel">
                      <div className="form-field">
                        <label htmlFor="chk-netbank">Select Bank</label>
                        <select
                          id="chk-netbank"
                          value={paymentForm.bankName}
                          onChange={(e) =>
                            setPaymentForm({ ...paymentForm, bankName: e.target.value })
                          }
                          className="auth-input auth-select"
                        >
                          <option value="HDFC Corporate Banking">HDFC Bank</option>
                          <option value="ICICI Corporate & Retail">ICICI Bank</option>
                          <option value="State Bank of India">State Bank of India (SBI)</option>
                          <option value="Axis Commercial">Axis Bank</option>
                          <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {paymentError && (
                    <div className="auth-alert auth-alert--error" role="alert">
                      <span>⚠</span>
                      <span>{paymentError}</span>
                    </div>
                  )}

                  <div className="checkout-submit-box">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="btn btn--primary btn--xl btn--full"
                    >
                      {isProcessing
                        ? 'Verifying with Bank...'
                        : `Authorize & Pay ₹${summary.grandTotalDueToday.toLocaleString('en-IN')}`}
                    </button>
                    <small className="checkout-guarantee-note">
                      🔒 Secured with RBI Compliance · Instant PDF / Print Tax Receipt generated on next screen.
                    </small>
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Itemized Bag Data Linked Summary */}
            <div className="checkout-summary-column">
              <div className="checkout-summary-card">
                <div className="summary-header">
                  <h3 className="summary-title">Linked Bag Items</h3>
                  <span className="summary-badge tabular-nums">
                    {summary.totalItemsCount} pieces
                  </span>
                </div>

                <div className="summary-items-scroll">
                  {bagItems.map((entry, idx) => (
                    <div
                      key={`${entry.item.id}-${entry.selectedFinish?.id}-${idx}`}
                      className="summary-item-row"
                    >
                      <img
                        src={entry.selectedFinish?.image || entry.item.image}
                        alt={entry.item.name}
                        className="summary-item-img"
                        width="64"
                        height="50"
                      />
                      <div className="summary-item-info">
                        <div className="summary-item-title-line">
                          <strong>{entry.item.name}</strong>
                          <span className="tabular-nums font-bold">
                            ₹{(entry.unitPrice * entry.quantity).toLocaleString('en-IN')}
                            {entry.mode === 'rent' ? <small>/mo</small> : ''}
                          </span>
                        </div>
                        <div className="summary-item-meta">
                          <span>Finish: {entry.selectedFinish?.name}</span>
                          <span>Qty: {entry.quantity}</span>
                        </div>
                        <div className="summary-item-tag-line">
                          {entry.mode === 'rent' ? (
                            <span className="badge-rent-pill">
                              Rental ({entry.tenureMonths || 3} mo) · 80% Equity Credit
                            </span>
                          ) : (
                            <span className="badge-buy-pill">
                              Outright Purchase · 5-Yr Warranty
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation Breakdown from paymentAndReceipt.js */}
                <div className="summary-calc-breakdown">
                  {summary.monthlyRentalTotal > 0 && (
                    <div className="calc-row">
                      <span>Monthly Rental Recurring:</span>
                      <strong className="tabular-nums">
                        ₹{summary.monthlyRentalTotal.toLocaleString('en-IN')}/mo
                      </strong>
                    </div>
                  )}

                  {summary.buySubtotal > 0 && (
                    <div className="calc-row">
                      <span>Direct Purchase Total:</span>
                      <strong className="tabular-nums">
                        ₹{summary.buySubtotal.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  )}

                  {summary.refundableDeposit > 0 && (
                    <div className="calc-row">
                      <span>
                        Refundable Rental Security Deposit:
                        <small className="d-block text-muted">
                          (100% refundable or rolls into buyout)
                        </small>
                      </span>
                      <strong className="tabular-nums text-forest">
                        ₹{summary.refundableDeposit.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  )}

                  <div className="calc-row">
                    <span>GST (18% Goods & Services Tax):</span>
                    <strong className="tabular-nums">
                      ₹{summary.gstAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>

                  <div className="calc-row">
                    <span>White-Glove Placement & Assembly:</span>
                    <strong className="text-accent">Complimentary (₹0)</strong>
                  </div>

                  {summary.totalEquityAccrued > 0 && (
                    <div className="equity-credit-callout">
                      <span className="sparkle-icon">✦</span>
                      <div>
                        <strong>
                          ₹{summary.totalEquityAccrued.toLocaleString('en-IN')} Accrued Equity
                        </strong>
                        <p>
                          80% of your rental dues accumulate directly toward full piece buyout ownership.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="calc-row calc-row--total">
                    <span>Total Initial Due Today:</span>
                    <strong className="tabular-nums text-xl">
                      ₹{summary.grandTotalDueToday.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: OFFICIAL GENERATED TAX INVOICE & RECEIPT */}
        {activeStep === 'receipt' && activeReceipt && (
          <div className="receipt-view-wrapper">
            {/* Action Bar for Receipt */}
            <div className="receipt-action-bar no-print">
              <div className="receipt-status-cluster">
                <span className="verified-stamp">✓ PAYMENT VERIFIED & CAPTURED</span>
                <span className="invoice-id-badge">{activeReceipt.invoiceNumber}</span>
              </div>
              <div className="receipt-buttons-group">
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  onClick={() => downloadReceiptAsText(activeReceipt)}
                >
                  Download Text Receipt (.txt)
                </button>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={handlePrint}
                >
                  Print / Save PDF Receipt 🖨️
                </button>
              </div>
            </div>

            {/* Official Printable Receipt Document */}
            <div className="printable-receipt-card" id="printable-receipt">
              {/* Receipt Header */}
              <div className="receipt-doc-header">
                <div>
                  <h1 className="receipt-brand-logo">AURA</h1>
                  <span className="receipt-brand-type">Home & Office Architectural Furnishings</span>
                  <p className="receipt-brand-address">
                    AURA Flagship Gallery, 428 Mercer Street, Bengaluru 560001<br />
                    CIN: U36100KA2026PTC099881 · GSTIN: 29AABCA1234D1Z5
                  </p>
                </div>
                <div className="receipt-doc-meta">
                  <div className="doc-type-badge">TAX INVOICE & RENTAL AGREEMENT</div>
                  <div className="meta-line">
                    <span>Invoice No:</span>
                    <strong className="tabular-nums">{activeReceipt.invoiceNumber}</strong>
                  </div>
                  <div className="meta-line">
                    <span>Issue Date:</span>
                    <strong>{activeReceipt.formattedDate}</strong>
                  </div>
                  <div className="meta-line">
                    <span>Transaction ID:</span>
                    <strong className="tabular-nums">{activeReceipt.payment.transactionId}</strong>
                  </div>
                </div>
              </div>

              <hr className="receipt-divider" />

              {/* Billed To / Shipped To Cluster */}
              <div className="receipt-addresses-grid">
                <div className="address-col">
                  <span className="col-label">Billed & Delivered To:</span>
                  <strong className="client-name">{activeReceipt.customer.name}</strong>
                  <p className="client-contact">
                    {activeReceipt.customer.address}<br />
                    Phone: {activeReceipt.customer.phone}<br />
                    Email: {activeReceipt.customer.email}
                  </p>
                  {activeReceipt.customer.gstin && (
                    <small className="client-gstin">
                      Client GSTIN: {activeReceipt.customer.gstin}
                    </small>
                  )}
                </div>

                <div className="address-col">
                  <span className="col-label">Payment & Delivery Protocol:</span>
                  <div className="meta-line">
                    <span>Payment Method:</span>
                    <strong>{activeReceipt.payment.method}</strong>
                  </div>
                  <div className="meta-line">
                    <span>Banking Ref:</span>
                    <strong className="tabular-nums">{activeReceipt.payment.bankReference}</strong>
                  </div>
                  <div className="meta-line">
                    <span>Assembly Service:</span>
                    <strong className="text-forest">White-Glove Included (₹0)</strong>
                  </div>
                  <div className="meta-line">
                    <span>Trial Guarantee:</span>
                    <strong>30-Day In-Situ Trial</strong>
                  </div>
                </div>
              </div>

              {/* Itemized Table Linked Directly from Bag Data */}
              <div className="receipt-table-wrapper">
                <table className="receipt-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Item Description & Architecture</th>
                      <th>Acquisition Plan</th>
                      <th>Qty</th>
                      <th>Unit Rate (₹)</th>
                      <th>Line Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeReceipt.items.map((line) => (
                      <tr key={line.lineNumber}>
                        <td className="tabular-nums text-muted">{line.lineNumber}</td>
                        <td>
                          <strong>{line.name}</strong>
                          <div className="table-submeta">
                            <span>Finish: {line.finish}</span> ·{' '}
                            <span>Category: {line.category} ({line.space})</span>
                          </div>
                        </td>
                        <td>
                          {line.mode === 'rent' ? (
                            <span className="plan-pill plan-pill--rent">
                              Rental ({line.tenureMonths} Mos)
                            </span>
                          ) : (
                            <span className="plan-pill plan-pill--buy">
                              Outright Purchase
                            </span>
                          )}
                        </td>
                        <td className="tabular-nums">{line.quantity}</td>
                        <td className="tabular-nums">
                          ₹{line.unitPrice.toLocaleString('en-IN')}
                          {line.mode === 'rent' ? '/mo' : ''}
                        </td>
                        <td className="tabular-nums font-bold">
                          ₹{line.subtotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Breakdown & Equity Certificate */}
              <div className="receipt-bottom-grid">
                <div className="equity-certificate-box">
                  <div className="cert-header">
                    <span className="cert-seal">✦</span>
                    <h4>AURA 80% Buyout Equity Certificate</h4>
                  </div>
                  <p className="cert-copy">
                    By terms of this agreement, <strong>80% of all monthly rental fees paid</strong> are irrevocably credited toward permanent piece acquisition.
                  </p>
                  <div className="cert-highlight-row">
                    <span>Projected Equity Accrued:</span>
                    <strong className="tabular-nums text-forest font-bold">
                      ₹{activeReceipt.summary.totalEquityAccrued.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <small className="cert-footnote">
                    Redeemable anytime directly in your AURA architectural dashboard.
                  </small>
                </div>

                <div className="receipt-totals-table">
                  {activeReceipt.summary.monthlyRentalTotal > 0 && (
                    <div className="totals-row">
                      <span>Monthly Rental Sum:</span>
                      <strong className="tabular-nums">
                        ₹{activeReceipt.summary.monthlyRentalTotal.toLocaleString('en-IN')}/mo
                      </strong>
                    </div>
                  )}
                  {activeReceipt.summary.buySubtotal > 0 && (
                    <div className="totals-row">
                      <span>Direct Purchase Sum:</span>
                      <strong className="tabular-nums">
                        ₹{activeReceipt.summary.buySubtotal.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  )}
                  {activeReceipt.summary.refundableDeposit > 0 && (
                    <div className="totals-row">
                      <span>Refundable Security Deposit:</span>
                      <strong className="tabular-nums">
                        ₹{activeReceipt.summary.refundableDeposit.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  )}
                  <div className="totals-row">
                    <span>GST (18% Goods & Services Tax):</span>
                    <strong className="tabular-nums">
                      ₹{activeReceipt.summary.gstAmount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="totals-row">
                    <span>White-Glove Placement:</span>
                    <strong className="text-forest">₹0 (Complimentary)</strong>
                  </div>
                  <hr />
                  <div className="totals-row totals-row--grand">
                    <span>TOTAL AMOUNT PAID:</span>
                    <strong className="tabular-nums text-xl text-forest">
                      ₹{activeReceipt.summary.totalPaidToday.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Receipt Footer Terms */}
              <div className="receipt-doc-footer">
                <div className="terms-col">
                  <strong>Terms of Service & Care Guarantee</strong>
                  <p>
                    All items remain covered by the AURA 30-Day In-Situ Trial. Minor honest wear and tear is fully forgiven. In case of queries or service requests, email concierge@aura.design or call our customer line at +91 80 4000 8800.
                  </p>
                </div>
                <div className="authorized-sign-col">
                  <div className="auth-signature-line">
                    <span className="digital-sign-stamp">AURA PLATFORM VERIFIED</span>
                  </div>
                  <small>Authorized Digital Signature</small>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="receipt-bottom-actions no-print">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => onViewChange('overview')}
              >
                ← Return to Home
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => onViewChange('rent')}
              >
                Explore More Furniture →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

