import React, { useState } from 'react'
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi'
import api from '../../utils/api'
import { toast } from '../common/Toast'

const AddressList = ({ addresses = [], onUpdate }) => {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '' })
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/addresses', form)
      toast.success('Address saved!')
      setAdding(false)
      setForm({ label: 'Home', street: '', city: '', state: '', pincode: '' })
      onUpdate?.()
    } catch (err) {
      toast.error('Failed to save address')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/auth/addresses/${id}`)
      toast.success('Address removed')
      onUpdate?.()
    } catch {
      toast.error('Failed to remove address')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-dark dark:text-white text-lg">Saved Addresses</h3>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-1.5 text-sm text-primary border border-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-colors font-medium"
        >
          <FiPlus size={14} />{adding ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {['Home', 'Work', 'Other'].map(l => (
              <button
                key={l}
                type="button"
                onClick={() => setForm(f => ({ ...f, label: l }))}
                className={`py-2 rounded-xl text-sm font-medium border transition-colors
                  ${form.label === l ? 'bg-primary text-white border-primary' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                {l === 'Home' ? '🏠' : l === 'Work' ? '💼' : '📍'} {l}
              </button>
            ))}
          </div>
          {[
            { name: 'street', placeholder: 'Street address' },
            { name: 'city', placeholder: 'City' },
            { name: 'state', placeholder: 'State' },
            { name: 'pincode', placeholder: 'PIN code' }
          ].map(f => (
            <input
              key={f.name}
              type="text"
              placeholder={f.placeholder}
              value={form[f.name]}
              onChange={(e) => setForm(prev => ({ ...prev, [f.name]: e.target.value }))}
              required
              className="input-field"
            />
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      )}

      {addresses.length === 0 && !adding ? (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <span className="text-5xl">📍</span>
          <p className="text-gray-500 mt-3">No saved addresses</p>
        </div>
      ) : (
        addresses.map((addr, i) => (
          <div key={addr._id || i} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <FiMapPin size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{addr.label}</span>
                {addr.isDefault && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <FiCheck size={10} />Default
                  </span>
                )}
              </div>
              <p className="text-sm text-dark dark:text-white mt-1">{addr.street}</p>
              <p className="text-xs text-gray-500">{[addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}</p>
            </div>
            <button
              onClick={() => handleDelete(addr._id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default AddressList
