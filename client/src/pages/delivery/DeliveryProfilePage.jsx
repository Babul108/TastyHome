import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDeliveryProfile } from '../../store/slices/deliverySlice'
import { FiTruck, FiUser, FiPhone, FiMail, FiEdit2, FiSave } from 'react-icons/fi'
import deliveryService from '../../services/deliveryService'
import { toast } from '../../components/common/Toast'
import Loader from '../../components/common/Loader'

export default function DeliveryProfilePage() {
  const dispatch = useDispatch()
  const { profile, loading } = useSelector(state => state.delivery)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', vehicleType: 'bike', vehicleNumber: '', bankAccount: '', ifsc: ''
  })

  useEffect(() => {
    dispatch(fetchDeliveryProfile())
  }, [dispatch])

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        phone: profile.phone || '',
        vehicleType: profile.vehicleType || 'bike',
        vehicleNumber: profile.vehicleNumber || '',
        bankAccount: profile.bankAccount || '',
        ifsc: profile.ifsc || ''
      })
    }
  }, [profile])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await deliveryService.updateProfile(form)
      toast.success('Profile updated!')
      setEditing(false)
      dispatch(fetchDeliveryProfile())
    } catch {
      toast.error('Failed to update profile')
    }
  }

  if (loading && !profile) return <Loader fullPage />

  return (
    <div className="p-6 max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-dark dark:text-white">My Profile</h1>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center gap-1.5 btn-secondary text-sm px-4"
        >
          <FiEdit2 size={14} />{editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {!editing ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-primary to-secondary" />
          <div className="px-6 pb-6">
            <div className="-mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-700 shadow-lg flex items-center justify-center text-3xl font-extrabold text-primary">
                {profile?.name?.[0]?.toUpperCase() || 'D'}
              </div>
            </div>
            <h2 className="text-xl font-bold text-dark dark:text-white">{profile?.name}</h2>
            <p className="text-gray-400 text-sm capitalize">Delivery Partner</p>

            <div className="mt-5 space-y-3">
              {[
                { icon: FiPhone, label: 'Phone', value: profile?.phone },
                { icon: FiMail, label: 'Email', value: profile?.email },
                { icon: FiTruck, label: 'Vehicle', value: `${profile?.vehicleType || 'bike'} • ${profile?.vehicleNumber || 'N/A'}` }
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                  <item.icon size={16} className="text-primary" />
                  <div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm font-medium text-dark dark:text-white">{item.value || 'Not set'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 space-y-4">
          <input placeholder="Full Name" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="input-field" required />
          <input placeholder="Phone Number" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} className="input-field" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.vehicleType} onChange={e => setForm(p => ({...p, vehicleType: e.target.value}))} className="input-field">
              <option value="bike">🏍️ Bike</option>
              <option value="scooter">🛵 Scooter</option>
              <option value="cycle">🚲 Cycle</option>
            </select>
            <input placeholder="Vehicle Number" value={form.vehicleNumber} onChange={e => setForm(p => ({...p, vehicleNumber: e.target.value.toUpperCase()}))} className="input-field" />
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <p className="text-sm font-semibold text-gray-500 mb-3">Bank Details (for payments)</p>
            <input placeholder="Bank Account Number" value={form.bankAccount} onChange={e => setForm(p => ({...p, bankAccount: e.target.value}))} className="input-field mb-3" />
            <input placeholder="IFSC Code" value={form.ifsc} onChange={e => setForm(p => ({...p, ifsc: e.target.value.toUpperCase()}))} className="input-field" />
          </div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <FiSave size={16} />Save Profile
          </button>
        </form>
      )}
    </div>
  )
}
