package com.Ecommerce.mapper;

import com.Ecommerce.dto.request.Category.CategoryRequest;
import com.Ecommerce.dto.response.Category.CategoryResponse;
import com.Ecommerce.entity.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {
    public CategoryResponse toResponse(Category entity) {
        if (entity == null) return null;
        CategoryResponse response = new CategoryResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setDescription(entity.getDescription());
        response.setSortOrder(entity.getSortOrder());
        return response;
    }

    public Category toEntity(CategoryRequest request) {
        if (request == null) return null;
        Category entity = new Category();
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);
        return entity;
    }

    public void updateEntity(CategoryRequest request, Category entity) {
        if (request.getName() != null) entity.setName(request.getName());
        if (request.getDescription() != null) entity.setDescription(request.getDescription());
        if (request.getSortOrder() != null) entity.setSortOrder(request.getSortOrder());
    }
}
