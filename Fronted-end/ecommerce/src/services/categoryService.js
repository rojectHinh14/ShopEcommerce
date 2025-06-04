import axios from 'axios';

const API_URL = 'http://localhost:8080/api/categories';

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Create new category
  createCategory: async (categoryData) => {
    const response = await axios.post(API_URL, categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await axios.put(`${API_URL}/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
}; 