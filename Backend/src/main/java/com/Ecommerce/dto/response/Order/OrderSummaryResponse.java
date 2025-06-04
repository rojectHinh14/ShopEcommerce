package com.Ecommerce.dto.response.Order;

import java.math.BigDecimal;

public class OrderSummaryResponse {
    private Long id;
    private String orderNumber;
    private String status;
    private BigDecimal totalAmount;
    private Integer totalItems;
    private String createdAt;

    public OrderSummaryResponse() {}

    public OrderSummaryResponse(Long id, String orderNumber, String status, BigDecimal totalAmount, Integer totalItems, String createdAt) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.status = status;
        this.totalAmount = totalAmount;
        this.totalItems = totalItems;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
