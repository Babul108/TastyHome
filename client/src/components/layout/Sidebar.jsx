import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  FiHome, FiUsers, FiShoppingBag, FiList, FiTag, FiBell,
  FiMessageSquare, FiBarChart2, FiTruck, FiDollarSign,
  FiUser, FiLogOut, FiChevronLeft, FiChevronRight,
  FiPieChart, FiSettings, FiAlertCircle
} from 'react-icons/fi'
import { logoutUser } from '../../store/slices/authSlice'
import Logo from '../common/Logo'
import useAuth from '../../hooks/useAuth'

const adminLinks = [
  { to: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/restaurants', icon: FiList, label: 'Restaurants' },
  { to: '/admin/menu', icon: FiSettings, label: 'Menu Items' },
  { to: '/admin/coupons', icon: FiTag, label: 'Coupons' },
  { to: '/admin/notifications', icon: FiBell, label: 'Notifications' },
  { to: '/admin/tickets', icon: FiAlertCircle, label: 'Support Tickets' },
  { to: '/admin/reports', icon: FiBarChart2, label: 'Reports' },
  { to: '/admin/analytics', icon: FiPieChart, label: 'Analytics' }
]

const deliveryLinks = [
  { to: '/delivery/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/delivery/orders', icon: FiShoppingBag, label: 'My Orders' },
  { to: '/delivery/earnings', icon: FiDollarSign, label: 'Earnings' },
  { to: '/delivery/profile', icon: FiUser, label: 'Profile' }
]

const Sidebar = ({ type = 'admin' }) => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()

  const links = type === 'admin' ? adminLinks : deliveryLinks
  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  return (
    <aside
      className={`
        flex flex-col h-screen bg-dark text-white transition-all duration-300 sticky top-0
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center p-4 border-b border-gray-700 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        {!collapsed ? (
          <Logo size="sm" />
        ) : (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white text-sm">T</div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            title={collapsed ? label : ''}
            className={`
              flex items-center gap-3 px-4 py-3 mx-2 rounded-xl mb-1 transition-all duration-200
              ${isActive(to)
                ? 'bg-primary text-white shadow-lg shadow-red-900/20'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <Icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
          </Link>
        ))}
      </nav>

      {/* User & Collapse */}
      <div className="border-t border-gray-700 p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{type}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          title="Logout"
          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-900/20 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <FiLogOut size={18} />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 text-gray-500 hover:text-white transition-colors"
        >
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
