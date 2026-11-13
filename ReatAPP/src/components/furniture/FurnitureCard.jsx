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

  const handleAction = (e) => {
    e.stopPropagation()
    onAddToCart({
      item,
      selectedFinish: activeFinish,
      mode,
      tenureMonths: mode === 'rent' ? tenureMonths : null,
      unitPrice: mode === 'rent' ? effectiveMonthlyRent : item.buyPrice,
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

        {mode === 'rent' ? (
          <div className="furniture-card__pricing-box">
            <div className="furniture-card__price-row">
              <span className="furniture-card__price-label">Rental Rate</span>
              <span className="furniture-card__price-val tabular-nums">
                ₹{effectiveMonthlyRent}
                <small>/mo</small>
              </span>
            </div>
            <div className="furniture-card__equity-hint">
              <span className="equity-hint__pill">80% Buyout Credit</span>
              <span className="equity-hint__text tabular-nums">
                ₹{monthlyEquity}/mo builds toward ₹{item.buyPrice} buyout
              </span>
            </div>
          </div>
        ) : (
          <div className="furniture-card__pricing-box">
            <div className="furniture-card__price-row">
              <span className="furniture-card__price-label">Outright Purchase</span>
              <span className="furniture-card__price-val tabular-nums">
                ₹{item.buyPrice}
              </span>
            </div>
            <div className="furniture-card__equity-hint">
              <span className="equity-hint__pill pill--neutral">Try Before Buying</span>
              <span className="equity-hint__text tabular-nums">
                Or rent from ₹{item.rentMonthly}/mo with buyout option
              </span>
            </div>
          </div>
        )}

        <div className="furniture-card__actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="btn btn--primary btn--full"
            onClick={handleAction}
          >
            {mode === 'rent'
              ? `Rent for ₹${effectiveMonthlyRent}/mo`
              : `Buy Now (₹${item.buyPrice})`}
          </button>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => onInspect(item, activeFinish)}
            aria-label={`View full details of ${item.name}`}
          >
            Explore
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

