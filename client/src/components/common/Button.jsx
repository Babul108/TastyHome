import React from 'react'

const sizeClasses = {
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2 px-4 text-sm',
  lg: 'py-3 px-6 text-base'
}

const variantClasses = {
  primary: 'bg-primary hover:bg-red-600 text-white',
  secondary: 'bg-secondary hover:bg-orange-500 text-white',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'bg-transparent text-primary hover:bg-red-50 dark:hover:bg-red-900/20',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  dark: 'bg-dark hover:bg-gray-700 text-white'
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

export default Button
