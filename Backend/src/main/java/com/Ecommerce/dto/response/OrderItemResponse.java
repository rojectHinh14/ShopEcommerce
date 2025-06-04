package com.Ecommerce.dto.response;

import java.math.BigDecimal;

public class OrderItemResponse {
    private Long id;
    private String productName;
    private String productImage;
    private String variantInfo;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;

    public OrderItemResponse(Long id, Long aLong, String productName, String productImage, String variantInfo, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice) {
        this.id = id;
        this.productName = productName;
        this.productImage = productImage;
        this.variantInfo = variantInfo;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;

    }

    public OrderItemResponse(Long id, String productName, String productImage, String variantInfo, Integer quantity, BigDecimal unitPrice, BigDecimal totalPrice) {
        this.id = id;
        this.productName = productName;
        this.productImage = productImage;
        this.variantInfo = variantInfo;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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