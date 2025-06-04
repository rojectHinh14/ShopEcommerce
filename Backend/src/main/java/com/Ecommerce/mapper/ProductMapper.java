package com.Ecommerce.mapper;

import com.Ecommerce.dto.request.ProductCreateRequest;
import com.Ecommerce.dto.response.ProductResponse;
import com.Ecommerce.dto.response.ProductVariant.ProductVariantResponse;
import com.Ecommerce.entity.Product;
import com.Ecommerce.entity.ProductImage;
import com.Ecommerce.entity.ProductVariant;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {
    public Product toEntity(ProductCreateRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setShortDescription(request.getShortDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setSkuCode(request.getSkuCode());
        product.setWeight(request.getWeight());
        product.setStatus(request.getStatus());
        return product;
    }
    private ProductVariantResponse toVariantResponse(ProductVariant variant) {
        ProductVariantResponse resp = new ProductVariantResponse();
        resp.setId(variant.getId());
        resp.setVariantName(variant.getVariantName());
        resp.setVariantValue(variant.getVariantValue());
        resp.setPrice(variant.getPrice());
        resp.setStockQuantity(variant.getStockQuantity());
        resp.setSkuCode(variant.getSkuCode());
        resp.setImageUrl(variant.getImageUrl());
        return resp;
    }
    public ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();

        // Basic fields
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setShortDescription(product.getShortDescription());
        response.setPrice(product.getPrice());
        response.setOriginalPrice(product.getOriginalPrice());
        response.setStockQuantity(product.getStockQuantity());
        response.setSoldCount(product.getSoldCount());
        response.setViewCount(product.getViewCount());
        response.setLikeCount(product.getLikeCount());
        response.setRating(product.getRating());
        response.setRatingCount(product.getRatingCount());
        response.setSkuCode(product.getSkuCode());
        response.setWeight(product.getWeight());
        response.setStatus(product.getStatus().name());
        response.setCreatedAt(product.getCreatedAt());

        // Category name
        if (product.getCategory() != null) {
            response.setCategoryName(product.getCategory().getName());
        }
        
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            // Lấy ảnh chính đầu tiên
            product.getImages().stream()
                    .filter(ProductImage::getPrimary)
                    .findFirst()
                    .ifPresent(primaryImage -> response.setPrimaryImageUrl(primaryImage.getImageUrl()));

            // Nếu muốn trả tất cả ảnh
            List<String> imageUrls = product.getImages().stream()
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());
            response.setImageUrls(imageUrls);
        } else {
            response.setPrimaryImageUrl(null);
            response.setImageUrls(Collections.emptyList());
        }

        // Shop name
        if (product.getShop() != null) {
            response.setShopName(product.getShop().getName());
        }
        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            List<ProductVariantResponse> variantResponses = product.getVariants().stream()
                    .map(this::toVariantResponse)
                    .collect(Collectors.toList());
            response.setVariants(variantResponses);
        } else {
            response.setVariants(Collections.emptyList());
        }


        // Image URLs
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            List<String> imageUrls = product.getImages().stream()
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());
            response.setImageUrls(imageUrls);
        } else {
            response.setImageUrls(Collections.emptyList());
        }

        return response;
    }

    public List<ProductResponse> toResponseList(List<Product> products) {
        return products.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

}
