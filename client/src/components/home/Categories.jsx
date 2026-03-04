import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MEAL_CATEGORIES } from '../../utils/constants'

const Categories = () => {
  const navigate = useNavigate()

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-dark dark:text-white">
            What Are You <span className="text-primary">Craving?</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Choose from our wide variety of categories</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {MEAL_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/category/${cat.name.toLowerCase().replace(' ', '-')}`)}
              className="cursor-pointer group"
            >
              <div className={`bg-gradient-to-br ${cat.color} rounded-2xl p-4 flex flex-col items-center gap-2 
                shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200`}>
                <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{cat.emoji}</span>
                <span className="text-white text-xs font-semibold text-center leading-tight">{cat.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
