import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authApi, type AuthResponse } from '../services/authApi'

const TOKEN_KEY = 'tesso-token'
const USER_KEY = 'tesso-user'

type AuthUser = Omit<AuthResponse, 'accessToken' | 'tokenType'>

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: {
    email: string
    password: string
    fullName: string
    phone?: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

function persist(auth: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, auth.accessToken)
  const user: AuthUser = {
    userId: auth.userId,
    customerId: auth.customerId,
    email: auth.email,
    fullName: auth.fullName,
    role: auth.role,
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<AuthUser | null>(() => loadUser())

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password })
    setToken(res.accessToken)
    setUser(persist(res))
  }, [])

  const register = useCallback(
    async (input: { email: string; password: string; fullName: string; phone?: string }) => {
      const res = await authApi.register(input)
      setToken(res.accessToken)
      setUser(persist(res))
    },
    [],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [user, token, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
