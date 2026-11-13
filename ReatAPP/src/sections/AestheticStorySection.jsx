export function AestheticStorySection({ onViewChange }) {
  return (
    <section className="story-section" aria-labelledby="story-title">
      <div className="container">
        <div className="story-split-grid">
          <div className="story-card story-card--home">
            <div className="story-card__image-wrap">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80"
                alt="Architectural residential living room with Scandinavian furniture"
                className="story-card__img"
                loading="lazy"
                width="600"
                height="420"
              />
              <span className="story-card__badge">Residential Harmony</span>
            </div>
            <div className="story-card__content">
              <span className="story-card__eyebrow">The Living Space</span>
              <h3 id="story-title" className="story-card__heading">Furniture that lives, softens, and anchors.</h3>
              <p className="story-card__copy">
                From low-profile sofas in tactile bouclé to hand-carved travertine dining pedestals. Rent them for your seasonal renovations, host family gatherings, and buyout when they become the heartbeat of your home.
              </p>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => onViewChange('rent')}
              >
                Browse Home Rentals →
              </button>
            </div>
          </div>

          <div className="story-card story-card--office">
            <div className="story-card__image-wrap">
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80"
                alt="Executive modern workspace with ergonomic furniture and acoustic pods"
                className="story-card__img"
                loading="lazy"
                width="600"
                height="420"
              />
              <span className="story-card__badge">Executive Workspace</span>
            </div>
            <div className="story-card__content">
              <span className="story-card__eyebrow">The Modern Office</span>
              <h3 className="story-card__heading">Ergonomic precision meets executive presence.</h3>
              <p className="story-card__copy">
                Scale office headcount dynamically without heavy capex. Equip executive suites, conference halls, and focus pods. Convert your rental expenses directly into enterprise capital assets whenever balance sheets dictate.
              </p>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => onViewChange('buy')}
              >
                Explore Workspace Showroom →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

