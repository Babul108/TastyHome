import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import api from '../utils/api'
import RestaurantCard from '../components/restaurant/RestaurantCard'
import Loader from '../components/common/Loader'
import useDebounce from '../hooks/useDebounce'

export default function SearchPage() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const initialQuery = params.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState({ restaurants: [], menuItems: [] })
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('restaurants')

  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults({ restaurants: [], menuItems: [] }); return }
    const search = async () => {
      setLoading(true)
      try {
        const res = await api.get('/search', { params: { q: debouncedQuery } })
        setResults(res.data)
      } catch {
        setResults({ restaurants: [], menuItems: [] })
      } finally {
        setLoading(false)
      }
    }
    search()
  }, [debouncedQuery])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Search bar */}
      <div className="relative mb-6">
        <FiSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for restaurants, food..."
          className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-lg shadow-sm"
          autoFocus
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      {!query.trim() ? (
        <div className="text-center py-16">
          <span className="text-7xl">🔍</span>
          <p className="text-gray-400 mt-4 text-lg">Search for restaurants or food</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-4 mb-5 border-b border-gray-200 dark:border-gray-700">
            {['restaurants', 'menuItems'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 text-sm font-semibold border-b-2 transition-colors -mb-px
                  ${tab === t ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-dark dark:hover:text-white'}`}
              >
                {t === 'menuItems' ? 'Menu Items' : 'Restaurants'} ({results[t]?.length || 0})
              </button>
            ))}
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              {tab === 'restaurants' && (
                results.restaurants?.length > 0
                  ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {results.restaurants.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
                    </div>
                  : <EmptyState type="restaurants" query={query} />
              )}
              {tab === 'menuItems' && (
                results.menuItems?.length > 0
                  ? <div className="space-y-3">
                      {results.menuItems.map(item => (
                        <div key={item._id} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
                          <span className="text-2xl">{item.isVeg ? '🟢' : '🔴'}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-dark dark:text-white">{item.name}</p>
                            <p className="text-sm text-gray-400">{item.restaurant?.name}</p>
                          </div>
                          <p className="font-bold text-primary">₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                  : <EmptyState type="menu items" query={query} />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

const EmptyState = ({ type, query }) => (
  <div className="text-center py-12">
    <span className="text-6xl">😕</span>
    <p className="text-gray-500 mt-3">No {type} found for "<strong>{query}</strong>"</p>
  </div>
)
