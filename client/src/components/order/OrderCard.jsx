import React from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiClock, FiMapPin, FiChevronRight } from 'react-icons/fi'
import { formatPrice, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/helpers'

const OrderCard = ({ order }) => {
  const {
    _id, restaurant, items = [], totalAmount, status,
    createdAt, paymentMethod
  } = order

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-dark dark:text-white">{restaurant?.name || 'Restaurant'}</h3>
          <p className="text-xs text-gray-400 mt-0.5">#{_id?.slice(-8).toUpperCase()}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusColor(status)}`}>
          {getStatusLabel(status)}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <FiPackage size={14} />
        <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
        {items.slice(0, 2).map((item, i) => (
          <span key={i} className="truncate max-w-[100px]">• {item.name}</span>
        ))}
        {items.length > 2 && <span>+{items.length - 2} more</span>}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <FiClock size={12} />
        <span>{formatDateTime(createdAt)}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-400">Total Paid</p>
          <p className="font-extrabold text-dark dark:text-white">{formatPrice(totalAmount)}</p>
        </div>
        <div className="flex gap-2">
          {['confirmed', 'preparing', 'out_for_delivery'].includes(status) && (
            <Link
              to={`/order/${_id}/track`}
              className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <FiMapPin size={12} />Track
            </Link>
          )}
          <Link
            to={`/order/${_id}/track`}
            className="flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
          >
            View Details <FiChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderCard
