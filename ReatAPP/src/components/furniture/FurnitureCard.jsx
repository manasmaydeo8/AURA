import { useState } from 'react'

export function FurnitureCard({
  item,
  mode = 'rent',
  tenureMonths = 3,
  discountMultiplier = 1.0,
  onInspect,
  onAddToCart,
}) {
  const [activeFinish, setActiveFinish] = useState(item.finishes[0])

  const effectiveMonthlyRent = Math.round(item.rentMonthly * discountMultiplier)
  const monthlyEquity = Math.round(effectiveMonthlyRent * 0.8)
  const totalAccruedInTenure = monthlyEquity * tenureMonths
  const residualBuyoutPrice = Math.max(0, item.buyPrice - totalAccruedInTenure)

  const currentDisplayImage = activeFinish?.image || item.image

  const handleRent = (e) => {
    e.stopPropagation()
    onAddToCart({
      item,
      selectedFinish: activeFinish,
      mode: 'rent',
      tenureMonths,
      unitPrice: effectiveMonthlyRent,
    })
  }

  const handleBuyout = (e) => {
    e.stopPropagation()
    onAddToCart({
      item,
      selectedFinish: activeFinish,
      mode: 'buy',
      tenureMonths: null,
      unitPrice: item.buyPrice,
    })
  }

  return (
    <article className="furniture-card" onClick={() => onInspect(item, activeFinish)}>
      <div className="furniture-card__image-wrapper">
        <img
          src={currentDisplayImage}
          alt={`${item.name} in ${activeFinish?.name || 'Default finish'}`}
          className="furniture-card__image"
          loading="lazy"
          width="400"
          height="280"
        />
        <div className="furniture-card__badges">
          <span className={`furniture-card__badge space-badge--${item.space}`}>
            {item.space === 'home' ? 'Home Aesthetic' : 'Office Architecture'}
          </span>
          {item.featured && <span className="furniture-card__badge badge-featured">Signature Piece</span>}
        </div>

        {/* Quick Finish Dot Preview */}
        <div className="furniture-card__swatches" onClick={(e) => e.stopPropagation()}>
          {item.finishes.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`swatch-circle ${activeFinish?.id === f.id ? 'swatch-circle--active' : ''}`}
              style={{ backgroundColor: f.color }}
              title={f.name}
              aria-label={`Select ${f.name} finish`}
              onClick={() => setActiveFinish(f)}
            />
          ))}
        </div>
      </div>

      <div className="furniture-card__body">
        <div className="furniture-card__meta">
          <span className="furniture-card__category">{item.category.replace('-', ' ')}</span>
          <span className="furniture-card__rating">★ {item.rating} ({item.reviewsCount})</span>
        </div>

        <h3 className="furniture-card__title">{item.name}</h3>
        <p className="furniture-card__tagline">{item.tagline}</p>

        {/* Architectural Pricing Module */}
        <div className="furniture-card__pricing-card">
          <div className="pricing-plan-columns">
            <div className="pricing-plan-col">
              <span className="pricing-plan-kicker">Rental Plan</span>
              <div className="pricing-plan-val tabular-nums">
                ₹{effectiveMonthlyRent.toLocaleString('en-IN')}
                <span className="pricing-plan-unit">/mo</span>
              </div>
            </div>

            <div className="pricing-plan-divider" aria-hidden="true" />

            <div className="pricing-plan-col pricing-plan-col--right">
              <span className="pricing-plan-kicker">Spot Buyout</span>
              <div className="pricing-plan-val tabular-nums">
                ₹{item.buyPrice.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="pricing-equity-ribbon">
            <span className="equity-ribbon-tag">80% Credit</span>
            <span className="equity-ribbon-copy tabular-nums">
              ₹{monthlyEquity.toLocaleString('en-IN')}/mo builds to ownership
            </span>
          </div>
        </div>

        {/* Action CTAs: Dual Selection + Detail Link */}
        <div className="furniture-card__actions" onClick={(e) => e.stopPropagation()}>
          <div className="card-dual-actions">
            <button
              type="button"
              className="card-action-btn card-action-btn--rent"
              onClick={handleRent}
              title={`Rent ${item.name} at ₹${effectiveMonthlyRent.toLocaleString('en-IN')}/mo`}
            >
              <span className="card-action-btn__label">Rent Plan</span>
              <span className="card-action-btn__sub tabular-nums">₹{effectiveMonthlyRent.toLocaleString('en-IN')}/mo</span>
            </button>

            <button
              type="button"
              className="card-action-btn card-action-btn--buyout"
              onClick={handleBuyout}
              title={`Buyout ${item.name} outright at ₹${item.buyPrice.toLocaleString('en-IN')}`}
            >
              <span className="card-action-btn__label">Spot Buyout</span>
              <span className="card-action-btn__sub tabular-nums">₹{item.buyPrice.toLocaleString('en-IN')}</span>
            </button>
          </div>

          <button
            type="button"
            className="card-detail-link-btn"
            onClick={() => onInspect(item, activeFinish)}
            aria-label={`View full details & payment QR for ${item.name}`}
          >
            <span>View Details & Payment QR</span>
            <span className="card-detail-link-arrow" aria-hidden="true">→</span>
          </button>
        </div>

        {mode === 'rent' && tenureMonths > 3 && (
          <div className="furniture-card__tenure-savings tabular-nums">
            {tenureMonths} mo plan: buy out for only <strong>₹{residualBuyoutPrice}</strong>
          </div>
        )}
      </div>
    </article>
  )
}
