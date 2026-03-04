import React, { useEffect, useState } from 'react'
import { FiDollarSign, FiTrendingUp, FiCalendar } from 'react-icons/fi'
import deliveryService from '../../services/deliveryService'
import { formatPrice } from '../../utils/helpers'
import Loader from '../../components/common/Loader'

export default function DeliveryEarningsPage() {
  const [period, setPeriod] = useState('week')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEarnings()
  }, [period])

  const fetchEarnings = async () => {
    setLoading(true)
    try {
      const res = await deliveryService.getEarnings(period)
      setData(res)
    } catch {
      // Demo data
      setData({
        today: 320,
        week: 2240,
        month: 9600,
        total: 45000,
        perDay: [
          { day: 'Mon', amount: 280 }, { day: 'Tue', amount: 350 },
          { day: 'Wed', amount: 210 }, { day: 'Thu', amount: 420 },
          { day: 'Fri', amount: 380 }, { day: 'Sat', amount: 290 },
          { day: 'Sun', amount: 310 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  const perDay = data?.perDay || []
  const maxDay = Math.max(...perDay.map(d => d.amount), 1)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-extrabold text-dark dark:text-white flex items-center gap-2">
        <FiDollarSign className="text-primary" />My Earnings
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Today', value: data?.today, icon: '📅' },
          { label: 'This Week', value: data?.week, icon: '📆' },
          { label: 'This Month', value: data?.month, icon: '🗓️' },
          { label: 'Total Earned', value: data?.total, icon: '💰' }
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
            <div className="text-3xl mb-2">{item.icon}</div>
            <p className="text-xs text-gray-400">{item.label}</p>
            <p className="text-xl font-extrabold text-dark dark:text-white mt-1">{formatPrice(item.value || 0)}</p>
          </div>
        ))}
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {['day', 'week', 'month'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors capitalize
              ${period === p ? 'bg-primary text-white border-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}
          >
            {p === 'day' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      {/* Daily Bar Chart */}
      {perDay.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
          <h3 className="font-bold text-dark dark:text-white mb-5 flex items-center gap-2">
            <FiTrendingUp className="text-primary" />Daily Breakdown
          </h3>
          <div className="flex items-end gap-3 h-36">
            {perDay.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{formatPrice(d.amount).replace('₹', '₹')}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-green-500 to-emerald-400 transition-all"
                  style={{ height: `${(d.amount / maxDay) * 100}px` }}
                />
                <span className="text-xs text-gray-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
