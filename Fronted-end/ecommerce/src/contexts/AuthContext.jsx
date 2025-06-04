import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { toast } from 'react-toastify';
import api from '../services/api'; // Import api instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Only validate token if we're not on the login/register page
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/register')) {
            const response = await api.post('/auth/introspect', { token: storedToken });
            if (!response.data.data.valid) {
              throw new Error('Token invalid');
            }
          }
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          // Only clear storage and redirect if we're not already on auth pages
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/register')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []); // Run only once on mount

  const login = async (credentials) => {
    try {
      const data = await userService.login(credentials);
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        toast.success('Đăng nhập thành công!');
      } else {
        toast.error(data.message || 'Đăng nhập thất bại: Thông tin phản hồi không đủ');
        setUser(null);
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
      setUser(null);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await userService.register(userData);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
      throw error;
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    toast.info('Đã đăng xuất');
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = await userService.updateProfile(userData);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Cập nhật thông tin thành công!');
      } else {
        toast.error('Cập nhật thất bại: Thông tin phản hồi không đủ');
      }
      return updatedUser;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
      throw error;
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      await userService.updatePassword(passwordData);
      toast.success('Cập nhật mật khẩu thành công!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật mật khẩu thất bại');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 