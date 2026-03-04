import React from 'react'
import { motion } from 'framer-motion'

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xs flex-shrink-0 mr-2 mt-auto mb-1">
          🤖
        </div>
      )}
      <div
        className={`
          max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-gray-100 dark:bg-gray-700 text-dark dark:text-white rounded-bl-sm'
          }
        `}
      >
        {message.text}
        <p className={`text-xs mt-1 opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}

export default ChatMessage
