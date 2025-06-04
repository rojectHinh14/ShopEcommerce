package com.Ecommerce.dto.request;

import com.Ecommerce.dto.request.ProductImage.ProductImageRequest;
import com.Ecommerce.dto.request.ProductVariant.ProductVariantCreateRequest;
import com.Ecommerce.enums.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

public class ProductCreateRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String description;
    private String shortDescription;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    private BigDecimal originalPrice;

    @NotNull(message = "Stock quantity is required")
    private Integer stockQuantity;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
    private List<ProductVariantCreateRequest> variants;

    private List<String> imageBase64s;



    private String skuCode;
    private Double weight;
    private ProductStatus status;


    public List<String> getImageBase64s() {
        return imageBase64s;
    }

    public void setImageBase64s(List<String> imageBase64s) {
        this.imageBase64s = imageBase64s;
    }

    public ProductCreateRequest() {}

    public ProductCreateRequest(String name, String description, String shortDescription, BigDecimal price, BigDecimal originalPrice, Integer stockQuantity, Long categoryId, String skuCode, Double weight, ProductStatus status) {
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

    public List<ProductVariantCreateRequest> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariantCreateRequest> variants) {
        this.variants = variants;
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
