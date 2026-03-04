import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheck, FiCheckCircle, FiBell } from 'react-icons/fi'
import { markAsRead, markAllAsRead } from '../../store/slices/notificationSlice'
import { formatDateTime } from '../../utils/helpers'

const NotificationDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { notifications, loading } = useSelector(state => state.notification)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-dark dark:text-white flex items-center gap-2">
              <FiBell size={18} className="text-primary" />
              Notifications
            </h3>
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={() => dispatch(markAllAsRead())}
                className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
              >
                <FiCheck size={13} />Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10">
                <span className="text-5xl">🔔</span>
                <p className="text-gray-400 text-sm mt-3">No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification._id}
                  onClick={() => !notification.isRead && dispatch(markAsRead(notification._id))}
                  className={`flex gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0
                    ${!notification.isRead ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 
                    ${notification.type === 'order' ? 'bg-blue-100' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    {notification.type === 'order' ? '📦' : notification.type === 'promo' ? '🎁' : '🔔'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.isRead ? 'font-semibold text-dark dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {notification.title}
                    </p>
                    {notification.message && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{notification.createdAt ? formatDateTime(notification.createdAt) : ''}</p>
                  </div>
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NotificationDropdown
