package com.Ecommerce.controller;

import com.Ecommerce.dto.ApiResponse;
import com.Ecommerce.dto.request.Seller.SellerCreateRequest;
import com.Ecommerce.dto.request.Seller.SellerUpdateRequest;
import com.Ecommerce.dto.response.Seller.SellerResponse;
import com.Ecommerce.enums.SellerStatus;
import com.Ecommerce.service.SellerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sellers")
public class SellerController {
    private final SellerService sellerService;

    public SellerController(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SellerResponse>> createSeller(@RequestBody SellerCreateRequest request) {
        SellerResponse response = sellerService.createSeller(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Seller created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SellerResponse>> updateSeller(@PathVariable Long id, @RequestBody SellerUpdateRequest request) {
        SellerResponse response = sellerService.updateSeller(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Seller updated successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SellerResponse>> getSellerById(@PathVariable Long id) {
        SellerResponse response = sellerService.getSellerById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SellerResponse>>> getAllSellers(Pageable pageable) {
        Page<SellerResponse> page = sellerService.getAllSellers(pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<Page<SellerResponse>>> getSellersByStatus(@PathVariable SellerStatus status, Pageable pageable) {
        Page<SellerResponse> page = sellerService.getSellersByStatus(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(page));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSeller(@PathVariable Long id) {
        sellerService.deleteSeller(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Seller deleted successfully"));
    }
}
