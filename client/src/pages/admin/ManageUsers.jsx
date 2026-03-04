import React, { useEffect, useState } from 'react'
import DataTable from '../../components/admin/DataTable'
import api from '../../utils/api'
import { formatDate } from '../../utils/helpers'
import { toast } from '../../components/common/Toast'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data.users || [])
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(prev => prev.filter(u => u._id !== id))
      toast.success('User deleted')
    } catch {
      toast.error('Failed to delete user')
    }
  }

  const roleColors = {
    admin: 'bg-red-100 text-red-700',
    delivery: 'bg-blue-100 text-blue-700',
    user: 'bg-green-100 text-green-700'
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (v) => v || '-' },
    {
      key: 'role',
      label: 'Role',
      render: (v) => (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${roleColors[v] || 'bg-gray-100 text-gray-700'}`}>
          {v}
        </span>
      )
    },
    { key: 'createdAt', label: 'Joined', render: (v) => formatDate(v) },
    {
      key: '_id',
      label: 'Actions',
      sortable: false,
      render: (v) => (
        <button
          onClick={() => handleDelete(v)}
          className="text-red-500 hover:text-red-700 text-xs font-medium px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      )
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-dark dark:text-white">Manage Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
      </div>
      <DataTable columns={columns} data={users} loading={loading} />
    </div>
  )
}
