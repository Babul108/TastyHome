import React, { useState, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi'

const icons = {
  success: <FiCheckCircle size={20} />,
  error: <FiAlertCircle size={20} />,
  warning: <FiAlertTriangle size={20} />,
  info: <FiInfo size={20} />
}

const colors = {
  success: 'bg-green-50 border-green-400 text-green-800',
  error: 'bg-red-50 border-red-400 text-red-800',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
  info: 'bg-blue-50 border-blue-400 text-blue-800'
}

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500'
}

let toastFn = null

export const toast = {
  success: (msg) => toastFn?.({ type: 'success', message: msg }),
  error: (msg) => toastFn?.({ type: 'error', message: msg }),
  warning: (msg) => toastFn?.({ type: 'warning', message: msg }),
  info: (msg) => toastFn?.({ type: 'info', message: msg })
}

const ToastItem = ({ id, type, message, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 4000)
    return () => clearTimeout(timer)
  }, [id, onRemove])

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-[280px] max-w-sm ${colors[type]}`}
    >
      <span className={iconColors[type]}>{icons[type]}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={() => onRemove(id)} className="opacity-60 hover:opacity-100">
        <FiX size={16} />
      </button>
    </motion.div>
  )
}

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type, message }) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, message }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    toastFn = addToast
    return () => { toastFn = null }
  }, [addToast])

  return ReactDOM.createPortal(
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(t => (
          <ToastItem key={t.id} {...t} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}

export default ToastContainer
