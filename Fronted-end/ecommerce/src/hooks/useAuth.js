import { useSelector, useDispatch } from "react-redux"
import { loginStart, loginSuccess, loginFailure, logout, updateUser } from "../store/slices/userSlice"
import api from "../services/api"
import { toast } from "react-toastify"

export function useAuth() {
  const auth = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const login = async (email, password) => {
    try {
      dispatch(loginStart())
      const response = await api.post('/auth/token', {
        username: email,
        password
      })
      const {token} = response.data.data;
      localStorage.setItem('token', token);

      const userResponse = await api.get('/api/users/profile');
      const user = userResponse.data.data;
      localStorage.setItem('user', JSON.stringify(user));

      dispatch(loginSuccess(user))
      toast.success("Đăng nhập thành công!")
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      dispatch(loginFailure(errorMessage))
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const register = async (name, email, password, phone) => {
    try {
      dispatch(loginStart())
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      await api.post('/api/users/register', {
        username: email,
        email,
        password,
        phoneNumber: phone,
        firstName,
        lastName
      })

      const loginResponse = await api.post('/auth/token', {
        username: email,
        password
      })

      const {token} = loginResponse.data.data;
      localStorage.setItem('token', token);

      const userResponse = await api.get('/api/users/profile')
      const user = userResponse.data.data
      localStorage.setItem('user', JSON.stringify(user));

      dispatch(loginSuccess(user))
      toast.success("Đăng ký thành công!")
      return { success: true }
    } catch (error) {
      const errMessage = error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại sau.";
      dispatch(loginFailure(errMessage))
      toast.error(errMessage)
      return { success: false, error: errMessage }
    }
  }

  const logoutUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if(token) {
        await api.post("/auth/logout", {token})
      }
    } catch(error) {
      console.log("Logout error", error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user');
      dispatch(logout())
      toast.info("Đã đăng xuất")
    }
  }

  const updateUserInfo = async (userData) => {
    try {
      const response = await api.put('/api/users/profile', userData)
      dispatch(updateUser(response.data.data))
      return {success: true}
    } catch(error) {
      const errorMessage = error.response?.data?.message || "Cập nhật thông tin thất bại";
      toast.error(errorMessage)
      return { success: false, error: errorMessage };
    }
  }

  return {
    auth,
    login,
    register,
    logout: logoutUser,
    updateUserInfo,
  }
}
