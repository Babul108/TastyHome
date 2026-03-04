import React, { useEffect, useState } from 'react'
import DataTable from '../../components/admin/DataTable'
import api from '../../utils/api'
import { formatPrice } from '../../utils/helpers'
import { toast } from '../../components/common/Toast'
import { FiPlus } from 'react-icons/fi'
import Modal from '../../components/common/Modal'

export default function ManageMenu() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', category: '', isVeg: true, restaurant: '' })

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      const res = await api.get('/admin/menu-items')
      setItems(res.data.items || [])
    } catch {
      toast.error('Failed to load menu items')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/menu-items', { ...form, price: Number(form.price) })
      setItems(prev => [res.data.item || res.data, ...prev])
      setModal(false)
      setForm({ name: '', price: '', category: '', isVeg: true, restaurant: '' })
      toast.success('Menu item added!')
    } catch {
      toast.error('Failed to add item')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
    try {
      await api.delete(`/menu-items/${id}`)
      setItems(prev => prev.filter(i => i._id !== id))
      toast.success('Item deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category', render: (v) => v || '-' },
    { key: 'price', label: 'Price', render: (v) => formatPrice(v) },
    { key: 'isVeg', label: 'Type', render: (v) => (
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${v ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {v ? '🟢 Veg' : '🔴 Non-Veg'}
      </span>
    )},
    { key: 'restaurant', label: 'Restaurant', render: (v) => v?.name || '-' },
    { key: '_id', label: 'Actions', sortable: false, render: (v) => (
      <button onClick={() => handleDelete(v)} className="text-red-500 text-xs hover:underline">Delete</button>
    )}
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-dark dark:text-white">Manage Menu</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} menu items</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2">
          <FiPlus />Add Item
        </button>
      </div>

      <DataTable columns={columns} data={items} loading={loading} />

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Menu Item">
        <form onSubmit={handleSave} className="space-y-3">
          <input placeholder="Item name *" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required className="input-field" />
          <input placeholder="Price (₹) *" type="number" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} required className="input-field" />
          <input placeholder="Category (e.g. Biryani)" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} className="input-field" />
          <input placeholder="Restaurant ID *" value={form.restaurant} onChange={e => setForm(p => ({...p, restaurant: e.target.value}))} required className="input-field" />
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isVeg} onChange={e => setForm(p => ({...p, isVeg: e.target.checked}))} className="accent-green-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Vegetarian</span>
            </label>
          </div>
          <button type="submit" className="btn-primary w-full">Add Item</button>
        </form>
      </Modal>
    </div>
  )
}
