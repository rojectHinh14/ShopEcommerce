package com.Ecommerce.service.Impl;

import com.Ecommerce.dto.request.ProductCreateRequest;
import com.Ecommerce.dto.request.ProductSearchRequest;
import com.Ecommerce.dto.request.ProductUpdateRequest;
import com.Ecommerce.dto.response.ProductResponse;
import com.Ecommerce.entity.*;
import com.Ecommerce.enums.ProductStatus;
import com.Ecommerce.exception.ResourceNotFoundException;
import com.Ecommerce.mapper.ProductMapper;
import com.Ecommerce.repository.CategoryRepository;
import com.Ecommerce.repository.ProductRepository;
import com.Ecommerce.repository.ShopRepository;
import com.Ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Value("${storage.product.relative.path}")
    private String relativePath;


    @Value("${storage.root.folder.product}")
    private String storagePath;




    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository, ShopRepository shopRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ProductResponse createProduct(ProductCreateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));


        if (productRepository.existsBySkuCode(request.getSkuCode())) {
            throw new IllegalArgumentException("SKU code already exists: " + request.getSkuCode());
        }

        Product product = productMapper.toEntity(request);
        product.setCategory(category);
        product.setStatus(ProductStatus.ACTIVE);

        final Product finalProduct = product; // để dùng trong lambda

        // Gán variants nếu có
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            List<ProductVariant> variants = request.getVariants().stream().map(vReq -> {
                ProductVariant variant = new ProductVariant();
                variant.setProduct(finalProduct);
                variant.setVariantName(vReq.getVariantName());
                variant.setVariantValue(vReq.getVariantValue());
                variant.setPrice(vReq.getPrice());
                variant.setStockQuantity(vReq.getStockQuantity());
                variant.setSkuCode(vReq.getSkuCode());
                variant.setImageUrl(vReq.getImageUrl());
                return variant;
            }).toList();
            product.setVariants(variants);
        }

        // Gán images nếu có
        List<String> imagePaths =  saveImagesFromBase64(request.getImageBase64s(), request.getName());
        Set<ProductImage> images = imagePaths.stream()
                .map(path -> {
                    ProductImage image = new ProductImage();
                    image.setImageUrl(path);
                    image.setProduct(finalProduct);
                    image.setPrimary(false);
                    return image;
                }).collect(Collectors.toSet());

        product.setImages(images);


        product = productRepository.save(product);

        return productMapper.toResponse(product);
    }


    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        return productMapper.toResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        Page<Product> products = productRepository.findByCategoryAndIsActiveTrue(category, pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByShop(Long shopId, Pageable pageable) {
        Page<Product> products = productRepository.findByShopIdAndIsActiveTrue(shopId, pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByStatus(ProductStatus status, Pageable pageable) {
        Page<Product> products = productRepository.findByStatus(status, pageable);
        return products.map(productMapper::toResponse);
    }


    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(ProductSearchRequest request) {
        Sort sort = request.getSortDir().equalsIgnoreCase("desc") ?
                Sort.by(request.getSortBy()).descending() :
                Sort.by(request.getSortBy()).ascending();

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

        // Simple search by keyword
        if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
            Page<Product> products = productRepository.searchProducts(request.getKeyword(), pageable);
            return products.map(productMapper::toResponse);
        }

        // Advanced search with filters
        Page<Product> products = productRepository.findProductsWithFilters(
                request.getKeyword(),
                request.getCategoryId(),
                request.getMinPrice(),
                request.getMaxPrice(),
                pageable
        );

        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.searchProducts(keyword, pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> findByPriceRange(java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, Pageable pageable) {
        Page<Product> products = productRepository.findByPriceRange(minPrice, maxPrice, pageable);
        return products.map(productMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getBestSellingProducts(int limit) {
        List<Product> products = productRepository.findTop10ByOrderBySoldCountDesc();
        return products.stream()
                .limit(limit)
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getMostViewedProducts(int limit) {
        List<Product> products = productRepository.findTop10ByOrderByViewCountDesc();
        return products.stream()
                .limit(limit)
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getTopRatedProducts(int limit) {
        List<Product> products = productRepository.findTop10ByOrderByRatingDesc();
        return products.stream()
                .limit(limit)
                .map(productMapper::toResponse)
                .toList();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Update fields if provided
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getShortDescription() != null) {
            product.setShortDescription(request.getShortDescription());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getOriginalPrice() != null) {
            product.setOriginalPrice(request.getOriginalPrice());
        }
        if (request.getStockQuantity() != null) {
            product.setStockQuantity(request.getStockQuantity());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }
        if (request.getSkuCode() != null && !request.getSkuCode().equals(product.getSkuCode())) {
            if (productRepository.existsBySkuCode(request.getSkuCode())) {
                throw new IllegalArgumentException("SKU code already exists: " + request.getSkuCode());
            }
            product.setSkuCode(request.getSkuCode());
        }
        if (request.getWeight() != null) {
            product.setWeight(request.getWeight());
        }
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }

        product = productRepository.save(product);
        return productMapper.toResponse(product);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Soft delete - set status to deleted and isActive to false
        product.setStatus(ProductStatus.INACTIVE);
        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    public void updateProductStatus(Long productId, ProductStatus status) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        product.setStatus(status);
        productRepository.save(product);
    }

    @Override
    public void updateProductStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        product.setStockQuantity(product.getStockQuantity() + quantity);

        // Update status based on stock
        if (product.getStockQuantity() <= 0) {
            product.setStatus(ProductStatus.OUT_OF_STOCK);
        } else if (product.getStatus() == ProductStatus.OUT_OF_STOCK) {
            product.setStatus(ProductStatus.ACTIVE);
        }

        productRepository.save(product);
    }

    @Override
    public void incrementProductViews(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        product.setViewCount(product.getViewCount() + 1);
        productRepository.save(product);
    }

    @Override
    public void incrementProductLikes(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        product.setLikeCount(product.getLikeCount() + 1);
        productRepository.save(product);
    }

    @Override
    public void decrementProductLikes(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (product.getLikeCount() > 0) {
            product.setLikeCount(product.getLikeCount() - 1);
            productRepository.save(product);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsBySkuCode(String skuCode) {
        return productRepository.existsBySkuCode(skuCode);
    }

    @Override
    public boolean isProductOwner(Long productId, String username) {
        // Implementation to check if user owns the product through shop
        // This would need UserService or ShopService to check ownership
        return true; // Placeholder
    }

    @Override
    public Object getProductStatistics() {
        // Return product statistics for admin dashboard
        return new Object(); // Placeholder
    }

    private List<String> saveImagesFromBase64(List<String> base64Images, String productName) {
        List<String> imagePaths = new ArrayList<>();

        for (String base64 : base64Images) {
            try {
                String mimeType = base64.substring(5, base64.indexOf(";"));
                String fileExtension = "";
                if ("image/png".equals(mimeType)) {
                    fileExtension = "png";
                }else if ("image/jpeg".equals(mimeType)) {
                    fileExtension = "jpg";
                } else if ("image/webp".equals(mimeType)) {
                    fileExtension = "webp";
                } else if ("image/gif".equals(mimeType)) {
                    fileExtension = "gif";
                }else {
                    throw new RuntimeException("Định dạng ảnh không được hỗ trợ: " + mimeType);
                }

                byte[] decodedBytes = Base64.getDecoder().decode(base64.split(",")[1]);
                if (!storagePath.endsWith("/")) {
                    storagePath += "/";
                }
                File directory = new File(storagePath);
                if (!directory.exists()) {
                    directory.mkdirs();
                }

                String fileName = "product_" + productName + "_" + UUID.randomUUID() + "." + fileExtension;
                File imageFile = new File(directory, fileName);
                try (FileOutputStream fos = new FileOutputStream(imageFile)) {
                    fos.write(decodedBytes);
                }
                imagePaths.add(relativePath + fileName);
            } catch (Exception e) {
                for (String path : imagePaths) {
                    new File(storagePath + path).delete();
                }
                throw new RuntimeException("Lỗi khi lưu ảnh từ Base64: " + e.getMessage(), e);
            }
        }
        return imagePaths;
    }
}