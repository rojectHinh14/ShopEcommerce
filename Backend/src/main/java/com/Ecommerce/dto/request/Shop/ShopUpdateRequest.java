package com.Ecommerce.dto.request.Shop;

import com.Ecommerce.enums.ShopStatus;

public class ShopUpdateRequest {
    private String name;
    private String description;
    private ShopStatus status;

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
