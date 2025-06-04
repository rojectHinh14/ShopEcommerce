import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../../store/slices/orderSlice';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';
import { Badge } from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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

const OrderList = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, totalPages, currentPage } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders({ page: 0, size: 10 }));
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(fetchMyOrders({ page: newPage, size: 10 }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
        <button
          onClick={() => dispatch(fetchMyOrders({ page: 0, size: 10 }))}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
        <Link
          to="/"
          className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-primary hover:text-primary/80"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              className={`px-3 py-1 rounded ${
                currentPage === index
                  ? 'bg-primary text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderList; 