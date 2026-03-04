import React, { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LoginForm from '../components/auth/LoginForm'
import Logo from '../components/common/Logo'

export default function LoginPage() {
  const { isAuthenticated, isAdmin, isDelivery } = useAuth()

  if (isAuthenticated) {
    if (isAdmin) return <Navigate to="/admin/dashboard" replace />
    if (isDelivery) return <Navigate to="/delivery/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-2xl font-extrabold text-dark dark:text-white">Welcome back!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to continue ordering</p>
          </div>
          <LoginForm />
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} TastyHome. All rights reserved.
        </p>
      </div>
    </div>
  )
}
