export function Navbar({
  activeView,
  onViewChange,
  cartCount,
  onOpenCart,
  selectedSpace,
  onSpaceSelect,
}) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <button
          type="button"
          className="brand-logo-btn"
          onClick={() => onViewChange('overview')}
        >
          <span className="brand-title">AURA</span>
          <span className="brand-subtitle">Home & Office Architecture</span>
        </button>

        {/* Primary View Switcher */}
        <nav className="site-nav" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-link ${activeView === 'overview' ? 'nav-link--active' : ''}`}
            onClick={() => onViewChange('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`nav-link ${activeView === 'rent' ? 'nav-link--active' : ''}`}
            onClick={() => onViewChange('rent')}
          >
            <span>Rent Furniture</span>
            <span className="nav-pill-badge">80% Credit</span>
          </button>
          <button
            type="button"
            className={`nav-link ${activeView === 'buy' ? 'nav-link--active' : ''}`}
            onClick={() => onViewChange('buy')}
          >
            <span>Buy Furniture</span>
            <span className="nav-pill-badge nav-pill-badge--dark">Outright</span>
          </button>
          <button
            type="button"
            className={`nav-link ${activeView === 'calculator' ? 'nav-link--active' : ''}`}
            onClick={() => onViewChange('calculator')}
          >
            Equity Calculator
          </button>
        </nav>

        {/* Right Action Cluster */}
        <div className="header-actions">
          {/* Space Filter Pill */}
          <div className="space-toggle-pill" role="group" aria-label="Filter by environment">
            <button
              type="button"
              className={`space-btn ${selectedSpace === 'all' ? 'space-btn--active' : ''}`}
              onClick={() => onSpaceSelect('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`space-btn ${selectedSpace === 'home' ? 'space-btn--active' : ''}`}
              onClick={() => onSpaceSelect('home')}
            >
              Home
            </button>
            <button
              type="button"
              className={`space-btn ${selectedSpace === 'office' ? 'space-btn--active' : ''}`}
              onClick={() => onSpaceSelect('office')}
            >
              Office
            </button>
          </div>

          {/* Cart / Bag Button */}
          <button
            type="button"
            className="cart-trigger-btn"
            onClick={onOpenCart}
            aria-label={`Open shopping bag with ${cartCount} items`}
          >
            <span className="cart-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </span>
            <span className="cart-label">Bag</span>
            {cartCount > 0 && (
              <span className="cart-badge tabular-nums">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

