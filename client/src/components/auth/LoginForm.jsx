import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import { loginUser } from '../../store/slices/authSlice'
import Input from '../common/Input'
import Button from '../common/Button'
import { toast } from '../common/Toast'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(state => state.auth)

  const [form, setForm] = useState({ email: '', password: '', rememberMe: false })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = await dispatch(loginUser({ email: form.email, password: form.password }))
    if (loginUser.fulfilled.match(result)) {
      toast.success('Welcome back! 🎉')
      const role = result.payload?.user?.role
      if (role === 'admin') navigate('/admin/dashboard')
      else if (role === 'delivery') navigate('/delivery/dashboard')
      else navigate('/')
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={handleChange}
        icon={FiMail}
        error={errors.email}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={handleChange}
        icon={FiLock}
        error={errors.password}
        required
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={form.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 accent-primary rounded"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" loading={loading} fullWidth size="lg">
        <FiLogIn size={18} />
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary font-semibold hover:underline">
          Create one
        </Link>
      </p>
    </form>
  )
}

export default LoginForm
