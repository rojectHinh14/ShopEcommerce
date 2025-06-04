package com.Ecommerce.mapper;

import com.Ecommerce.dto.response.Seller.SellerResponse;
import com.Ecommerce.entity.Seller;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

@Component
public class SellerMapper {

    public SellerResponse toResponse(Seller seller) {
        if (seller == null) {
            return null;
        }
        SellerResponse response = new SellerResponse();
        response.setId(seller.getId());
        response.setUserId(seller.getUser() != null ? seller.getUser().getId() : null);
        response.setBusinessName(seller.getBusinessName());
        response.setBusinessLicense(seller.getBusinessLicense());
        response.setStatus(seller.getStatus());

        // Thêm các trường khác nếu có trong DTO
        return response;
    }
}
