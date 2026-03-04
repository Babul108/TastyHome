import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById } from '../store/slices/orderSlice'
import OrderTracking from '../components/order/OrderTracking'
import LiveMap from '../components/order/LiveMap'
import Loader from '../components/common/Loader'
import { formatPrice, formatDateTime } from '../utils/helpers'
import useSocket from '../hooks/useSocket'

export default function OrderTrackingPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentOrder: order, loading } = useSelector(state => state.order)
  const [deliveryLocation, setDeliveryLocation] = useState(null)
  const { onDeliveryLocation } = useSocket()

  useEffect(() => {
    dispatch(fetchOrderById(id))
  }, [id, dispatch])

  useEffect(() => {
    const cleanup = onDeliveryLocation?.((data) => {
      if (data.orderId === id) setDeliveryLocation([data.lat, data.lng])
    })
    return cleanup
  }, [id])

  if (loading) return <Loader fullPage />
  if (!order) return (
    <div className="text-center py-20">
      <span className="text-6xl">😕</span>
      <p className="text-gray-500 mt-4">Order not found</p>
    </div>
  )

  const userAddress = order.deliveryAddress
  const userLocation = userAddress ? null : null // Could add geocoding

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-dark dark:text-white">Track Order</h1>
        <span className="text-sm text-gray-400">#{order._id?.slice(-8).toUpperCase()}</span>
      </div>

      <OrderTracking order={order} />

      {/* Live Map */}
      {order.status === 'out_for_delivery' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4">
          <h3 className="font-bold text-dark dark:text-white mb-3">Live Tracking</h3>
          <LiveMap
            deliveryLocation={deliveryLocation}
            userLocation={userLocation}
          />
        </div>
      )}

      {/* Order Details */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-dark dark:text-white mb-4">Order Details</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {(order.items || []).map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-medium text-dark dark:text-white">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2 flex justify-between font-bold text-dark dark:text-white">
            <span>Total</span>
            <span className="text-primary">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        {order.deliveryAddress && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400 mb-1">Delivering to</p>
            <p className="text-sm text-dark dark:text-white">
              {[order.deliveryAddress.street, order.deliveryAddress.city, order.deliveryAddress.pincode].filter(Boolean).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
