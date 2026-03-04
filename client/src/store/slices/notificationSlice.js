import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

export const fetchNotifications = createAsyncThunk('notification/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/notifications')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch notifications')
  }
})

export const markAsRead = createAsyncThunk('notification/markRead', async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/notifications/${id}/read`)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to mark as read')
  }
})

export const markAllAsRead = createAsyncThunk('notification/markAllRead', async (_, { rejectWithValue }) => {
  try {
    const res = await api.patch('/notifications/read-all')
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to mark all as read')
  }
})

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      state.unreadCount += 1
    },
    clearNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload.notifications || action.payload
        state.unreadCount = state.notifications.filter(n => !n.isRead).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const id = action.meta.arg
        const notification = state.notifications.find(n => n._id === id)
        if (notification && !notification.isRead) {
          notification.isRead = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => { n.isRead = true })
        state.unreadCount = 0
      })
  }
})

export const { addNotification, clearNotifications } = notificationSlice.actions
export default notificationSlice.reducer
