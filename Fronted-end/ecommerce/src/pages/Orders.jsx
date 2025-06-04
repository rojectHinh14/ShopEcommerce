import React from 'react';
import OrderList from '../components/order/OrderList';

const Orders = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Đơn hàng của tôi</h1>
        <OrderList />
      </div>
    </div>
  );
};

export default Orders; 