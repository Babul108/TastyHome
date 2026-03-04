import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  FiShoppingCart, FiBell, FiUser, FiLogOut, FiSearch,
  FiMenu, FiX, FiSun, FiMoon, FiChevronDown, FiHome,
  FiList, FiSettings, FiHelpCircle, FiPackage
} from 'react-icons/fi'
import useAuth from '../../hooks/useAuth'
import { useTheme } from '../../context/ThemeContext'
import { logoutUser } from '../../store/slices/authSlice'
import Logo from '../common/Logo'
import { MEAL_CATEGORIES } from '../../utils/constants'
import NotificationBell from '../notification/NotificationBell'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isDelivery } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const cartItems = useSelector(state => state.cart.items)
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const userMenuRef = useRef(null)
  const categoryRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors
                ${isActive('/') ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}
            >
              <FiHome size={16} />Home
            </Link>
            <Link
              to="/restaurants"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors
                ${isActive('/restaurants') ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'}`}
            >
              <FiList size={16} />Restaurants
            </Link>

            {/* Category Dropdown */}
            <div ref={categoryRef} className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
              >
                Categories <FiChevronDown size={16} className={`transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoryOpen && (
                <div className="absolute top-8 left-0 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 p-3 grid grid-cols-2 gap-1 w-64 z-50">
                  {MEAL_CATEGORIES.map(cat => (
                    <Link
                      key={cat.name}
                      to={`/category/${cat.name.toLowerCase().replace(' ', '-')}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setCategoryOpen(false)}
                    >
                      <span>{cat.emoji}</span>
                      <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/help"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
            >
              <FiHelpCircle size={16} />Help
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => navigate('/search')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            >
              <FiSearch size={20} />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
            >
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {isAuthenticated && (
              <>
                {/* Notifications */}
                <NotificationBell />

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                >
                  <FiShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      {user?.name?.[0]?.toUpperCase() || <FiUser size={16} />}
                    </div>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-11 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 w-52 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-semibold text-sm text-dark dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <FiUser size={16} />Profile
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                          <FiPackage size={16} />My Orders
                        </Link>
                        {isAdmin && (
                          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <FiSettings size={16} />Admin Panel
                          </Link>
                        )}
                        {isDelivery && (
                          <Link to="/delivery/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={() => setUserMenuOpen(false)}>
                            <FiSettings size={16} />Delivery Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                        <button
                          onClick={() => { handleLogout(); setUserMenuOpen(false) }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <FiLogOut size={16} />Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors px-3 py-1.5">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-3">
          <Link to="/" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 py-2">
            <FiHome size={18} />Home
          </Link>
          <Link to="/restaurants" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 py-2">
            <FiList size={18} />Restaurants
          </Link>
          <Link to="/search" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 py-2">
            <FiSearch size={18} />Search
          </Link>
          <Link to="/help" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 py-2">
            <FiHelpCircle size={18} />Help
          </Link>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
            <div className="grid grid-cols-3 gap-2">
              {MEAL_CATEGORIES.slice(0, 9).map(cat => (
                <Link
                  key={cat.name}
                  to={`/category/${cat.name.toLowerCase().replace(' ', '-')}`}
                  className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 py-1"
                >
                  {cat.emoji} {cat.name}
                </Link>
              ))}
            </div>
          </div>
          {!isAuthenticated && (
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1 text-center border border-primary text-primary rounded-lg py-2 font-semibold text-sm">Login</Link>
              <Link to="/signup" className="flex-1 text-center btn-primary text-sm">Sign Up</Link>
            </div>
          )}
          {isAuthenticated && (
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 py-2 w-full">
              <FiLogOut size={18} />Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar
