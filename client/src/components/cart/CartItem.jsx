import React from 'react'
import { useDispatch } from 'react-redux'
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'
import { updateQuantity, removeItem } from '../../store/slices/cartSlice'
import { formatPrice } from '../../utils/helpers'

const CartItem = ({ item }) => {
  const dispatch = useDispatch()
  const { menuItem, name, price, image, quantity } = item

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
            <span className="text-2xl">🍱</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-dark dark:text-white text-sm truncate">{name}</h4>
        <p className="text-primary font-bold mt-1">{formatPrice(price)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(quantity === 1 ? removeItem(menuItem) : updateQuantity({ menuItem, quantity: quantity - 1 }))}
          className="w-8 h-8 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
        >
          <FiMinus size={14} />
        </button>
        <span className="font-bold text-dark dark:text-white w-6 text-center">{quantity}</span>
        <button
          onClick={() => dispatch(updateQuantity({ menuItem, quantity: quantity + 1 }))}
          className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <FiPlus size={14} />
        </button>
      </div>

      <div className="text-right min-w-[60px]">
        <p className="font-bold text-dark dark:text-white">{formatPrice(price * quantity)}</p>
        <button
          onClick={() => dispatch(removeItem(menuItem))}
          className="text-gray-400 hover:text-red-500 transition-colors mt-1"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default CartItem
