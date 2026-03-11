// Database-backed authentication using Supabase
// bcrypt operations happen server-side via API routes

const AUTH_SESSION_KEY = 'auth_session'
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'writer'
  avatarUrl: string | null
}

interface StoredSession {
  user: AuthUser
  timestamp: number
}

// Login: call server-side API route (bcrypt runs on server)
export const loginUser = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) return null

    const data = await res.json()
    const user: AuthUser = data.user

    // Store session in localStorage
    if (typeof window !== 'undefined') {
      const session: StoredSession = {
        user,
        timestamp: Date.now(),
      }
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
    }

    return user
  } catch {
    return null
  }
}

// Logout: clear session from localStorage
export const logoutUser = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_SESSION_KEY)
}

// For backward compatibility with existing code that uses logout()
export const logout = logoutUser

// Check if user is authenticated and return user data (check localStorage session + expiry)
export const getAuthUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null

  const raw = localStorage.getItem(AUTH_SESSION_KEY)
  if (!raw) return null

  try {
    const session: StoredSession = JSON.parse(raw)
    const elapsed = Date.now() - session.timestamp

    if (elapsed > SESSION_EXPIRY_MS) {
      // Session expired
      logoutUser()
      return null
    }

    return session.user
  } catch {
    logoutUser()
    return null
  }
}

// Check if authenticated
export const isAuthenticated = (): boolean => {
  return getAuthUser() !== null
}

// Register new user (admin only action) via server-side API route
export const registerUser = async (
  email: string,
  password: string,
  name: string,
  role: string
): Promise<AuthUser | null> => {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    })

    if (!res.ok) return null

    const data = await res.json()
    return data.user
  } catch {
    return null
  }
}

// Get all users (for admin panel)
export const getAllUsers = async (): Promise<AuthUser[]> => {
  try {
    const res = await fetch('/api/auth/users', {
      method: 'GET',
    })

    if (!res.ok) return []

    const data = await res.json()
    return data.users
  } catch {
    return []
  }
}

// Update user
export const updateUser = async (
  id: string,
  updates: { name?: string; role?: string; avatarUrl?: string }
): Promise<boolean> => {
  try {
    const res = await fetch('/api/auth/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })

    return res.ok
  } catch {
    return false
  }
}

// Delete user
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch('/api/auth/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    return res.ok
  } catch {
    return false
  }
}

// Change password (via server-side API route for bcrypt hashing)
export const changePassword = async (userId: string, newPassword: string): Promise<boolean> => {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newPassword }),
    })

    return res.ok
  } catch {
    return false
  }
}
