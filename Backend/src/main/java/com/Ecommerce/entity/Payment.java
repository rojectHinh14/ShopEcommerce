package com.Ecommerce.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "payment_method")
    private String paymentMethod;  // 'CASH' or 'CARD'

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "amount", precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "vnpay_amount", precision = 12, scale = 0)
    private BigDecimal vnpayAmount;

    @Column(name = "payment_status")
    private String paymentStatus;  // 'SUCCESS', 'FAILED', 'PENDING'

    @Column(name = "transaction_id", length = 1000)
    private String transactionId;

    @Column(name = "payment_url", columnDefinition = "TEXT") // hoặc VARCHAR(1024)
    private String paymentUrl;

    public String getPaymentUrl() {
        return paymentUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public Payment() {}

    public Payment(Order order, String paymentMethod, LocalDateTime paymentDate, BigDecimal amount, String paymentStatus, String transactionId) {
        this.order = order;
        this.paymentMethod = paymentMethod;
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.transactionId = transactionId;
    }

    public Payment(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive, Order order, String paymentMethod, LocalDateTime paymentDate, BigDecimal amount, String paymentStatus, String transactionId) {
        super(id, createdAt, updatedAt, isActive);
        this.order = order;
        this.paymentMethod = paymentMethod;
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.paymentStatus = paymentStatus;
        this.transactionId = transactionId;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public BigDecimal getVnpayAmount() {
        return vnpayAmount;
    }

    public void setVnpayAmount(BigDecimal vnpayAmount) {
        this.vnpayAmount = vnpayAmount;
    }
}
