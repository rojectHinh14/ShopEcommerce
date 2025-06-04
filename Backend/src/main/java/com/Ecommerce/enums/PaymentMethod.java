package com.Ecommerce.enums;

public enum PaymentMethod {
    CASH("Thanh toán khi nhận hàng"),
    CARD("Thanh toán qua VNPay"),
    MOMO("Thanh toán qua MoMo");

    private final String description;

    PaymentMethod(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
} 