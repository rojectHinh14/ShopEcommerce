package com.Ecommerce.service;

import com.Ecommerce.dto.request.ProductVariant.ProductVariantCreateRequest;
import com.Ecommerce.dto.request.ProductVariant.ProductVariantUpdateRequest;
import com.Ecommerce.dto.response.ProductVariant.ProductVariantResponse;

import java.util.List;

public interface ProductVariantService {
    ProductVariantResponse createVariant(ProductVariantCreateRequest request);
    ProductVariantResponse updateVariant(Long id, ProductVariantUpdateRequest request);
    void deleteVariant(Long id);
    ProductVariantResponse getVariantById(Long id);
    List<ProductVariantResponse> getVariantsByProductId(Long productId);
}
