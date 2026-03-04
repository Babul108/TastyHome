import React from 'react'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { FiStar } from 'react-icons/fi'
import { formatDate, getInitials } from '../../utils/helpers'

const ReviewList = ({ reviews = [] }) => {
  if (!reviews.length) {
    return (
      <div className="text-center py-12">
        <span className="text-5xl">💬</span>
        <p className="text-gray-500 mt-3">No reviews yet. Be the first to review!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {getInitials(review.user?.name || 'User')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-dark dark:text-white text-sm">{review.user?.name || 'Anonymous'}</p>
                <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(review.createdAt)}</span>
              </div>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s}>
                    {s <= review.rating
                      ? <FaStar size={13} className="text-yellow-400" />
                      : <FiStar size={13} className="text-gray-300" />}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-13">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}

export default ReviewList
