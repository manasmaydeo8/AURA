import { useState } from 'react'
import { FURNITURE_ITEMS } from '../../data/furniture'

export function RentToOwnCalculator({ onSelectPieceForCart }) {
  const [selectedId, setSelectedId] = useState(FURNITURE_ITEMS[0].id)
  const [months, setMonths] = useState(6)

  const item = FURNITURE_ITEMS.find((f) => f.id === selectedId) || FURNITURE_ITEMS[0]

  // Dynamic discount based on duration
  const discountMultiplier = months >= 12 ? 0.8 : months >= 6 ? 0.9 : 1.0
  const monthlyRent = Math.round(item.rentMonthly * discountMultiplier)
  const totalRentPaid = monthlyRent * months
  const equityCredit = Math.round(totalRentPaid * 0.8)
  const residualBuyout = Math.max(0, item.buyPrice - equityCredit)
  const percentSaved = Math.round((equityCredit / item.buyPrice) * 100)

  return (
    <section id="calculator" className="calculator-section" aria-labelledby="calculator-heading">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-eyebrow">Interactive Equity Engine</span>
          <h2 id="calculator-heading" className="section-title">Rent-to-Own Buyout Simulator</h2>
          <p className="section-subtitle">
            Not sure if a piece fits your room aesthetics? Rent first. 80% of every dollar you pay in rent is credited toward full ownership buyout.
          </p>
        </div>

        <div className="calculator-card">
          <div className="calculator-controls">
            <div className="form-group">
              <label htmlFor="furniture-picker" className="form-label">
                Choose Furniture Piece:
              </label>
              <select
                id="furniture-picker"
                className="form-select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {FURNITURE_ITEMS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.space === 'home' ? 'Home' : 'Office'}) — Rent ₹{f.rentMonthly}/mo | Buy ₹{f.buyPrice}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <div className="slider-label-row">
                <label htmlFor="tenure-slider" className="form-label">
                  Trial & Rental Duration:
                </label>
                <span className="slider-val-badge tabular-nums">
                  {months} {months === 1 ? 'Month' : 'Months'}
                </span>
              </div>
              <input
                id="tenure-slider"
                type="range"
                min="1"
                max="12"
                step="1"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="range-slider"
              />
              <div className="slider-ticks-row">
                <span>1 mo (Try)</span>
                <span>3 mos (Flex)</span>
                <span>6 mos (-10% rent)</span>
                <span>12 mos (-20% rent)</span>
              </div>
            </div>

            <div className="calculator-product-preview">
              <img
                src={item.image}
                alt={item.name}
                className="calc-preview-thumb"
                width="90"
                height="70"
              />
              <div>
                <strong className="calc-preview-name">{item.name}</strong>
                <p className="calc-preview-space">
                  {item.space === 'home' ? 'Home Aesthetic' : 'Office Workspace'} · Retail Value ₹{item.buyPrice}
                </p>
              </div>
            </div>
          </div>

          <div className="calculator-results">
            <div className="results-metrics-grid">
              <div className="metric-cell">
                <span className="metric-label">Effective Monthly Rent</span>
                <span className="metric-value tabular-nums">₹{monthlyRent}<small>/mo</small></span>
                <span className="metric-sub">{months >= 6 ? `${Math.round((1 - discountMultiplier) * 100)}% tenure discount` : 'Standard flexible'}</span>
              </div>

              <div className="metric-cell">
                <span className="metric-label">Total Rent Paid in {months} Mos</span>
                <span className="metric-value tabular-nums">₹{totalRentPaid}</span>
                <span className="metric-sub">Over {months} months</span>
              </div>

              <div className="metric-cell metric-cell--highlight">
                <span className="metric-label">Your Accrued Equity (80%)</span>
                <span className="metric-value text-accent tabular-nums">+₹{equityCredit}</span>
                <span className="metric-sub">{percentSaved}% of retail funded</span>
              </div>

              <div className="metric-cell metric-cell--primary">
                <span className="metric-label">Residual Buyout Price</span>
                <span className="metric-value tabular-nums">₹{residualBuyout}</span>
                <span className="metric-sub">Pay this to keep forever</span>
              </div>
            </div>

            {/* Visual Equity Progress Bar */}
            <div className="equity-progress-block">
              <div className="equity-progress-labels">
                <span>Accrued Equity (₹{equityCredit})</span>
                <span>Residual Buyout (₹{residualBuyout})</span>
              </div>
              <div className="equity-progress-track" role="progressbar" aria-valuenow={percentSaved} aria-valuemin="0" aria-valuemax="100">
                <div
                  className="equity-progress-fill"
                  style={{ width: `${Math.min(100, percentSaved)}%` }}
                />
              </div>
              <p className="equity-progress-summary">
                If you love the aesthetics in your room after {months} months, you simply pay the residual{' '}
                <strong className="tabular-nums">₹{residualBuyout}</strong>. If not, swap or return with zero buyout fee.
              </p>
            </div>

            <div className="calculator-actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => onSelectPieceForCart({ item, mode: 'rent', tenureMonths: months, unitPrice: monthlyRent })}
              >
                Rent This Piece (₹{monthlyRent}/mo)
              </button>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => onSelectPieceForCart({ item, mode: 'buy', tenureMonths: null, unitPrice: item.buyPrice })}
              >
                Buy Now Outright (₹{item.buyPrice})
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

