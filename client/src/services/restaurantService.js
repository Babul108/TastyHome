import api from '../utils/api'

const restaurantService = {
  getAll: async (params = {}) => {
    const res = await api.get('/restaurants', { params })
    return res.data
  },
  getById: async (id) => {
    const res = await api.get(`/restaurants/${id}`)
    return res.data
  },
  search: async (query) => {
    const res = await api.get('/restaurants/search', { params: { q: query } })
    return res.data
  },
  getNearby: async (lat, lng) => {
    const res = await api.get('/restaurants/nearby', { params: { lat, lng } })
    return res.data
  },
  create: async (data) => {
    const res = await api.post('/restaurants', data)
    return res.data
  },
  update: async (id, data) => {
    const res = await api.put(`/restaurants/${id}`, data)
    return res.data
  },
  delete: async (id) => {
    const res = await api.delete(`/restaurants/${id}`)
    return res.data
  },
  getMenu: async (id) => {
    const res = await api.get(`/restaurants/${id}/menu`)
    return res.data
  },
  toggleActive: async (id) => {
    const res = await api.patch(`/restaurants/${id}/toggle-active`)
    return res.data
  }
}

export default restaurantService
