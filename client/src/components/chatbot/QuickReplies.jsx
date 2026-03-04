import React from 'react'
import { useDispatch } from 'react-redux'
import { addMessage } from '../../store/slices/chatSlice'

const QuickReplies = ({ replies = [] }) => {
  const dispatch = useDispatch()

  const handleClick = (reply) => {
    dispatch(addMessage({ text: reply, sender: 'user' }))
    // Bot response simulation
    setTimeout(() => {
      let response = "I'm looking into that for you! 🔍"
      if (reply.toLowerCase().includes('track')) response = "Please share your order ID and I'll help you track it! 📦"
      else if (reply.toLowerCase().includes('restaurant')) response = "Check out our restaurants page for the best options near you! 🍽️"
      else if (reply.toLowerCase().includes('issue') || reply.toLowerCase().includes('report')) response = "I'm sorry to hear that! Please describe the issue and we'll resolve it ASAP. 🙏"
      else if (reply.toLowerCase().includes('refund')) response = "Refunds are typically processed within 5-7 business days. Please share your order ID! 💰"
      else if (reply.toLowerCase().includes('support')) response = "Connecting you to our support team... ☎️ You can also call 1800-123-4567"
      dispatch(addMessage({ text: response, sender: 'bot' }))
    }, 800)
  }

  return (
    <div className="flex flex-wrap gap-2 px-3 pb-2">
      {replies.map((reply, i) => (
        <button
          key={i}
          onClick={() => handleClick(reply)}
          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-colors border border-gray-200 dark:border-gray-600"
        >
          {reply}
        </button>
      ))}
    </div>
  )
}

export default QuickReplies
