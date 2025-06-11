import api from './api';

const API_URL = '/api/v1/users';

export const userService = {
  // Authentication
  login: async (credentials) => {
    const response = await api.post('/api/v1/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Profile Management
  getCurrentUser: async () => {
    const response = await api.get(`${API_URL}/me`);
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/api/users/profile', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      avatarBase64: userData.avatarBase64
    });
    return response.data;
  },

  updatePassword: async (passwordData) => {
    const response = await api.post('/api/users/change-password', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    return response.data;
  },

  getAddresses: async () => {
    const response = await api.get('/api/addresses/my-addresses');
    const raw = response.data;
  
    console.log("Raw address API response:", raw);
  
    if (!raw || !Array.isArray(raw.data)) {
      console.error(" Dữ liệu trả về không đúng định dạng:", raw);
      return [];
    }
  
    return raw.data.map(address => ({
      id: address.id,
      fullName: address.fullName || 'Không có tên',
      phone: address.phoneNumber || 'Không có SĐT',
      address: address.addressLine || '',
      city: address.province || '',
      district: address.district || '',
      ward: address.ward || '',
      country: address.country || '',
      postalCode: address.postalCode || '',
      isDefault: address.default || false,
      type: address.type || 'HOME',
    }));

  },
  
  
  

  addAddress: async (addressData) => {
    const backendData = {
      fullName: addressData.fullName,
      phoneNumber: addressData.phone,
      addressLine: addressData.address,
      ward: addressData.ward,
      district: addressData.district,
      province: addressData.city,
      country: addressData.country || 'Việt Nam',
      postalCode: addressData.postalCode || '',
      isDefault: addressData.isDefault || false,
      type: addressData.type || 'HOME',
    };
    const response = await api.post('/api/addresses', backendData);
    const backendResponse = response.data.data;
    return {
      id: backendResponse.id,
      fullName: backendResponse.fullName,
      phone: backendResponse.phoneNumber,
      address: backendResponse.addressLine,
      city: backendResponse.province,
      district: backendResponse.district,
      ward: backendResponse.ward,
      country: backendResponse.country,
      postalCode: backendResponse.postalCode,
      isDefault: backendResponse.isDefault,
      type: backendResponse.type,
    };
  },

  updateAddress: async (addressId, addressData) => {
    const backendData = {
      fullName: addressData.fullName,
      phoneNumber: addressData.phone,
      addressLine: addressData.address,
      ward: addressData.ward,
      district: addressData.district,
      province: addressData.city,
      country: addressData.country || 'Việt Nam',
      postalCode: addressData.postalCode || '',
      isDefault: addressData.isDefault || false,
      type: addressData.type || 'HOME',
    };
    const response = await api.put(`/api/addresses/${addressId}`, backendData);
    const backendResponse = response.data.data;
    return {
      id: backendResponse.id,
      fullName: backendResponse.fullName,
      phone: backendResponse.phoneNumber,
      address: backendResponse.addressLine,
      city: backendResponse.province,
      district: backendResponse.district,
      ward: backendResponse.ward,
      country: backendResponse.country,
      postalCode: backendResponse.postalCode,
      isDefault: backendResponse.isDefault,
      type: backendResponse.type,
    };
  },

  deleteAddress: async (addressId) => {
    const response = await api.delete(`/api/addresses/${addressId}`);
    return response.data;
  },

  // Cart Management
  getCart: async () => {
    const response = await api.get('/api/cart');
    return response.data.data;
  },

  addToCart: async (productId, quantity, variantInfo = null) => {
    const response = await api.post('/api/cart/items', {
      productId,
      quantity,
      variantInfo: variantInfo ? JSON.stringify(variantInfo) : null,
    });
    return response.data.data;
  },

  updateCartItemQuantity: async (itemId, quantity) => {
    const response = await api.put(`/api/cart/items/${itemId}`, null, {
      params: { quantity }
    });
    return response.data.data;
  },

  removeCartItem: async (itemId) => {
    const response = await api.delete(`/api/cart/items/${itemId}`);
    return response.data.data;
  },

  // Order History
  getOrders: async (page = 0, size = 10) => {
    const response = await api.get(`${API_URL}/me/orders`, {
      params: { page, size }
    });
    return response.data;
  },

  getOrderDetails: async (orderId) => {
    const response = await api.get(`${API_URL}/me/orders/${orderId}`);
    return response.data;
  },

  // Wishlist Management
  getWishlist: async () => {
    const response = await api.get(`${API_URL}/me/wishlist`);
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await api.post(`${API_URL}/me/wishlist/${productId}`);
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await api.delete(`${API_URL}/me/wishlist/${productId}`);
    return response.data;
   },

  // Admin User Management
  getAllUsers: async (page = 0, size = 10) => {
    const response = await api.get(`/api/v1/users/admin?page=${page}&size=${size}`);
    return response.data;
  },

  searchUsers: async (keyword, page = 0, size = 10) => {
    const response = await api.get(`/api/v1/users/admin/search?keyword=${keyword}&page=${page}&size=${size}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    console.log('userService.updateUser called with:', { userId, userData });
    try {
      const response = await api.put(`/api/v1/users/admin/${userId}`, userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('userService.updateUser response:', response);
      return response.data;
    } catch (error) {
      console.error('userService.updateUser error:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/api/v1/users/admin/${userId}`);
    return response.data;
  },
}; 