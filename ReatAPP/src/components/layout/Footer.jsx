export function Footer({ onViewChange }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <span className="footer-brand-title">AURA</span>
            <p className="footer-brand-tagline">
              Architectural furniture for elevated homes and high-performance workspaces.
            </p>
            <p className="footer-ethos">
              We reject rigid ownership and disposable furniture. Rent for as long as your aesthetic demands. When you fall in love with a piece, 80% of your rent credits toward making it permanently yours.
            </p>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-heading">Collections & Acquisition</h4>
            <ul className="footer-links">
              <li>
                <button type="button" onClick={() => onViewChange('rent')}>
                  Rental Catalog (From ₹18/mo)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onViewChange('buy')}>
                  Direct Purchase Showroom
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onViewChange('calculator')}>
                  Rent-to-Own Equity Calculator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onViewChange('overview')}>
                  Curated Signature Pieces
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-heading">Client Portal</h4>
            <ul className="footer-links">
              <li>
                <button type="button" onClick={() => onViewChange('login')}>
                  Sign In to Account
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onViewChange('signup')}>
                  Create Architectural Membership
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onViewChange('checkout')}>
                  Checkout & Payment Invoices
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-heading">The Aura Standards</h4>
            <ul className="footer-list-text">
              <li>✓ 80% Rent Equity Accrual</li>
              <li>✓ Complimentary White-Glove Setup</li>
              <li>✓ 30-Day Aesthetic Exchange Guarantee</li>
              <li>✓ Zero-Landfill Circular Lifecycle</li>
              <li>✓ Certified FSC Hardwoods & Recycled Alloys</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} AURA Architecture & Living Inc. All rights reserved. Built with React & modern ESLint standards.
          </p>
          <div className="footer-legal-tags">
            <span>WCAG 2.2 AA Compliant</span>
            <span>·</span>
            <span>Circular Economy Verified</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
