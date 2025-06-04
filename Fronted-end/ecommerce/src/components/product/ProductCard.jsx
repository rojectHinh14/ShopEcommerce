"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, ShoppingBag, Star } from "lucide-react"
import Button from "@mui/material/Button"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../../store/slices/cartSlice"
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice"

// Thêm base URL cho server file
const FILE_SERVER_BASE_URL = 'http://localhost:8080'; // Base URL cho server phục vụ file

// Hàm helper để tạo URL đầy đủ cho ảnh sản phẩm
const getProductImageUrl = (path) => {
  if (!path) return null; // Trả về null nếu không có đường dẫn
  
  // Nếu đường dẫn từ backend bắt đầu bằng tiền tố cổng 8082, thay thế bằng cổng 8080
  if (path.startsWith('http://localhost:8082/file/images-product/')) {
    return path.replace('http://localhost:8082', 'http://localhost:8080');
  }
  // Nếu đường dẫn từ backend đã là URL đầy đủ (bắt đầu bằng http) nhưng không phải cổng 8082, sử dụng nó trực tiếp.
  if (path.startsWith('http')) {
    return path;
  }
  // Nếu không phải là URL đầy đủ, ghép với FILE_SERVER_BASE_URL (cổng 8080) và /file/images-product/
  // (Lưu ý: dựa vào cấu hình backend, đường dẫn này có thể cần khớp với storage.product.relative.path)
  return `${FILE_SERVER_BASE_URL}/file/images-product/${path.split('/').pop()}`;
};

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const dispatch = useDispatch()
  const isInWishlist = useSelector((state) => state.wishlist.items.some((item) => item.id === product.id))

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrls?.[0] || "/placeholder.svg",
        quantity: 1,
      }),
    )
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`)
  }

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
      toast.info(`Đã xóa ${product.name} khỏi danh sách yêu thích`)
    } else {
      dispatch(
        addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrls?.[0] || "/placeholder.svg",
          discount: product.discount,
          rating: product.rating,
        }),
      )
      toast.info(`Đã thêm ${product.name} vào danh sách yêu thích`)
    }
  }

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 transition-all hover:shadow-md">
      {/* Discount badge */}
      {product.discount > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-[#a27b5c] hover:bg-[#8b6b4f] text-white text-xs font-semibold rounded px-2 py-1">
          -{product.discount}%
        </span>
      )}

      {/* New badge */}
      {product.isNew && (
        <span className="absolute top-2 right-2 z-10 bg-[#7d5a50] hover:bg-[#6b4f45] text-white text-xs font-semibold rounded px-2 py-1">
          Mới
        </span>
      )}

      {/* Product image */}
      <Link to={`/products/${product.id}`} className="block relative aspect-square">
        <img
          src={getProductImageUrl(product.imageUrls?.[0]) || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Quick actions */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 backdrop-blur-sm translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex gap-2">
          <Button variant="contained" size="small" fullWidth onClick={handleAddToCart} sx={{ minWidth: 0 }}>
            <ShoppingBag className="h-4 w-4 mr-1" />
            Thêm vào giỏ
          </Button>
          <Button
            variant={isWishlisted ? "contained" : "outlined"}
            size="small"
            color={isWishlisted ? "secondary" : "primary"}
            className={isInWishlist ? "text-[#a27b5c]" : ""}
            onClick={toggleWishlist}
            sx={{ minWidth: 0, color: isWishlisted ? '#a27b5c' : undefined }}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
            <span className="sr-only">Thêm vào yêu thích</span>
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-medium text-sm mb-1 line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs ml-1">{product.rating || 0}</span>
          </div>
          {product.ratingCount > 0 && (
            <span className="text-xs text-gray-500 ml-1">({product.ratingCount})</span>
          )}
        </div>

        <div className="flex items-center">
        {product.originalPrice && product.originalPrice > product.price ? (

            <>
                <span className="font-semibold">{formatCurrency(product.price)}</span>
                <span className="text-gray-500 text-sm line-through ml-2">{formatCurrency(product.originalPrice)}</span>
            </>
          ) : (
            <span className="font-semibold">{formatCurrency(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
