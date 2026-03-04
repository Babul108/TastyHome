import { useSelector } from 'react-redux'

const useAuth = () => {
  const { user, token, loading, error, isAuthenticated } = useSelector(state => state.auth)

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isDelivery: user?.role === 'delivery',
    isUser: user?.role === 'user' || (!user?.role && isAuthenticated)
  }
}

export default useAuth
