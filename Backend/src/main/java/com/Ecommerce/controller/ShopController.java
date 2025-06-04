package com.Ecommerce.controller;

import com.Ecommerce.dto.request.Shop.ShopCreateRequest;
import com.Ecommerce.dto.request.Shop.ShopUpdateRequest;
import com.Ecommerce.dto.response.Shop.ShopResponse;
import com.Ecommerce.enums.ShopStatus;
import com.Ecommerce.service.ShopService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/shops")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @PostMapping
    public ResponseEntity<ShopResponse> createShop(@RequestBody ShopCreateRequest request) {
        ShopResponse response = shopService.createShop(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShopResponse> updateShop(@PathVariable Long id, @RequestBody ShopUpdateRequest request) {
        ShopResponse response = shopService.updateShop(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShopResponse> getShopById(@PathVariable Long id) {
        ShopResponse response = shopService.getShopById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<ShopResponse>> getAllShops(Pageable pageable) {
        Page<ShopResponse> page = shopService.getAllShops(pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<ShopResponse>> getShopsByStatus(@PathVariable ShopStatus status, Pageable pageable) {
        Page<ShopResponse> page = shopService.getShopsByStatus(status, pageable);
        return ResponseEntity.ok(page);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShop(@PathVariable Long id) {
        shopService.deleteShop(id);
        return ResponseEntity.noContent().build();
    }
}

