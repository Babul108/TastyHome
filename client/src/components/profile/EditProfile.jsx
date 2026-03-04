import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { FiUser, FiPhone, FiSave } from 'react-icons/fi'
import Input from '../common/Input'
import Button from '../common/Button'
import authService from '../../services/authService'
import { setUser } from '../../store/slices/authSlice'
import { toast } from '../common/Toast'

const EditProfile = ({ user, onSuccess }) => {
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setLoading(true)
    try {
      const res = await authService.updateProfile(form)
      dispatch(setUser(res.user || res))
      localStorage.setItem('user', JSON.stringify(res.user || res))
      toast.success('Profile updated successfully!')
      onSuccess?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 space-y-4">
      <h3 className="font-bold text-dark dark:text-white text-lg">Edit Profile</h3>
      <Input
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        icon={FiUser}
        required
      />
      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        value={form.phone}
        onChange={handleChange}
        icon={FiPhone}
        placeholder="10-digit mobile number"
      />
      <Button type="submit" loading={loading} fullWidth>
        <FiSave size={16} />Save Changes
      </Button>
    </form>
  )
}

export default EditProfile
