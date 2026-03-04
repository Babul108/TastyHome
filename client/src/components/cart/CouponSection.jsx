import React, { useState } from 'react'
import { FiTag, FiX, FiCheckCircle } from 'react-icons/fi'
import api from '../../utils/api'
import { toast } from '../common/Toast'

const CouponSection = ({ onApply }) => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [applied, setApplied] = useState(null)

  const handleApply = async () => {
    if (!code.trim()) return
    setLoading(true)
    try {
      const res = await api.post('/coupons/validate', { code: code.toUpperCase() })
      const coupon = res.data.coupon
      setApplied(coupon)
      onApply?.(coupon)
      toast.success(`Coupon applied! Save ${coupon.discountType === 'percent' ? coupon.discount + '%' : '₹' + coupon.discount}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setApplied(null)
    setCode('')
    onApply?.(null)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
      <h3 className="font-bold text-dark dark:text-white mb-4 flex items-center gap-2">
        <FiTag size={18} className="text-primary" />
        Apply Coupon
      </h3>

      {applied ? (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-3">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <FiCheckCircle size={18} />
            <div>
              <p className="font-bold text-sm">{applied.code}</p>
              <p className="text-xs opacity-80">{applied.description}</p>
            </div>
          </div>
          <button onClick={handleRemove} className="text-gray-400 hover:text-red-500 transition-colors">
            <FiX size={18} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            className="input-field flex-1 uppercase tracking-widest text-sm"
          />
          <button
            onClick={handleApply}
            disabled={loading || !code.trim()}
            className="btn-primary px-5 flex-shrink-0 disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : 'Apply'}
          </button>
        </div>
      )}

      {!applied && (
        <p className="text-xs text-gray-400 mt-2">Try: TASTY10, FIRST50, WELCOME100</p>
      )}
    </div>
  )
}

export default CouponSection
