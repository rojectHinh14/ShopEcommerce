import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';
import { toast } from 'react-toastify';

// Async thunks
export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData);
      toast.success('Đặt hàng thành công!');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đặt hàng thất bại';
      toast.error(errorMessage);
      return rejectWithValue(error.response?.data || { message: errorMessage });
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await orderService.getMyOrders(page, size);
      console.log("✅ Full response from API:", response);
      return response.data.data; // 👈 DỮ LIỆU THỰC SỰ (content, page, size, totalPages,...)
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng');
      return rejectWithValue(error?.message || 'Unknown error');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(orderId);
      return response.data.data;
    } catch (error) {
      toast.error('Không thể tải thông tin đơn hàng');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancel',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(orderId);
      toast.success('Hủy đơn hàng thành công');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 0,
  totalItems: 0
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.currentPage = 0;
      state.totalPages = 0;
      state.totalItems = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Đặt hàng thất bại';
      })
      // Fetch my orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        // Check if payload has content property (assuming response structure { content: [...] })
        if (action.payload && Array.isArray(action.payload.content)) {
          state.orders = action.payload.content;
          state.totalPages = action.payload.totalPages || 0;
          state.currentPage = action.payload.number || 0;
          state.totalItems = action.payload.totalElements || 0;
          console.log('Fetched orders (pagination structure):', state.orders);
        } else if (action.payload && Array.isArray(action.payload)) {
           // Fallback: Assume payload is directly the array of orders
           state.orders = action.payload;
           state.totalPages = 1; // Assume single page if array is returned directly
           state.currentPage = 0;
           state.totalItems = action.payload.length;
           console.log('Fetched orders (array structure direct payload):', state.orders);
        } else {
          // Handle unexpected payload structure
          state.orders = [];
          state.totalPages = 0;
          state.currentPage = 0;
          state.totalItems = 0;
          console.error('Unexpected payload structure for fetching orders:', action.payload);
          toast.error('Lỗi khi tải dữ liệu đơn hàng.');
        }
        state.error = null; // Clear previous errors on success
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tải danh sách đơn hàng';
      })
      // Fetch order by id
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể tải thông tin đơn hàng';
      })
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Không thể hủy đơn hàng';
      });
  }
});

export const { clearCurrentOrder, clearOrders } = orderSlice.actions;
export default orderSlice.reducer; 