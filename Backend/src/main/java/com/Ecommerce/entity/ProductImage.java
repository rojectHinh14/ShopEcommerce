package com.Ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_images")

@EqualsAndHashCode(callSuper = true)
public class ProductImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "alt_text")
    private String altText;

    @Column(name = "is_primary")
    private Boolean isPrimary = false;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    public ProductImage() {

    }

    public ProductImage(Product product, String imageUrl, String altText, Boolean isPrimary, Integer sortOrder) {
        this.product = product;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.isPrimary = isPrimary;
        this.sortOrder = sortOrder;
    }

    public ProductImage(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive, Product product, String imageUrl, String altText, Boolean isPrimary, Integer sortOrder) {
        super(id, createdAt, updatedAt, isActive);
        this.product = product;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.isPrimary = isPrimary;
        this.sortOrder = sortOrder;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAltText() {
        return altText;
    }

    public void setAltText(String altText) {
        this.altText = altText;
    }

    public Boolean getPrimary() {
        return isPrimary;
    }

    public void setPrimary(Boolean primary) {
        isPrimary = primary;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}