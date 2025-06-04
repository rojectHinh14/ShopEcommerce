import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/products';

export const productService = {
  // Get all products with pagination
  getAllProducts: async (page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc') => {
    const response = await axios.get(`${API_URL}`, {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get product detail
  getProductById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (params) => {
    const response = await axios.get(`${API_URL}/search`, { params });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId, page = 0, size = 20) => {
    const response = await axios.get(`${API_URL}/category/${categoryId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get best selling products
  getBestSellingProducts: async (limit = 10) => {
    const response = await axios.get(`${API_URL}/best-selling`, {
      params: { limit }
    });
    return response.data;
  },

  // Get most viewed products
  getMostViewedProducts: async (limit = 10) => {
    const response = await axios.get(`${API_URL}/most-viewed`, {
      params: { limit }
    });
    return response.data;
  },

  // Get top rated products
  getTopRatedProducts: async (limit = 10) => {
    const response = await axios.get(`${API_URL}/top-rated`, {
      params: { limit }
    });
    return response.data;
  },

  // Increment product views
  incrementProductViews: async (id) => {
    const response = await axios.post(`${API_URL}/${id}/view`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await axios.post(`${API_URL}/create`, productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await axios.put(`${API_URL}/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  // Update product status
  updateProductStatus: async (id, status) => {
    const response = await axios.patch(`${API_URL}/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  // Update product stock
  updateProductStock: async (id, quantity) => {
    const response = await axios.patch(`${API_URL}/${id}/stock`, null, {
      params: { quantity }
    });
    return response.data;
  },

  // Get product stats (admin only)
  getProductStats: async () => {
    const response = await axios.get(`${API_URL}/admin/stats`);
    return response.data;
  },

  // Get products by status (admin only)
  getProductsByStatus: async (status, page = 0, size = 20) => {
    const response = await axios.get(`${API_URL}/admin/status/${status}`, {
      params: { page, size }
    });
    return response.data;
  }
};