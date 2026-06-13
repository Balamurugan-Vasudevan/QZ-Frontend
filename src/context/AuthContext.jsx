import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, getMe } from '../api/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // restore session on page refresh
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const me = await getMe()
          setUser(me)
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }
    restoreSession()
  }, [])

  const login = async (data) => {
    const res = await loginUser(data)
    localStorage.setItem('token', res.token)
    localStorage.setItem('user',  JSON.stringify(res))
    setUser(res)
    return res
  }

  // signup removed from context — handled directly in Signup.jsx
  // and redirects to login instead of auto-logging in

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)