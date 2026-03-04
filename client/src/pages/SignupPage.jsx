import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import SignupForm from '../components/auth/SignupForm'
import Logo from '../components/common/Logo'

export default function SignupPage() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-2xl font-extrabold text-dark dark:text-white">Create an account</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Join TastyHome and start ordering</p>
          </div>
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
