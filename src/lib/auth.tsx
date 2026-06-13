import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api, clearSession, getStoredUser, getToken, setSession } from './api'
import type { UserContext } from './types'

interface StoredUser extends UserContext {
  login_method?: 'FACILITY' | 'EMAIL' | 'DEMO'
}

interface AuthState {
  user: StoredUser | null
  isAuthenticated: boolean
  isDemo: boolean
  login: (email: string, password: string) => Promise<void>
  demoLogin: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => (getToken() ? getStoredUser() : null))

  const login = useCallback(async (email: string, password: string) => {
    const auth = await api.login(email, password)
    setSession(auth)
    setUser({ ...auth.user, login_method: auth.login_method })
  }, [])

  const demoLogin = useCallback(async () => {
    const auth = await api.demoLogin()
    setSession(auth)
    setUser({ ...auth.user, login_method: auth.login_method })
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated: user != null,
      isDemo: user?.login_method === 'DEMO',
      login,
      demoLogin,
      logout,
    }),
    [user, login, demoLogin, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
