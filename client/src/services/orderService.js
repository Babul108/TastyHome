import api from '../utils/api'

const orderService = {
  createOrder: async (orderData) => {
    const res = await api.post('/orders', orderData)
    return res.data
  },
  getMyOrders: async () => {
    const res = await api.get('/orders/my')
    return res.data
  },
  getById: async (id) => {
    const res = await api.get(`/orders/${id}`)
    return res.data
  },
  cancelOrder: async (id) => {
    const res = await api.patch(`/orders/${id}/cancel`)
    return res.data
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/orders/${id}/status`, { status })
    return res.data
  },
  getAllOrders: async (params = {}) => {
    const res = await api.get('/orders/admin/all', { params })
    return res.data
  },
  getOrderStats: async () => {
    const res = await api.get('/orders/admin/stats')
    return res.data
  }
}

export default orderService
