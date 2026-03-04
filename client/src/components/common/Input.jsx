import React, { useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const Input = ({
  label,
  error,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required,
  disabled,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full border rounded-lg px-4 py-2.5 bg-white dark:bg-gray-700 
            text-dark dark:text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary transition-colors
            disabled:opacity-60 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 dark:border-gray-600'}
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default Input
