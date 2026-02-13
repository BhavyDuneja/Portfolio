// Simple authentication utility for admin panel
// In production, replace this with a proper authentication system

const ADMIN_PASSWORD_KEY = 'admin_password'
const ADMIN_SESSION_KEY = 'admin_session'

// Set admin password (should be done once, or via environment variable)
export const setAdminPassword = (password: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(ADMIN_PASSWORD_KEY, password)
}

// Get admin password from environment or localStorage
const getAdminPassword = (): string => {
  if (typeof window === 'undefined') return ''
  
  // Check environment variable first (for production)
  const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
  if (envPassword) return envPassword
  
  // Fallback to localStorage (for development)
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || 'admin123' // Default password
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const session = localStorage.getItem(ADMIN_SESSION_KEY)
  if (!session) return false
  
  // Check if session is still valid (24 hours)
  try {
    const sessionData = JSON.parse(session)
    const now = Date.now()
    if (now - sessionData.timestamp > 24 * 60 * 60 * 1000) {
      // Session expired
      logout()
      return false
    }
    return true
  } catch {
    return false
  }
}

// Login function
export const login = (password: string): boolean => {
  if (typeof window === 'undefined') return false
  
  const correctPassword = getAdminPassword()
  
  if (password === correctPassword) {
    // Create session
    const sessionData = {
      timestamp: Date.now(),
      authenticated: true
    }
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData))
    return true
  }
  
  return false
}

// Logout function
export const logout = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ADMIN_SESSION_KEY)
}
