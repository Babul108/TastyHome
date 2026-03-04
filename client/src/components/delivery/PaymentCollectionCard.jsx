import React from 'react'
import { FiDollarSign, FiPhone } from 'react-icons/fi'
import { formatPrice } from '../../utils/helpers'

const PaymentCollectionCard = ({ order }) => {
  const isCOD = order?.paymentMethod === 'cod'
  const amount = order?.totalAmount || 0

  if (!isCOD) return null

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
          <FiDollarSign size={24} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-dark dark:text-white">Collect Cash Payment</p>
          <p className="text-sm text-gray-500">Customer has chosen Cash on Delivery</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-500 mb-1">Amount to Collect</p>
        <p className="text-4xl font-extrabold text-green-600">{formatPrice(amount)}</p>
      </div>

      <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3">
        <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
          ⚠️ Please ensure you receive the exact amount before marking delivered
        </p>
      </div>

      {order?.customer?.phone && (
        <a
          href={`tel:${order.customer.phone}`}
          className="flex items-center justify-center gap-2 mt-3 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-semibold transition-colors"
        >
          <FiPhone size={16} />
          Call Customer
        </a>
      )}
    </div>
  )
}

export default PaymentCollectionCard
