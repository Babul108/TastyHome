import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiBell } from 'react-icons/fi'
import { fetchNotifications } from '../../store/slices/notificationSlice'
import NotificationDropdown from './NotificationDropdown'

const NotificationBell = () => {
  const dispatch = useDispatch()
  const { unreadCount } = useSelector(state => state.notification)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown isOpen={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export default NotificationBell
