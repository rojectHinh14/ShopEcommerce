package com.Ecommerce.repository;

import com.Ecommerce.entity.Category;
import com.Ecommerce.entity.Product;
import com.Ecommerce.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByShopIdAndIsActiveTrue(Long shopId, Pageable pageable);
    Page<Product> findByCategoryAndIsActiveTrue(Category category, Pageable pageable);
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.status = 'ACTIVE'")
    Page<Product> findAll(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND " +
            "p.isActive = true AND p.status = 'ACTIVE'")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "p.price BETWEEN :minPrice AND :maxPrice AND " +
            "p.isActive = true AND p.status = 'ACTIVE'")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice,
                                   @Param("maxPrice") BigDecimal maxPrice,
                                   Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "p.isActive = true AND p.status = 'ACTIVE'")
    Page<Product> findProductsWithFilters(@Param("keyword") String keyword,
                                          @Param("categoryId") Long categoryId,
                                          @Param("minPrice") BigDecimal minPrice,
                                          @Param("maxPrice") BigDecimal maxPrice,
                                          Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.status = 'ACTIVE' ORDER BY p.soldCount DESC")
    List<Product> findTop10ByOrderBySoldCountDesc();

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.status = 'ACTIVE' ORDER BY p.viewCount DESC")
    List<Product> findTop10ByOrderByViewCountDesc();

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.status = 'ACTIVE' ORDER BY p.rating DESC")
    List<Product> findTop10ByOrderByRatingDesc();

    boolean existsBySkuCode(String skuCode);

}