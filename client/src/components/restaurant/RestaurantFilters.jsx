import React from 'react'
import { FiStar, FiX } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, clearFilters } from '../../store/slices/restaurantSlice'
import { CUISINES } from '../../utils/constants'

const RestaurantFilters = () => {
  const dispatch = useDispatch()
  const filters = useSelector(state => state.restaurant.filters)

  const handleChange = (key, value) => {
    dispatch(setFilters({ [key]: value }))
  }

  const hasFilters = filters.cuisine || filters.rating > 0 || filters.priceRange || filters.sortBy !== 'rating'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 sticky top-20">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-dark dark:text-white">Filters</h3>
        {hasFilters && (
          <button
            onClick={() => dispatch(clearFilters())}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <FiX size={14} />Clear All
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Sort By</p>
        <div className="space-y-2">
          {[
            { label: 'Rating', value: 'rating' },
            { label: 'Delivery Time', value: 'deliveryTime' },
            { label: 'Price: Low to High', value: 'price_asc' },
            { label: 'Price: High to Low', value: 'price_desc' }
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sortBy"
                value={opt.value}
                checked={filters.sortBy === opt.value}
                onChange={() => handleChange('sortBy', opt.value)}
                className="accent-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Minimum Rating</p>
        <div className="flex gap-2">
          {[3, 3.5, 4, 4.5].map(r => (
            <button
              key={r}
              onClick={() => handleChange('rating', filters.rating === r ? 0 : r)}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors
                ${filters.rating === r
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary'
                }`}
            >
              <FiStar size={12} />{r}+
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine Filter */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Cuisine</p>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map(c => (
            <button
              key={c}
              onClick={() => handleChange('cuisine', filters.cuisine === c ? '' : c)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors
                ${filters.cuisine === c
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary'
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Price Range</p>
        <div className="flex gap-2">
          {['₹', '₹₹', '₹₹₹'].map(p => (
            <button
              key={p}
              onClick={() => handleChange('priceRange', filters.priceRange === p ? '' : p)}
              className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors
                ${filters.priceRange === p
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary'
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RestaurantFilters
