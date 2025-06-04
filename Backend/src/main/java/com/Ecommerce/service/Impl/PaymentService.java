package com.Ecommerce.service.Impl;

import com.Ecommerce.config.VnPayConfig;
import com.Ecommerce.entity.Payment;
import com.Ecommerce.entity.Transaction;
import com.Ecommerce.repository.TransactionRepository;
import com.Ecommerce.repository.UserRepository;
import com.Ecommerce.repository.PaymentRepository;
import com.Ecommerce.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class PaymentService {

    private final VnPayConfig  vnPayConfig;
    private final UserServiceImpl userServiceImpl;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final PaymentRepository paymentRepository;

    public PaymentService(VnPayConfig vnPayConfig, UserServiceImpl userServiceImpl, UserRepository userRepository, TransactionRepository transactionRepository, PaymentRepository paymentRepository) {
        this.vnPayConfig = vnPayConfig;
        this.userServiceImpl = userServiceImpl;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.paymentRepository = paymentRepository;
    }

    public ResponseEntity<String> handlePaymentReturn(HttpServletRequest request) {
        try {
            Map<String, String> params = new HashMap<>();
            for (Enumeration<String> e = request.getParameterNames(); e.hasMoreElements(); ) {
                String paramName = e.nextElement();
                params.put(paramName, request.getParameter(paramName));
            }

            String vnp_SecureHash = params.remove("vnp_SecureHash");
            String signData = VNPayUtil.hashAllFields(params);
            String computedHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), signData);

            if (computedHash.equalsIgnoreCase(vnp_SecureHash)) {
                String responseCode = params.get("vnp_ResponseCode");
                if ("00".equals(responseCode)) {
                    String orderInfo = params.get("vnp_OrderInfo");
                    Long userId = Long.parseLong(orderInfo.replace("UpgradePremiumUser", ""));
                    return ResponseEntity.ok("Payment successful. Account upgraded to premium!");
                } else if ("24".equals(responseCode)) {
                    return ResponseEntity.badRequest().body("Payment cancelled by user");
                } else {
                    return ResponseEntity.badRequest().body("Payment failed: " + responseCode);
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid signature");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing payment return: " + e.getMessage());
        }
    }
    // Hàm tạo checksum HMAC-SHA512
    public String hmacSHA512(String key, String data) throws Exception {
        Mac sha512_HMAC = Mac.getInstance("HmacSHA512");
        SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        sha512_HMAC.init(secret_key);
        byte[] result = sha512_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hash = new StringBuilder();
        for (byte b : result) {
            hash.append(String.format("%02x", b));
        }
        return hash.toString();
    }
    // Hàm sắp xếp và tạo chuỗi hash từ Map
    public String hashAllFields(Map<String, String> fields) throws Exception {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = fields.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (fieldNames.indexOf(fieldName) < fieldNames.size() - 1) {
                    hashData.append('&');
                }
            }
        }
        return hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
    }
    // Hàm tạo mã đơn hàng ngẫu nhiên
    public String getRandomTxnRef() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    // Tạo URL thanh toán
    public Map<String, String> createPaymentUrl(String amount, String userId, String orderNumber) throws Exception {
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_OrderType", "other");
        
        // Sử dụng URL backend cho return URL - phải là endpoint backend để xử lý callback
        String backendReturnUrl = "http://localhost:8080/api/v1/payment/vnpay/return";
        System.out.println("🔍 Using backend return URL: " + backendReturnUrl);
        vnpParams.put("vnp_ReturnUrl", backendReturnUrl);
        
        // Sử dụng IP thực tế hoặc localhost
        String ipAddr = "127.0.0.1";
        vnpParams.put("vnp_IpAddr", ipAddr);
        
        // Tạo transaction ID và lưu vào payment
        String txnRef = getRandomTxnRef();
        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_Amount", amount);
        
        // Sử dụng orderNumber trong OrderInfo
        String orderInfo = "Thanh toan don hang " + orderNumber;
        vnpParams.put("vnp_OrderInfo", orderInfo);

        // Thêm thời gian tạo và hết hạn
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        vnpParams.put("vnp_CreateDate", formatter.format(cld.getTime()));
        cld.add(Calendar.MINUTE, 15);
        vnpParams.put("vnp_ExpireDate", formatter.format(cld.getTime()));

        // Tạo chuỗi query và secure hash
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()))
                        .append('&');
            }
        }
        String vnpSecureHash = hashAllFields(vnpParams);
        query.append("vnp_SecureHash=").append(vnpSecureHash);
        String paymentUrl = vnPayConfig.getPayUrl() + "?" + query;

        System.out.println("🔍 Created payment URL with params:");
        System.out.println("- Order Number: " + orderNumber);
        System.out.println("- Transaction Ref: " + txnRef);
        System.out.println("- Amount: " + amount);
        System.out.println("- Return URL: " + backendReturnUrl);
        System.out.println("- Secure Hash: " + vnpSecureHash);

        Map<String, String> response = new HashMap<>();
        response.put("code", "00");
        response.put("message", "success");
        response.put("data", paymentUrl);
        response.put("transactionId", txnRef);
        return response;
    }


    // Xử lý Return URL và cập nhật isPinned
    public String handleReturnUrl(Map<String, String> params) throws Exception {
        System.out.println("🔍 VNPay Return URL params: " + params);
        
        String vnpSecureHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");
        String signValue = hashAllFields(params);

        if (!signValue.equals(vnpSecureHash)) {
            System.out.println("❌ Invalid signature");
            return "Chữ ký không hợp lệ";
        }

        String vnpResponseCode = params.get("vnp_ResponseCode");
        String vnpOrderInfo = params.get("vnp_OrderInfo");
        String vnpTxnRef = params.get("vnp_TxnRef");
        
        System.out.println("🔍 Processing payment return:");
        System.out.println("- Response Code: " + vnpResponseCode);
        System.out.println("- Order Info: " + vnpOrderInfo);
        System.out.println("- Transaction Ref: " + vnpTxnRef);

        // Tìm payment theo transactionId
        Optional<Payment> paymentOpt = paymentRepository.findByTransactionId(vnpTxnRef);
        if (paymentOpt.isEmpty()) {
            System.out.println("❌ Payment not found for transaction: " + vnpTxnRef);
            return "Không tìm thấy thông tin thanh toán";
        }

        Payment payment = paymentOpt.get();
        System.out.println("✅ Found payment: " + payment.getId() + " with status: " + payment.getPaymentStatus());

        // Cập nhật trạng thái thanh toán nếu giao dịch thành công
        if ("00".equals(vnpResponseCode)) {
            payment.setPaymentStatus("SUCCESS");
            payment.setPaymentDate(LocalDateTime.now());
            paymentRepository.save(payment);
            System.out.println("✅ Updated payment status to SUCCESS");
        } else {
            payment.setPaymentStatus("FAILED");
            paymentRepository.save(payment);
            System.out.println("❌ Updated payment status to FAILED");
        }

        return "00".equals(vnpResponseCode) ? "Giao dịch thành công" : "Giao dịch không thành công";
    }

    // Xử lý IPN URL (không cập nhật isPinned nữa)
    public Map<String, String> handleIpnUrl(Map<String, String> params) throws Exception {
        Map<String, String> response = new HashMap<>();
        String vnpSecureHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");
        String signValue = hashAllFields(params);

        if (!signValue.equals(vnpSecureHash)) {
            response.put("RspCode", "97");
            response.put("Message", "Invalid Checksum");
            return response;
        }

        String vnpTxnRef = params.get("vnp_TxnRef");
        String vnpAmount = params.get("vnp_Amount");
        String vnpResponseCode = params.get("vnp_ResponseCode");
        String vnpTransactionNo = params.get("vnp_TransactionNo");
        String vnpBankCode = params.get("vnp_BankCode");
        String vnpPayDate = params.get("vnp_PayDate");

        // Tìm payment theo transactionId
        Payment payment = paymentRepository.findByTransactionId(vnpTxnRef)
                .orElseThrow(() -> {
                    response.put("RspCode", "01");
                    response.put("Message", "Payment not found");
                    return new RuntimeException("Payment not found for transaction: " + vnpTxnRef);
                });

        // Kiểm tra số tiền
        if (!payment.getVnpayAmount().toString().equals(vnpAmount)) {
            response.put("RspCode", "04");
            response.put("Message", "Invalid Amount");
            return response;
        }

        // Kiểm tra trạng thái thanh toán
        if (!payment.getPaymentStatus().equals("PENDING")) {
            response.put("RspCode", "02");
            response.put("Message", "Payment already processed");
            return response;
        }

        // Cập nhật thông tin thanh toán
        payment.setPaymentStatus(vnpResponseCode.equals("00") ? "SUCCESS" : "FAILED");
        if (vnpPayDate != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            payment.setPaymentDate(LocalDateTime.parse(vnpPayDate, formatter));
        }
        paymentRepository.save(payment);

        // Cập nhật transaction
        Transaction transaction = transactionRepository.findByTxnRef(vnpTxnRef)
                .orElseGet(() -> {
                    Transaction newTransaction = new Transaction();
                    newTransaction.setTxnRef(vnpTxnRef);
                    newTransaction.setUserId(payment.getOrder().getUser().getId());
                    newTransaction.setAmount(vnpAmount);
                    return newTransaction;
                });

        transaction.setResponseCode(vnpResponseCode);
        transaction.setTransactionNo(vnpTransactionNo);
        transaction.setBankCode(vnpBankCode);
        if (vnpPayDate != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            transaction.setPayDate(LocalDateTime.parse(vnpPayDate, formatter));
        }
        transaction.setStatus(vnpResponseCode.equals("00") ? "SUCCESS" : "FAILED");
        transactionRepository.save(transaction);

        response.put("RspCode", "00");
        response.put("Message", "Confirm Success");
        return response;
    }
}

