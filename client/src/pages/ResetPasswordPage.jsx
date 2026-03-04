import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiLock } from 'react-icons/fi'
import authService from '../services/authService'
import { toast } from '../components/common/Toast'
import Logo from '../components/common/Logo'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await authService.resetPassword(token, form.password)
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.')
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
        <h1 className="text-2xl font-extrabold text-dark dark:text-white mb-2">Reset Password</h1>
        <p className="text-gray-500 text-sm mb-6">Choose a strong password for your account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
            icon={FiLock}
            placeholder="Minimum 6 characters"
            required
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
            icon={FiLock}
            placeholder="Repeat your password"
            required
          />
          <Button type="submit" loading={loading} fullWidth size="lg">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  )
}
