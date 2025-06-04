package com.Ecommerce.entity;

import com.Ecommerce.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@EqualsAndHashCode(callSuper = true)
public class Order extends BaseEntity {

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "subtotal", precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "shipping_fee", precision = 12, scale = 2)
    private BigDecimal shippingFee;

    @Column(name = "tax_amount", precision = 12, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 12, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 12, scale = 2)
    private BigDecimal totalAmount;

    // Shipping Address (denormalized for order history)
    @Column(name = "shipping_name")
    private String shippingName;

    @Column(name = "shipping_phone")
    private String shippingPhone;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "estimated_delivery")
    private LocalDateTime estimatedDelivery;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;



    public Order(){}

    public Order(String orderNumber, User user, OrderStatus status, BigDecimal subtotal, BigDecimal shippingFee, BigDecimal taxAmount, BigDecimal discountAmount, BigDecimal totalAmount, String paymentMethod,  String shippingName, String shippingPhone, String shippingAddress, LocalDateTime estimatedDelivery, LocalDateTime deliveredAt, List<OrderItem> orderItems) {
        this.orderNumber = orderNumber;
        this.user = user;
        this.status = status;
        this.subtotal = subtotal;
        this.shippingFee = shippingFee;
        this.taxAmount = taxAmount;
        this.discountAmount = discountAmount;
        this.totalAmount = totalAmount;
        this.shippingName = shippingName;
        this.shippingPhone = shippingPhone;
        this.shippingAddress = shippingAddress;
        this.estimatedDelivery = estimatedDelivery;
        this.deliveredAt = deliveredAt;
        this.orderItems = orderItems;
    }

    public Order(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive, String orderNumber, User user, OrderStatus status, BigDecimal subtotal, BigDecimal shippingFee, BigDecimal taxAmount, BigDecimal discountAmount, BigDecimal totalAmount, String paymentMethod, String shippingName, String shippingPhone, String shippingAddress, LocalDateTime estimatedDelivery, LocalDateTime deliveredAt, List<OrderItem> orderItems) {
        super(id, createdAt, updatedAt, isActive);
        this.orderNumber = orderNumber;
        this.user = user;
        this.status = status;
        this.subtotal = subtotal;
        this.shippingFee = shippingFee;
        this.taxAmount = taxAmount;
        this.discountAmount = discountAmount;
        this.totalAmount = totalAmount;
        this.shippingName = shippingName;
        this.shippingPhone = shippingPhone;
        this.shippingAddress = shippingAddress;
        this.estimatedDelivery = estimatedDelivery;
        this.deliveredAt = deliveredAt;
        this.orderItems = orderItems;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getShippingName() {
        return shippingName;
    }

    public void setShippingName(String shippingName) {
        this.shippingName = shippingName;
    }

    public String getShippingPhone() {
        return shippingPhone;
    }

    public void setShippingPhone(String shippingPhone) {
        this.shippingPhone = shippingPhone;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public LocalDateTime getEstimatedDelivery() {
        return estimatedDelivery;
    }

    public void setEstimatedDelivery(LocalDateTime estimatedDelivery) {
        this.estimatedDelivery = estimatedDelivery;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public List<Payment> getPayments() {
        return payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }
}