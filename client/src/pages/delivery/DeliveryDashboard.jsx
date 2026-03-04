import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiToggleLeft, FiToggleRight, FiPackage, FiDollarSign, FiClock } from 'react-icons/fi'
import { fetchDeliveryProfile, fetchAssignedOrders, toggleAvailability } from '../../store/slices/deliverySlice'
import Loader from '../../components/common/Loader'
import { formatPrice, getStatusColor, getStatusLabel } from '../../utils/helpers'

export default function DeliveryDashboard() {
  const dispatch = useDispatch()
  const { profile, assignedOrders, isAvailable, loading } = useSelector(state => state.delivery)

  useEffect(() => {
    dispatch(fetchDeliveryProfile())
    dispatch(fetchAssignedOrders())
  }, [dispatch])

  const todayOrders = assignedOrders.filter(o => {
    const today = new Date().toDateString()
    return new Date(o.createdAt).toDateString() === today
  })
  const todayEarnings = todayOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.deliveryFee || 40), 0)

  if (loading && !profile) return <Loader fullPage />

  return (
    <div className="p-6 space-y-6">
      {/* Header with availability toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-dark dark:text-white">
            Hi, {profile?.name || 'Partner'} 👋
          </h1>
          <p className="text-gray-500 text-sm">Ready to deliver today?</p>
        </div>
        <button
          onClick={() => dispatch(toggleAvailability())}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold transition-all ${
            isAvailable ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}
        >
          {isAvailable ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
          {isAvailable ? 'Online' : 'Offline'}
        </button>
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: FiPackage, label: "Today's Orders", value: todayOrders.filter(o => o.status === 'delivered').length, color: 'bg-blue-500' },
          { icon: FiDollarSign, label: "Today's Earnings", value: formatPrice(todayEarnings), color: 'bg-green-500' },
          { icon: FiClock, label: 'Active Orders', value: assignedOrders.filter(o => ['confirmed', 'preparing', 'out_for_delivery'].includes(o.status)).length, color: 'bg-orange-500' }
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 text-center">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-extrabold text-dark dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Assigned Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-bold text-dark dark:text-white">Assigned Orders</h3>
          <Link to="/delivery/orders" className="text-sm text-primary hover:underline">View All</Link>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {assignedOrders.length === 0 ? (
            <div className="p-8 text-center">
              <span className="text-4xl">🛵</span>
              <p className="text-gray-400 mt-2 text-sm">No orders assigned yet</p>
            </div>
          ) : (
            assignedOrders.slice(0, 5).map(order => (
              <Link
                key={order._id}
                to={`/delivery/order/${order._id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <FiPackage className="text-primary" size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-dark dark:text-white text-sm">#{order._id?.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-400">{order.restaurant?.name}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
