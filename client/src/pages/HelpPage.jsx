import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiMail, FiPhone, FiMessageCircle } from 'react-icons/fi'
import ChatWidget from '../components/chatbot/ChatWidget'
import api from '../utils/api'
import { toast } from '../components/common/Toast'

const FAQS = [
  { q: 'How long does delivery take?', a: 'Average delivery time is 30-45 minutes depending on your location and restaurant.' },
  { q: 'Can I cancel my order?', a: 'Yes, you can cancel your order within 2 minutes of placing it. Go to My Orders and tap Cancel.' },
  { q: 'How do I track my order?', a: 'Go to My Orders and click "Track" on your active order for real-time updates.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and Cash on Delivery.' },
  { q: 'How do I apply a coupon?', a: 'Add items to cart, then enter your coupon code in the Cart page before checkout.' },
  { q: 'What if I receive wrong or damaged food?', a: 'Please report the issue within 30 minutes via Help > Contact Us. We\'ll resolve it promptly.' },
  { q: 'How are refunds processed?', a: 'Refunds are processed within 5-7 business days to your original payment method.' },
  { q: 'Can I schedule a delivery?', a: 'Currently we only support immediate delivery. Scheduled delivery is coming soon!' }
]

const FAQItem = ({ faq }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="font-semibold text-dark dark:text-white text-sm">{faq.q}</span>
        {open ? <FiChevronUp className="text-primary flex-shrink-0" /> : <FiChevronDown className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-3">
          {faq.a}
        </div>
      )}
    </div>
  )
}

export default function HelpPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/support/contact', form)
      toast.success("Message sent! We'll get back to you soon.")
      setForm({ name: '', email: '', message: '' })
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-dark dark:text-white">Help & Support</h1>
        <p className="text-gray-500 mt-2">How can we help you today?</p>
      </div>

      {/* Contact options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: FiPhone, label: 'Call Us', value: '1800-123-4567', sub: 'Mon-Sun, 8AM-10PM' },
          { icon: FiMail, label: 'Email Us', value: 'support@tastyhome.in', sub: 'Response in 24 hrs' },
          { icon: FiMessageCircle, label: 'Live Chat', value: 'Chat with us', sub: 'Available 24/7' }
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <item.icon size={22} className="text-primary" />
            </div>
            <p className="font-bold text-dark dark:text-white">{item.label}</p>
            <p className="text-primary font-medium text-sm mt-1">{item.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FAQ */}
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-bold text-dark dark:text-white mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              required
              className="input-field"
            />
            <input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
              required
              className="input-field"
            />
            <textarea
              placeholder="Describe your issue..."
              value={form.message}
              onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
              rows={5}
              required
              className="input-field resize-none"
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      <ChatWidget />
    </div>
  )
}
