import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiUser, FiMail, FiPhone, FiLock, FiUserPlus } from 'react-icons/fi'
import { registerUser } from '../../store/slices/authSlice'
import Input from '../common/Input'
import Button from '../common/Button'
import { toast } from '../common/Toast'

const SignupForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(state => state.auth)

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.phone) e.phone = 'Phone is required'
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const { confirmPassword, ...data } = form
    const result = await dispatch(registerUser(data))
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Welcome to TastyHome 🎉')
      navigate('/')
    } else {
      toast.error(result.payload || 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        name="name"
        placeholder="John Doe"
        value={form.name}
        onChange={handleChange}
        icon={FiUser}
        error={errors.name}
        required
      />
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
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="10-digit mobile number"
        value={form.phone}
        onChange={handleChange}
        icon={FiPhone}
        error={errors.phone}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Create a strong password"
        value={form.password}
        onChange={handleChange}
        icon={FiLock}
        error={errors.password}
        required
      />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Repeat your password"
        value={form.confirmPassword}
        onChange={handleChange}
        icon={FiLock}
        error={errors.confirmPassword}
        required
      />

      <p className="text-xs text-gray-500">
        By signing up, you agree to our{' '}
        <Link to="#" className="text-primary underline">Terms of Service</Link> and{' '}
        <Link to="#" className="text-primary underline">Privacy Policy</Link>
      </p>

      <Button type="submit" loading={loading} fullWidth size="lg">
        <FiUserPlus size={18} />
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
      </p>
    </form>
  )
}

export default SignupForm
