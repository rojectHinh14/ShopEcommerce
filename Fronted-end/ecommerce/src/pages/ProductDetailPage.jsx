"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Heart, ShoppingBag, Star, Minus, Plus, ArrowLeft, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@mui/material"
import { Card } from "@mui/material"
import { CardContent } from "@mui/material"
import { Badge } from "@mui/material"
import { Tabs, Tab } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { addToWishlist, removeFromWishlist } from "../store/slices/wishlistSlice"
import { addToCart } from "../store/slices/cartSlice"
import { toast } from "react-toastify"
import ProductCard from "../components/product/ProductCard"
import { productService } from "../services/productService"
import { userService } from "../services/userService"

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
  return `${FILE_SERVER_BASE_URL}/file/images-product/${path.split('/').pop()}`;
};

// Thêm component TabPanel để dùng cho tab content
function TabPanel(props) {
  const { children, ...other } = props;
  return (
    <div role="tabpanel" hidden={false} {...other}>
      {children}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState([])

  const isInWishlist = useSelector((state) => state.wishlist.items.some((item) => item.id === Number(id)))

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await productService.getProductById(id)
      const productData = response.data
      setProduct(productData)
      
      // Set initial variant if available
      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0])
      }

      // Increment view count
      await productService.incrementProductViews(id)

      // Fetch related products (same category)
      if (productData.categoryId) {
        const relatedResponse = await productService.getProductsByCategory(productData.categoryId, 0, 4)
        setRelatedProducts(relatedResponse.data.content.filter(p => p.id !== productData.id))
      }
    } catch (err) {
      toast.error("Không thể tải thông tin sản phẩm")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleAddToCart = async () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error("Vui lòng chọn biến thể sản phẩm")
      return
    }

    try {
      // Call backend API
      const cartItemData = {
        productId: product.id,
        quantity: quantity,
        variantInfo: selectedVariant ? JSON.stringify({
          variantId: selectedVariant.id,
          variantName: selectedVariant.variantName,
          variantValue: selectedVariant.variantValue
        }) : null
      }
      await userService.addToCart(cartItemData.productId, cartItemData.quantity, cartItemData.variantInfo)

      // Dispatch Redux action to update frontend state (optional but good for immediate UI update)
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: selectedVariant ? selectedVariant.price : product.price,
          image: product.imageUrls[0],
          quantity,
          variant: selectedVariant ? {
            variantId: selectedVariant.id,
            variantName: selectedVariant.variantName,
            variantValue: selectedVariant.variantValue
          } : null
        })
      )
      toast.success(`Đã thêm ${product.name} vào giỏ hàng!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Không thể thêm sản phẩm vào giỏ hàng')
    }
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
          price: selectedVariant ? selectedVariant.price : product.price,
          image: product.imageUrls[0],
          rating: product.rating,
        }),
      )
      toast.info(`Đã thêm ${product.name} vào danh sách yêu thích`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-300 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to={`/category/${product.categoryId}`} className="hover:text-primary">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-white">
              <img
                src={getProductImageUrl(product.imageUrls?.[selectedImage]) || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.imageUrls.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <img
                    src={getProductImageUrl(image) || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.ratingCount} đánh giá)
                  </span>
                </div>
                <span className="text-sm text-gray-500">SKU: {product.skuCode}</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                {product.originalPrice && product.originalPrice > product.price ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(selectedVariant ? selectedVariant.price : product.price)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(selectedVariant ? selectedVariant.price : product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Product Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Biến thể sản phẩm</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-4 border rounded-lg text-left ${
                        selectedVariant?.id === variant.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{variant.variantName}</div>
                      <div className="text-sm text-gray-600">{variant.variantValue}</div>
                      <div className="mt-2 font-bold">{formatCurrency(variant.price)}</div>
                      <div className="text-sm text-gray-500">
                        Còn lại: {variant.stockQuantity}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Số lượng</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(
                    selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity,
                    quantity + 1
                  ))}
                  disabled={quantity >= (selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  ({selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity} sản phẩm có sẵn)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button onClick={handleAddToCart} className="flex-1" size="lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Thêm vào giỏ hàng
                </Button>
                <Button variant="outline" onClick={toggleWishlist} size="lg">
                  <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <Button variant="outline" className="w-full" size="lg">
                Mua ngay
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium">Miễn phí vận chuyển</p>
                <p className="text-xs text-gray-600">Đơn hàng từ 500k</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium">Bảo hành chính hãng</p>
                <p className="text-xs text-gray-600">12 tháng</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-sm font-medium">Đổi trả dễ dàng</p>
                <p className="text-xs text-gray-600">Trong 7 ngày</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <Tab value="description" label="Mô tả sản phẩm" />
              <Tab value="specifications" label="Thông số kỹ thuật" />
              <Tab value="reviews" label="Đánh giá ({product.ratingCount})" />

              <TabPanel value="description" className="mt-6">
                <div className="space-y-4">
                  <p className="text-gray-700">{product.description}</p>
                  {product.shortDescription && (
                    <p className="text-gray-600">{product.shortDescription}</p>
                  )}
                </div>
              </TabPanel>

              <TabPanel value="specifications" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-900">Danh mục:</span>
                    <span className="text-gray-700">{product.categoryName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-900">Cửa hàng:</span>
                    <span className="text-gray-700">{product.shopName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium text-gray-900">SKU:</span>
                    <span className="text-gray-700">{product.skuCode}</span>
                  </div>
                  {product.weight && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium text-gray-900">Khối lượng:</span>
                      <span className="text-gray-700">{product.weight} kg</span>
                    </div>
                  )}
                </div>
              </TabPanel>

              <TabPanel value="reviews" className="mt-6">
                <div className="text-center py-8">
                  <p className="text-gray-600">Chức năng đánh giá sẽ được cập nhật sớm</p>
                </div>
              </TabPanel>
            </Tabs>
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
