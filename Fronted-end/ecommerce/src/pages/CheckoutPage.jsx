"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { CreditCard, Truck, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@mui/material"
import { Input } from "@mui/material"
import { Card } from "@mui/material"
import { CardContent } from "@mui/material"
import { CardHeader } from "@mui/material"
import { Badge } from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../store/slices/orderSlice'
import { clearCart } from '../store/slices/cartSlice'
import { useAuth } from "../contexts/AuthContext"

const checkoutSchema = Yup.object({
  fullName: Yup.string().required("Họ tên là bắt buộc"),
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
  address: Yup.string().required("Địa chỉ là bắt buộc"),
  city: Yup.string().required("Thành phố là bắt buộc"),
  district: Yup.string().required("Quận/Huyện là bắt buộc"),
  paymentMethod: Yup.string().required("Phương thức thanh toán là bắt buộc"),
})

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { auth } = useAuth()
  const dispatch = useDispatch()
  const { items: cartItems, total: cartTotal } = useSelector((state) => state.cart)
  const [isProcessing, setIsProcessing] = useState(false)

  const formik = useFormik({
    initialValues: {
      fullName: auth.user?.firstName + ' ' + auth.user?.lastName || "",
      email: auth.user?.email || "",
      phone: auth.user?.phone || "",
      address: "",
      city: "",
      district: "",
      ward: "",
      paymentMethod: "cod",
      notes: "",
    },
    validationSchema: checkoutSchema,
    onSubmit: async (values) => {
      if (!cartItems || cartItems.length === 0) {
        toast.error("Giỏ hàng trống")
        return
      }

      setIsProcessing(true)
      try {
        const orderData = {
          shippingName: values.fullName,
          shippingPhone: values.phone,
          shippingAddress: `${values.address}, ${values.ward}, ${values.district}, ${values.city}`,
          shippingFee: shippingFee,
          paymentMethod: values.paymentMethod,
          notes: values.notes,
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            variantId: item.variantId
          }))
        }

        const resultAction = await dispatch(createOrder(orderData))
        if (createOrder.fulfilled.match(resultAction)) {
          dispatch(clearCart())
          toast.success("Đặt hàng thành công!")
          navigate(`/order-success/${resultAction.payload.id}`)
        } else {
          throw new Error(resultAction.error.message)
        }
      } catch (error) {
        console.error('Error creating order:', error)
        toast.error(error.message || "Có lỗi xảy ra. Vui lòng thử lại.")
      } finally {
        setIsProcessing(false)
      }
    },
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  if (!auth.user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vui lòng đăng nhập</h2>
            <p className="text-gray-600 mb-8">Bạn cần đăng nhập để đặt hàng</p>
            <Button asChild size="lg">
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">Bạn cần thêm sản phẩm vào giỏ hàng trước khi đặt hàng</p>
            <Button asChild>
              <Link to="/">Tiếp tục mua sắm</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalAmount = cartTotal || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingFee = totalAmount > 500000 ? 0 : 30000
  const finalTotal = totalAmount + shippingFee

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/cart")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại giỏ hàng
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Đặt hàng</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Thông tin giao hàng
                </h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ tên <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.fullName && formik.errors.fullName ? "border-red-500" : ""}
                      />
                      {formik.touched.fullName && formik.errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.phone && formik.errors.phone ? "border-red-500" : ""}
                      />
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thành phố <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                          formik.touched.city && formik.errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Chọn thành phố</option>
                        <option value="ho-chi-minh">TP. Hồ Chí Minh</option>
                        <option value="ha-noi">Hà Nội</option>
                        <option value="da-nang">Đà Nẵng</option>
                        <option value="can-tho">Cần Thơ</option>
                      </select>
                      {formik.touched.city && formik.errors.city && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quận/Huyện <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="district"
                        value={formik.values.district}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.touched.district && formik.errors.district ? "border-red-500" : ""}
                      />
                      {formik.touched.district && formik.errors.district && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.district}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Địa chỉ chi tiết <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Số nhà, tên đường, phường/xã"
                        className={formik.touched.address && formik.errors.address ? "border-red-500" : ""}
                      />
                      {formik.touched.address && formik.errors.address && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.address}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                      <textarea
                        name="notes"
                        value={formik.values.notes}
                        onChange={formik.handleChange}
                        rows={3}
                        placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phương thức thanh toán <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className={`p-4 border rounded-lg cursor-pointer ${
                          formik.values.paymentMethod === "cod"
                            ? "border-primary bg-primary/5"
                            : "hover:border-gray-400"
                        }`}
                        onClick={() => formik.setFieldValue("paymentMethod", "cod")}
                      >
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-5 w-5" />
                          <div>
                            <p className="font-medium">Thanh toán khi nhận hàng</p>
                            <p className="text-sm text-gray-600">(COD)</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`p-4 border rounded-lg cursor-pointer ${
                          formik.values.paymentMethod === "banking"
                            ? "border-primary bg-primary/5"
                            : "hover:border-gray-400"
                        }`}
                        onClick={() => formik.setFieldValue("paymentMethod", "banking")}
                      >
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-5 w-5" />
                          <div>
                            <p className="font-medium">Chuyển khoản ngân hàng</p>
                            <p className="text-sm text-gray-600">(Banking)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Đang xử lý..." : "Đặt hàng"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <h2 className="text-xl font-bold">Tóm tắt đơn hàng</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.size && `Size: ${item.size}`}
                          {item.color && ` • Màu: ${item.color}`}
                        </p>
                        <p className="text-sm text-gray-900">
                          {item.quantity} x {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
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
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">{formatCurrency(finalTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
