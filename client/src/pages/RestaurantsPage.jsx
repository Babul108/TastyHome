import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRestaurants } from '../store/slices/restaurantSlice'
import RestaurantCard from '../components/restaurant/RestaurantCard'
import RestaurantFilters from '../components/restaurant/RestaurantFilters'
import Loader from '../components/common/Loader'
import { FiGrid, FiList } from 'react-icons/fi'
import { useState } from 'react'

export default function RestaurantsPage() {
  const dispatch = useDispatch()
  const { restaurants, loading, filters } = useSelector(state => state.restaurant)
  const [view, setView] = useState('grid')

  useEffect(() => {
    dispatch(fetchRestaurants(filters))
  }, [dispatch, filters.cuisine, filters.rating, filters.sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-dark dark:text-white">All Restaurants</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{restaurants.length} restaurants available</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg border transition-colors ${view === 'grid' ? 'border-primary text-primary bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 text-gray-400'}`}
          >
            <FiGrid size={18} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg border transition-colors ${view === 'list' ? 'border-primary text-primary bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 text-gray-400'}`}
          >
            <FiList size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <RestaurantFilters />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <Loader message="Loading restaurants..." />
          ) : restaurants.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl">🍽️</span>
              <h3 className="text-xl font-bold text-dark dark:text-white mt-4">No restaurants found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-4'}>
              {restaurants.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
