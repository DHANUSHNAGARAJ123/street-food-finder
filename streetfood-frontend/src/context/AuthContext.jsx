import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('sf_token')
    const savedUser  = localStorage.getItem('sf_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (authResponse) => {
    const userData = {
      id:    authResponse.userId,
      name:  authResponse.name,
      email: authResponse.email,
      role:  authResponse.role
    }
    setToken(authResponse.token)
    setUser(userData)
    localStorage.setItem('sf_token', authResponse.token)
    localStorage.setItem('sf_user',  JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('sf_token')
    localStorage.removeItem('sf_user')
  }

  return (
    <AuthContext.Provider value={{
      user, token, login, logout,
      isAuthenticated: !!token,
      role: user?.role || null,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}