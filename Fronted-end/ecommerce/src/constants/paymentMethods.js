// Định nghĩa các phương thức thanh toán
export const PAYMENT_METHODS = {
  COD: 'CASH',           // Thanh toán khi nhận hàng
  VNPAY: 'CARD',         // Thanh toán qua VNPay
  MOMO: 'MOMO'          // Thanh toán qua MoMo
};

// Labels hiển thị cho người dùng
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.COD]: 'Thanh toán khi nhận hàng (COD)',
  [PAYMENT_METHODS.VNPAY]: 'Thanh toán qua VNPay',
  [PAYMENT_METHODS.MOMO]: 'Thanh toán qua MoMo'
};

// Mô tả chi tiết cho từng phương thức thanh toán
export const PAYMENT_METHOD_DESCRIPTIONS = {
  [PAYMENT_METHODS.COD]: 'Thanh toán khi nhận hàng',
  [PAYMENT_METHODS.VNPAY]: 'Thanh toán qua thẻ ATM, Visa, Mastercard',
  [PAYMENT_METHODS.MOMO]: 'Thanh toán qua ví MoMo'
};

// Icons cho từng phương thức thanh toán
export const PAYMENT_METHOD_ICONS = {
  [PAYMENT_METHODS.COD]: 'Truck',
  [PAYMENT_METHODS.VNPAY]: 'CreditCard',
  [PAYMENT_METHODS.MOMO]: 'Wallet'
}; 