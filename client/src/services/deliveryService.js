import api from '../utils/api'

const deliveryService = {
  getProfile: async () => {
    const res = await api.get('/delivery/profile')
    return res.data
  },
  updateProfile: async (data) => {
    const res = await api.put('/delivery/profile', data)
    return res.data
  },
  toggleAvailability: async (isAvailable) => {
    const res = await api.patch('/delivery/availability', { isAvailable })
    return res.data
  },
  getAssignedOrders: async () => {
    const res = await api.get('/delivery/orders')
    return res.data
  },
  updateOrderStatus: async (id, status) => {
    const res = await api.patch(`/delivery/orders/${id}/status`, { status })
    return res.data
  },
  getEarnings: async (period = 'week') => {
    const res = await api.get('/delivery/earnings', { params: { period } })
    return res.data
  },
  updateLocation: async (lat, lng) => {
    const res = await api.patch('/delivery/location', { lat, lng })
    return res.data
  }
}

export default deliveryService
