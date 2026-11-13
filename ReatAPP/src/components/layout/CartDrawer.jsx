import { useState } from 'react'

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const [checkoutStep, setCheckoutStep] = useState('review') // 'review' | 'success'
  const [formData, setFormData] = useState({
    name: 'Eleanor Vance',
    email: 'eleanor.vance@studioarch.com',
    address: '428 Mercer St, Floor 4, New York, NY',
    notes: 'Freight elevator accessible. Ring buzzer 4B.',
  })

  if (!isOpen) {
    return null
  }

  const rentalItems = cartItems.filter((i) => i.mode === 'rent')
  const buyItems = cartItems.filter((i) => i.mode === 'buy')

  const monthlyRentalTotal = rentalItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )
  const buyTotal = buyItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    setCheckoutStep('success')
  }

  const handleDone = () => {
    onClearCart()
    setCheckoutStep('review')
    onClose()
  }

  return (
    <div
      className="drawer-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={onClose}
    >
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-header__title-wrap">
            <h2 id="cart-drawer-title" className="drawer-title">
              Your Furniture Bag
            </h2>
            <span className="drawer-count-badge tabular-nums">
              {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} items
            </span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close cart drawer"
          >
            ✕
          </button>
        </div>

        {checkoutStep === 'success' ? (
          <div className="checkout-success-view">
            <div className="success-icon-ring">✓</div>
            <h3 className="success-title">Order Confirmed & Scheduled!</h3>
            <p className="success-copy">
              Thank you, <strong>{formData.name}</strong>. Your white-glove delivery has been reserved for:
            </p>
            <div className="success-address-card">
              <p>{formData.address}</p>
              <small>Confirmation sent to: {formData.email}</small>
            </div>
            <div className="success-reassurance">
              <p>
                <strong>The Aesthetic Guarantee:</strong> You will have 30 days to live with your selections. If you decide to keep and buy out your rentals, your accrued equity will automatically apply in your portal.
              </p>
            </div>
            <button
              type="button"
              className="btn btn--primary btn--full"
              onClick={handleDone}
            >
              Continue Exploring
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="drawer-empty-state">
            <div className="empty-icon-box" aria-hidden="true">🛋️</div>
            <h3>Your bag is empty</h3>
            <p>Select furniture from our rental collection or buy catalog to get started.</p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={onClose}
            >
              Browse Collections
            </button>
          </div>
        ) : (
          <>
            <div className="drawer-items-list">
              {/* Rental Items Group */}
              {rentalItems.length > 0 && (
                <div className="drawer-group">
                  <div className="drawer-group__header">
                    <span className="group-badge badge--rent">Rental Subscriptions</span>
                    <small>Billed monthly · 80% Buyout Credit</small>
                  </div>
                  {rentalItems.map((cartItem) => (
                    <div key={`${cartItem.item.id}-${cartItem.selectedFinish?.id}-rent`} className="cart-item-row">
                      <img
                        src={cartItem.selectedFinish?.image || cartItem.item.image}
                        alt={cartItem.item.name}
                        className="cart-item-thumb"
                        width="70"
                        height="55"
                      />
                      <div className="cart-item-details">
                        <div className="cart-item-title-row">
                          <strong className="cart-item-name">{cartItem.item.name}</strong>
                          <span className="cart-item-price tabular-nums">
                            ₹{cartItem.unitPrice}<small>/mo</small>
                          </span>
                        </div>
                        <span className="cart-item-finish">
                          Finish: {cartItem.selectedFinish?.name} · {cartItem.tenureMonths || 3} mo plan
                        </span>
                        <div className="cart-item-controls">
                          <div className="qty-counter">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => onUpdateQuantity(cartItem, -1)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="qty-val tabular-nums">{cartItem.quantity}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => onUpdateQuantity(cartItem, 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="item-remove-btn"
                            onClick={() => onRemoveItem(cartItem)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Buy Items Group */}
              {buyItems.length > 0 && (
                <div className="drawer-group">
                  <div className="drawer-group__header">
                    <span className="group-badge badge--buy">Direct Purchases</span>
                    <small>Outright ownership · 5-Yr Warranty</small>
                  </div>
                  {buyItems.map((cartItem) => (
                    <div key={`${cartItem.item.id}-${cartItem.selectedFinish?.id}-buy`} className="cart-item-row">
                      <img
                        src={cartItem.selectedFinish?.image || cartItem.item.image}
                        alt={cartItem.item.name}
                        className="cart-item-thumb"
                        width="70"
                        height="55"
                      />
                      <div className="cart-item-details">
                        <div className="cart-item-title-row">
                          <strong className="cart-item-name">{cartItem.item.name}</strong>
                          <span className="cart-item-price tabular-nums">
                            ₹{cartItem.unitPrice * cartItem.quantity}
                          </span>
                        </div>
                        <span className="cart-item-finish">
                          Finish: {cartItem.selectedFinish?.name}
                        </span>
                        <div className="cart-item-controls">
                          <div className="qty-counter">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => onUpdateQuantity(cartItem, -1)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="qty-val tabular-nums">{cartItem.quantity}</span>
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => onUpdateQuantity(cartItem, 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="item-remove-btn"
                            onClick={() => onRemoveItem(cartItem)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="drawer-footer">
              <div className="drawer-totals">
                {monthlyRentalTotal > 0 && (
                  <div className="total-row">
                    <span>Monthly Rental Total:</span>
                    <strong className="tabular-nums">₹{monthlyRentalTotal}/month</strong>
                  </div>
                )}
                {buyTotal > 0 && (
                  <div className="total-row">
                    <span>Outright Purchase Total:</span>
                    <strong className="tabular-nums">₹{buyTotal}</strong>
                  </div>
                )}
                <div className="total-row text-muted-sm">
                  <span>White-Glove In-Home Assembly:</span>
                  <strong className="text-accent">Complimentary (₹0)</strong>
                </div>
                <div className="total-row total-row--grand">
                  <span>Initial Due Today:</span>
                  <strong className="tabular-nums text-xl">
                    ₹{monthlyRentalTotal + buyTotal}
                  </strong>
                </div>
              </div>

              {/* Quick Mock Delivery Form */}
              <form onSubmit={handleCheckoutSubmit} className="checkout-quick-form">
                <div className="form-group-compact">
                  <label htmlFor="chk-name" className="sr-only">Full Name</label>
                  <input
                    id="chk-name"
                    type="text"
                    required
                    className="compact-input"
                    value={formData.name}
                    placeholder="Full Name"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group-compact">
                  <label htmlFor="chk-address" className="sr-only">Delivery Address</label>
                  <input
                    id="chk-address"
                    type="text"
                    required
                    className="compact-input"
                    value={formData.address}
                    placeholder="Delivery Address"
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn--primary btn--xl btn--full"
                >
                  Confirm Delivery & Complete (₹{monthlyRentalTotal + buyTotal})
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

