package com.Ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_items")
@EqualsAndHashCode(callSuper = true)
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "product_name")
    private String productName; // Snapshot for order history

    @Column(name = "product_image")
    private String productImage;

    @Column(name = "variant_info")
    private String variantInfo; // Size, Color info

    private Integer quantity;

    @Column(name = "unit_price", precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_price", precision = 12, scale = 2)
    private BigDecimal totalPrice;

    public OrderItem(){}

    public OrderItem(Order order, Product product, String productName, String productImage, String variantInfo, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice) {
        this.order = order;
        this.product = product;
        this.productName = productName;
        this.productImage = productImage;
        this.variantInfo = variantInfo;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }

    public OrderItem(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive, Order order, Product product, String productName, String productImage, String variantInfo, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice) {
        super(id, createdAt, updatedAt, isActive);
        this.order = order;
        this.product = product;
        this.productName = productName;
        this.productImage = productImage;
        this.variantInfo = variantInfo;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductImage() {
        return productImage;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public String getVariantInfo() {
        return variantInfo;
    }

    public void setVariantInfo(String variantInfo) {
        this.variantInfo = variantInfo;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}