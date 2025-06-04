import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./slices/cartSlice"
import userReducer from "./slices/userSlice"
import wishlistReducer from "./slices/wishlistSlice"
import orderReducer from "./slices/orderSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
  },
})
