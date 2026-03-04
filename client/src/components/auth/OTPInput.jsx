import React, { useState, useRef, useEffect } from 'react'

const OTPInput = ({ length = 6, onComplete, disabled = false }) => {
  const [otp, setOtp] = useState(Array(length).fill(''))
  const inputs = useRef([])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < length - 1) inputs.current[index + 1]?.focus()
    if (newOtp.every(d => d !== '')) onComplete?.(newOtp.join(''))
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputs.current[index - 1]?.focus()
      }
      const newOtp = [...otp]
      newOtp[index] = ''
      setOtp(newOtp)
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    const newOtp = [...otp]
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i]
    setOtp(newOtp)
    const nextIndex = Math.min(pasted.length, length - 1)
    inputs.current[nextIndex]?.focus()
    if (pasted.length === length) onComplete?.(pasted)
  }

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          disabled={disabled}
          className={`
            w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
            bg-white dark:bg-gray-800 text-dark dark:text-white
            ${digit
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-gray-300 dark:border-gray-600 focus:border-primary'}
            disabled:opacity-50
          `}
        />
      ))}
    </div>
  )
}

export default OTPInput
