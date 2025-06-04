"use client"

import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@mui/material"
import { Card } from "@mui/material"
import { CardContent } from "@mui/material"
import { Badge } from "@mui/material"
import { removeFromWishlist, clearWishlist } from "../store/slices/wishlistSlice"
import { addToCart } from "../store/slices/cartSlice"
import { toast } from "react-toastify"
import { userService } from "../services/userService"

export default function WishlistPage() {
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.wishlist)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleRemoveFromWishlist = (id, name) => {
    dispatch(removeFromWishlist(id))
    toast.success(`Đã xóa ${name} khỏi danh sách yêu thích`)
  }

  const handleAddToCart = async (item) => {
    try {
      // Call backend API
      await userService.addToCart(item.id, 1)
      
      // Dispatch Redux action
      dispatch(
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1
        })
      )
      toast.success(`Đã thêm ${item.name} vào giỏ hàng`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Không thể thêm sản phẩm vào giỏ hàng')
    }
  }

  const handleClearWishlist = () => {
    dispatch(clearWishlist())
    toast.success("Đã xóa tất cả sản phẩm khỏi danh sách yêu thích")
  }

  const handleAddAllToCart = async () => {
    try {
      // Call backend API for each item
      await Promise.all(items.map(item => userService.addToCart(item.id, 1)))

      // Dispatch Redux actions after all API calls are successful
      items.forEach((item) => {
        dispatch(
          addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: 1
          })
        )
      })
      toast.success(`Đã thêm ${items.length} sản phẩm vào giỏ hàng`)
    } catch (error) {
      console.error('Error adding all to cart:', error)
      toast.error('Không thể thêm một số sản phẩm vào giỏ hàng')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <Heart className="h-24 w-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Danh sách yêu thích trống</h2>
            <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong danh sách yêu thích</p>
            <Button asChild size="lg">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Khám phá sản phẩm
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Danh sách yêu thích</h1>
              <p className="text-gray-600 mt-1">Bạn có {items.length} sản phẩm trong danh sách yêu thích</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleAddAllToCart}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Thêm tất cả vào giỏ
              </Button>
              <Button variant="outline" onClick={handleClearWishlist}>
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa tất cả
              </Button>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="group relative overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Remove from wishlist button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                  onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>

                {/* Discount badge */}
                {item.discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-[#a27b5c] hover:bg-[#8b6b4f]">-{item.discount}%</Badge>
                )}

                {/* Quick actions overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => handleAddToCart(item)}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Thêm vào giỏ
                    </Button>
                    <Button variant="outline" className="w-full bg-white" asChild>
                      <Link to={`/products/${item.id}`}>Xem chi tiết</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <Link to={`/products/${item.id}`} className="block">
                  <h3 className="font-medium text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <div>
                    {item.discount > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-primary">
                          {formatCurrency(item.price * (1 - item.discount / 100))}
                        </span>
                        <span className="text-gray-500 text-sm line-through">{formatCurrency(item.price)}</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
                    )}
                  </div>

                  <Button size="sm" onClick={() => handleAddToCart(item)}>
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </div>

                {item.rating && (
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(item.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs ml-1 text-gray-600">{item.rating}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to shopping */}
        <div className="mt-12 text-center">
          <Button variant="outline" asChild size="lg">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tiếp tục mua sắm
            </Link>
          </Button>
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Có thể bạn sẽ thích</h2>
          <div className="text-center">
            <Button asChild>
              <Link to="/products">Khám phá thêm sản phẩm</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
