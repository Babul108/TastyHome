import { createSlice } from '@reduxjs/toolkit'

const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem('cart')
    return data ? JSON.parse(data) : { items: [], restaurantId: null, restaurantName: '' }
  } catch {
    return { items: [], restaurantId: null, restaurantName: '' }
  }
}

const saveCartToStorage = (state) => {
  localStorage.setItem('cart', JSON.stringify({
    items: state.items,
    restaurantId: state.restaurantId,
    restaurantName: state.restaurantName
  }))
}

const initialState = loadCartFromStorage()

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { menuItem, name, price, image, restaurantId, restaurantName } = action.payload
      // Enforce single restaurant rule
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = []
      }
      state.restaurantId = restaurantId
      state.restaurantName = restaurantName
      const existing = state.items.find(i => i.menuItem === menuItem)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ menuItem, name, price, image, restaurantId, restaurantName, quantity: 1 })
      }
      saveCartToStorage(state)
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.menuItem !== action.payload)
      if (state.items.length === 0) {
        state.restaurantId = null
        state.restaurantName = ''
      }
      saveCartToStorage(state)
    },
    updateQuantity: (state, action) => {
      const { menuItem, quantity } = action.payload
      if (quantity <= 0) {
        state.items = state.items.filter(i => i.menuItem !== menuItem)
        if (state.items.length === 0) {
          state.restaurantId = null
          state.restaurantName = ''
        }
      } else {
        const item = state.items.find(i => i.menuItem === menuItem)
        if (item) item.quantity = quantity
      }
      saveCartToStorage(state)
    },
    clearCart: (state) => {
      state.items = []
      state.restaurantId = null
      state.restaurantName = ''
      localStorage.removeItem('cart')
    }
  }
})

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
