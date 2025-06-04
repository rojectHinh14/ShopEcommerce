package com.Ecommerce.service;

import com.Ecommerce.dto.request.ProductImage.ProductImageRequest;
import com.Ecommerce.dto.response.ProductImage.ProductImageResponse;

import java.util.List;

public interface ProductImageService {
    ProductImageResponse createProductImage(ProductImageRequest request);
    ProductImageResponse updateProductImage(Long id, ProductImageRequest request);
    void deleteProductImage(Long id);
    List<ProductImageResponse> getImagesByProductId(Long productId);
}
