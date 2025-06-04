package com.Ecommerce.service.Impl;

import com.Ecommerce.dto.request.Category.CategoryRequest;
import com.Ecommerce.dto.response.Category.CategoryResponse;
import com.Ecommerce.entity.Category;
import com.Ecommerce.exception.ResourceNotFoundException;
import com.Ecommerce.mapper.CategoryMapper;
import com.Ecommerce.repository.CategoryRepository;
import com.Ecommerce.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = categoryMapper.toEntity(request);
        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
        categoryMapper.updateEntity(request, category);
        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
        category.setActive(false);  // soft delete
        categoryRepository.save(category);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAllActive();
        return categories.stream().map(categoryMapper::toResponse).collect(Collectors.toList());
    }
}
