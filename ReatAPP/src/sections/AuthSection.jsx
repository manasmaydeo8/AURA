import { useState } from 'react'
import { authService } from '../services/authService'

export function AuthSection({ initialMode = 'login', onAuthSuccess, onViewChange }) {
  const [mode, setMode] = useState(initialMode) // 'login' | 'signup'
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    accountType: 'Residential Living',
    password: '',
    confirmPassword: ''
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleUseDemo = () => {
    const demo = authService.getDemoCredentials()
    setLoginEmail(demo.email)
    setLoginPassword(demo.password)
    setErrorMessage('')
    setSuccessMessage('Demo credentials populated. Click "Sign In" below.')
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please fill in both email and password.')
      return
    }

    const result = authService.login(loginEmail, loginPassword)
    if (result.success) {
      setSuccessMessage(`Welcome back, ${result.user.name}!`)
      setTimeout(() => {
        onAuthSuccess(result.user)
        onViewChange('overview')
      }, 700)
    } else {
      setErrorMessage(result.error || 'Authentication failed.')
    }
  }

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      setErrorMessage('Please enter your name, email, and password.')
      return
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    if (signupForm.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    const result = authService.signup(signupForm)
    if (result.success) {
      setSuccessMessage(`Account created successfully! Welcome, ${result.user.name}.`)
      setTimeout(() => {
        onAuthSuccess(result.user)
        onViewChange('overview')
      }, 800)
    } else {
      setErrorMessage(result.error || 'Could not complete registration.')
    }
  }

  return (
    <div className="auth-section-wrapper">
      <div className="container">
        <div className="auth-container-card">
          <div className="auth-card-sidebar">
            <span className="auth-brand-badge">AURA Architectural Membership</span>
            <h2 className="auth-sidebar-title">
              {mode === 'login'
                ? 'Resume your architectural journey.'
                : 'Curate your space with flexible equity.'}
            </h2>
            <p className="auth-sidebar-copy">
              Unlock our 80% rent-to-own equity ledger, track white-glove assembly, and access your generated tax invoices & receipts anywhere.
            </p>

            <div className="auth-sidebar-perks">
              <div className="perk-item">
                <span className="perk-icon">✦</span>
                <div>
                  <strong>80% Equity Accumulation</strong>
                  <p>Every monthly rental payment automatically counts toward permanent buyout ownership.</p>
                </div>
              </div>
              <div className="perk-item">
                <span className="perk-icon">✦</span>
                <div>
                  <strong>Tax Invoices & Digital Receipts</strong>
                  <p>Itemized invoices with GST and verified transaction receipts saved automatically.</p>
                </div>
              </div>
              <div className="perk-item">
                <span className="perk-icon">✦</span>
                <div>
                  <strong>White-Glove Priority Service</strong>
                  <p>Complimentary setup, seasonal swaps, and dedicated concierge access.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-card-main">
            {/* Tab Switcher */}
            <div className="auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                className={`auth-tab-btn ${mode === 'login' ? 'auth-tab-btn--active' : ''}`}
                onClick={() => {
                  setMode('login')
                  setErrorMessage('')
                  setSuccessMessage('')
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                className={`auth-tab-btn ${mode === 'signup' ? 'auth-tab-btn--active' : ''}`}
                onClick={() => {
                  setMode('signup')
                  setErrorMessage('')
                  setSuccessMessage('')
                }}
              >
                Create Account
              </button>
            </div>

            {/* Error / Success Notifications */}
            {errorMessage && (
              <div className="auth-alert auth-alert--error" role="alert">
                <span>⚠</span>
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="auth-alert auth-alert--success" role="status">
                <span>✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-field">
                  <label htmlFor="auth-login-email">Email Address</label>
                  <input
                    id="auth-login-email"
                    type="email"
                    required
                    placeholder="e.g. eleanor.vance@studioarch.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="auth-input"
                  />
                </div>

                <div className="form-field">
                  <div className="form-label-row">
                    <label htmlFor="auth-login-password">Password</label>
                    <button
                      type="button"
                      className="demo-autofill-btn"
                      onClick={handleUseDemo}
                    >
                      Fill Demo Credentials
                    </button>
                  </div>
                  <input
                    id="auth-login-password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="auth-input"
                  />
                </div>

                <div className="auth-actions-group">
                  <button type="submit" className="btn btn--primary btn--xl btn--full">
                    Sign In to AURA
                  </button>
                </div>

                <div className="auth-footer-prompt">
                  <span>Don&apos;t have an account yet?</span>
                  <button
                    type="button"
                    className="auth-link-inline"
                    onClick={() => {
                      setMode('signup')
                      setErrorMessage('')
                      setSuccessMessage('')
                    }}
                  >
                    Create one now →
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="auth-form">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="auth-signup-name">Full Name</label>
                    <input
                      id="auth-signup-name"
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={signupForm.name}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, name: e.target.value })
                      }
                      className="auth-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="auth-signup-email">Email Address</label>
                    <input
                      id="auth-signup-email"
                      type="email"
                      required
                      placeholder="e.g. eleanor@studio.com"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, email: e.target.value })
                      }
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="auth-signup-phone">Phone Number (+91)</label>
                    <input
                      id="auth-signup-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={signupForm.phone}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, phone: e.target.value })
                      }
                      className="auth-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="auth-signup-type">Environment Focus</label>
                    <select
                      id="auth-signup-type"
                      value={signupForm.accountType}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, accountType: e.target.value })
                      }
                      className="auth-input auth-select"
                    >
                      <option value="Residential Living">Home & Residential</option>
                      <option value="Office & Studio Architecture">Office & Executive Studio</option>
                      <option value="Interior Design Practice">Interior Design Practice</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="auth-signup-address">Delivery Address</label>
                  <input
                    id="auth-signup-address"
                    type="text"
                    placeholder="e.g. 428 Mercer St, Floor 4, Bengaluru, Karnataka"
                    value={signupForm.address}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, address: e.target.value })
                    }
                    className="auth-input"
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label htmlFor="auth-signup-pwd">Password (6+ characters)</label>
                    <input
                      id="auth-signup-pwd"
                      type="password"
                      required
                      placeholder="Create password"
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, password: e.target.value })
                      }
                      className="auth-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="auth-signup-confirm-pwd">Confirm Password</label>
                    <input
                      id="auth-signup-confirm-pwd"
                      type="password"
                      required
                      placeholder="Confirm password"
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, confirmPassword: e.target.value })
                      }
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-actions-group">
                  <button type="submit" className="btn btn--primary btn--xl btn--full">
                    Complete Registration & Enter
                  </button>
                </div>

                <div className="auth-footer-prompt">
                  <span>Already an AURA member?</span>
                  <button
                    type="button"
                    className="auth-link-inline"
                    onClick={() => {
                      setMode('login')
                      setErrorMessage('')
                      setSuccessMessage('')
                    }}
                  >
                    Sign In instead →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
