package com.Ecommerce.dto.response.Shop;

import com.Ecommerce.enums.ShopStatus;

import java.time.LocalDateTime;

public class ShopResponse {
    private Long id;
    private Long sellerId;
    private String name;
    private String description;
    private ShopStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
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

    public ShopStatus getStatus() {
        return status;
    }

    public void setStatus(ShopStatus status) {
        this.status = status;
    }
}
