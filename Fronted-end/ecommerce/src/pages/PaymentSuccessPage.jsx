import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, CreditCard, Home, Receipt } from 'lucide-react';
import { Button, Card, CardContent, Badge } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

// Thêm base URL cho API
const API_BASE_URL = 'http://localhost:8080';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Log tất cả các params từ VNPay
        console.log('VNPay Response Params:', Object.fromEntries(searchParams.entries()));
        
        // Lấy thông tin từ URL params
        const vnpResponseCode = searchParams.get('vnp_ResponseCode');
        const vnpOrderInfo = searchParams.get('vnp_OrderInfo');
        
        console.log('Response Code:', vnpResponseCode);
        console.log('Order Info:', vnpOrderInfo);
        
        if (vnpResponseCode !== '00') {
          navigate('/payment/error', { 
            state: { 
              error: 'Thanh toán không thành công',
              code: vnpResponseCode 
            }
          });
          return;
        }

        // Tìm orderNumber từ vnp_OrderInfo
        // Thử nhiều cách parse khác nhau
        let orderNumber;
        if (vnpOrderInfo) {
          // Cách 1: Tìm chuỗi bắt đầu bằng ORD
          const ordMatch = vnpOrderInfo.match(/ORD[A-Z0-9]+/);
          if (ordMatch) {
            orderNumber = ordMatch[0];
          } else {
            // Cách 2: Lấy phần tử cuối cùng sau dấu cách
            orderNumber = vnpOrderInfo.split(' ').pop();
          }
        }
        
        console.log('Extracted Order Number:', orderNumber);

        if (!orderNumber) {
          console.error('Không thể tìm thấy mã đơn hàng từ vnp_OrderInfo');
          toast.error('Không thể xác định mã đơn hàng');
          return;
        }

        // Gọi API lấy thông tin đơn hàng với base URL và endpoint đúng
        console.log('Calling API with order number:', orderNumber);
        const response = await axios.get(`${API_BASE_URL}/api/orders/number/${orderNumber}`, {
          headers: {
            'Content-Type': 'application/json',
            // Thêm token nếu cần
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log('API Response:', response.data);
        
        if (response.data && response.data.data) {
          setOrder(response.data.data);
        } else {
          console.error('API response không có dữ liệu đơn hàng:', response.data);
          toast.error('Không thể lấy thông tin đơn hàng');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        if (error.response) {
          console.error('API Error Response:', error.response.data);
          if (error.response.status === 401) {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            navigate('/login');
            return;
          }
        }
        toast.error('Không thể lấy thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy thông tin đơn hàng</h2>
          <Button component={Link} to="/" variant="contained" color="primary">
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
            <p className="text-gray-600 mb-8">
              Cảm ơn bạn đã mua sắm tại Fashion Store. Đơn hàng của bạn đã được thanh toán thành công.
            </p>

            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Mã đơn hàng</p>
                  <p className="font-semibold text-lg">#{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {order.payment?.paymentMethod === 'VNPAY' ? 'VNPay' : 
                       order.payment?.paymentMethod === 'CARD' ? 'Thẻ tín dụng' : 
                       'Chưa xác định'}
                    </span>
                    {order.payment?.paymentMethod === 'VNPAY' && (
                      <img src="/vnpay-logo.png" alt="VNPay" className="h-6" />
                    )}
                    {order.payment?.paymentMethod === 'CARD' && (
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trạng thái thanh toán</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      color={
                        order.payment?.status === 'COMPLETED' ? 'success' :
                        order.payment?.status === 'PENDING' ? 'warning' :
                        order.payment?.status === 'FAILED' ? 'error' :
                        'default'
                      } 
                      variant="contained"
                    >
                      {order.payment?.status === 'COMPLETED' ? 'Đã thanh toán' :
                       order.payment?.status === 'PENDING' ? 'Đang xử lý' :
                       order.payment?.status === 'FAILED' ? 'Thanh toán thất bại' :
                       'Chưa thanh toán'}
                    </Badge>
                    {order.payment?.transactionId && (
                      <span className="text-xs text-gray-500">
                        (Mã GD: {order.payment.transactionId})
                      </span>
                    )}
                  </div>
                </div>
                {order.payment?.status === 'COMPLETED' && order.payment?.paidAt && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Thời gian thanh toán</p>
                    <p className="font-semibold">
                      {new Date(order.payment.paidAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                )}
                {order.payment?.status === 'FAILED' && order.payment?.failureReason && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Lý do thất bại</p>
                    <p className="text-red-500 font-semibold">
                      {order.payment.failureReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                component={Link}
                to={`/orders/${order.id}`}
                variant="contained"
                color="primary"
                className="w-full"
                startIcon={<Receipt />}
              >
                Xem chi tiết đơn hàng
              </Button>
              <Button
                component={Link}
                to="/"
                variant="outlined"
                className="w-full"
                startIcon={<Home />}
              >
                Tiếp tục mua sắm
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
  );
} 