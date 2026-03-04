import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyOrders } from '../store/slices/orderSlice'
import OrderCard from '../components/order/OrderCard'
import Loader from '../components/common/Loader'
import { ORDER_STATUSES } from '../utils/constants'

export default function OrdersPage() {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector(state => state.order)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-dark dark:text-white mb-6">My Orders</h1>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {['all', ...ORDER_STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors
              ${filter === s ? 'bg-primary text-white border-primary' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
          >
            {s === 'all' ? 'All' : s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader message="Loading your orders..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-7xl">📦</span>
          <h3 className="text-xl font-bold text-dark dark:text-white mt-4">No orders found</h3>
          <p className="text-gray-500 mt-2">
            {filter === 'all' ? "You haven't placed any orders yet." : `No ${filter.replace(/_/g, ' ')} orders.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => <OrderCard key={order._id} order={order} />)}
        </div>
      )}
    </div>
  )
}
