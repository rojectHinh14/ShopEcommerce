package com.Ecommerce.controller;

import com.Ecommerce.service.Impl.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/create-payment")
    public ResponseEntity<Map<String, String>> createPayment(
            @RequestParam("amount") String amount,
            @RequestParam("userId") String userId,
            @RequestHeader(value = "X-Forwarded-For", required = false) String ipAddr) {
        try {
            Map<String, String> response = paymentService.createPaymentUrl(amount, userId, ipAddr);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("code", "99");
            errorResponse.put("message", "Unknown error: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/vnpay/return")
    public RedirectView returnUrl(@RequestParam Map<String, String> params) {
        try {
            System.out.println("🔍 Received VNPay return callback with params: " + params);
            String result = paymentService.handleReturnUrl(params);
            System.out.println("🔍 Payment processing result: " + result);
            
            // Kiểm tra giao dịch thành công hay không
            if (result.equals("Giao dịch thành công")) {
                // Chuyển hướng đến trang thanh toán thành công trên frontend
                return new RedirectView("http://localhost:5173/payment/success?" + buildQueryString(params));
            } else {
                // Chuyển hướng đến trang lỗi
                return new RedirectView("http://localhost:5173/payment/error?" + buildQueryString(params));
            }
        } catch (Exception e) {
            System.out.println("❌ Error processing VNPay return: " + e.getMessage());
            e.printStackTrace();
            // Chuyển hướng đến trang lỗi nếu có lỗi xảy ra
            return new RedirectView("http://localhost:5173/payment/error?error=" + e.getMessage());
        }
    }

    @GetMapping("/vnpay/ipn")
    public ResponseEntity<Map<String, String>> ipnUrl(@RequestParam Map<String, String> params) {
        try {
            System.out.println("🔍 Received VNPay IPN callback with params: " + params);
            Map<String, String> response = paymentService.handleIpnUrl(params);
            System.out.println("🔍 IPN processing result: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("❌ Error processing VNPay IPN: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("RspCode", "99");
            errorResponse.put("Message", "Unknown error: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // Hàm xây dựng query string từ Map params
    private String buildQueryString(Map<String, String> params) {
        StringBuilder query = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (query.length() > 0) {
                query.append("&");
            }
            query.append(entry.getKey()).append("=").append(entry.getValue());
        }
        return query.toString();
    }
}