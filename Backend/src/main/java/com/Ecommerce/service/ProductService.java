package com.Ecommerce.service;

import com.Ecommerce.dto.request.ProductCreateRequest;
import com.Ecommerce.dto.request.ProductSearchRequest;
import com.Ecommerce.dto.request.ProductUpdateRequest;
import com.Ecommerce.dto.response.ProductResponse;
import com.Ecommerce.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    // CRUD operations
    ProductResponse createProduct(ProductCreateRequest request);
    ProductResponse getProductById(Long id);
    Page<ProductResponse> getAllProducts(Pageable pageable);
    ProductResponse updateProduct(Long id, ProductUpdateRequest request);
    void deleteProduct(Long id);

    // Query operations
    Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);
    Page<ProductResponse> getProductsByShop(Long shopId, Pageable pageable);
    Page<ProductResponse> getProductsByStatus(ProductStatus status, Pageable pageable);
    Page<ProductResponse> searchProducts(ProductSearchRequest request);
    Page<ProductResponse> searchProducts(String keyword, Pageable pageable);
    Page<ProductResponse> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    // Featured lists
    List<ProductResponse> getBestSellingProducts(int limit);
    List<ProductResponse> getMostViewedProducts(int limit);
    List<ProductResponse> getTopRatedProducts(int limit);

    // Product management
    void updateProductStatus(Long productId, ProductStatus status);
    void updateProductStock(Long productId, Integer quantity);
    void incrementProductViews(Long productId);
    void incrementProductLikes(Long productId);
    void decrementProductLikes(Long productId);

    // Utility methods
    boolean existsBySkuCode(String skuCode);
    boolean isProductOwner(Long productId, String username);
    Object getProductStatistics();
}
