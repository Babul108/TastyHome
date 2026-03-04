import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import orderReducer from './slices/orderSlice'
import restaurantReducer from './slices/restaurantSlice'
import chatReducer from './slices/chatSlice'
import deliveryReducer from './slices/deliverySlice'
import notificationReducer from './slices/notificationSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    restaurant: restaurantReducer,
    chat: chatReducer,
    delivery: deliveryReducer,
    notification: notificationReducer
  }
})

export default store
