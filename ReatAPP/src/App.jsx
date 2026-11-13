import { useState } from 'react'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { CartDrawer } from './components/layout/CartDrawer'
import { ProductModal } from './components/furniture/ProductModal'
import { HeroSection } from './sections/HeroSection'
import { ValuePillars } from './sections/ValuePillars'
import { RentalListingSection } from './sections/RentalListingSection'
import { BuyListingSection } from './sections/BuyListingSection'
import { AestheticStorySection } from './sections/AestheticStorySection'
import { FaqSection } from './sections/FaqSection'
import { RentToOwnCalculator } from './components/calculator/RentToOwnCalculator'
import { AuthSection } from './sections/AuthSection'
import { CheckoutPaymentReceiptSection } from './sections/CheckoutPaymentReceiptSection'
import { FURNITURE_ITEMS } from './data/furniture'
import { useReducedMotionPreference } from './hooks/useReducedMotion'
import { authService } from './services/authService'

function App() {
  const [activeView, setActiveView] = useState('overview') // 'overview' | 'rent' | 'buy' | 'calculator' | 'login' | 'signup' | 'checkout'
  const [selectedSpace, setSelectedSpace] = useState('all') // 'all' | 'home' | 'office'
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [modalItem, setModalItem] = useState(null)
  const [modalFinish, setModalFinish] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser())

  // Motion preference hook for accessible animations
  useReducedMotionPreference()

  const featuredHeroItem = FURNITURE_ITEMS[0]

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  const handleOpenModal = (item, finish) => {
    setModalItem(item)
    setModalFinish(finish || item.finishes[0])
  }

  const handleCloseModal = () => {
    setModalItem(null)
    setModalFinish(null)
  }

  const handleAddToCart = (actionPayload) => {
    const { item, selectedFinish, mode, tenureMonths, unitPrice } = actionPayload
    const finishToUse = selectedFinish || item.finishes[0]

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (entry) =>
          entry.item.id === item.id &&
          entry.selectedFinish?.id === finishToUse.id &&
          entry.mode === mode &&
          entry.tenureMonths === tenureMonths
      )

      if (existingIndex > -1) {
        const next = [...prevItems]
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        }
        return next
      }

      return [
        ...prevItems,
        {
          item,
          selectedFinish: finishToUse,
          mode,
          tenureMonths,
          unitPrice,
          quantity: 1,
        },
      ]
    })

    const modeLabel = mode === 'rent' ? `Rental plan (${tenureMonths || 3} mos)` : 'Purchase'
    showToast(`Added ${item.name} [${finishToUse.name}] to ${modeLabel}`)
    setIsCartOpen(true)
  }

  const handleUpdateQuantity = (cartItem, delta) => {
    setCartItems((prev) => {
      return prev
        .map((entry) => {
          if (
            entry.item.id === cartItem.item.id &&
            entry.selectedFinish?.id === cartItem.selectedFinish?.id &&
            entry.mode === cartItem.mode &&
            entry.tenureMonths === cartItem.tenureMonths
          ) {
            const nextQty = entry.quantity + delta
            return nextQty > 0 ? { ...entry, quantity: nextQty } : null
          }
          return entry
        })
        .filter(Boolean)
    })
  }

  const handleRemoveItem = (cartItem) => {
    setCartItems((prev) =>
      prev.filter(
        (entry) =>
          !(
            entry.item.id === cartItem.item.id &&
            entry.selectedFinish?.id === cartItem.selectedFinish?.id &&
            entry.mode === cartItem.mode &&
            entry.tenureMonths === cartItem.tenureMonths
          )
      )
    )
  }

  const handleClearCart = () => {
    setCartItems([])
  }

  const handleLogout = () => {
    authService.logout()
    setCurrentUser(null)
    showToast('Signed out of AURA account.')
  }

  const handleAuthSuccess = (user) => {
    setCurrentUser(user)
    showToast(`Signed in as ${user.name}`)
  }

  const handleProceedToCheckout = () => {
    setIsCartOpen(false)
    setActiveView('checkout')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenReceipts = () => {
    setActiveView('checkout')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0)

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Navbar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedSpace={selectedSpace}
        onSpaceSelect={setSelectedSpace}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenReceipts={handleOpenReceipts}
      />

      <main id="main-content">
        {activeView === 'overview' && (
          <>
            <HeroSection
              onViewChange={setActiveView}
              onInspectItem={handleOpenModal}
              featuredItem={featuredHeroItem}
            />

            <ValuePillars
              onOpenCalculator={() => {
                setActiveView('calculator')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />

            {/* Curated Rental Listing Section */}
            <RentalListingSection
              selectedSpace={selectedSpace}
              onSpaceChange={setSelectedSpace}
              onInspectItem={handleOpenModal}
              onAddToCart={handleAddToCart}
            />

            {/* Separate Curated Buying Listing Section */}
            <BuyListingSection
              selectedSpace={selectedSpace}
              onSpaceChange={setSelectedSpace}
              onInspectItem={handleOpenModal}
              onAddToCart={handleAddToCart}
              onSwitchToRent={() => {
                setActiveView('rent')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />

            <RentToOwnCalculator onSelectPieceForCart={handleAddToCart} />

            <AestheticStorySection onViewChange={setActiveView} />

            <FaqSection
              onOpenCalculator={() => {
                setActiveView('calculator')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </>
        )}

        {activeView === 'rent' && (
          <RentalListingSection
            selectedSpace={selectedSpace}
            onSpaceChange={setSelectedSpace}
            onInspectItem={handleOpenModal}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeView === 'buy' && (
          <BuyListingSection
            selectedSpace={selectedSpace}
            onSpaceChange={setSelectedSpace}
            onInspectItem={handleOpenModal}
            onAddToCart={handleAddToCart}
            onSwitchToRent={() => {
              setActiveView('rent')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {activeView === 'calculator' && (
          <RentToOwnCalculator onSelectPieceForCart={handleAddToCart} />
        )}

        {(activeView === 'login' || activeView === 'signup') && (
          <AuthSection
            initialMode={activeView}
            onAuthSuccess={handleAuthSuccess}
            onViewChange={setActiveView}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutPaymentReceiptSection
            bagItems={cartItems}
            currentUser={currentUser}
            onClearBag={handleClearCart}
            onViewChange={setActiveView}
          />
        )}
      </main>

      <Footer onViewChange={setActiveView} />

      {/* Cart & Rental Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Aesthetic Detail & Acquisition Modal */}
      {modalItem && (
        <ProductModal
          item={modalItem}
          initialFinish={modalFinish}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice" role="status" aria-live="polite">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  )
}

export default App
