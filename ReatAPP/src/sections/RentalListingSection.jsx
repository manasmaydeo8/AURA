import { useState, useMemo } from 'react'
import { FurnitureCard } from '../components/furniture/FurnitureCard'
import { FURNITURE_ITEMS, SPACES, CATEGORIES, RENTAL_TENURES } from '../data/furniture'

export function RentalListingSection({
  selectedSpace,
  onSpaceChange,
  onInspectItem,
  onAddToCart,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTenure, setSelectedTenure] = useState(RENTAL_TENURES[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured') // 'featured' | 'rent-asc' | 'rent-desc'

  const filteredItems = useMemo(() => {
    return FURNITURE_ITEMS.filter((item) => {
      const matchesSpace = selectedSpace === 'all' || item.space === selectedSpace
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.materials.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSpace && matchesCategory && matchesSearch
    }).sort((a, b) => {
      const rentA = a.rentMonthly * selectedTenure.discountMultiplier
      const rentB = b.rentMonthly * selectedTenure.discountMultiplier

      if (sortBy === 'rent-asc') {
        return rentA - rentB
      }
      if (sortBy === 'rent-desc') {
        return rentB - rentA
      }
      return b.rating - a.rating
    })
  }, [selectedSpace, selectedCategory, searchQuery, sortBy, selectedTenure])

  return (
    <section id="rental-section" className="catalog-section" aria-labelledby="rental-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-pill badge-pill--accent">Rental Section · Test Your Space</div>
          <h2 id="rental-heading" className="section-title">
            Furniture Rentals with 80% Buyout Credit
          </h2>
          <p className="section-subtitle">
            Experience the design in your home or office before committing. Every month of rent accrues equity towards outright purchase.
          </p>
        </div>

        {/* Global Tenure Selector Bar */}
        <div className="tenure-selector-bar">
          <div className="tenure-selector-intro">
            <span className="tenure-selector-label">Choose Rental Plan Duration:</span>
            <small>Longer plans unlock lower monthly payments with full buyout rights</small>
          </div>
          <div className="tenure-pills-row" role="radiogroup" aria-label="Rental Plan Duration">
            {RENTAL_TENURES.map((t) => {
              const active = selectedTenure.months === t.months
              return (
                <button
                  key={t.months}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`tenure-bar-pill ${active ? 'tenure-bar-pill--active' : ''}`}
                  onClick={() => setSelectedTenure(t)}
                >
                  <span className="tenure-bar-months">{t.label}</span>
                  <span className="tenure-bar-discount">{t.discountLabel}</span>
                </button>
              )
            })}
          </div>
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
            {/* Search Input */}
            <div className="search-box">
              <input
                type="search"
                placeholder="Search wood, chair, sofa..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search rental pieces"
              />
            </div>

            {/* Sort Select */}
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort rental pieces"
            >
              <option value="featured">Sort by Rating</option>
              <option value="rent-asc">Rent: Low to High</option>
              <option value="rent-desc">Rent: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Active Filters Summary */}
        <div className="catalog-meta-row">
          <span className="results-count tabular-nums">
            Showing <strong>{filteredItems.length}</strong> available rental pieces
            {selectedSpace !== 'all' && ` for ${selectedSpace}`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </span>
          <span className="tenure-active-badge">
            Pricing calculated for {selectedTenure.label} plan ({selectedTenure.discountLabel})
          </span>
        </div>

        {/* Product Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="empty-catalog-message">
            <h3>No pieces match your search</h3>
            <p>Try resetting your filters or search keywords.</p>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => {
                setSelectedCategory('all')
                setSearchQuery('')
                onSpaceChange('all')
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="furniture-grid">
            {filteredItems.map((item) => (
              <FurnitureCard
                key={item.id}
                item={item}
                mode="rent"
                tenureMonths={selectedTenure.months}
                discountMultiplier={selectedTenure.discountMultiplier}
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

