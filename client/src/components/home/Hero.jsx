import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiMapPin } from 'react-icons/fi'

const Hero = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className="relative bg-gradient-to-br from-primary via-red-500 to-secondary overflow-hidden min-h-[85vh] flex items-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-white/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              🚀 <span>Fast delivery in 30 mins!</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Delicious Food
              <br />
              <span className="text-yellow-300">Delivered</span> to
              <br />
              Your Door
            </h1>

            <p className="text-white/80 text-lg mb-8 max-w-md">
              Order from 500+ restaurants near you. Fresh, hot, and delivered in minutes.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex items-center gap-2 shadow-2xl max-w-xl">
              <div className="flex items-center gap-2 px-3 flex-1">
                <FiSearch size={20} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for food, restaurants..."
                  className="flex-1 outline-none text-dark placeholder-gray-400 text-sm py-1"
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors flex-shrink-0"
              >
                Search
              </button>
            </form>

            {/* Stats */}
            <div className="flex gap-8 mt-8">
              {[
                { value: '500+', label: 'Restaurants' },
                { value: '50K+', label: 'Happy Orders' },
                { value: '4.8★', label: 'Rating' },
                { value: '30min', label: 'Avg Delivery' }
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-white/70 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Food illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-9xl animate-bounce">🍕</span>
                </div>
              </div>
              {/* Floating food items */}
              {[
                { emoji: '🍔', top: '5%', left: '5%', delay: 0 },
                { emoji: '🍜', top: '5%', right: '5%', delay: 0.3 },
                { emoji: '🍦', bottom: '10%', left: '0%', delay: 0.6 },
                { emoji: '🌮', bottom: '5%', right: '0%', delay: 0.9 }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 2, delay: item.delay, repeat: Infinity }}
                >
                  {item.emoji}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
