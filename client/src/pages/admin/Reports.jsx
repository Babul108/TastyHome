import React, { useState, useEffect } from 'react'
import { FiDownload, FiCalendar } from 'react-icons/fi'
import api from '../../utils/api'
import { formatPrice } from '../../utils/helpers'
import DataTable from '../../components/admin/DataTable'
import { toast } from '../../components/common/Toast'

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [data, setData] = useState({ orders: [], summary: {} })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchReport() }, [])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/reports', { params: dateRange })
      setData(res.data)
    } catch {
      // Demo data
      setData({
        orders: [],
        summary: { totalOrders: 847, revenue: 68450, avgOrderValue: 380, completionRate: 94 }
      })
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    const headers = ['Order ID', 'Restaurant', 'Amount', 'Status', 'Date']
    const rows = data.orders.map(o => [
      o._id?.slice(-8), o.restaurant?.name, o.totalAmount, o.status, o.createdAt
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `report-${dateRange.start}-${dateRange.end}.csv`
    a.click()
    toast.success('Report downloaded!')
  }

  const summaryCards = [
    { label: 'Total Orders', value: data.summary?.totalOrders || 0, icon: '📦' },
    { label: 'Revenue', value: formatPrice(data.summary?.revenue || 0), icon: '💰' },
    { label: 'Avg Order Value', value: formatPrice(data.summary?.avgOrderValue || 0), icon: '📊' },
    { label: 'Completion Rate', value: `${data.summary?.completionRate || 0}%`, icon: '✅' }
  ]

  const columns = [
    { key: '_id', label: 'Order ID', render: (v) => `#${v?.slice(-8).toUpperCase()}` },
    { key: 'restaurant', label: 'Restaurant', render: (v) => v?.name || '-' },
    { key: 'totalAmount', label: 'Amount', render: (v) => formatPrice(v) },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Date', render: (v) => new Date(v).toLocaleDateString() }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-dark dark:text-white">Reports</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
            <FiCalendar size={16} className="text-gray-400" />
            <input type="date" value={dateRange.start} onChange={e => setDateRange(p => ({...p, start: e.target.value}))}
              className="text-sm bg-transparent outline-none text-dark dark:text-white" />
            <span className="text-gray-400">–</span>
            <input type="date" value={dateRange.end} onChange={e => setDateRange(p => ({...p, end: e.target.value}))}
              className="text-sm bg-transparent outline-none text-dark dark:text-white" />
          </div>
          <button onClick={fetchReport} className="btn-primary px-4">Apply</button>
          <button onClick={exportCSV} className="flex items-center gap-2 btn-secondary px-4">
            <FiDownload size={16} />Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
            <div className="text-3xl mb-2">{card.icon}</div>
            <p className="text-gray-500 text-xs">{card.label}</p>
            <p className="text-2xl font-extrabold text-dark dark:text-white mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <DataTable title="Order Report" columns={columns} data={data.orders} loading={loading} />
    </div>
  )
}
