import React, { useEffect, useState } from 'react'
import DataTable from '../../components/admin/DataTable'
import api from '../../utils/api'
import { toast } from '../../components/common/Toast'
import { FiPlus } from 'react-icons/fi'

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const res = await api.get('/admin/restaurants')
      setRestaurants(res.data.restaurants || [])
    } catch {
      toast.error('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id, current) => {
    try {
      await api.patch(`/restaurants/${id}/toggle-active`)
      setRestaurants(prev => prev.map(r => r._id === id ? { ...r, isActive: !current } : r))
      toast.success(`Restaurant ${!current ? 'activated' : 'deactivated'}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this restaurant?')) return
    try {
      await api.delete(`/restaurants/${id}`)
      setRestaurants(prev => prev.filter(r => r._id !== id))
      toast.success('Restaurant deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'cuisine', label: 'Cuisine', render: (v) => (v || []).slice(0, 2).join(', ') || '-' },
    { key: 'rating', label: 'Rating', render: (v) => `⭐ ${(v || 0).toFixed(1)}` },
    { key: 'isActive', label: 'Status', render: (v, row) => (
      <button
        onClick={() => handleToggle(row._id, v)}
        className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors
          ${v ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
      >
        {v ? 'Active' : 'Inactive'}
      </button>
    )},
    { key: '_id', label: 'Actions', sortable: false, render: (v) => (
      <button onClick={() => handleDelete(v)} className="text-red-500 text-xs hover:underline">Delete</button>
    )}
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-dark dark:text-white">Manage Restaurants</h1>
          <p className="text-gray-500 text-sm mt-1">{restaurants.length} restaurants</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <FiPlus />Add Restaurant
        </button>
      </div>
      <DataTable columns={columns} data={restaurants} loading={loading} />
    </div>
  )
}
