package com.Ecommerce.service;

import com.Ecommerce.dto.request.Category.CategoryRequest;
import com.Ecommerce.dto.response.Category.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);
    CategoryResponse getCategoryById(Long id);
    List<CategoryResponse> getAllCategories();
}
