import React from 'react'

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'p-4'
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-md
        ${padding}
        ${hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card
