import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MEAL_CATEGORIES } from '../utils/constants'
import api from '../utils/api'
import MenuItemCard from '../components/restaurant/MenuItemCard'
import Loader from '../components/common/Loader'

export default function MealCategoryPage() {
  const { name } = useParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const category = MEAL_CATEGORIES.find(
    c => c.name.toLowerCase().replace(' ', '-') === name
  )

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const res = await api.get('/menu-items', { params: { category: category?.name || name } })
        setItems(res.data.items || [])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [name])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className={`bg-gradient-to-r ${category?.color || 'from-primary to-secondary'} rounded-2xl p-8 mb-8 text-white`}>
        <div className="text-6xl mb-3">{category?.emoji || '🍽️'}</div>
        <h1 className="text-3xl font-extrabold">{category?.name || name}</h1>
        <p className="text-white/80 mt-1">Explore our best {category?.name || name} options</p>
      </div>

      {loading ? (
        <Loader message="Loading menu items..." />
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl">😋</span>
          <h3 className="text-xl font-bold mt-4 text-dark dark:text-white">No items available</h3>
          <p className="text-gray-500 mt-2">Check back soon for {category?.name} options!</p>
          <Link to="/restaurants" className="btn-primary mt-5 inline-flex">Browse Restaurants</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(item => (
            <MenuItemCard
              key={item._id}
              item={item}
              restaurantId={item.restaurant?._id}
              restaurantName={item.restaurant?.name}
            />
          ))}
        </div>
      )}
    </div>
  )
}
