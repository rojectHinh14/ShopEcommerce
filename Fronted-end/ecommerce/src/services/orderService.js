import api from './api';

const API_URL = '/api/orders';

export const orderService = {
  // Create order from cart
  createOrder: async (orderData) => {
    try {
      const response = await api.post(`${API_URL}`, orderData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's orders with pagination
  getMyOrders: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`${API_URL}/my-orders?page=${page}&size=${size}`);
      return response; 
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`${API_URL}/${orderId}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await api.get(`${API_URL}/number/${orderNumber}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update order
  updateOrder: async (orderId, updateData) => {
    try {
      const response = await api.put(`${API_URL}/${orderId}`, updateData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`${API_URL}/${orderId}/cancel`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get order summaries
  getOrderSummaries: async () => {
    try {
      const response = await api.get(`${API_URL}/my-orders/summary`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default orderService;
