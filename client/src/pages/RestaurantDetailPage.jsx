import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiStar, FiClock, FiMapPin, FiInfo } from 'react-icons/fi'
import { fetchRestaurantById } from '../store/slices/restaurantSlice'
import MenuItemCard from '../components/restaurant/MenuItemCard'
import ReviewForm from '../components/review/ReviewForm'
import ReviewList from '../components/review/ReviewList'
import Loader from '../components/common/Loader'
import useAuth from '../hooks/useAuth'
import api from '../utils/api'

export default function RestaurantDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentRestaurant, menuItems, loading } = useSelector(state => state.restaurant)
  const { isAuthenticated } = useAuth()
  const [activeCategory, setActiveCategory] = useState('All')
  const [reviews, setReviews] = useState([])
  const [activeTab, setActiveTab] = useState('menu')

  useEffect(() => {
    dispatch(fetchRestaurantById(id))
    fetchReviews()
  }, [id, dispatch])

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/restaurants/${id}/reviews`)
      setReviews(res.data.reviews || [])
    } catch {}
  }

  if (loading) return <Loader fullPage />
  if (!currentRestaurant) return (
    <div className="text-center py-20">
      <span className="text-6xl">😕</span>
      <p className="mt-4 text-gray-500">Restaurant not found</p>
    </div>
  )

  const categories = ['All', ...new Set(menuItems.map(i => i.category).filter(Boolean))]
  const filteredItems = activeCategory === 'All' ? menuItems : menuItems.filter(i => i.category === activeCategory)

  const { name, cuisine = [], rating = 0, reviewCount = 0, deliveryTime, priceRange, address, image, description, isOpen } = currentRestaurant

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden mb-6">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-8xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-5 left-5 text-white">
          <h1 className="text-3xl font-extrabold drop-shadow-lg">{name}</h1>
          {cuisine.length > 0 && <p className="text-white/80 text-sm mt-1">{cuisine.join(' • ')}</p>}
        </div>
        <span className={`absolute top-4 right-4 text-sm font-bold px-3 py-1.5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-gray-600'} text-white`}>
          {isOpen ? '● Open' : '● Closed'}
        </span>
      </div>

      {/* Info bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: FiStar, value: `${rating.toFixed(1)} (${reviewCount})`, label: 'Rating' },
          { icon: FiClock, value: `${deliveryTime || '30-45'} mins`, label: 'Delivery' },
          { icon: FiMapPin, value: address?.city || 'N/A', label: 'Location' },
          { icon: FiInfo, value: priceRange || '₹₹', label: 'Price' }
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <item.icon size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="font-semibold text-dark dark:text-white text-sm">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 w-fit">
        {['menu', 'reviews'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize
              ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-dark dark:hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'menu' ? (
        <>
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors
                    ${activeCategory === cat ? 'bg-primary text-white border-primary' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl">🍽️</span>
              <p className="text-gray-500 mt-3">No items available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <MenuItemCard
                  key={item._id}
                  item={item}
                  restaurantId={id}
                  restaurantName={name}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          {isAuthenticated && (
            <ReviewForm restaurantId={id} onSuccess={fetchReviews} />
          )}
          <ReviewList reviews={reviews} />
        </div>
      )}
    </div>
  )
}
