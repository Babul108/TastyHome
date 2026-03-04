import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import restaurantService from '../../services/restaurantService'

export const fetchRestaurants = createAsyncThunk('restaurant/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await restaurantService.getAll(params)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch restaurants')
  }
})

export const fetchRestaurantById = createAsyncThunk('restaurant/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await restaurantService.getById(id)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch restaurant')
  }
})

export const searchRestaurants = createAsyncThunk('restaurant/search', async (query, { rejectWithValue }) => {
  try {
    return await restaurantService.search(query)
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Search failed')
  }
})

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState: {
    restaurants: [],
    currentRestaurant: null,
    menuItems: [],
    loading: false,
    error: null,
    filters: {
      cuisine: '',
      rating: 0,
      priceRange: '',
      sortBy: 'rating'
    }
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    clearFilters: (state) => { state.filters = { cuisine: '', rating: 0, priceRange: '', sortBy: 'rating' } },
    clearCurrentRestaurant: (state) => { state.currentRestaurant = null; state.menuItems = [] }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false
        state.restaurants = action.payload.restaurants || action.payload
      })
      .addCase(fetchRestaurants.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchRestaurantById.pending, (state) => { state.loading = true })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload.restaurant || action.payload
        state.currentRestaurant = data
        state.menuItems = data.menuItems || []
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(searchRestaurants.pending, (state) => { state.loading = true })
      .addCase(searchRestaurants.fulfilled, (state, action) => {
        state.loading = false
        state.restaurants = action.payload.restaurants || action.payload
      })
      .addCase(searchRestaurants.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  }
})

export const { setFilters, clearFilters, clearCurrentRestaurant } = restaurantSlice.actions
export default restaurantSlice.reducer
