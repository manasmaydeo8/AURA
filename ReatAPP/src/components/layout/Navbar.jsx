export function Navbar({
  activeView,
  onViewChange,
  cartCount,
  onOpenCart,
  selectedSpace,
  onSpaceSelect,
  currentUser,
  onLogout,
  onOpenReceipts,
}) {
  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

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

          {/* User Account Cluster */}
          {currentUser ? (
            <div className="user-nav-cluster">
              <button
                type="button"
                className="user-profile-badge"
                onClick={onOpenReceipts}
                title={`Signed in as ${currentUser.name} (${currentUser.email}). Click to view tax receipts.`}
              >
                <span className="user-avatar-circle">{getInitials(currentUser.name)}</span>
                <span className="user-name-label">{currentUser.name.split(' ')[0]}</span>
              </button>
              <button
                type="button"
                className="receipts-nav-btn"
                onClick={onOpenReceipts}
                title="View your verified payment receipts & tax invoices"
              >
                Receipts 🧾
              </button>
              <button
                type="button"
                className="logout-nav-btn"
                onClick={onLogout}
                title="Sign out of your account"
              >
                Exit
              </button>
            </div>
          ) : (
            <div className="auth-nav-cluster">
              <button
                type="button"
                className={`auth-nav-link ${activeView === 'login' ? 'auth-nav-link--active' : ''}`}
                onClick={() => onViewChange('login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-nav-btn-pill ${activeView === 'signup' ? 'auth-nav-btn-pill--active' : ''}`}
                onClick={() => onViewChange('signup')}
              >
                Sign Up
              </button>
            </div>
          )}

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
