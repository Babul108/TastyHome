import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Sidebar from './components/layout/Sidebar'
import { ToastContainer } from './components/common/Toast'
import ChatWidget from './components/chatbot/ChatWidget'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OTPVerificationPage from './pages/OTPVerificationPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import RestaurantsPage from './pages/RestaurantsPage'
import RestaurantDetailPage from './pages/RestaurantDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import ProfilePage from './pages/ProfilePage'
import MealCategoryPage from './pages/MealCategoryPage'
import SearchPage from './pages/SearchPage'
import HelpPage from './pages/HelpPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageRestaurants from './pages/admin/ManageRestaurants'
import ManageOrders from './pages/admin/ManageOrders'
import ManageMenu from './pages/admin/ManageMenu'
import ManageCoupons from './pages/admin/ManageCoupons'
import NotificationCenter from './pages/admin/NotificationCenter'
import SupportTickets from './pages/admin/SupportTickets'
import Reports from './pages/admin/Reports'
import Analytics from './pages/admin/Analytics'

// Delivery Pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard'
import DeliveryOrdersPage from './pages/delivery/DeliveryOrdersPage'
import DeliveryOrderDetailPage from './pages/delivery/DeliveryOrderDetailPage'
import DeliveryEarningsPage from './pages/delivery/DeliveryEarningsPage'
import DeliveryProfilePage from './pages/delivery/DeliveryProfilePage'

// Route guards
const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector(state => state.auth)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

const AdminRoute = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}

const DeliveryRoute = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'delivery') return <Navigate to="/" replace />
  return <Outlet />
}

// Layouts
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <ChatWidget />
    <ToastContainer />
  </div>
)

const AdminLayout = () => (
  <div className="flex min-h-screen">
    <Sidebar type="admin" />
    <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <Outlet />
    </main>
    <ToastContainer />
  </div>
)

const DeliveryLayout = () => (
  <div className="flex min-h-screen">
    <Sidebar type="delivery" />
    <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      <Outlet />
    </main>
    <ToastContainer />
  </div>
)

const App = () => {
  return (
    <>
      <Routes>
        {/* Public routes with Navbar/Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/category/:name" element={<MealCategoryPage />} />
          <Route path="/help" element={<HelpPage />} />

          {/* Protected user routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/order/:id/track" element={<OrderTrackingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Auth routes (no navbar/footer) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OTPVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/restaurants" element={<ManageRestaurants />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            <Route path="/admin/menu" element={<ManageMenu />} />
            <Route path="/admin/coupons" element={<ManageCoupons />} />
            <Route path="/admin/notifications" element={<NotificationCenter />} />
            <Route path="/admin/tickets" element={<SupportTickets />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* Delivery routes */}
        <Route element={<DeliveryRoute />}>
          <Route element={<DeliveryLayout />}>
            <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
            <Route path="/delivery/orders" element={<DeliveryOrdersPage />} />
            <Route path="/delivery/order/:id" element={<DeliveryOrderDetailPage />} />
            <Route path="/delivery/earnings" element={<DeliveryEarningsPage />} />
            <Route path="/delivery/profile" element={<DeliveryProfilePage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🍕</div>
                <h1 className="text-4xl font-extrabold text-dark dark:text-white mb-2">404</h1>
                <p className="text-gray-500 mb-6">Oops! Page not found.</p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </>
  )
}

export default App
