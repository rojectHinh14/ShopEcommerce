package com.Ecommerce.mapper;

import com.Ecommerce.dto.request.ProductVariant.ProductVariantCreateRequest;
import com.Ecommerce.dto.request.ProductVariant.ProductVariantUpdateRequest;
import com.Ecommerce.dto.response.ProductVariant.ProductVariantResponse;
import com.Ecommerce.entity.ProductVariant;
import org.springframework.stereotype.Component;

@Component
public class ProductVariantMapper {
    public ProductVariantResponse toResponse(ProductVariant entity) {
        if (entity == null) return null;
        ProductVariantResponse dto = new ProductVariantResponse();
        dto.setId(entity.getId());
        dto.setProductId(entity.getProduct() != null ? entity.getProduct().getId() : null);
        dto.setVariantName(entity.getVariantName());
        dto.setVariantValue(entity.getVariantValue());
        dto.setPrice(entity.getPrice());
        dto.setStockQuantity(entity.getStockQuantity());
        dto.setSkuCode(entity.getSkuCode());
        dto.setImageUrl(entity.getImageUrl());
        return dto;
    }

    public ProductVariant toEntity(ProductVariantCreateRequest dto) {
        if (dto == null) return null;
        ProductVariant entity = new ProductVariant();
        entity.setVariantName(dto.getVariantName());
        entity.setVariantValue(dto.getVariantValue());
        entity.setPrice(dto.getPrice());
        entity.setStockQuantity(dto.getStockQuantity());
        entity.setSkuCode(dto.getSkuCode());
        entity.setImageUrl(dto.getImageUrl());
        return entity;
    }

    public void updateEntity(ProductVariantUpdateRequest dto, ProductVariant entity) {
        if (dto == null || entity == null) return;
        if (dto.getVariantName() != null) entity.setVariantName(dto.getVariantName());
        if (dto.getVariantValue() != null) entity.setVariantValue(dto.getVariantValue());
        if (dto.getPrice() != null) entity.setPrice(dto.getPrice());
        if (dto.getStockQuantity() != null) entity.setStockQuantity(dto.getStockQuantity());
        if (dto.getSkuCode() != null) entity.setSkuCode(dto.getSkuCode());
        if (dto.getImageUrl() != null) entity.setImageUrl(dto.getImageUrl());
    }
}
