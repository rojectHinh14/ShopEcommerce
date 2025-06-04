package com.Ecommerce.dto.request.Shop;

import com.Ecommerce.enums.ShopStatus;

public class ShopCreateRequest {
    private Long sellerId;
    private String name;
    private String description;
    private ShopStatus status;

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
