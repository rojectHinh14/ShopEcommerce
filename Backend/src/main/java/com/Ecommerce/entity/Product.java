package com.Ecommerce.entity;

import com.Ecommerce.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "products")
@EqualsAndHashCode(callSuper = true)
public class Product extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 12, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @Column(name = "sold_count")
    private Integer soldCount = 0;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "like_count")
    private Integer likeCount = 0;

    private Double rating = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(name = "sku_code")
    private String skuCode;

    private Double weight;

    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    private Shop shop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProductImage> images;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductReview> reviews;
    public Product() {}

    public Product(String name, String description, String shortDescription, BigDecimal price, BigDecimal originalPrice, Integer stockQuantity, Integer soldCount, Integer viewCount, Integer likeCount, Double rating, Integer ratingCount, String skuCode, Double weight, ProductStatus status, Shop shop, Category category, Set<ProductImage> images, List<ProductVariant> variants, List<ProductReview> reviews) {
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
        this.shop = shop;
        this.category = category;
        this.images = images;
        this.variants = variants;
        this.reviews = reviews;
    }

    public Product(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive, String name, String description, String shortDescription, BigDecimal price, BigDecimal originalPrice, Integer stockQuantity, Integer soldCount, Integer viewCount, Integer likeCount, Double rating, Integer ratingCount, String skuCode, Double weight, ProductStatus status, Shop shop, Category category, Set<ProductImage> images, List<ProductVariant> variants, List<ProductReview> reviews) {
        super(id, createdAt, updatedAt, isActive);
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
        this.shop = shop;
        this.category = category;
        this.images = images;
        this.variants = variants;
        this.reviews = reviews;
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

    public ProductStatus getStatus() {
        return status;
    }

    public void setStatus(ProductStatus status) {
        this.status = status;
    }

    public Shop getShop() {
        return shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Set<ProductImage> getImages() {
        return images;
    }

    public void setImages(Set<ProductImage> images) {
        this.images = images;
    }

    public List<ProductVariant> getVariants() {
        return variants;
    }

    public void setVariants(List<ProductVariant> variants) {
        this.variants = variants;
    }

    public List<ProductReview> getReviews() {
        return reviews;
    }

    public void setReviews(List<ProductReview> reviews) {
        this.reviews = reviews;
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            super.hashCode(),
            name,
            description,
            shortDescription,
            price,
            originalPrice,
            stockQuantity,
            soldCount,
            viewCount,
            likeCount,
            rating,
            ratingCount,
            skuCode,
            weight,
            status,
            category != null ? category.getId() : null,
            shop != null ? shop.getId() : null
        );
    }
}