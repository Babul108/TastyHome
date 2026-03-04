import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiMapPin, FiPlus, FiCreditCard, FiSmartphone, FiDollarSign, FiCheck } from 'react-icons/fi'
import { createOrder } from '../store/slices/orderSlice'
import { clearCart } from '../store/slices/cartSlice'
import { formatPrice, calculateDeliveryFee, calculateGST } from '../utils/helpers'
import UPIPaymentModal from '../components/payment/UPIPaymentModal'
import { toast } from '../components/common/Toast'
import useAuth from '../hooks/useAuth'

const PAYMENT_OPTIONS = [
  { id: 'upi', label: 'UPI Payment', icon: FiSmartphone, desc: 'GPay, PhonePe, Paytm' },
  { id: 'cod', label: 'Cash on Delivery', icon: FiDollarSign, desc: 'Pay when delivered' },
  { id: 'card', label: 'Credit / Debit Card', icon: FiCreditCard, desc: 'Visa, Mastercard, RuPay' }
]

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, restaurantId, restaurantName } = useSelector(state => state.cart)

  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' })
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [upiOpen, setUpiOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const deliveryFee = calculateDeliveryFee(subtotal)
  const gst = calculateGST(subtotal)
  const total = subtotal + deliveryFee + gst

  const validateAddress = () => {
    const { street, city, state, pincode } = address
    if (!street || !city || !state || !pincode) { toast.error('Please fill in all address fields'); return false }
    if (!/^\d{6}$/.test(pincode)) { toast.error('Enter a valid 6-digit PIN code'); return false }
    return true
  }

  const handleOrder = async () => {
    if (!validateAddress()) return
    if (paymentMethod === 'upi') { setUpiOpen(true); return }
    await placeOrder()
  }

  const placeOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        restaurant: restaurantId,
        items: items.map(i => ({ menuItem: i.menuItem, name: i.name, price: i.price, quantity: i.quantity })),
        deliveryAddress: address,
        paymentMethod,
        totalAmount: total
      }
      const result = await dispatch(createOrder(orderData))
      if (createOrder.fulfilled.match(result)) {
        dispatch(clearCart())
        const orderId = result.payload.order?._id || result.payload._id
        toast.success('Order placed successfully! 🎉')
        navigate(`/order/${orderId}/track`)
      } else {
        toast.error(result.payload || 'Failed to place order')
      }
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-dark dark:text-white mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
            <h2 className="font-bold text-dark dark:text-white mb-4 flex items-center gap-2">
              <FiMapPin className="text-primary" />Delivery Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Street address *"
                value={address.street}
                onChange={(e) => setAddress(p => ({ ...p, street: e.target.value }))}
                className="input-field sm:col-span-2"
              />
              <input
                type="text"
                placeholder="City *"
                value={address.city}
                onChange={(e) => setAddress(p => ({ ...p, city: e.target.value }))}
                className="input-field"
              />
              <input
                type="text"
                placeholder="State *"
                value={address.state}
                onChange={(e) => setAddress(p => ({ ...p, state: e.target.value }))}
                className="input-field"
              />
              <input
                type="text"
                placeholder="PIN Code *"
                value={address.pincode}
                onChange={(e) => setAddress(p => ({ ...p, pincode: e.target.value }))}
                className="input-field"
                maxLength={6}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
            <h2 className="font-bold text-dark dark:text-white mb-4 flex items-center gap-2">
              <FiCreditCard className="text-primary" />Payment Method
            </h2>
            <div className="space-y-3">
              {PAYMENT_OPTIONS.map(opt => (
                <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${paymentMethod === opt.id ? 'border-primary bg-red-50 dark:bg-red-900/10' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200'}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${paymentMethod === opt.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                    <opt.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark dark:text-white text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-400">{opt.desc}</p>
                  </div>
                  {paymentMethod === opt.id && <FiCheck size={20} className="text-primary" />}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 h-fit sticky top-20">
          <h3 className="font-bold text-dark dark:text-white mb-4">Order from {restaurantName}</h3>
          <div className="space-y-2 text-sm mb-4">
            {items.map(item => (
              <div key={item.menuItem} className="flex justify-between text-gray-600 dark:text-gray-400">
                <span className="truncate flex-1">{item.name} ×{item.quantity}</span>
                <span className="font-medium ml-2">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span></div>
            <div className="flex justify-between text-gray-500"><span>GST</span><span>{formatPrice(gst)}</span></div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 mt-3 pt-3 flex justify-between font-extrabold text-dark dark:text-white">
            <span>Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
          <button
            onClick={handleOrder}
            disabled={loading}
            className="btn-primary w-full mt-4 py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            {paymentMethod === 'upi' ? 'Pay via UPI' : 'Place Order'} • {formatPrice(total)}
          </button>
        </div>
      </div>

      <UPIPaymentModal
        isOpen={upiOpen}
        onClose={() => setUpiOpen(false)}
        amount={total}
        onSuccess={placeOrder}
      />
    </div>
  )
}
