import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        // Lấy các tham số từ URL callback
        const vnpResponseCode = searchParams.get('vnp_ResponseCode');
        // Các tham số khác có thể được sử dụng trong tương lai
        const _VNP_TRANSACTION_NO = searchParams.get('vnp_TransactionNo');
        const _VNP_ORDER_INFO = searchParams.get('vnp_OrderInfo');
        const _VNP_AMOUNT = searchParams.get('vnp_Amount');
        const _VNP_BANK_CODE = searchParams.get('vnp_BankCode');
        const _VNP_PAY_DATE = searchParams.get('vnp_PayDate');

        // Kiểm tra kết quả thanh toán
        if (vnpResponseCode === '00') {
          toast.success('Thanh toán thành công!');
          // Chuyển hướng đến trang đơn hàng
          navigate('/orders');
        } else {
          toast.error('Thanh toán thất bại!');
          // Chuyển hướng đến trang lỗi hoặc trang đơn hàng
          navigate('/orders');
        }
      } catch (error) {
        console.error('Error processing payment callback:', error);
        toast.error('Có lỗi xảy ra khi xử lý kết quả thanh toán');
        navigate('/orders');
      }
    };

    processPaymentCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Đang xử lý kết quả thanh toán...
          </h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Vui lòng đợi trong giây lát...
          </p>
        </div>
      </div>
    </div>
  );
} 