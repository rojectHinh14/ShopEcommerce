package com.Ecommerce.controller;

import com.Ecommerce.dto.ApiResponse;
import com.Ecommerce.dto.PageResponse;
import com.Ecommerce.dto.request.ProductCreateRequest;
import com.Ecommerce.dto.request.ProductSearchRequest;
import com.Ecommerce.dto.request.ProductUpdateRequest;
import com.Ecommerce.dto.response.ProductResponse;
import com.Ecommerce.enums.ProductStatus;
import com.Ecommerce.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Public endpoints - không cần authentication

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductResponse> products = productService.getAllProducts(pageable);
        PageResponse<ProductResponse> pageResponse = PageResponse.of(products);

        return ResponseEntity.ok(ApiResponse.success(pageResponse, "Products retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product, "Product retrieved successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        ProductSearchRequest request = new ProductSearchRequest();
        request.setKeyword(keyword);
        request.setCategoryId(categoryId);
        request.setMinPrice(minPrice);
        request.setMaxPrice(maxPrice);
        request.setPage(page);
        request.setSize(size);
        request.setSortBy(sortBy);
        request.setSortDir(sortDir);

        Page<ProductResponse> products = productService.searchProducts(request);
        PageResponse<ProductResponse> pageResponse = PageResponse.of(products);

        return ResponseEntity.ok(ApiResponse.success(pageResponse, "Search completed successfully"));
    }

    @GetMapping("/search/simple")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> simpleSearch(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductResponse> products = productService.searchProducts(keyword, pageable);
        PageResponse<ProductResponse> pageResponse = PageResponse.of(products);

        return ResponseEntity.ok(ApiResponse.success(pageResponse, "Search completed successfully"));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductResponse> products = productService.getProductsByCategory(categoryId, pageable);
        PageResponse<ProductResponse> pageResponse = PageResponse.of(products);

        return ResponseEntity.ok(ApiResponse.success(pageResponse, "Products retrieved successfully"));
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getProductsByShop(
            @PathVariable Long shopId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductResponse> products = productService.getProductsByShop(shopId, pageable);
        PageResponse<ProductResponse> pageResponse = PageResponse.of(products);

        return ResponseEntity.ok(ApiResponse.success(pageResponse, "Products retrieved successfully"));
    }

    @GetMapping("/price-range")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductResponse> products = productService.findByPriceRange(minPrice, maxPrice, pageable);
        PageResponse<ProductResponse> pageResponse = PageResponse.of(products);

        return ResponseEntity.ok(ApiResponse.success(pageResponse, "Products retrieved successfully"));
    }

    @GetMapping("/best-selling")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getBestSellingProducts(
            @RequestParam(defaultValue = "10") int limit) {

        List<ProductResponse> products = productService.getBestSellingProducts(limit);
        return ResponseEntity.ok(ApiResponse.success(products, "Best selling products retrieved successfully"));
    }

    @GetMapping("/most-viewed")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getMostViewedProducts(
            @RequestParam(defaultValue = "10") int limit) {

        List<ProductResponse> products = productService.getMostViewedProducts(limit);
        return ResponseEntity.ok(ApiResponse.success(products, "Most viewed products retrieved successfully"));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getTopRatedProducts(
            @RequestParam(defaultValue = "10") int limit) {

        List<ProductResponse> products = productService.getTopRatedProducts(limit);
        return ResponseEntity.ok(ApiResponse.success(products, "Top rated products retrieved successfully"));
    }

    // Admin/Shop owner endpoints - cần authentication và authorization

    @PostMapping("/create")
  //  @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP_OWNER')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
             @RequestBody ProductCreateRequest request) {

        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(product, "Product created successfully"));
    }

    @PutMapping("/{id}")
 //   @PreAuthorize("hasRole('ADMIN') or (hasRole('SHOP_OWNER') and @productService.isProductOwner(#id, authentication.name))")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductUpdateRequest request) {

        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success(product, "Product updated successfully"));
    }

    @DeleteMapping("/{id}")
   //  @PreAuthorize("hasRole('ADMIN') or (hasRole('SHOP_OWNER') and @productService.isProductOwner(#id, authentication.name))")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product deleted successfully"));
    }

    @PatchMapping("/{id}/status")
 //   @PreAuthorize("hasRole('ADMIN') or (hasRole('SHOP_OWNER') and @productService.isProductOwner(#id, authentication.name))")
    public ResponseEntity<ApiResponse<Void>> updateProductStatus(
            @PathVariable Long id,
            @RequestParam ProductStatus status) {

        productService.updateProductStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(null, "Product status updated successfully"));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('SHOP_OWNER') and @productService.isProductOwner(#id, authentication.name))")
    public ResponseEntity<ApiResponse<Void>> updateProductStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {

        productService.updateProductStock(id, quantity);
        return ResponseEntity.ok(ApiResponse.success(null, "Product stock updated successfully"));
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Void>> likeProduct(@PathVariable Long id) {
        productService.incrementProductLikes(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product liked successfully"));
    }

    @DeleteMapping("/{id}/like")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Void>> unlikeProduct(@PathVariable Long id) {
        productService.decrementProductLikes(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product unliked successfully"));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<ApiResponse<Void>> incrementProductViews(@PathVariable Long id) {
        productService.incrementProductViews(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product view count updated"));
    }

    // Admin only endpoints

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> getProductStats() {
        Object stats = productService.getProductStatistics();
        return ResponseEntity.ok(ApiResponse.success(stats, "Product statistics retrieved successfully"));
    }

    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getProductsByStatus(
            @PathVariable ProductStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = productService.getProductsByStatus(status, pageable);
        PageResponse<ProductResponse> pageResponse = PageResponse.of(products);

        return ResponseEntity.ok(ApiResponse.success(pageResponse, "Products retrieved successfully"));
    }

}
