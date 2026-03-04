import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi'
import { formatPrice, calculateDeliveryFee, calculateGST } from '../../utils/helpers'

const CartSummary = ({ discount = 0, onCheckout }) => {
  const { items } = useSelector(state => state.cart)
  const navigate = useNavigate()

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const deliveryFee = calculateDeliveryFee(subtotal)
  const gst = calculateGST(subtotal)
  const total = subtotal + deliveryFee + gst - discount

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 sticky top-20">
      <h3 className="font-bold text-dark dark:text-white text-lg mb-5 flex items-center gap-2">
        <FiShoppingBag size={20} className="text-primary" />
        Order Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span className="font-medium text-dark dark:text-white">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Delivery Fee</span>
          {deliveryFee === 0 ? (
            <span className="font-medium text-green-600">FREE</span>
          ) : (
            <span className="font-medium text-dark dark:text-white">{formatPrice(deliveryFee)}</span>
          )}
        </div>

        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>GST (5%)</span>
          <span className="font-medium text-dark dark:text-white">{formatPrice(gst)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span className="font-medium">- {formatPrice(discount)}</span>
          </div>
        )}

        {subtotal < 499 && (
          <p className="text-xs text-secondary bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 text-center">
            Add {formatPrice(499 - subtotal)} more for free delivery! 🎉
          </p>
        )}
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 mt-4 pt-4">
        <div className="flex justify-between text-dark dark:text-white font-extrabold text-lg mb-4">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>

        <button
          onClick={onCheckout || (() => navigate('/checkout'))}
          disabled={items.length === 0}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          Proceed to Checkout <FiArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default CartSummary
