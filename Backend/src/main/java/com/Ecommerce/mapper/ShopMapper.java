package com.Ecommerce.mapper;

import com.Ecommerce.dto.response.Shop.ShopResponse;
import com.Ecommerce.entity.Shop;
import org.springframework.stereotype.Component;

@Component
public class ShopMapper {

    public ShopResponse toResponse(Shop shop) {
        if (shop == null) {
            return null;
        }
        ShopResponse response = new ShopResponse();
        response.setId(shop.getId());
        response.setSellerId(shop.getSeller() != null ? shop.getSeller().getId() : null);
        response.setName(shop.getName());
        response.setDescription(shop.getDescription());
        response.setStatus(shop.getStatus());
        response.setCreatedAt(shop.getCreatedAt());
        response.setUpdatedAt(shop.getUpdatedAt());
        // Nếu ShopResponse có thêm các trường khác thì map thêm ở đây

        return response;
    }

    // Nếu muốn, có thể viết thêm method map ngược lại hoặc cập nhật entity từ DTO
}
