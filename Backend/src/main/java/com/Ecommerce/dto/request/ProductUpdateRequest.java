package com.Ecommerce.dto.request;

import com.Ecommerce.enums.ProductStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

public class ProductUpdateRequest {
    @Size(min = 2, max = 255, message = "Product name must be between 2 and 255 characters")
    private String name;

    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;

    @Size(max = 500, message = "Short description cannot exceed 500 characters")
    private String shortDescription;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price format is invalid")
    private BigDecimal price;

    @DecimalMin(value = "0.0", inclusive = false, message = "Original price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Original price format is invalid")
    private BigDecimal originalPrice;

    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    private Long categoryId;

    @Size(min = 3, max = 50, message = "SKU code must be between 3 and 50 characters")
    private String skuCode;

    @DecimalMin(value = "0.0", message = "Weight cannot be negative")
    private Double weight;

    private ProductStatus status;

    public ProductUpdateRequest() {}

    public ProductUpdateRequest(String name, String description, String shortDescription, BigDecimal price, BigDecimal originalPrice, Integer stockQuantity, Long categoryId, String skuCode, Double weight, ProductStatus status) {
        this.name = name;
        this.description = description;
        this.shortDescription = shortDescription;
        this.price = price;
        this.originalPrice = originalPrice;
        this.stockQuantity = stockQuantity;
        this.categoryId = categoryId;
        this.skuCode = skuCode;
        this.weight = weight;
        this.status = status;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getSkuCode() {
        return skuCode;
    }

    public void setSkuCode(String skuCode) {
        this.skuCode = skuCode;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }
}
