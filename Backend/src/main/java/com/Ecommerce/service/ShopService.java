package com.Ecommerce.service;

import com.Ecommerce.dto.request.Shop.ShopCreateRequest;
import com.Ecommerce.dto.request.Shop.ShopUpdateRequest;
import com.Ecommerce.dto.response.Shop.ShopResponse;
import com.Ecommerce.enums.ShopStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ShopService {
    ShopResponse createShop(ShopCreateRequest request);
    ShopResponse updateShop(Long id, ShopUpdateRequest request);
    ShopResponse getShopById(Long id);
    Page<ShopResponse> getAllShops(Pageable pageable);
    Page<ShopResponse> getShopsByStatus(ShopStatus status, Pageable pageable);
    void deleteShop(Long id);
}
