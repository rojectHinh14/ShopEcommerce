package com.Ecommerce.controller;

import com.Ecommerce.dto.ApiResponse;
import com.Ecommerce.dto.request.ProductVariant.ProductVariantCreateRequest;
import com.Ecommerce.dto.request.ProductVariant.ProductVariantUpdateRequest;
import com.Ecommerce.dto.response.ProductVariant.ProductVariantResponse;
import com.Ecommerce.service.ProductVariantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/product-variants")
public class ProductVariantController {
    private final ProductVariantService variantService;

    public ProductVariantController(ProductVariantService variantService) {
        this.variantService = variantService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductVariantResponse>> createVariant(@RequestBody ProductVariantCreateRequest request) {
        ProductVariantResponse response = variantService.createVariant(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Product variant created"));
    }


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductVariantResponse>> updateVariant(
            @PathVariable Long id,
            @RequestBody ProductVariantUpdateRequest request) {
        ProductVariantResponse response = variantService.updateVariant(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Product variant updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVariant(@PathVariable Long id) {
        variantService.deleteVariant(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product variant deleted"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductVariantResponse>> getVariantById(@PathVariable Long id) {
        ProductVariantResponse response = variantService.getVariantById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Product variant retrieved"));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ProductVariantResponse>>> getVariantsByProductId(@PathVariable Long productId) {
        List<ProductVariantResponse> responses = variantService.getVariantsByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success(responses, "Product variants list retrieved"));
    }

}
