import React, { useEffect, useState } from 'react'
import { FiUsers, FiTrendingUp, FiShoppingBag, FiPieChart } from 'react-icons/fi'
import api from '../../utils/api'

export default function Analytics() {
  const [data, setData] = useState({
    userTrend: [12, 18, 15, 25, 30, 28, 35, 40, 38, 45, 50, 55],
    orderTrend: [80, 95, 75, 110, 130, 125, 145, 155, 140, 170, 185, 195],
    categoryData: [
      { name: 'Biryani', value: 28 },
      { name: 'Pizza', value: 22 },
      { name: 'Burger', value: 18 },
      { name: 'Chinese', value: 15 },
      { name: 'Others', value: 17 }
    ]
  })

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const maxUser = Math.max(...data.userTrend)
  const maxOrder = Math.max(...data.orderTrend)

  const categoryColors = ['bg-primary', 'bg-secondary', 'bg-blue-500', 'bg-green-500', 'bg-purple-500']

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-extrabold text-dark dark:text-white">Analytics</h1>

      {/* User Registration Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-dark dark:text-white mb-5 flex items-center gap-2">
          <FiUsers className="text-primary" />User Registrations (Monthly)
        </h3>
        <div className="flex items-end gap-2 h-36">
          {data.userTrend.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{v}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-purple-400 transition-all"
                style={{ height: `${(v / maxUser) * 100}px` }}
              />
              <span className="text-xs text-gray-400">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-dark dark:text-white mb-5 flex items-center gap-2">
          <FiShoppingBag className="text-primary" />Orders (Monthly)
        </h3>
        <div className="flex items-end gap-2 h-36">
          {data.orderTrend.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{v}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary to-secondary transition-all"
                style={{ height: `${(v / maxOrder) * 100}px` }}
              />
              <span className="text-xs text-gray-400">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-dark dark:text-white mb-5 flex items-center gap-2">
          <FiPieChart className="text-primary" />Popular Categories
        </h3>
        <div className="space-y-3">
          {data.categoryData.map((cat, i) => (
            <div key={cat.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-dark dark:text-white">{cat.name}</span>
                <span className="text-gray-500">{cat.value}%</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${categoryColors[i]} transition-all duration-700`}
                  style={{ width: `${cat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
