package com.Ecommerce.service;

import com.Ecommerce.dto.request.Seller.SellerCreateRequest;
import com.Ecommerce.dto.request.Seller.SellerUpdateRequest;
import com.Ecommerce.dto.response.Seller.SellerResponse;
import com.Ecommerce.enums.SellerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SellerService {
    SellerResponse createSeller(SellerCreateRequest request);
    SellerResponse updateSeller(Long id, SellerUpdateRequest request);
    SellerResponse getSellerById(Long id);
    Page<SellerResponse> getAllSellers(Pageable pageable);
    Page<SellerResponse> getSellersByStatus(SellerStatus status, Pageable pageable);
    void deleteSeller(Long id);
}
