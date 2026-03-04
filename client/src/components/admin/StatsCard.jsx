import React from 'react'

const StatsCard = ({ icon: Icon, title, value, change, color = 'bg-blue-500', subtext }) => {
  const isPositive = change > 0
  const isNeutral = change === 0 || change === undefined

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}>
          {Icon && <Icon size={24} className="text-white" />}
        </div>
        {!isNeutral && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-2xl font-extrabold text-dark dark:text-white">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  )
}

export default StatsCard
