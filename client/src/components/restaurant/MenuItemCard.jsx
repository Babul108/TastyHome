import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { addItem, updateQuantity, removeItem } from '../../store/slices/cartSlice'
import { formatPrice, truncateText } from '../../utils/helpers'
import { toast } from '../common/Toast'

const MenuItemCard = ({ item, restaurantId, restaurantName }) => {
  const dispatch = useDispatch()
  const cartItems = useSelector(state => state.cart.items)
  const cartRestaurantId = useSelector(state => state.cart.restaurantId)
  const cartItem = cartItems.find(i => i.menuItem === item._id)
  const quantity = cartItem?.quantity || 0

  const { _id, name, description, price, image, isVeg, category } = item

  const handleAdd = () => {
    if (cartRestaurantId && cartRestaurantId !== restaurantId) {
      if (!window.confirm('Your cart has items from another restaurant. Adding this item will clear your cart. Continue?')) return
    }
    dispatch(addItem({ menuItem: _id, name, price, image, restaurantId, restaurantName }))
    toast.success(`${name} added to cart!`)
  }

  const handleIncrease = () => {
    dispatch(updateQuantity({ menuItem: _id, quantity: quantity + 1 }))
  }

  const handleDecrease = () => {
    if (quantity === 1) dispatch(removeItem(_id))
    else dispatch(updateQuantity({ menuItem: _id, quantity: quantity - 1 }))
  }

  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      {/* Veg indicator & info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 
              ${isVeg ? 'border-green-600' : 'border-red-600'}`}
          >
            <span className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          </span>
          {category && (
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{category}</span>
          )}
        </div>

        <h4 className="font-semibold text-dark dark:text-white text-sm mb-1">{name}</h4>
        {description && (
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-2 leading-relaxed">
            {truncateText(description, 80)}
          </p>
        )}
        <p className="font-bold text-dark dark:text-white">{formatPrice(price)}</p>
      </div>

      {/* Image & Add button */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="w-24 h-20 rounded-xl overflow-hidden">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <span className="text-2xl">🍱</span>
            </div>
          )}
        </div>

        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 bg-primary hover:bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
          >
            <FiPlus size={14} />ADD
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-primary rounded-full px-2 py-1">
            <button onClick={handleDecrease} className="text-white hover:text-red-200 transition-colors">
              <FiMinus size={14} />
            </button>
            <span className="text-white font-bold text-sm min-w-[16px] text-center">{quantity}</span>
            <button onClick={handleIncrease} className="text-white hover:text-red-200 transition-colors">
              <FiPlus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuItemCard
