import React, { useEffect, useState } from 'react'
import DataTable from '../../components/admin/DataTable'
import api from '../../utils/api'
import { formatPrice, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/helpers'
import { ORDER_STATUSES as STATUS_LIST } from '../../utils/constants'
import { toast } from '../../components/common/Toast'

export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/admin/all')
      setOrders(res.data.orders || [])
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status })
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
      toast.success('Order status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const columns = [
    { key: '_id', label: 'Order ID', render: (v) => `#${v?.slice(-8).toUpperCase()}` },
    { key: 'customer', label: 'Customer', render: (v, row) => v?.name || row.user?.name || '-' },
    { key: 'restaurant', label: 'Restaurant', render: (v) => v?.name || '-' },
    { key: 'totalAmount', label: 'Amount', render: (v) => formatPrice(v) },
    {
      key: 'status',
      label: 'Status',
      render: (v, row) => (
        <select
          value={v}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className={`text-xs font-semibold px-2 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${getStatusColor(v)}`}
        >
          {STATUS_LIST.map(s => (
            <option key={s} value={s}>{getStatusLabel(s)}</option>
          ))}
        </select>
      )
    },
    { key: 'createdAt', label: 'Date', render: (v) => formatDateTime(v) }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-dark dark:text-white">Manage Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
      </div>
      <DataTable columns={columns} data={orders} loading={loading} />
    </div>
  )
}
