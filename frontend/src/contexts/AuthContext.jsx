import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          await fetchUser(token)
        } catch (error) {
          console.error('Error initializing auth:', error)
          logout()
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const fetchUser = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        throw new Error('Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      throw error
    }
  }

  const login = async (phone, password) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      await fetchUser(data.accessToken)
      
      switch (data.role) {
        case 'Customer':
          navigate('/')
          break
        case 'Manager':
          navigate('/manager-dashboard')
          break
        case 'Delivery Staff':
          navigate('/ds-dashboard')
          break
        case 'Sales Staff':
          navigate('/ss-dashboard')
          break
        case 'Consulting Staff':
          navigate('/cs-dashboard')
          break
        default:
          throw new Error('Invalid user role')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    navigate('/login')
  }

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      return data.accessToken
    } catch (error) {
      console.error('Error refreshing token:', error)
      logout()
      throw error
    }
  }

  return (
    (<AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>)
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}