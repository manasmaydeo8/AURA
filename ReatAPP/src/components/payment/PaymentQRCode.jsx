import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export function PaymentQRCode({
  amount = 0,
  productName = 'AURA Architectural Furniture',
  payeeVpa = 'aura.concierge@okhdfcbank',
  payeeName = 'AURA Architecture',
  size = 240,
  className = ''
}) {
  const [qrUrl, setQrUrl] = useState('')
  const [copied, setCopied] = useState(false)

  // Construct standard Indian UPI deep-link URI with pre-filled amount
  const sanitizedAmount = Math.max(0, Math.round(Number(amount) || 0))
  const cleanNote = (productName || 'AURA Furniture').slice(0, 45).replace(/[^a-zA-Z0-9\s-]/g, '')
  const upiUri = `upi://pay?pa=${encodeURIComponent(payeeVpa)}&pn=${encodeURIComponent(payeeName)}&am=${sanitizedAmount}&cu=INR&tn=${encodeURIComponent(cleanNote)}`

  useEffect(() => {
    let isMounted = true

    QRCode.toDataURL(upiUri, {
      width: size * 2, // 2x for sharp retina displays
      margin: 1,
      color: {
        dark: '#171816',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => {
        if (isMounted) {
          setQrUrl(url)
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err)
      })

    return () => {
      isMounted = false
    }
  }, [upiUri, size])

  const handleCopyVpa = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(payeeVpa)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={`payment-qr-container ${className}`}>
      <div className="payment-qr-card">
        {/* Header with Amount */}
        <div className="payment-qr-header">
          <div className="payment-qr-amount-badge">
            <span className="qr-rupee-symbol">₹</span>
            <span className="qr-amount-value tabular-nums">
              {sanitizedAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="payment-qr-payee">Pay to {payeeName}</span>
          {productName && (
            <small className="payment-qr-product-note" title={productName}>
              For: {productName}
            </small>
          )}
        </div>

        {/* QR Image Box */}
        <div className="payment-qr-frame">
          {qrUrl ? (
            <img
              src={qrUrl}
              alt={`Scan to pay ₹${sanitizedAmount} to ${payeeName} via UPI`}
              className="payment-qr-image"
              width={size}
              height={size}
            />
          ) : (
            <div
              className="payment-qr-skeleton"
              style={{ width: size, height: size }}
              aria-label="Generating QR code..."
            >
              <span>Generating UPI QR...</span>
            </div>
          )}
          <div className="qr-corner-accent qr-corner-tl" />
          <div className="qr-corner-accent qr-corner-tr" />
          <div className="qr-corner-accent qr-corner-bl" />
          <div className="qr-corner-accent qr-corner-br" />
        </div>

        {/* Scan instruction */}
        <div className="payment-qr-instruction">
          <p>
            Scan with <strong>Google Pay, PhonePe, Paytm, or BHIM</strong>
          </p>
          <small>
            The amount of <strong>₹{sanitizedAmount.toLocaleString('en-IN')}</strong> will display automatically on your phone.
          </small>
        </div>

        {/* VPA pill and Copy button */}
        <div className="payment-qr-vpa-row">
          <span className="qr-vpa-label">UPI VPA:</span>
          <code className="qr-vpa-code">{payeeVpa}</code>
          <button
            type="button"
            className="qr-copy-btn"
            onClick={handleCopyVpa}
            title="Copy UPI ID to clipboard"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}

