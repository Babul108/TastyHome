import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchAssignedOrders } from '../../store/slices/deliverySlice'
import { getStatusColor, getStatusLabel, formatDateTime, formatPrice } from '../../utils/helpers'
import Loader from '../../components/common/Loader'
import { FiPackage } from 'react-icons/fi'

export default function DeliveryOrdersPage() {
  const dispatch = useDispatch()
  const { assignedOrders, loading } = useSelector(state => state.delivery)
  const [filter, setFilter] = useState('all')

  useEffect(() => { dispatch(fetchAssignedOrders()) }, [dispatch])

  const filtered = filter === 'all' ? assignedOrders : assignedOrders.filter(o => o.status === filter)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-extrabold text-dark dark:text-white mb-6">My Deliveries</h1>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['all', 'out_for_delivery', 'delivered', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors
              ${filter === s ? 'bg-primary text-white border-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}
          >
            {s === 'all' ? 'All' : getStatusLabel(s)}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16"><span className="text-5xl">📦</span><p className="text-gray-400 mt-3">No deliveries found</p></div>
          ) : filtered.map(order => (
            <Link key={order._id} to={`/delivery/order/${order._id}`}
              className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <FiPackage className="text-primary" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-dark dark:text-white">#{order._id?.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-gray-500">{order.restaurant?.name} → {order.deliveryAddress?.city}</p>
                <p className="text-xs text-gray-400">{formatDateTime(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold px-2 py-1 rounded-full block mb-1 ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                <p className="text-sm font-bold text-primary">{formatPrice(order.deliveryFee || 40)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
