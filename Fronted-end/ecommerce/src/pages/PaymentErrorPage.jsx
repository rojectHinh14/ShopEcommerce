import { useLocation, Link, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Home, Headphones } from 'lucide-react';
import { Button, Card, CardContent } from '@mui/material';

export default function PaymentErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const error = location.state?.error || 'Thanh toán không thành công';
  const code = location.state?.code || 'Unknown';

  const handleRetry = () => {
    // Quay lại trang thanh toán
    navigate(-2);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardContent className="text-center py-12">
            {/* Error Icon */}
            <div className="mb-6">
              <XCircle className="h-20 w-20 text-red-500 mx-auto" />
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            {code !== 'Unknown' && (
              <p className="text-sm text-gray-500 mb-8">Mã lỗi: {code}</p>
            )}

            {/* Possible Reasons */}
            <div className="bg-red-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-red-800 mb-3">Có thể do một trong các nguyên nhân sau:</h3>
              <ul className="list-disc list-inside space-y-2 text-red-700">
                <li>Thông tin thẻ không chính xác</li>
                <li>Số dư tài khoản không đủ</li>
                <li>Giao dịch bị từ chối bởi ngân hàng</li>
                <li>Phiên giao dịch đã hết hạn</li>
                <li>Lỗi kết nối mạng</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                variant="contained"
                color="primary"
                className="w-full"
                startIcon={<RefreshCw />}
              >
                Thử lại thanh toán
              </Button>
              <Button
                component={Link}
                to="/"
                variant="outlined"
                className="w-full"
                startIcon={<Home />}
              >
                Về trang chủ
              </Button>
            </div>

            {/* Contact Support */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center justify-center space-x-2 text-primary mb-4">
                <Headphones className="h-5 w-5" />
                <h3 className="font-semibold">Cần hỗ trợ?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Nếu bạn gặp vấn đề với thanh toán, vui lòng liên hệ với chúng tôi để được hỗ trợ
              </p>
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

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Thời gian hỗ trợ: Thứ 2 - Thứ 7 (8:00 - 20:00)</p>
          <p className="mt-1">Email phản hồi trong vòng 24 giờ</p>
        </div>
      </div>
    </div>
  );
} 