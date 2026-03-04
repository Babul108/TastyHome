import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { fetchRestaurants } from '../../store/slices/restaurantSlice'
import RestaurantCard from '../restaurant/RestaurantCard'
import Loader from '../common/Loader'

const FeaturedRestaurants = () => {
  const dispatch = useDispatch()
  const { restaurants, loading } = useSelector(state => state.restaurant)
  const scrollRef = useRef(null)

  useEffect(() => {
    dispatch(fetchRestaurants({ limit: 10, featured: true }))
  }, [dispatch])

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
    }
  }

  const featured = restaurants.slice(0, 10)

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-dark dark:text-white">
              Featured <span className="text-primary">Restaurants</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Top rated restaurants near you</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              <FiChevronRight size={20} />
            </button>
            <Link
              to="/restaurants"
              className="hidden sm:flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all"
            >
              View All <FiArrowRight size={16} />
            </Link>
          </div>
        </div>

        {loading ? (
          <Loader message="Loading restaurants..." />
        ) : featured.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">🍽️</p>
            <p className="text-gray-500">No restaurants available yet</p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featured.map((restaurant, i) => (
              <motion.div
                key={restaurant._id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex-shrink-0 w-72"
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6 sm:hidden">
          <Link to="/restaurants" className="btn-primary flex items-center gap-2">
            View All Restaurants <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedRestaurants
