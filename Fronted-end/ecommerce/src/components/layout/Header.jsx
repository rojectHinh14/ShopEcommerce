"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Search, ShoppingBag, User, Heart, Menu, Package } from "lucide-react"
import Button from "../ui/button"
import Badge from "@mui/material/Badge"
import TextField from "@mui/material/TextField"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import { useSelector } from "react-redux"
import { useAuth } from "../../hooks/useAuth"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  
  // Lấy cả user và isAuthenticated từ hook useAuth
  const { auth, logout } = useAuth();
  const isAuthenticated = auth.isAuthenticated; // Sử dụng isAuthenticated từ state trong hook

  // Log để kiểm tra re-render khi isAuthenticated thay đổi
  useEffect(() => {
    console.log("Header re-rendered. isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  const cartItemCount = useSelector((state) => state.cart.totalItems)
  const wishlistItemCount = useSelector((state) => state.wishlist.items.length)

  const navigation = [
    { name: "Trang chủ", href: "/" },
    { name: "Nam", href: "/men" },
    { name: "Nữ", href: "/women" },
    { name: "Phụ kiện", href: "/accessories" },
    { name: "Khuyến mãi", href: "/sale" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold">
              Fashion<span className="text-primary">Store</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href ? "text-primary" : "text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <IconButton onClick={() => setSearchOpen(true)} className="hidden sm:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Tìm kiếm</span>
            </IconButton>
            <Dialog open={searchOpen} onClose={() => setSearchOpen(false)} fullWidth maxWidth="sm">
              <DialogTitle>Tìm kiếm sản phẩm</DialogTitle>
              <DialogContent>
                <div className="flex gap-2 mt-2">
                  <TextField placeholder="Nhập từ khóa tìm kiếm..." fullWidth size="small" />
                  <Button variant="contained">Tìm kiếm</Button>
                </div>
              </DialogContent>
            </Dialog>

                {/* Orders - Only show when authenticated */}
                {isAuthenticated && (
              <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                <Link to="/orders">
                  <Package className="h-5 w-5" />
                  <span className="sr-only">Đơn hàng</span>
                </Link>
              </Button>
            )}

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hidden sm:flex relative" component={Link} to="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                    {wishlistItemCount}
                  </Badge>
                )}
              <span className="sr-only">Danh sách yêu thích</span>
            </Button>

            {/* Account */}
            <Button variant="text" size="small" component={Link} to="/account">
            <Link to={isAuthenticated ? "/profile" : "/login"}>
              <User className="h-5 w-5" />
              <span className="sr-only">Tài khoản</span>
              </Link>
            </Button>

            {isAuthenticated && (
              <Button variant="text" size="small" onClick={logout}>
                <span>Đăng xuất</span>
              </Button>
            )}

            {/* Cart */}
            <Button variant="text" size="small" component={Link} to="/cart" className="relative">
              <Badge badgeContent={cartItemCount} color="primary">
                <ShoppingBag className="h-5 w-5" />
              </Badge>
              <span className="sr-only">Giỏ hàng</span>
            </Button>

            {/* Mobile menu */}
            <IconButton onClick={() => setDrawerOpen(true)} className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </IconButton>
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <div className="flex flex-col h-full w-64 p-4">
                <div className="flex items-center justify-between py-4 border-b">
                  <div className="text-lg font-bold">Menu</div>
                </div>
                <nav className="flex flex-col space-y-4 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`text-base font-medium transition-colors hover:text-primary ${
                        location.pathname === item.href ? "text-primary" : "text-gray-700"
                      }`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto border-t py-4">
                  <div className="flex flex-col space-y-4">
                    {/* Conditional rendering based on authentication */}
                    {isAuthenticated ? (
                      <> {/* Fragment to group authenticated links */}
                        <Link to="/profile" className="flex items-center" onClick={() => setDrawerOpen(false)}>
                          <User className="h-5 w-5 mr-2" />
                          <span>Thông tin tài khoản</span>
                        </Link>
                        <Link to="/orders" className="flex items-center" onClick={() => setDrawerOpen(false)}>
                          <Package className="h-5 w-5 mr-2" />
                          <span>Đơn hàng</span>
                        </Link>
                        <Link to="/wishlist" className="flex items-center" onClick={() => setDrawerOpen(false)}>
                          <Heart className="h-5 w-5 mr-2" />
                          <span>Danh sách yêu thích</span>
                        </Link>
                        {/* Logout Button for Mobile */}
                        <Button variant="text" className="flex items-center w-full justify-start" onClick={() => { logout(); setDrawerOpen(false); }}>
                           <User className="h-5 w-5 mr-2" />
                           <span>Đăng xuất</span>
                        </Button>
                      </>
                    ) : (
                       <Link to="/login" className="flex items-center" onClick={() => setDrawerOpen(false)}>
                          <User className="h-5 w-5 mr-2" />
                          <span>Đăng nhập</span>
                        </Link>
                    )}
                  </div>
                </div>
              </div>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  )
}
