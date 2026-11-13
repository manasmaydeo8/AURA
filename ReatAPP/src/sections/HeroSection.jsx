import { useState } from 'react'

export function HeroSection({ onViewChange, onInspectItem, featuredItem }) {
  const [heroFinish, setHeroFinish] = useState(featuredItem?.finishes[0])

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-grid">
          {/* Text Narrative Column */}
          <div className="hero-text-col">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              <span>Modern Architectural Furniture · Home & Office</span>
            </div>

            <h1 id="hero-title" className="hero-headline">
              Live with it.<br />
              <span className="headline-highlight">Rent first.</span><br />
              Own forever.
            </h1>

            <p className="hero-description">
              Finding furniture that resonates with your home light and office workflow takes time. Rent iconic pieces month-to-month to test your space aesthetics. If it feels right, 80% of your rent credits directly toward owning it.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={() => onViewChange('rent')}
              >
                Browse Rental Pieces (From ₹18/mo)
              </button>
              <button
                type="button"
                className="btn btn--outline btn--lg"
                onClick={() => onViewChange('buy')}
              >
                Showroom Direct Buy
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="hero-metrics-strip">
              <div className="metric-pill">
                <span className="metric-num tabular-nums">80%</span>
                <span className="metric-lbl">Rent Equity Credit</span>
              </div>
              <div className="metric-divider" aria-hidden="true" />
              <div className="metric-pill">
                <span className="metric-num tabular-nums">30 Days</span>
                <span className="metric-lbl">Aesthetic Trial</span>
              </div>
              <div className="metric-divider" aria-hidden="true" />
              <div className="metric-pill">
                <span className="metric-num tabular-nums">₹0</span>
                <span className="metric-lbl">White-Glove Assembly</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Column */}
          <div className="hero-visual-col">
            <div className="hero-showcase-card">
              <div className="hero-image-frame">
                <img
                  src={heroFinish?.image || featuredItem.image}
                  alt={`${featuredItem.name} in ${heroFinish?.name}`}
                  className="hero-primary-image"
                  width="700"
                  height="520"
                />
                <div className="hero-card-floating-badge">
                  <span className="floating-badge-tag">Featured Masterpiece</span>
                  <span className="floating-badge-price tabular-nums">
                    Rent ₹{featuredItem.rentMonthly}/mo · Buy ₹{featuredItem.buyPrice}
                  </span>
                </div>
              </div>

              <div className="hero-showcase-footer">
                <div>
                  <h2 className="hero-card-title">{featuredItem.name}</h2>
                  <p className="hero-card-sub">{featuredItem.tagline}</p>
                </div>

                <div className="hero-swatch-cluster" role="radiogroup" aria-label="Hero piece finish">
                  {featuredItem.finishes.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      role="radio"
                      aria-checked={heroFinish?.id === f.id}
                      className={`hero-swatch-dot ${heroFinish?.id === f.id ? 'hero-swatch-dot--active' : ''}`}
                      style={{ backgroundColor: f.color }}
                      title={f.name}
                      onClick={() => setHeroFinish(f)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn--subtle"
                  onClick={() => onInspectItem(featuredItem, heroFinish)}
                >
                  View Details & Buyout Terms →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

