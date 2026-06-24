import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { User } from '@/types'
import { authService } from '@/services/authService'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser())
  const [isLoading, setIsLoading] = useState(() => authService.isAuthenticated())

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      setUser(null)
      setIsLoading(false)
      return
    }

    authService.restoreSession().then((restored) => {
      setUser(restored)
      setIsLoading(false)
    })
  }, [])

  const login = useCallback((nextUser: User) => {
    setUser(nextUser)
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setIsLoading(false)
  }, [])

  const isAuthenticated = authService.isAuthenticated() && !!user && !isLoading

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
