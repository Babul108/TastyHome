import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import CouponSection from '../components/cart/CouponSection'
import { useState } from 'react'

export default function CartPage() {
  const { items, restaurantName } = useSelector(state => state.cart)
  const [discount, setDiscount] = useState(0)

  const handleCouponApply = (coupon) => {
    if (!coupon) { setDiscount(0); return }
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const disc = coupon.discountType === 'percent'
      ? Math.min((subtotal * coupon.discount) / 100, coupon.maxDiscount || Infinity)
      : coupon.discount
    setDiscount(disc)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-2xl font-extrabold text-dark dark:text-white mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some delicious items to get started!</p>
        <Link to="/restaurants" className="btn-primary inline-flex items-center gap-2 py-3 px-8">
          <FiShoppingBag />Browse Restaurants
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/restaurants" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-dark dark:text-white">Your Cart</h1>
          {restaurantName && <p className="text-gray-500 text-sm">From {restaurantName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => <CartItem key={item.menuItem} item={item} />)}
        </div>
        <div className="space-y-4">
          <CouponSection onApply={handleCouponApply} />
          <CartSummary discount={discount} />
        </div>
      </div>
    </div>
  )
}
