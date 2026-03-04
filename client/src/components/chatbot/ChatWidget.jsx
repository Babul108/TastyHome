import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiX, FiMinimize2, FiMessageCircle } from 'react-icons/fi'
import { addMessage, toggleChat } from '../../store/slices/chatSlice'
import ChatMessage from './ChatMessage'
import QuickReplies from './QuickReplies'
import api from '../../utils/api'

const ChatWidget = () => {
  const dispatch = useDispatch()
  const { messages, isOpen, quickReplies } = useSelector(state => state.chat)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async (text = input) => {
    if (!text.trim()) return
    setInput('')
    dispatch(addMessage({ text: text.trim(), sender: 'user' }))
    setTyping(true)

    try {
      const res = await api.post('/chatbot/message', { message: text.trim() })
      setTimeout(() => {
        dispatch(addMessage({ text: res.data.reply || "I'll help you with that!", sender: 'bot' }))
        setTyping(false)
      }, 600)
    } catch {
      setTimeout(() => {
        dispatch(addMessage({
          text: "Sorry, I'm having trouble connecting. Please try again or call 1800-123-4567 📞",
          sender: 'bot'
        }))
        setTyping(false)
      }, 600)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => dispatch(toggleChat())}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <FiX size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <FiMessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && messages.filter(m => m.sender === 'bot').length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            style={{ maxHeight: '500px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
                <div>
                  <p className="font-bold text-white text-sm">TastyBot</p>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/80 text-xs">Always online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => dispatch(toggleChat())} className="text-white/80 hover:text-white">
                <FiMinimize2 size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1" style={{ maxHeight: '300px' }}>
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 flex gap-1 items-center">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <QuickReplies replies={quickReplies} />

            {/* Input */}
            <div className="border-t border-gray-100 dark:border-gray-700 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm outline-none text-dark dark:text-white placeholder-gray-400"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                <FiSend size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWidget
