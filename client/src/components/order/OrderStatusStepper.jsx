import React from 'react'
import { FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi'

const steps = [
  { key: 'pending', label: 'Order Placed', emoji: '📋' },
  { key: 'confirmed', label: 'Confirmed', emoji: '✅' },
  { key: 'preparing', label: 'Preparing', emoji: '👨‍🍳' },
  { key: 'out_for_delivery', label: 'Out for Delivery', emoji: '🛵' },
  { key: 'delivered', label: 'Delivered', emoji: '🎉' }
]

const OrderStatusStepper = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="text-center">
          <span className="text-5xl">❌</span>
          <p className="mt-2 font-bold text-red-600">Order Cancelled</p>
        </div>
      </div>
    )
  }

  const currentIndex = steps.findIndex(s => s.key === status)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 z-0" />
        {/* Progress line filled */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary z-0 transition-all duration-700"
          style={{ width: currentIndex === -1 ? '0%' : `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, i) => {
          const done = i < currentIndex
          const active = i === currentIndex
          const future = i > currentIndex

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg
                border-2 transition-all duration-300
                ${done ? 'bg-primary border-primary text-white' : ''}
                ${active ? 'bg-white dark:bg-gray-800 border-primary ring-4 ring-primary/20' : ''}
                ${future ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600' : ''}
              `}>
                {done ? <FiCheckCircle size={20} /> : <span>{step.emoji}</span>}
              </div>
              <p className={`
                text-xs font-medium mt-2 text-center leading-tight max-w-[60px]
                ${active ? 'text-primary font-bold' : done ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'}
              `}>
                {step.label}
              </p>
              {active && (
                <div className="flex items-center gap-1 mt-1">
                  <FiClock size={10} className="text-primary" />
                  <span className="text-xs text-primary font-medium">Now</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderStatusStepper
