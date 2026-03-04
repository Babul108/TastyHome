import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import deliveryService from '../../services/deliveryService'

export const fetchDeliveryProfile = createAsyncThunk('delivery/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    return await deliveryService.getProfile()
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile')
  }
})

export const fetchAssignedOrders = createAsyncThunk('delivery/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    return await deliveryService.getAssignedOrders()
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders')
  }
})

export const toggleAvailability = createAsyncThunk('delivery/toggleAvailability', async (_, { rejectWithValue, getState }) => {
  try {
    const { isAvailable } = getState().delivery
    return await deliveryService.toggleAvailability(!isAvailable)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to toggle availability')
  }
})

export const updateDeliveryOrderStatus = createAsyncThunk('delivery/updateOrderStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    return await deliveryService.updateOrderStatus(id, status)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update order')
  }
})

const deliverySlice = createSlice({
  name: 'delivery',
  initialState: {
    profile: null,
    assignedOrders: [],
    earnings: { today: 0, week: 0, month: 0, total: 0 },
    isAvailable: false,
    loading: false,
    error: null
  },
  reducers: {
    setAvailability: (state, action) => { state.isAvailable = action.payload },
    updateEarnings: (state, action) => { state.earnings = { ...state.earnings, ...action.payload } }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveryProfile.pending, (state) => { state.loading = true })
      .addCase(fetchDeliveryProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload.profile || action.payload
        state.isAvailable = state.profile?.isAvailable || false
      })
      .addCase(fetchDeliveryProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchAssignedOrders.pending, (state) => { state.loading = true })
      .addCase(fetchAssignedOrders.fulfilled, (state, action) => {
        state.loading = false
        state.assignedOrders = action.payload.orders || action.payload
      })
      .addCase(fetchAssignedOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(toggleAvailability.fulfilled, (state, action) => {
        state.isAvailable = action.payload.isAvailable ?? !state.isAvailable
      })
      .addCase(updateDeliveryOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload.order || action.payload
        state.assignedOrders = state.assignedOrders.map(o => o._id === updated._id ? updated : o)
      })
  }
})

export const { setAvailability, updateEarnings } = deliverySlice.actions
export default deliverySlice.reducer
