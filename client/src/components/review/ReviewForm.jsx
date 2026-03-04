import React, { useState } from 'react'
import { FiSend, FiImage } from 'react-icons/fi'
import StarRating from '../common/StarRating'
import api from '../../utils/api'
import { toast } from '../common/Toast'

const ReviewForm = ({ restaurantId, orderId, onSuccess }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = {}
    if (!rating) e2.rating = 'Please select a rating'
    if (!comment.trim()) e2.comment = 'Please write a comment'
    if (Object.keys(e2).length > 0) { setErrors(e2); return }

    setLoading(true)
    try {
      await api.post(`/restaurants/${restaurantId}/reviews`, { rating, comment, orderId })
      toast.success('Review submitted! Thank you 🙏')
      setRating(0)
      setComment('')
      onSuccess?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 space-y-4">
      <h3 className="font-bold text-dark dark:text-white text-lg">Write a Review</h3>

      <div>
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">Your Rating *</label>
        <StarRating value={rating} onChange={setRating} size={28} />
        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Your Review *</label>
        <textarea
          value={comment}
          onChange={(e) => { setComment(e.target.value); setErrors(p => ({ ...p, comment: '' })) }}
          placeholder="Share your experience with food quality, delivery time, packaging..."
          rows={4}
          className="input-field resize-none"
        />
        {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment}</p>}
        <p className="text-xs text-gray-400 mt-1">{comment.length}/500</p>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : <FiSend size={16} />}
        Submit Review
      </button>
    </form>
  )
}

export default ReviewForm
