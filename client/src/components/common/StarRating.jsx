import React, { useState } from 'react'
import { FiStar } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'

const StarRating = ({
  value = 0,
  onChange,
  max = 5,
  size = 20,
  showValue = false,
  readonly = false,
  reviewCount
}) => {
  const [hovered, setHovered] = useState(0)

  const display = hovered || value

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-transform ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
        >
          {star <= display ? (
            <FaStar size={size} className="text-yellow-400" />
          ) : (
            <FiStar size={size} className="text-gray-300" />
          )}
        </button>
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {value.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="ml-1 text-sm text-gray-500">({reviewCount})</span>
      )}
    </div>
  )
}

export default StarRating
