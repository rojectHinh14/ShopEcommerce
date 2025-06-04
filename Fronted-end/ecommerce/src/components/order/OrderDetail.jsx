import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderById, cancelOrder } from '../../store/slices/orderSlice';
import { formatCurrency } from '../../utils/format';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { toast } from 'react-toastify';

const OrderStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'DELIVERED':
        return 'Đã giao';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <Badge
      color={getStatusColor(status)}
      variant="contained"
      sx={{
        '& .MuiBadge-badge': {
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
        },
      }}
    >
      {getStatusText(status)}
    </Badge>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'Đã thanh toán';
      case 'PENDING':
        return 'Chờ thanh toán';
      case 'FAILED':
        return 'Thanh toán thất bại';
      default:
        return status;
    }
  };

  return (
    <Badge
      color={getStatusColor(status)}
      variant="contained"
      sx={{
        '& .MuiBadge-badge': {
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
        },
      }}
    >
      {getStatusText(status)}
    </Badge>
  );
};

const OrderDetail = () => {
  const { id } = useParams();
  console.log("🧪 OrderDetail useParams.id =", id); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder: order, loading, error } = useSelector((state) => state.order);
  const [openCancelDialog, setOpenCancelDialog] = React.useState(false);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      console.error("❌ Order ID không hợp lệ:", id);
      toast.error("Không tìm thấy mã đơn hàng hợp lệ.");
      navigate('/orders');
      return;
    }
  
    dispatch(fetchOrderById(Number(id))); // ✅ ép kiểu đảm bảo
  }, [dispatch, id, navigate]);

  // Add debug logs
  useEffect(() => {
    if (order) {
      console.log("🔍 Order data:", {
        orderNumber: order.orderNumber,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        payments: order.payments // Log the entire payments array
      });
    }
  }, [order]);

  const handleCancelOrder = async () => {
    try {
      // Ensure id is valid before cancelling
      if (!id) {
        console.error("Cannot cancel order: ID is missing");
        toast.error("Không tìm thấy mã đơn hàng để hủy.");
        return;
      }
      await dispatch(cancelOrder(id)).unwrap();
      setOpenCancelDialog(false);
      toast.success('Hủy đơn hàng thành công');
      navigate('/orders');
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Modified error handling to include the case where ID is missing initially
  if (error || !id) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error || 'Không tìm thấy mã đơn hàng hoặc có lỗi xảy ra.'}</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Quay lại danh sách đơn hàng
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy đơn hàng với mã: {id}</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Đơn hàng #{order.orderNumber}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Đặt lúc {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <OrderStatusBadge status={order.status} />
            {order.status === 'PENDING' && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpenCancelDialog(true)}
              >
                Hủy đơn hàng
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giao hàng</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Người nhận:</span> {order.shippingAddress.fullName}
            </p>
            <p className="text-sm">
              <span className="font-medium">Số điện thoại:</span> {order.shippingAddress.phone}
            </p>
            <p className="text-sm">
              <span className="font-medium">Địa chỉ:</span> {order.shippingAddress.address}
            </p>
            {order.shippingAddress.note && (
              <p className="text-sm">
                <span className="font-medium">Ghi chú:</span> {order.shippingAddress.note}
              </p>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thanh toán</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Phương thức:</span> {order.paymentMethod || 'Chưa chọn'}
            </p>
            <p className="text-sm">
              <span className="font-medium">Trạng thái:</span>{' '}
              {order.payments && order.payments.length > 0 ? (
                <PaymentStatusBadge status={order.payments[0].paymentStatus} />
              ) : (
                <PaymentStatusBadge status="PENDING" />
              )}
            </p>
            {order.paymentMethod === 'VNPAY' && 
             order.payments && 
             order.payments.length > 0 && 
             order.payments[0].paymentStatus === 'PENDING' && (
              <p className="text-sm text-yellow-600">
                Vui lòng hoàn tất thanh toán trong vòng 15 phút
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết sản phẩm</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thành tiền
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                        <div className="text-sm text-gray-500">SKU: {item.productSku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-end">
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="text-red-600">-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="text-gray-900">{formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-base font-medium">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle id="cancel-dialog-title">Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>Hủy</Button>
          <Button onClick={handleCancelOrder} color="error" variant="contained">
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderDetail; 