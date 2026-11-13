import { useState, useEffect } from 'react'
import { FinishSelector } from './FinishSelector'
import { RENTAL_TENURES } from '../../data/furniture'

export function ProductModal({ item, initialFinish, onClose, onAddToCart }) {
  const [selectedFinish, setSelectedFinish] = useState(initialFinish || item.finishes[0])
  const [activeTab, setActiveTab] = useState('rent') // 'rent' or 'buy'
  const [selectedTenureMonths, setSelectedTenureMonths] = useState(3)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [onClose])

  const tenureObj = RENTAL_TENURES.find((t) => t.months === selectedTenureMonths) || RENTAL_TENURES[0]
  const effectiveMonthlyRent = Math.round(item.rentMonthly * tenureObj.discountMultiplier)
  const monthlyEquity = Math.round(effectiveMonthlyRent * (item.equityCreditPercent / 100))
  const totalAccruedInTenure = monthlyEquity * selectedTenureMonths
  const remainingResidual = Math.max(0, item.buyPrice - totalAccruedInTenure)

  const handleAction = () => {
    onAddToCart({
      item,
      selectedFinish,
      mode: activeTab,
      tenureMonths: activeTab === 'rent' ? selectedTenureMonths : null,
      unitPrice: activeTab === 'rent' ? effectiveMonthlyRent : item.buyPrice,
    })
    onClose()
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="modal-grid">
          {/* Media Column */}
          <div className="modal-media-col">
            <div className="modal-image-frame">
              <img
                src={selectedFinish?.image || item.image}
                alt={`${item.name} in ${selectedFinish?.name}`}
                className="modal-main-image"
                width="640"
                height="500"
              />
              <span className="modal-space-tag">
                {item.space === 'home' ? 'Home Aesthetic' : 'Office Architecture'}
              </span>
            </div>

            <div className="modal-specs-box">
              <h4 className="modal-specs-title">Architectural Specifications</h4>
              <dl className="modal-specs-list">
                <div className="modal-specs-row">
                  <dt>Dimensions</dt>
                  <dd>{item.dimensions}</dd>
                </div>
                <div className="modal-specs-row">
                  <dt>Weight</dt>
                  <dd>{item.weight}</dd>
                </div>
                <div className="modal-specs-row">
                  <dt>Materials</dt>
                  <dd>{item.materials}</dd>
                </div>
                <div className="modal-specs-row">
                  <dt>Designer</dt>
                  <dd>{item.designer}</dd>
                </div>
                <div className="modal-specs-row">
                  <dt>Condition</dt>
                  <dd>{item.condition}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Details & Acquisition Column */}
          <div className="modal-content-col">
            <div className="modal-header-block">
              <span className="modal-category-eyebrow">{item.category.toUpperCase()}</span>
              <h2 id="modal-title" className="modal-product-title">{item.name}</h2>
              <p className="modal-tagline">{item.tagline}</p>
              <p className="modal-description">{item.description}</p>
            </div>

            {/* Finish Selector */}
            <div className="modal-finish-section">
              <FinishSelector
                finishes={item.finishes}
                selectedFinish={selectedFinish}
                onSelectFinish={setSelectedFinish}
                layoutGroupPrefix="modal-finish"
              />
            </div>

            {/* Acquisition Mode Switcher */}
            <div className="modal-acquisition-card">
              <div className="acquisition-tab-bar" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'rent'}
                  className={`acquisition-tab ${activeTab === 'rent' ? 'acquisition-tab--active' : ''}`}
                  onClick={() => setActiveTab('rent')}
                >
                  Option A: Rent & Test Aesthetics
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'buy'}
                  className={`acquisition-tab ${activeTab === 'buy' ? 'acquisition-tab--active' : ''}`}
                  onClick={() => setActiveTab('buy')}
                >
                  Option B: Buy Outright (₹{item.buyPrice})
                </button>
              </div>

              {activeTab === 'rent' ? (
                <div className="acquisition-tab-panel">
                  <label className="tenure-label">Select Rental Commitment:</label>
                  <div className="tenure-pills">
                    {RENTAL_TENURES.map((t) => (
                      <button
                        key={t.months}
                        type="button"
                        className={`tenure-pill ${selectedTenureMonths === t.months ? 'tenure-pill--active' : ''}`}
                        onClick={() => setSelectedTenureMonths(t.months)}
                      >
                        <span className="tenure-pill__months">{t.label}</span>
                        <span className="tenure-pill__discount">{t.discountLabel}</span>
                        <span className="tenure-pill__price tabular-nums">
                          ₹{Math.round(item.rentMonthly * t.discountMultiplier)}/mo
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="rent-equity-calculator-summary">
                    <div className="summary-row">
                      <span>Monthly Rental Charge:</span>
                      <strong className="tabular-nums">₹{effectiveMonthlyRent} / month</strong>
                    </div>
                    <div className="summary-row text-accent">
                      <span>Accrued Buyout Credit (80%):</span>
                      <strong className="tabular-nums">+₹{monthlyEquity} / month</strong>
                    </div>
                    <div className="summary-row">
                      <span>Total Credit in {selectedTenureMonths} Mos:</span>
                      <strong className="tabular-nums">-₹{totalAccruedInTenure} credited</strong>
                    </div>
                    <div className="summary-row summary-row--highlight">
                      <span>If you love it, buyout for only:</span>
                      <strong className="tabular-nums">₹{remainingResidual}</strong>
                    </div>
                  </div>

                  <p className="rent-reassurance-note">
                    ✓ Free delivery & assembly · Swap or return hassle-free if your aesthetic changes · Zero long-term debt.
                  </p>
                </div>
              ) : (
                <div className="acquisition-tab-panel">
                  <div className="buy-summary-box">
                    <div className="summary-row summary-row--lg">
                      <span>Purchase Price:</span>
                      <strong className="tabular-nums text-2xl">₹{item.buyPrice}</strong>
                    </div>
                    <p className="buy-perks">
                      ✓ Direct ownership · 5-year structural warranty · White-glove in-room placement included · 30-day aesthetic satisfaction trial.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="btn btn--primary btn--xl btn--full"
                onClick={handleAction}
              >
                {activeTab === 'rent'
                  ? `Rent Now (₹${effectiveMonthlyRent}/mo)`
                  : `Purchase Outright (₹${item.buyPrice})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

