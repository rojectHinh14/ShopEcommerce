"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@mui/material"
import { Input } from "@mui/material"
import { Card } from "@mui/material"
import { CardContent } from "@mui/material"
import { CardHeader } from "@mui/material"
import { Badge } from "@mui/material"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { removeFromCart, updateCartItemQuantity, clearCart, setCartItems } from "../store/slices/cartSlice"
import { useAuth } from "../hooks/useAuth"
import { userService } from "../services/userService"
import { createOrder } from "../store/slices/orderSlice"
import { useFormik } from "formik"
import * as Yup from "yup"
import { productService } from "../services/productService"
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../constants/paymentMethods'

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

const shippingSchema = Yup.object({
  shippingName: Yup.string().required("Họ tên là bắt buộc"),
  shippingPhone: Yup.string()
    .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
  shippingAddress: Yup.string().required("Địa chỉ là bắt buộc"),
  paymentMethod: Yup.string().required("Vui lòng chọn phương thức thanh toán"),
});

export default function CartPage() {
  const { auth } = useAuth()
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.cart)
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [showShippingForm, setShowShippingForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const initializeCart = async () => {
      try {
        if (auth.isAuthenticated) {
          console.log('Fetching cart for authenticated user:', auth.user);
          const cartData = await userService.getCart();
          console.log('Raw cart data received:', cartData);
          
          // Transform cart data to match expected structure
          const transformedItems = Array.isArray(cartData) ? cartData : (cartData.items || []);
          console.log('Transformed cart items:', transformedItems);
          console.log('Variant info in cart items:', transformedItems.map(item => ({
            id: item.id,
            variantName: item.variantName,
            variantValue: item.variantValue,
            variantInfo: item.variantInfo,
            productImage: item.productImage // Log để debug
          })));
          
          // Fetch additional product details for each item
          const itemsWithDetails = await Promise.all(
            transformedItems.map(async (item) => {
              try {
                const productDetails = await productService.getProductById(item.productId);
                console.log('Product details for item:', item.id, productDetails);
                
                return {
                  id: item.id || item.cartItemId,
                  productId: item.productId,
                  name: item.productName || item.name || productDetails.name,
                  price: item.price || item.unitPrice,
                  quantity: item.quantity,
                  image: item.productImage || getProductImageUrl(item.productImage), // Sử dụng productImage từ backend
                  variantId: item.variantId,
                  variantName: item.variantName,
                  variantValue: item.variantValue,
                  description: productDetails.description,
                  stock: productDetails.stock
                };
              } catch (error) {
                console.error('Error fetching product details for item:', item.id, error);
                return {
                  id: item.id || item.cartItemId,
                  productId: item.productId,
                  name: item.productName || item.name,
                  price: item.price || item.unitPrice,
                  quantity: item.quantity,
                  image: item.productImage || getProductImageUrl(item.productImage), // Sử dụng productImage từ backend
                  variantId: item.variantId,
                  variantName: item.variantName,
                  variantValue: item.variantValue
                };
              }
            })
          );
          
          console.log('Cart items with details:', itemsWithDetails);
          dispatch(setCartItems(itemsWithDetails));
        } else {
          console.log('User not authenticated, clearing cart');
          dispatch(setCartItems([]));
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        toast.error('Không thể tải giỏ hàng');
        dispatch(setCartItems([]));
      } finally {
        setLoading(false);
      }
    };

    initializeCart();
  }, [auth.isAuthenticated, dispatch]);

  // Add debug logging for cart items
  useEffect(() => {
    console.log('Current cart items in Redux store:', items);
  }, [items]);

  const totalItems = items?.reduce((sum, item) => sum + (parseInt(item?.quantity) || 0), 0) || 0;
  const totalAmount = items?.reduce((sum, item) => {
    const price = parseFloat(item?.price) || 0;
    const quantity = parseInt(item?.quantity) || 0;
    return sum + (price * quantity);
  }, 0) || 0;

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId)
      return
    }
    try {
      await userService.updateCartItemQuantity(itemId, newQuantity)
      dispatch(updateCartItemQuantity({ id: itemId, quantity: newQuantity }))
      toast.success('Cập nhật số lượng thành công')
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Không thể cập nhật số lượng')
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await userService.removeCartItem(itemId)
      dispatch(removeFromCart(itemId))
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error('Không thể xóa sản phẩm')
    }
  }

  const handleClearCart = async () => {
    try {
      await Promise.all(items.map(item => userService.removeCartItem(item.id)))
      dispatch(clearCart())
      toast.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng')
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Không thể xóa giỏ hàng')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "sale10") {
      setDiscount(0.1)
      toast.success("Áp dụng mã giảm giá thành công! Giảm 10%")
    } else if (couponCode.toLowerCase() === "welcome20") {
      setDiscount(0.2)
      toast.success("Áp dụng mã giảm giá thành công! Giảm 20%")
    } else if (couponCode) {
      toast.error("Mã giảm giá không hợp lệ")
    }
  }

  const finalAmount = totalAmount * (1 - discount)
  const shippingFee = totalAmount > 500000 ? 0 : 30000

  const formik = useFormik({
    initialValues: {
      shippingName: auth.user?.firstName + ' ' + auth.user?.lastName || "",
      shippingPhone: auth.user?.phone || "",
      shippingAddress: "",
      paymentMethod: PAYMENT_METHODS.COD,
    },
    validationSchema: shippingSchema,
    onSubmit: async (values) => {
      try {
        const orderData = {
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            variantId: item.variantId
          })),
          shippingName: values.shippingName,
          shippingPhone: values.shippingPhone,
          shippingAddress: values.shippingAddress,
          shippingFee: shippingFee,
          discountAmount: totalAmount * discount,
          couponCode: couponCode || null,
          paymentMethod: values.paymentMethod,
          totalAmount: finalAmount + shippingFee,
        };
        
        const resultAction = await dispatch(createOrder(orderData));
        if (createOrder.fulfilled.match(resultAction)) {
          const order = resultAction.payload;
          
          // Nếu là thanh toán VNPay, chuyển hướng đến trang thanh toán
          if (values.paymentMethod === PAYMENT_METHODS.VNPAY) {
            const payment = order.payments?.[0];
            if (payment?.paymentUrl) {
              // Chuyển hướng đến trang thanh toán VNPay
              window.location.href = payment.paymentUrl;
              return;
            } else {
              toast.error('Không thể tạo URL thanh toán VNPay');
              return;
            }
          }
          
          // Nếu là COD, chuyển đến trang đơn hàng
          dispatch(clearCart());
          navigate('/orders');
          toast.success('Đặt hàng thành công!');
        }
      } catch (error) {
        console.error('Error creating order:', error);
        toast.error('Không thể tạo đơn hàng. Vui lòng thử lại.');
      }
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="md:col-span-1">
                <div className="p-4 border rounded-lg space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vui lòng đăng nhập</h2>
            <p className="text-gray-600 mb-8">Bạn cần đăng nhập để xem giỏ hàng</p>
            <Button asChild size="lg">
              <Link to="/login">
                Đăng nhập
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Button asChild size="lg">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tiếp tục mua sắm
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
              <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
              <p className="text-gray-600 mt-1">
                {totalItems > 0 
                  ? `Bạn có ${totalItems} sản phẩm trong giỏ hàng`
                  : 'Giỏ hàng của bạn đang trống'}
              </p>
            </div>
            {items.length > 0 && (
              <Button variant="outline" onClick={handleClearCart}>
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa tất cả
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Sản phẩm trong giỏ hàng</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <img
                        src={getProductImageUrl(item.image) || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.productId}`} className="hover:underline">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
                      </Link>
                      <div className="mt-1 space-y-1">
                        {(item.variantName || item.variantValue) && (
                          <p className="text-sm text-gray-500">
                            {item.variantName && `${item.variantName}: ${item.variantValue}`}
                          </p>
                        )}
                        {item.stock !== undefined && (
                          <p className={`text-sm ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.stock > 0 ? `Còn ${item.stock} sản phẩm` : 'Hết hàng'}
                          </p>
                        )}
                        <p className="text-lg font-semibold text-primary">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={item.stock !== undefined && item.quantity >= item.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Tiếp tục mua sắm
                </Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <h2 className="text-xl font-bold">Tóm tắt đơn hàng</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Nhập mã giảm giá"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button onClick={handleApplyCoupon} variant="outline">
                      Áp dụng
                    </Button>
                  </div>
                  {discount > 0 && (
                    <div className="mt-2">
                      <Badge variant="secondary">Giảm {(discount * 100).toFixed(0)}%</Badge>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(totalAmount * discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        formatCurrency(shippingFee)
                      )}
                    </span>
                  </div>

                  {totalAmount <= 500000 && (
                    <p className="text-sm text-gray-600">
                      Mua thêm {formatCurrency(500000 - totalAmount)} để được miễn phí vận chuyển
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{formatCurrency(finalAmount + shippingFee)}</span>
                  </div>
                </div>

                {!showShippingForm ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowShippingForm(true)}
                  >
                    Đặt hàng
                  </Button>
                ) : (
                  <Card className="mt-4">
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Thông tin giao hàng</h3>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ tên <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="shippingName"
                            value={formik.values.shippingName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={formik.touched.shippingName && formik.errors.shippingName ? "border-red-500" : ""}
                          />
                          {formik.touched.shippingName && formik.errors.shippingName && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.shippingName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="shippingPhone"
                            value={formik.values.shippingPhone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={formik.touched.shippingPhone && formik.errors.shippingPhone ? "border-red-500" : ""}
                          />
                          {formik.touched.shippingPhone && formik.errors.shippingPhone && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.shippingPhone}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ giao hàng <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="shippingAddress"
                            value={formik.values.shippingAddress}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                            className={formik.touched.shippingAddress && formik.errors.shippingAddress ? "border-red-500" : ""}
                          />
                          {formik.touched.shippingAddress && formik.errors.shippingAddress && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.shippingAddress}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phương thức thanh toán <span className="text-red-500">*</span>
                          </label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="cod"
                                name="paymentMethod"
                                value={PAYMENT_METHODS.COD}
                                checked={formik.values.paymentMethod === PAYMENT_METHODS.COD}
                                onChange={formik.handleChange}
                                className="h-4 w-4 text-primary"
                              />
                              <label htmlFor="cod" className="text-sm">
                                Thanh toán khi nhận hàng (COD)
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="banking"
                                name="paymentMethod"
                                value={PAYMENT_METHODS.VNPAY}
                                checked={formik.values.paymentMethod === PAYMENT_METHODS.VNPAY}
                                onChange={formik.handleChange}
                                className="h-4 w-4 text-primary"
                              />
                              <label htmlFor="banking" className="text-sm">
                                Chuyển khoản ngân hàng
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="momo"
                                name="paymentMethod"
                                value={PAYMENT_METHODS.MOMO}
                                checked={formik.values.paymentMethod === PAYMENT_METHODS.MOMO}
                                onChange={formik.handleChange}
                                className="h-4 w-4 text-primary"
                              />
                              <label htmlFor="momo" className="text-sm">
                                Ví MoMo
                              </label>
                            </div>
                          </div>
                          {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.paymentMethod}</p>
                          )}
                        </div>

                        {formik.values.paymentMethod === PAYMENT_METHODS.VNPAY && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Thông tin chuyển khoản:</h4>
                            <p className="text-sm">Ngân hàng: Vietcombank</p>
                            <p className="text-sm">Số tài khoản: 1234567890</p>
                            <p className="text-sm">Chủ tài khoản: CÔNG TY TNHH ABC</p>
                            <p className="text-sm">Nội dung chuyển khoản: [Mã đơn hàng]</p>
                          </div>
                        )}

                        {formik.values.paymentMethod === PAYMENT_METHODS.MOMO && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Thanh toán qua MoMo:</h4>
                            <p className="text-sm">Quét mã QR MoMo để thanh toán</p>
                            <p className="text-sm">Hoặc chuyển khoản đến số điện thoại: 0123456789</p>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowShippingForm(false)}
                          >
                            Quay lại
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1"
                            disabled={formik.isSubmitting}
                          >
                            {formik.isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Hoặc{" "}
                    <Link to="/products" className="text-primary hover:underline">
                      tiếp tục mua sắm
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
