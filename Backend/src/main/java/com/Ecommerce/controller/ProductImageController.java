package com.Ecommerce.controller;

import com.Ecommerce.dto.ApiResponse;
import com.Ecommerce.dto.request.ProductImage.ProductImageRequest;
import com.Ecommerce.dto.response.ProductImage.ProductImageResponse;
import com.Ecommerce.service.ProductImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-images")
public class ProductImageController {

    private final ProductImageService productImageService;

    public ProductImageController(ProductImageService productImageService) {
        this.productImageService = productImageService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductImageResponse>> createProductImage(@RequestBody ProductImageRequest request) {
        ProductImageResponse response = productImageService.createProductImage(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Product image created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductImageResponse>> updateProductImage(
            @PathVariable Long id,
            @RequestBody ProductImageRequest request) {
        ProductImageResponse response = productImageService.updateProductImage(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Product image updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProductImage(@PathVariable Long id) {
        productImageService.deleteProductImage(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product image deleted successfully"));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ProductImageResponse>>> getImagesByProduct(@PathVariable Long productId) {
        List<ProductImageResponse> images = productImageService.getImagesByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success(images));
    }

}
