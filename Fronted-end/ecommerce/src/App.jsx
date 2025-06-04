import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { Providers } from "./store/Providers"
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"
import HomePage from "./pages/HomePage"
import "react-toastify/dist/ReactToastify.css"
import CartPage from "./pages/CartPage"
import WishlistPage from "./pages/WishlistPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import OrderSuccessPage from "./pages/OrderSuccessPage"
import OrderDetailPage from "./pages/OrderDetailPage"
import ProfilePage from "./pages/ProfilePage"
import { useEffect } from "react"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { useDispatch } from "react-redux"
import { restoreAuth } from "./store/slices/userSlice"
import Orders from './pages/Orders'
import Dashboard from "./admin/pages/Dashboard";
import ManageUsers from "./admin/pages/ManageUsers";
import ManageOrders from "./admin/pages/ManageOrders";
import ManageProducts from "./admin/pages/ManageProducts";

function App() {
  const dispatch = useDispatch()

  // Restore auth state on mount
  useEffect(() => {
    dispatch(restoreAuth())
  }, [dispatch])

  return (
    <Providers>


      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/men" element={<div>Trang Nam</div>} />
              <Route path="/women" element={<div>Trang Nữ</div>} />
              <Route path="/accessories" element={<div>Trang Phụ kiện</div>} />
              <Route path="/sale" element={<div>Trang Khuyến mãi</div>} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute><ManageOrders /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><ManageProducts /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </Providers>
  )
}

export default App
