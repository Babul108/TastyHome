import { createSlice } from '@reduxjs/toolkit'

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [
      {
        id: 1,
        text: "Hi! I'm TastyBot 🍕 How can I help you today?",
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    ],
    isOpen: false,
    quickReplies: [
      'Track my order',
      'Browse restaurants',
      'Report an issue',
      'Refund status',
      'Talk to support'
    ]
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString()
      })
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen
    },
    openChat: (state) => { state.isOpen = true },
    closeChat: (state) => { state.isOpen = false },
    setQuickReplies: (state, action) => {
      state.quickReplies = action.payload
    },
    clearMessages: (state) => {
      state.messages = [
        {
          id: 1,
          text: "Hi! I'm TastyBot 🍕 How can I help you today?",
          sender: 'bot',
          timestamp: new Date().toISOString()
        }
      ]
    }
  }
})

export const { addMessage, toggleChat, openChat, closeChat, setQuickReplies, clearMessages } = chatSlice.actions
export default chatSlice.reducer
