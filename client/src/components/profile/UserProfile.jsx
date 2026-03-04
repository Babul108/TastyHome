import React from 'react'
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2 } from 'react-icons/fi'
import { getInitials, formatDate } from '../../utils/helpers'

const UserProfile = ({ user, onEdit }) => {
  if (!user) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-primary to-secondary" />
      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-12 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-700 shadow-lg flex items-center justify-center text-2xl font-extrabold text-primary">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              getInitials(user.name)
            )}
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-sm text-primary border border-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-colors font-medium"
          >
            <FiEdit2 size={14} />Edit Profile
          </button>
        </div>

        <h2 className="text-xl font-extrabold text-dark dark:text-white mb-1">{user.name}</h2>
        <span className="inline-block text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full mb-4 capitalize">
          {user.role || 'Customer'}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: FiMail, label: 'Email', value: user.email },
            { icon: FiPhone, label: 'Phone', value: user.phone || 'Not added' },
            { icon: FiMapPin, label: 'Location', value: user.address?.city || 'Not set' },
            { icon: FiUser, label: 'Member since', value: user.createdAt ? formatDate(user.createdAt) : 'N/A' }
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
              <item.icon size={16} className="text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-medium text-dark dark:text-white truncate">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
