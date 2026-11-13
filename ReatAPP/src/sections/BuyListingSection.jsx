import { useState, useMemo } from 'react'
import { FurnitureCard } from '../components/furniture/FurnitureCard'
import { FURNITURE_ITEMS, SPACES, CATEGORIES } from '../data/furniture'

export function BuyListingSection({
  selectedSpace,
  onSpaceChange,
  onInspectItem,
  onAddToCart,
  onSwitchToRent,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured') // 'featured' | 'price-asc' | 'price-desc'

  const filteredItems = useMemo(() => {
    return FURNITURE_ITEMS.filter((item) => {
      const matchesSpace = selectedSpace === 'all' || item.space === selectedSpace
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const matchesPrice = item.buyPrice <= maxPrice
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.materials.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSpace && matchesCategory && matchesPrice && matchesSearch
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.buyPrice - b.buyPrice
      }
      if (sortBy === 'price-desc') {
        return b.buyPrice - a.buyPrice
      }
      return b.rating - a.rating
    })
  }, [selectedSpace, selectedCategory, maxPrice, searchQuery, sortBy])

  return (
    <section id="buy-section" className="catalog-section" aria-labelledby="buy-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill badge-pill--dark">Direct Purchase Showroom</div>
          <h2 id="buy-heading" className="section-title">
            Buy Architectural Furniture Outright
          </h2>
          <p className="section-subtitle">
            Permanent acquisitions for discerning homeowners, studios, and executive corporate offices. Includes 5-year structural warranty and white-glove setup.
          </p>
        </div>

        {/* Informational Banner */}
        <div className="buy-info-banner">
          <div className="buy-info-icon" aria-hidden="true">💡</div>
          <div className="buy-info-content">
            <strong>Unsure if the piece fits your aesthetic?</strong>
            <span>You can rent any piece below first with zero long-term contract. 80% of rent accrues directly to your buyout price.</span>
          </div>
          <button
            type="button"
            className="btn btn--subtle-accent"
            onClick={onSwitchToRent}
          >
            Explore Rental Option →
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="filter-controls-bar">
          <div className="filter-group">
            {/* Space Filter */}
            <div className="pill-group" role="group" aria-label="Filter by environment">
              {SPACES.map((space) => (
                <button
                  key={space.id}
                  type="button"
                  className={`pill-btn ${selectedSpace === space.id ? 'pill-btn--active' : ''}`}
                  onClick={() => onSpaceChange(space.id)}
                >
                  {space.label}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group-right">
            {/* Max Price Filter */}
            <div className="price-filter-group">
              <label htmlFor="max-price-input" className="price-filter-label">
                Max: <span className="tabular-nums">₹{maxPrice}</span>
              </label>
              <input
                id="max-price-input"
                type="range"
                min="300"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="price-range-slider"
              />
            </div>

            {/* Search Input */}
            <div className="search-box">
              <input
                type="search"
                placeholder="Search furniture to buy..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search purchase pieces"
              />
            </div>

            {/* Sort Select */}
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort purchase pieces"
            >
              <option value="featured">Sort by Rating</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="catalog-meta-row">
          <span className="results-count tabular-nums">
            Showing <strong>{filteredItems.length}</strong> purchase-ready pieces
            {selectedSpace !== 'all' && ` for ${selectedSpace}`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </span>
          <span className="tenure-active-badge">
            ✓ White-glove assembly & 5-year warranty included
          </span>
        </div>

        {/* Product Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="empty-catalog-message">
            <h3>No pieces found under ₹{maxPrice}</h3>
            <p>Try widening your price range or resetting filters.</p>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => {
                setMaxPrice(5000)
                setSelectedCategory('all')
                setSearchQuery('')
                onSpaceChange('all')
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="furniture-grid">
            {filteredItems.map((item) => (
              <FurnitureCard
                key={item.id}
                item={item}
                mode="buy"
                onInspect={onInspectItem}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

