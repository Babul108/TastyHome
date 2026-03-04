import React from 'react'

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' }
  }
  const s = sizes[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4L4 16V36H16V26H24V36H36V16L20 4Z" fill="#E23744" />
        <path d="M20 4L36 16V18L20 6L4 18V16L20 4Z" fill="#FF6B35" />
        <rect x="15" y="18" width="3" height="10" rx="1.5" fill="white" />
        <rect x="22" y="18" width="3" height="10" rx="1.5" fill="white" />
        <rect x="18.5" y="16" width="3" height="3" rx="1.5" fill="white" />
      </svg>
      {showText && (
        <span className={`font-extrabold ${s.text} tracking-tight`}>
          <span className="text-primary">Tasty</span>
          <span className="text-dark dark:text-white">Home</span>
        </span>
      )}
    </div>
  )
}

export default Logo
