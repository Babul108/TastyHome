import React, { useState } from 'react'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import authService from '../services/authService'
import { toast } from '../components/common/Toast'
import Logo from '../components/common/Logo'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email'); return }
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
      toast.success('Reset link sent to your email!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-dark dark:text-white mb-2">Check your inbox!</h2>
            <p className="text-gray-500 text-sm mb-6">We've sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login" className="btn-primary inline-flex items-center gap-2">
              <FiArrowLeft />Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-dark dark:text-white mb-2">Forgot Password?</h1>
            <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={FiMail}
                placeholder="you@example.com"
                required
              />
              <Button type="submit" loading={loading} fullWidth size="lg">
                Send Reset Link
              </Button>
            </form>
            <Link to="/login" className="flex items-center justify-center gap-1.5 mt-4 text-sm text-gray-500 hover:text-primary transition-colors">
              <FiArrowLeft size={16} />Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
