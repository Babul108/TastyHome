import React, { useState, useEffect } from 'react'
import { FiCopy, FiClock, FiCheckCircle } from 'react-icons/fi'
import Modal from '../common/Modal'
import { formatPrice } from '../../utils/helpers'
import { toast } from '../common/Toast'
import QRCodeDisplay from './QRCodeDisplay'

const UPI_APPS = [
  { name: 'GPay', icon: '💚', bg: 'bg-green-50' },
  { name: 'PhonePe', icon: '💜', bg: 'bg-purple-50' },
  { name: 'Paytm', icon: '💙', bg: 'bg-blue-50' },
  { name: 'BHIM', icon: '🇮🇳', bg: 'bg-orange-50' }
]

const UPIPaymentModal = ({ isOpen, onClose, amount, upiId = 'tastyhome@okaxis', onSuccess, orderId }) => {
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (!isOpen) { setTimeLeft(600); setVerified(false); return }
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isOpen])

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const seconds = (timeLeft % 60).toString().padStart(2, '0')

  const copyUPI = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    toast.success('UPI ID copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVerify = async () => {
    // Simulate verification
    setVerified(true)
    toast.success('Payment verified! 🎉')
    setTimeout(() => { onSuccess?.(); onClose?.() }, 1500)
  }

  const upiString = `upi://pay?pa=${upiId}&pn=TastyHome&am=${amount}&cu=INR&tn=Order-${orderId || 'FOOD'}`

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="UPI Payment" size="sm">
      <div className="space-y-4">
        {/* Amount */}
        <div className="text-center bg-gradient-to-br from-primary to-secondary rounded-2xl p-5 text-white">
          <p className="text-white/80 text-sm mb-1">Pay Amount</p>
          <p className="text-4xl font-extrabold">{formatPrice(amount)}</p>
        </div>

        {/* QR Code */}
        <QRCodeDisplay value={upiString} size={180} />

        {/* UPI ID Copy */}
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
          <p className="flex-1 text-sm font-mono text-dark dark:text-white">{upiId}</p>
          <button
            onClick={copyUPI}
            className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
          >
            {copied ? <FiCheckCircle size={14} /> : <FiCopy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* UPI Apps */}
        <div>
          <p className="text-xs text-gray-400 mb-2 text-center">Pay using any UPI app</p>
          <div className="grid grid-cols-4 gap-2">
            {UPI_APPS.map(app => (
              <a
                key={app.name}
                href={upiString}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl ${app.bg} dark:bg-gray-700 hover:opacity-80 transition-opacity`}
              >
                <span className="text-2xl">{app.icon}</span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{app.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className={`flex items-center justify-center gap-2 text-sm font-semibold 
          ${timeLeft < 60 ? 'text-red-500' : 'text-gray-500'}`}>
          <FiClock size={16} />
          <span>Expires in {minutes}:{seconds}</span>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={verified || timeLeft === 0}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {verified ? (
            <><FiCheckCircle size={18} /> Payment Verified!</>
          ) : (
            "I've Completed Payment"
          )}
        </button>
      </div>
    </Modal>
  )
}

export default UPIPaymentModal
