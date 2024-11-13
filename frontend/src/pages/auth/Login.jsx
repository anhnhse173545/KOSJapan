'use client'

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Phone, Lock } from 'lucide-react'

export function LoginComponent() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const validateForm = () => {
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setError('Phone number must be exactly 10 digits.')
      return false
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return false
    }
    return true
  }

  const handleSubmit = async ( ) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      await login(phone, password)
      // The login function in AuthContext now handles redirection
    } catch (err) {
      handleLoginError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginError = ( ) => {
    if (err instanceof Error) {
      switch (err.message) {
        case 'BAD_CREDENTIALS':
          setError('Invalid phone number or password. Please try again.')
          break
        case 'ACCOUNT_DISABLED':
          setError('Your account has been disabled. Please contact support.')
          break
        case 'ACCOUNT_LOCKED':
          setError('Your account has been locked due to multiple failed attempts. Please try again later or reset your password.')
          break
        case 'NETWORK_ERROR':
          setError('Network error. Please check your internet connection and try again.')
          break
        default:
          setError('An unexpected error occurred. Please try again later.')
      }
    } else {
      setError('An unexpected error occurred. Please try again later.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-6">
            <img
              src="/koi-fish.png?height=64&width=64"
              alt="KOSJapan Logo"
              className="h-16 w-16"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Login to KOSJapan</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  required
                  disabled={loading}
                  className="pl-10"
                  maxLength={10}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pl-10"
                  minLength={8}
                />
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-gray-600 w-full">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}