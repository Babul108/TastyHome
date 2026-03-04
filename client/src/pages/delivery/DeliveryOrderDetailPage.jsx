import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateDeliveryOrderStatus } from '../../store/slices/deliverySlice'
import DeliveryMap from '../../components/delivery/DeliveryMap'
import PaymentCollectionCard from '../../components/delivery/PaymentCollectionCard'
import api from '../../utils/api'
import { formatPrice, getStatusLabel, getStatusColor } from '../../utils/helpers'
import Loader from '../../components/common/Loader'
import { toast } from '../../components/common/Toast'

const STATUS_FLOW = {
  confirmed: { next: 'out_for_delivery', label: 'Start Delivery', color: 'btn-secondary' },
  out_for_delivery: { next: 'delivered', label: 'Mark as Delivered', color: 'bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors' }
}

export default function DeliveryOrderDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/delivery/orders/${id}`)
        setOrder(res.data.order || res.data)
      } catch {
        toast.error('Failed to load order')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  const handleStatusUpdate = async (nextStatus) => {
    const result = await dispatch(updateDeliveryOrderStatus({ id, status: nextStatus }))
    if (updateDeliveryOrderStatus.fulfilled.match(result)) {
      setOrder(prev => ({ ...prev, status: nextStatus }))
      toast.success(`Order marked as ${getStatusLabel(nextStatus)}`)
    } else {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <Loader fullPage />
  if (!order) return <div className="p-6 text-center text-gray-500">Order not found</div>

  const transition = STATUS_FLOW[order.status]

  return (
    <div className="p-6 max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-dark dark:text-white">
          Order #{order._id?.slice(-6).toUpperCase()}
        </h1>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Map */}
      <DeliveryMap
        restaurantLocation={order.restaurant?.location ? [order.restaurant.location.lat, order.restaurant.location.lng] : null}
        customerLocation={null}
      />

      {/* Order Info */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-dark dark:text-white mb-3">Delivery Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Restaurant</span>
            <span className="font-medium text-dark dark:text-white">{order.restaurant?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Deliver to</span>
            <span className="font-medium text-dark dark:text-white text-right max-w-[180px]">
              {[order.deliveryAddress?.street, order.deliveryAddress?.city].filter(Boolean).join(', ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="font-medium capitalize">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Earning</span>
            <span className="font-bold text-green-600">{formatPrice(order.deliveryFee || 40)}</span>
          </div>
        </div>
      </div>

      {/* COD Collection */}
      <PaymentCollectionCard order={order} />

      {/* Status Update Button */}
      {transition && (
        <button
          onClick={() => handleStatusUpdate(transition.next)}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-all shadow-lg ${transition.color}`}
        >
          {transition.label}
        </button>
      )}

      {order.status === 'delivered' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-5 text-center">
          <span className="text-4xl">🎉</span>
          <p className="font-bold text-green-700 dark:text-green-400 mt-2">Delivery Completed!</p>
          <p className="text-sm text-green-600 mt-1">You earned {formatPrice(order.deliveryFee || 40)}</p>
        </div>
      )}
    </div>
  )
}
