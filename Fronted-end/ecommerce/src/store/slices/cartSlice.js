import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload
      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    addToCart: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        })
      }

      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)

      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },

    updateCartItemQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload.id)

      if (item) {
        item.quantity = action.payload.quantity
      }

      // Recalculate totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0)
    },

    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalAmount = 0
    },
  },
})

export const { setCartItems, addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
