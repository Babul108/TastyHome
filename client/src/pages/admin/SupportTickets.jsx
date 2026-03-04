import React, { useEffect, useState } from 'react'
import api from '../../utils/api'
import { formatDateTime } from '../../utils/helpers'
import { toast } from '../../components/common/Toast'
import { FiMessageCircle, FiSend } from 'react-icons/fi'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/common/Modal'

const statusColors = {
  open: 'bg-red-100 text-red-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700'
}

export default function SupportTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchTickets() }, [])

  const fetchTickets = async () => {
    try {
      const res = await api.get('/admin/tickets')
      setTickets(res.data.tickets || [])
    } catch {
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!reply.trim()) return
    try {
      await api.post(`/admin/tickets/${selected._id}/reply`, { message: reply })
      setTickets(prev => prev.map(t => t._id === selected._id ? { ...t, status: 'in_progress' } : t))
      toast.success('Reply sent!')
      setReply('')
      setSelected(null)
    } catch {
      toast.error('Failed to send reply')
    }
  }

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter)

  const columns = [
    { key: '_id', label: 'ID', render: (v) => `#${v?.slice(-6).toUpperCase()}` },
    { key: 'subject', label: 'Subject', render: (v) => v || 'No subject' },
    { key: 'user', label: 'User', render: (v) => v?.name || '-' },
    { key: 'status', label: 'Status', render: (v) => (
      <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${statusColors[v] || statusColors.open}`}>
        {(v || 'open').replace('_', ' ')}
      </span>
    )},
    { key: 'createdAt', label: 'Opened', render: (v) => formatDateTime(v) },
    { key: '_id', label: 'Actions', sortable: false, render: (v, row) => (
      <button onClick={() => setSelected(row)} className="text-primary text-xs font-medium hover:underline flex items-center gap-1">
        <FiMessageCircle size={12} />Reply
      </button>
    )}
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-dark dark:text-white">Support Tickets</h1>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors capitalize
              ${filter === s ? 'bg-primary text-white border-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary'}`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Ticket: ${selected?.subject || 'No Subject'}`}>
        {selected && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-sm font-semibold text-dark dark:text-white">{selected.user?.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{selected.message || 'No message'}</p>
              <p className="text-xs text-gray-400 mt-2">{formatDateTime(selected.createdAt)}</p>
            </div>
            <form onSubmit={handleReply} className="space-y-3">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
                className="input-field resize-none"
                required
              />
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <FiSend size={16} />Send Reply
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  )
}
