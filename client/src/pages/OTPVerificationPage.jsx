import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import OTPInput from '../components/auth/OTPInput'
import authService from '../services/authService'
import { toast } from '../components/common/Toast'
import Logo from '../components/common/Logo'

export default function OTPVerificationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  const [loading, setLoading] = useState(false)

  const handleComplete = async (otp) => {
    setLoading(true)
    try {
      await authService.verifyOTP({ email, otp })
      toast.success('Email verified successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <div className="text-5xl mb-4">📬</div>
        <h1 className="text-2xl font-extrabold text-dark dark:text-white mb-2">Verify your email</h1>
        <p className="text-gray-500 text-sm mb-6">
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
        <OTPInput length={6} onComplete={handleComplete} disabled={loading} />
        <p className="text-gray-400 text-sm mt-6">
          Didn't receive it?{' '}
          <button className="text-primary font-semibold hover:underline">Resend OTP</button>
        </p>
      </div>
    </div>
  )
}
