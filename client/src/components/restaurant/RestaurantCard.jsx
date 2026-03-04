import React from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiStar, FiMapPin } from 'react-icons/fi'
import { truncateText } from '../../utils/helpers'

const RestaurantCard = ({ restaurant }) => {
  const {
    _id, name, cuisine = [], rating = 0, reviewCount = 0,
    deliveryTime = '30-45', priceRange = '₹₹', isOpen = true,
    image, address, isVeg = false
  } = restaurant

  return (
    <Link to={`/restaurant/${_id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <span className="text-5xl">🍽️</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isOpen ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
            {isVeg && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">Pure Veg</span>
            )}
          </div>

          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
            <FiStar size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-dark">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-dark dark:text-white text-lg mb-1 group-hover:text-primary transition-colors">
            {truncateText(name, 28)}
          </h3>

          {cuisine.length > 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              {cuisine.slice(0, 3).join(' • ')}
            </p>
          )}

          {address?.city && (
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
              <FiMapPin size={12} />
              <span>{address.city}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
              <FiClock size={14} />
              <span>{deliveryTime} mins</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className="font-medium">{priceRange}</span>
              <span>for 2</span>
            </div>
            <div className="text-xs text-gray-400">
              ({reviewCount} reviews)
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RestaurantCard
