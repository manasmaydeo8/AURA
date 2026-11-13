export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) {
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

  const totalItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0)

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
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
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

        {cartItems.length === 0 ? (
          <div className="drawer-empty-state">
            <div className="empty-icon-box" aria-hidden="true">🛋️</div>
            <h3>Your bag is empty</h3>
            <p>Select pieces from our rental subscription or buy catalog to get started.</p>
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
                    <div
                      key={`${cartItem.item.id}-${cartItem.selectedFinish?.id}-rent-${cartItem.tenureMonths}`}
                      className="cart-item-row"
                    >
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
                            ₹{(cartItem.unitPrice * cartItem.quantity).toLocaleString('en-IN')}
                            <small>/mo</small>
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
                    <div
                      key={`${cartItem.item.id}-${cartItem.selectedFinish?.id}-buy`}
                      className="cart-item-row"
                    >
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
                            ₹{(cartItem.unitPrice * cartItem.quantity).toLocaleString('en-IN')}
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
                    <strong className="tabular-nums">
                      ₹{monthlyRentalTotal.toLocaleString('en-IN')}/mo
                    </strong>
                  </div>
                )}
                {buyTotal > 0 && (
                  <div className="total-row">
                    <span>Outright Purchase Total:</span>
                    <strong className="tabular-nums">
                      ₹{buyTotal.toLocaleString('en-IN')}
                    </strong>
                  </div>
                )}
                <div className="total-row text-muted-sm">
                  <span>White-Glove In-Home Assembly:</span>
                  <strong className="text-accent">Complimentary (₹0)</strong>
                </div>
                <div className="total-row total-row--grand">
                  <span>Initial Due Today:</span>
                  <strong className="tabular-nums text-xl">
                    ₹{(monthlyRentalTotal + buyTotal).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              {/* Link bag data directly to Payment and Receipt generation */}
              <div className="drawer-cta-group">
                <button
                  type="button"
                  className="btn btn--primary btn--xl btn--full drawer-checkout-btn"
                  onClick={() => {
                    onClose()
                    onProceedToCheckout(cartItems)
                  }}
                >
                  Proceed to Payment & Receipt →
                </button>
                <small className="drawer-security-hint">
                  ⚡ Linked to secure payment gateway & instant tax invoice receipt.
                </small>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
