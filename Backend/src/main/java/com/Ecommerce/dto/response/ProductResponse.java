package com.Ecommerce.dto.response;

import com.Ecommerce.dto.response.ProductVariant.ProductVariantResponse;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String shortDescription;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stockQuantity;
    private Integer soldCount;
    private Integer viewCount;
    private Integer likeCount;
    private Double rating;
    private Integer ratingCount;
    private String skuCode;
    private Double weight;
    private String status;
    private String shopName;
    private String categoryName;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
    private List<ProductVariantResponse> variants;
    private String primaryImageUrl;  // Ảnh chính đại diện

    public String getPrimaryImageUrl() {
        return primaryImageUrl;
    }

    public void setPrimaryImageUrl(String primaryImageUrl) {
        this.primaryImageUrl = primaryImageUrl;
    }

    public List<ProductVariantResponse> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariantResponse> variants) {
        this.variants = variants;
    }

    public ProductResponse() {}

    public ProductResponse(Long id, String name, String description, String shortDescription, BigDecimal price, BigDecimal originalPrice, Integer stockQuantity, Integer soldCount, Integer viewCount, Integer likeCount, Double rating, Integer ratingCount, String skuCode, Double weight, String status, String shopName, String categoryName, List<String> imageUrls, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.shortDescription = shortDescription;
        this.price = price;
        this.originalPrice = originalPrice;
        this.stockQuantity = stockQuantity;
        this.soldCount = soldCount;
        this.viewCount = viewCount;
        this.likeCount = likeCount;
        this.rating = rating;
        this.ratingCount = ratingCount;
        this.skuCode = skuCode;
        this.weight = weight;
        this.status = status;
        this.shopName = shopName;
        this.categoryName = categoryName;
        this.imageUrls = imageUrls;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getSoldCount() {
        return soldCount;
    }

    public void setSoldCount(Integer soldCount) {
        this.soldCount = soldCount;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Integer getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Integer likeCount) {
        this.likeCount = likeCount;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
