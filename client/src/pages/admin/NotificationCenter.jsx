import React, { useState } from 'react'
import { FiBell, FiSend } from 'react-icons/fi'
import api from '../../utils/api'
import { toast } from '../../components/common/Toast'

export default function NotificationCenter() {
  const [form, setForm] = useState({ title: '', message: '', target: 'all', userId: '', type: 'info' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState([])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!form.title || !form.message) { toast.error('Title and message are required'); return }
    setLoading(true)
    try {
      await api.post('/admin/notifications/send', form)
      toast.success('Notification sent!')
      setSent(prev => [{ ...form, sentAt: new Date(), id: Date.now() }, ...prev])
      setForm(p => ({ ...p, title: '', message: '' }))
    } catch {
      toast.error('Failed to send notification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-dark dark:text-white flex items-center gap-2">
          <FiBell className="text-primary" />Notification Center
        </h1>
        <p className="text-gray-500 text-sm mt-1">Send push notifications to users</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-6">
        <h2 className="font-bold text-dark dark:text-white mb-4">Send Notification</h2>
        <form onSubmit={handleSend} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Send To</label>
              <select value={form.target} onChange={e => setForm(p => ({...p, target: e.target.value}))} className="input-field">
                <option value="all">All Users</option>
                <option value="user">Specific User</option>
                <option value="delivery">All Delivery Partners</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))} className="input-field">
                <option value="info">Info</option>
                <option value="promo">Promotion</option>
                <option value="order">Order Update</option>
                <option value="alert">Alert</option>
              </select>
            </div>
          </div>

          {form.target === 'user' && (
            <input
              placeholder="User ID or Email"
              value={form.userId}
              onChange={e => setForm(p => ({...p, userId: e.target.value}))}
              className="input-field"
            />
          )}

          <input
            placeholder="Notification title *"
            value={form.title}
            onChange={e => setForm(p => ({...p, title: e.target.value}))}
            required
            className="input-field"
          />

          <textarea
            placeholder="Notification message *"
            value={form.message}
            onChange={e => setForm(p => ({...p, message: e.target.value}))}
            rows={3}
            required
            className="input-field resize-none"
          />

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? 'Sending...' : <><FiSend size={16} />Send Notification</>}
          </button>
        </form>
      </div>

      {/* Sent history */}
      {sent.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
          <h3 className="font-bold text-dark dark:text-white mb-4">Recent Sent</h3>
          <div className="space-y-3">
            {sent.map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <FiBell size={14} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark dark:text-white text-sm">{n.title}</p>
                  <p className="text-xs text-gray-400">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">To: {n.target} • {new Date(n.sentAt).toLocaleTimeString()}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Sent</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
