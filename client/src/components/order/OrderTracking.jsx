import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateCurrentOrderStatus } from '../../store/slices/orderSlice'
import useSocket from '../../hooks/useSocket'
import OrderStatusStepper from './OrderStatusStepper'
import { getStatusLabel, formatDateTime } from '../../utils/helpers'

const OrderTracking = ({ order }) => {
  const dispatch = useDispatch()
  const { joinOrderRoom, onOrderUpdate } = useSocket()

  useEffect(() => {
    if (!order?._id) return
    joinOrderRoom(order._id)
    const cleanup = onOrderUpdate((data) => {
      if (data.orderId === order._id) {
        dispatch(updateCurrentOrderStatus(data.status))
      }
    })
    return cleanup
  }, [order?._id])

  if (!order) return null

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-dark dark:text-white text-lg">Order Status</h3>
            <p className="text-sm text-gray-500">#{order._id?.slice(-8).toUpperCase()}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-sm font-bold text-primary`}>
              {getStatusLabel(order.status)}
            </span>
            <span className="text-xs text-gray-400">{formatDateTime(order.createdAt)}</span>
          </div>
        </div>
        <OrderStatusStepper status={order.status} />
      </div>

      {/* Delivery info */}
      {order.deliveryPerson && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
          <h4 className="font-bold text-dark dark:text-white mb-3">Delivery Partner</h4>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
              {order.deliveryPerson.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-dark dark:text-white">{order.deliveryPerson.name}</p>
              <p className="text-sm text-gray-500">{order.deliveryPerson.phone}</p>
            </div>
            <a
              href={`tel:${order.deliveryPerson.phone}`}
              className="ml-auto bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors"
            >
              📞 Call
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderTracking
