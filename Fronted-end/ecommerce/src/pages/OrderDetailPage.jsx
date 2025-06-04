import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone, User, CreditCard } from "lucide-react"
import { Button, Card, CardContent, CardHeader, Badge, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { fetchOrderById, cancelOrder } from "../store/slices/orderSlice"
import { toast } from "react-toastify"

// Thêm constant cho API base URL
const API_BASE_URL = 'http://localhost:8080';

// Hàm helper để xử lý URL ảnh
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-product.png';

  try {
    const url = new URL(imagePath);
    // Nếu URL có host (tức là absolute URL)
    if (url.host) {
      // Thay thế origin bằng API_BASE_URL
      const baseUrl = new URL(API_BASE_URL);
      url.protocol = baseUrl.protocol;
      url.host = baseUrl.host;
      url.port = baseUrl.port;
      return url.toString();
    }
  } catch (e) {
    // URL không phải là absolute URL, xử lý như relative path
    console.error("Error parsing image URL, treating as relative:", imagePath, e);
  }

  // Nếu là relative path, thêm base URL
  return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default function OrderDetailPage() {
  const { id: orderId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentOrder: order, loading, error } = useSelector((state) => state.order)
  
  // Debug logs
  useEffect(() => {
    if (order) {
      console.log("🔥 Order Details:", {
        orderNumber: order.orderNumber,
        status: order.status,
        payments: order.payments, // Log toàn bộ payments array
        paymentStatus: order.paymentStatus, // Log paymentStatus từ order
        latestPayment: order.payments ? order.payments[order.payments.length - 1] : null, // Log payment mới nhất
        orderItems: order.orderItems?.map(item => ({
          id: item.id,
          productName: item.productName,
          productImage: item.productImage,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      });
    }
  }, [order]);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  useEffect(() => {
    if (!orderId || isNaN(Number(orderId))) {
      toast.error("Không tìm thấy mã đơn hàng hợp lệ.")
      navigate("/orders")
      return
    }
    console.log("🧪 OrderDetail useParams.id =", orderId)
    dispatch(fetchOrderById(Number(orderId)))
  }, [dispatch, orderId, navigate])

  const handleCancelOrder = async () => {
    try {
      const resultAction = await dispatch(cancelOrder(orderId))
      if (cancelOrder.fulfilled.match(resultAction)) {
        toast.success("Đơn hàng đã được hủy thành công")
        setCancelDialogOpen(false)
        navigate("/orders")
      } else {
        throw new Error(resultAction.error.message)
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi hủy đơn hàng")
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)

  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: "Chờ xử lý", color: "bg-yellow-500" },
      CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-500" },
      PROCESSING: { label: "Đang xử lý", color: "bg-orange-500" },
      SHIPPING: { label: "Đang giao", color: "bg-purple-500" },
      DELIVERED: { label: "Đã giao", color: "bg-green-500" },
      CANCELLED: { label: "Đã hủy", color: "bg-red-500" }
    }
    const config = statusConfig[status] || statusConfig.PENDING
    return <Badge className={`${config.color} text-white px-2 py-1 rounded-md`}>{config.label}</Badge>
  }

  const getPaymentStatusBadge = (payments) => {
    console.log("🔍 Payment data:", payments); // Debug log
    
    if (!payments || payments.length === 0) {
      console.log("⚠️ No payment data available");
      return (
        <div className="flex items-center gap-2">
          <Badge color="default" variant="contained">
            Chưa thanh toán
          </Badge>
        </div>
      );
    }
    
    // Get the latest payment
    const latestPayment = payments[payments.length - 1];
    console.log("Latest payment details:", {
      payment: latestPayment,
      status: latestPayment.paymentStatus,
      method: latestPayment.paymentMethod,
      transactionId: latestPayment.transactionId
    });
    
    const statusConfig = {
      'COMPLETED': { label: 'Đã thanh toán', color: 'success' },
      'SUCCESS': { label: 'Đã thanh toán', color: 'success' },
      'PENDING': { label: 'Đang xử lý', color: 'warning' },
      'FAILED': { label: 'Thanh toán thất bại', color: 'error' },
      'CANCELLED': { label: 'Đã hủy', color: 'error' }
    };

    // Nếu không có paymentStatus hoặc paymentStatus không hợp lệ
    if (!latestPayment.paymentStatus || !statusConfig[latestPayment.paymentStatus]) {
      console.log("⚠️ Invalid payment status:", latestPayment.paymentStatus);
      return (
        <div className="flex items-center gap-2">
          <Badge color="default" variant="contained">
            Chưa thanh toán
          </Badge>
        </div>
      );
    }

    const config = statusConfig[latestPayment.paymentStatus];
    console.log("Using status config:", config);
    return (
      <div className="flex items-center gap-2">
        <Badge color={config.color} variant="contained">
          {config.label}
        </Badge>
        {latestPayment.transactionId && config.label !== 'Chưa thanh toán' && (
          <span className="text-xs text-gray-500">
            (Mã GD: {latestPayment.transactionId})
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-16">Đang tải đơn hàng...</div>
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl text-red-600">Không thể tải thông tin đơn hàng</h2>
        <p>{error}</p>
        <Button onClick={() => navigate("/orders")}>Quay lại danh sách đơn hàng</Button>
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Button onClick={() => navigate("/orders")} startIcon={<ArrowLeft />}>
              Quay lại
            </Button>
            <h1 className="text-2xl font-bold mt-4">Đơn hàng #{order.orderNumber}</h1>
            <p className="text-gray-600">Ngày đặt: {formatDate(order.createdAt)}</p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        <Card>
          <CardHeader title="Sản phẩm đã đặt" />
          <CardContent>
            {order.orderItems?.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b py-2">
                <div className="flex items-center space-x-4">
                  <img 
                    src={getImageUrl(item.productImage)} 
                    alt={item.productName} 
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      console.log("⚠️ Image load error for:", item.productImage);
                      e.target.src = '/placeholder-product.png';
                    }}
                  />
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Đơn giá: {formatCurrency(item.unitPrice)}</p>
                  </div>
                </div>
                <p className="text-right font-medium">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Tóm tắt đơn hàng" />
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Tổng cộng</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Thông tin thanh toán" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-semibold">
                    {order.payments && order.payments.length > 0 ? (
                      order.payments[order.payments.length - 1].paymentMethod === 'VNPAY' ? 'VNPay' : 
                      order.payments[order.payments.length - 1].paymentMethod === 'CARD' ? 'Thẻ tín dụng' : 
                      order.payments[order.payments.length - 1].paymentMethod
                    ) : 'Chưa xác định'}
                  </span>
                  {order.payments && order.payments.length > 0 && order.payments[order.payments.length - 1].paymentMethod === 'VNPAY' && (
                    <img 
                      src="/vnpay-logo.png" 
                      alt="VNPay" 
                      className="h-6"
                      onError={(e) => {
                        console.log("⚠️ VNPay logo load error");
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  {order.payments && order.payments.length > 0 && order.payments[order.payments.length - 1].paymentMethod === 'CARD' && (
                    <CreditCard className="h-5 w-5 text-gray-600" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trạng thái thanh toán</p>
                <div className="mt-1">
                  {getPaymentStatusBadge(order.payments)}
                </div>
              </div>
              {order.payments && order.payments.length > 0 && order.payments[order.payments.length - 1].paymentStatus === 'COMPLETED' && order.payments[order.payments.length - 1].paymentDate && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Thời gian thanh toán</p>
                  <p className="font-semibold">
                    {formatDate(order.payments[order.payments.length - 1].paymentDate)}
                  </p>
                </div>
              )}
              {order.payments && order.payments.length > 0 && order.payments[order.payments.length - 1].paymentStatus === 'FAILED' && order.payments[order.payments.length - 1].failureReason && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Lý do thất bại</p>
                  <p className="text-red-500 font-semibold">
                    {order.payments[order.payments.length - 1].failureReason}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Thông tin giao hàng" />
          <CardContent>
            <p><strong>Người nhận:</strong> {order.shippingName}</p>
            <p><strong>SĐT:</strong> {order.shippingPhone}</p>
            <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
            {order.shippingAddress?.note && <p><strong>Ghi chú:</strong> {order.shippingAddress?.note}</p>}
          </CardContent>
        </Card>

        {(order.status === "PENDING" || order.status === "CONFIRMED") && (
          <Button
            color="error"
            variant="contained"
            onClick={() => setCancelDialogOpen(true)}
            fullWidth
          >
            Hủy đơn hàng
          </Button>
        )}
      </div>

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn hủy đơn hàng này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Không</Button>
          <Button onClick={handleCancelOrder} color="error">Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
