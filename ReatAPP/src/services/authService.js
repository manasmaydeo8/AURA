const STORAGE_KEY = 'aura_auth_user'
const USERS_REGISTRY_KEY = 'aura_registered_users'

const DEFAULT_DEMO_USER = {
  id: 'usr_demo_vance',
  name: 'Eleanor Vance',
  email: 'eleanor.vance@studioarch.com',
  phone: '+91 98765 43210',
  address: '428 Mercer St, Floor 4, Bengaluru, Karnataka 560001',
  accountType: 'Residential Living',
  joinedDate: 'November 2026'
}

export const authService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
      return null
    } catch {
      return null
    }
  },

  getRegisteredUsers() {
    try {
      const stored = localStorage.getItem(USERS_REGISTRY_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
      return [
        {
          ...DEFAULT_DEMO_USER,
          password: 'password123'
        }
      ]
    } catch {
      return [
        {
          ...DEFAULT_DEMO_USER,
          password: 'password123'
        }
      ]
    }
  },

  login(email, password) {
    const trimmedEmail = (email || '').trim().toLowerCase()
    const users = this.getRegisteredUsers()

    const match = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    )

    if (match) {
      const sessionUser = {
        id: match.id,
        name: match.name,
        email: match.email,
        phone: match.phone || '+91 98765 43210',
        address: match.address || '428 Mercer St, Bengaluru, Karnataka 560001',
        accountType: match.accountType || 'Residential Living',
        joinedDate: match.joinedDate || 'November 2026'
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser))
      return { success: true, user: sessionUser }
    }

    return {
      success: false,
      error: 'Invalid email or password. Use demo account or create a new one.'
    }
  },

  signup(userData) {
    const trimmedEmail = (userData.email || '').trim().toLowerCase()
    const users = this.getRegisteredUsers()

    const exists = users.some((u) => u.email.toLowerCase() === trimmedEmail)
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name.trim(),
      email: trimmedEmail,
      password: userData.password,
      phone: userData.phone ? userData.phone.trim() : '+91 98765 43210',
      address: userData.address ? userData.address.trim() : 'Bengaluru, Karnataka 560001',
      accountType: userData.accountType || 'Residential Living',
      joinedDate: new Intl.DateTimeFormat('en-IN', {
        month: 'long',
        year: 'numeric'
      }).format(new Date())
    }

    users.push(newUser)
    try {
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users))
      const sessionUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        accountType: newUser.accountType,
        joinedDate: newUser.joinedDate
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser))
      return { success: true, user: sessionUser }
    } catch {
      return { success: false, error: 'Failed to save account to local storage.' }
    }
  },

  logout() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  },

  getDemoCredentials() {
    return {
      email: DEFAULT_DEMO_USER.email,
      password: 'password123',
      name: DEFAULT_DEMO_USER.name
    }
  }
}

