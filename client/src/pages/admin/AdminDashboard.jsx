import React, { useEffect, useState } from 'react'
import { FiShoppingBag, FiDollarSign, FiUsers, FiList } from 'react-icons/fi'
import StatsCard from '../../components/admin/StatsCard'
import DataTable from '../../components/admin/DataTable'
import api from '../../utils/api'
import { formatPrice, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/helpers'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, users: 0, restaurants: 0 })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/orders/admin/all', { params: { limit: 10 } })
        ])
        setStats(statsRes.data)
        setOrders(ordersRes.data.orders || [])
      } catch {
        // Use mock data for demo
        setStats({ totalOrders: 1247, revenue: 89450, users: 3842, restaurants: 156 })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const columns = [
    { key: '_id', label: 'Order ID', render: (v) => `#${v?.slice(-8).toUpperCase()}` },
    { key: 'restaurant', label: 'Restaurant', render: (v) => v?.name || '-' },
    { key: 'totalAmount', label: 'Amount', render: (v) => formatPrice(v) },
    { key: 'status', label: 'Status', render: (v) => (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(v)}`}>{getStatusLabel(v)}</span>
    )},
    { key: 'createdAt', label: 'Date', render: (v) => formatDateTime(v) }
  ]

  // Simple CSS bar chart
  const barData = [
    { label: 'Mon', value: 42 }, { label: 'Tue', value: 58 },
    { label: 'Wed', value: 35 }, { label: 'Thu', value: 72 },
    { label: 'Fri', value: 89 }, { label: 'Sat', value: 95 },
    { label: 'Sun', value: 64 }
  ]
  const maxBar = Math.max(...barData.map(d => d.value))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-dark dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back, Admin!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard icon={FiShoppingBag} title="Total Orders" value={stats.totalOrders?.toLocaleString()} change={12} color="bg-blue-500" subtext="vs last month" />
        <StatsCard icon={FiDollarSign} title="Total Revenue" value={formatPrice(stats.revenue || 0)} change={8.5} color="bg-green-500" subtext="vs last month" />
        <StatsCard icon={FiUsers} title="Total Users" value={stats.users?.toLocaleString()} change={23} color="bg-purple-500" subtext="registered users" />
        <StatsCard icon={FiList} title="Restaurants" value={stats.restaurants?.toLocaleString()} change={5} color="bg-orange-500" subtext="active partners" />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-dark dark:text-white mb-5">Orders This Week</h3>
        <div className="flex items-end gap-3 h-40">
          {barData.map(d => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{d.value}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary to-secondary transition-all duration-500"
                style={{ height: `${(d.value / maxBar) * 120}px` }}
              />
              <span className="text-xs text-gray-400">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <DataTable
        title="Recent Orders"
        columns={columns}
        data={orders}
        loading={loading}
        pageSize={8}
      />
    </div>
  )
}
