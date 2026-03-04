import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderService from '../../services/orderService'

export const fetchMyOrders = createAsyncThunk('order/fetchMy', async (_, { rejectWithValue }) => {
  try {
    return await orderService.getMyOrders()
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders')
  }
})

export const fetchOrderById = createAsyncThunk('order/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await orderService.getById(id)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch order')
  }
})

export const createOrder = createAsyncThunk('order/create', async (orderData, { rejectWithValue }) => {
  try {
    return await orderService.createOrder(orderData)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create order')
  }
})

export const updateOrderStatus = createAsyncThunk('order/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    return await orderService.updateStatus(id, status)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update order')
  }
})

export const cancelOrder = createAsyncThunk('order/cancel', async (id, { rejectWithValue }) => {
  try {
    return await orderService.cancelOrder(id)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to cancel order')
  }
})

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentOrder: (state) => { state.currentOrder = null },
    updateCurrentOrderStatus: (state, action) => {
      if (state.currentOrder) state.currentOrder.status = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.orders || action.payload
      })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchOrderById.pending, (state) => { state.loading = true })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload.order || action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(createOrder.pending, (state) => { state.loading = true })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload.order || action.payload
        state.orders.unshift(action.payload.order || action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload.order || action.payload
        state.orders = state.orders.map(o => o._id === updated._id ? updated : o)
        if (state.currentOrder?._id === updated._id) state.currentOrder = updated
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updated = action.payload.order || action.payload
        state.orders = state.orders.map(o => o._id === updated._id ? updated : o)
        if (state.currentOrder?._id === updated._id) state.currentOrder = updated
      })
  }
})

export const { clearCurrentOrder, updateCurrentOrderStatus } = orderSlice.actions
export default orderSlice.reducer
