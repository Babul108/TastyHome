import React, { useEffect, useState } from 'react'
import DataTable from '../../components/admin/DataTable'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'
import { toast } from '../../components/common/Toast'
import { FiPlus, FiTag } from 'react-icons/fi'
import Modal from '../../components/common/Modal'

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ code: '', discount: '', discountType: 'percent', minOrder: 0, maxDiscount: '', expiresAt: '', description: '' })

  useEffect(() => { fetchCoupons() }, [])

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/admin/coupons')
      setCoupons(res.data.coupons || [])
    } catch {
      toast.error('Failed to load coupons')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/coupons', { ...form, discount: Number(form.discount), minOrder: Number(form.minOrder) })
      setCoupons(prev => [res.data.coupon || res.data, ...prev])
      setModal(false)
      toast.success('Coupon created!')
    } catch {
      toast.error('Failed to create coupon')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return
    try {
      await api.delete(`/coupons/${id}`)
      setCoupons(prev => prev.filter(c => c._id !== id))
      toast.success('Coupon deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const columns = [
    { key: 'code', label: 'Code', render: (v) => (
      <span className="font-mono font-bold text-primary">{v}</span>
    )},
    { key: 'discount', label: 'Discount', render: (v, row) => row.discountType === 'percent' ? `${v}%` : `₹${v}` },
    { key: 'minOrder', label: 'Min Order', render: (v) => `₹${v || 0}` },
    { key: 'usedCount', label: 'Used', render: (v) => v || 0 },
    { key: 'expiresAt', label: 'Expires', render: (v) => v ? formatDate(v) : 'No expiry' },
    { key: 'isActive', label: 'Status', render: (v) => (
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${v !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {v !== false ? 'Active' : 'Inactive'}
      </span>
    )},
    { key: '_id', label: 'Actions', sortable: false, render: (v) => (
      <button onClick={() => handleDelete(v)} className="text-red-500 text-xs hover:underline">Delete</button>
    )}
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-dark dark:text-white flex items-center gap-2">
            <FiTag className="text-primary" />Manage Coupons
          </h1>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
          <FiPlus />Create Coupon
        </button>
      </div>

      <DataTable columns={columns} data={coupons} loading={loading} />

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Create Coupon">
        <form onSubmit={handleCreate} className="space-y-3">
          <input placeholder="Coupon code (e.g. SAVE20) *" value={form.code} onChange={e => setForm(p => ({...p, code: e.target.value.toUpperCase()}))} required className="input-field uppercase font-mono" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Discount value *" type="number" value={form.discount} onChange={e => setForm(p => ({...p, discount: e.target.value}))} required className="input-field" />
            <select value={form.discountType} onChange={e => setForm(p => ({...p, discountType: e.target.value}))} className="input-field">
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>
          <input placeholder="Min order amount" type="number" value={form.minOrder} onChange={e => setForm(p => ({...p, minOrder: e.target.value}))} className="input-field" />
          <input placeholder="Max discount (₹, optional)" type="number" value={form.maxDiscount} onChange={e => setForm(p => ({...p, maxDiscount: e.target.value}))} className="input-field" />
          <input placeholder="Expiry date" type="date" value={form.expiresAt} onChange={e => setForm(p => ({...p, expiresAt: e.target.value}))} className="input-field" />
          <input placeholder="Description" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="input-field" />
          <button type="submit" className="btn-primary w-full">Create Coupon</button>
        </form>
      </Modal>
    </div>
  )
}
