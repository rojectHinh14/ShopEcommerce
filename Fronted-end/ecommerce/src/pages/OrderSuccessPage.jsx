"use client"

import { useParams, Link } from "react-router-dom"
import { CheckCircle, Package, Truck, CreditCard, Home, Receipt } from "lucide-react"
import { Button } from "@mui/material"
import { Card } from "@mui/material"
import { CardContent } from "@mui/material"

export default function OrderSuccessPage() {
  const { orderId } = useParams()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardContent className="text-center py-12">
            {/* Success Icon */}
            <div className="mb-6">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
            <p className="text-gray-600 mb-8">
              Cảm ơn bạn đã mua sắm tại Fashion Store. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
            </p>

            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Mã đơn hàng</p>
                  <p className="font-semibold text-lg">#{orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                  <p className="font-semibold">{new Date().toLocaleDateString("vi-VN")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                  <p className="font-semibold">Thanh toán khi nhận hàng</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái</p>
                  <p className="font-semibold text-green-600">Đang xử lý</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="text-left mb-8">
              <h3 className="font-semibold text-lg mb-4">Các bước tiếp theo:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Xác nhận đơn hàng</p>
                    <p className="text-sm text-gray-600">Chúng tôi sẽ gọi điện xác nhận trong vòng 2 giờ</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Chuẩn bị hàng</p>
                    <p className="text-sm text-gray-600">Đóng gói và chuẩn bị giao hàng (1-2 ngày)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Giao hàng</p>
                    <p className="text-sm text-gray-600">Giao hàng tận nơi (2-5 ngày làm việc)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link to="/profile">
                  <Receipt className="mr-2 h-4 w-4" />
                  Xem đơn hàng của tôi
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full" size="lg">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Tiếp tục mua sắm
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-8 border-t text-center">
              <p className="text-sm text-gray-600 mb-2">Cần hỗ trợ? Liên hệ với chúng tôi:</p>
              <div className="flex justify-center space-x-6 text-sm">
                <a href="tel:+84123456789" className="text-primary hover:underline">
                  📞 +84 123 456 789
                </a>
                <a href="mailto:support@fashionstore.com" className="text-primary hover:underline">
                  ✉️ support@fashionstore.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardContent className="text-center py-6">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-1">Miễn phí đổi trả</h4>
              <p className="text-sm text-gray-600">Trong vòng 7 ngày</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-1">Giao hàng nhanh</h4>
              <p className="text-sm text-gray-600">2-5 ngày làm việc</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium mb-1">Thanh toán an toàn</h4>
              <p className="text-sm text-gray-600">Bảo mật 100%</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
