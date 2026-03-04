import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import UserProfile from '../components/profile/UserProfile'
import EditProfile from '../components/profile/EditProfile'
import AddressList from '../components/profile/AddressList'
import OrderCard from '../components/order/OrderCard'
import { useDispatch } from 'react-redux'
import { fetchMyOrders } from '../store/slices/orderSlice'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { user } = useSelector(state => state.auth)
  const { orders } = useSelector(state => state.order)
  const dispatch = useDispatch()
  const [tab, setTab] = useState('profile')
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  const tabs = ['profile', 'addresses', 'history']

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 w-fit">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setEditing(false) }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize
              ${tab === t ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-dark dark:hover:text-white'}`}
          >
            {t === 'history' ? 'Order History' : t}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        editing
          ? <EditProfile user={user} onSuccess={() => setEditing(false)} />
          : <UserProfile user={user} onEdit={() => setEditing(true)} />
      )}

      {tab === 'addresses' && (
        <AddressList addresses={user?.addresses || []} />
      )}

      {tab === 'history' && (
        <div className="space-y-4">
          {orders.length === 0
            ? <div className="text-center py-12"><span className="text-5xl">📦</span><p className="text-gray-500 mt-3">No orders yet</p></div>
            : orders.map(o => <OrderCard key={o._id} order={o} />)
          }
        </div>
      )}
    </div>
  )
}
