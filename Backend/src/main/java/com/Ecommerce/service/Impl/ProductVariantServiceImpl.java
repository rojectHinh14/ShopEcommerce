package com.Ecommerce.service.Impl;

import com.Ecommerce.dto.request.ProductVariant.ProductVariantCreateRequest;
import com.Ecommerce.dto.request.ProductVariant.ProductVariantUpdateRequest;
import com.Ecommerce.dto.response.ProductVariant.ProductVariantResponse;
import com.Ecommerce.entity.Product;
import com.Ecommerce.entity.ProductVariant;
import com.Ecommerce.exception.ResourceNotFoundException;
import com.Ecommerce.mapper.ProductVariantMapper;
import com.Ecommerce.repository.ProductRepository;
import com.Ecommerce.repository.ProductVariantRepository;
import com.Ecommerce.service.ProductVariantService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductVariantRepository variantRepository;
    private final ProductRepository productRepository;
    private final ProductVariantMapper variantMapper;

    public ProductVariantServiceImpl(ProductVariantRepository variantRepository, ProductRepository productRepository, ProductVariantMapper variantMapper) {
        this.variantRepository = variantRepository;
        this.productRepository = productRepository;
        this.variantMapper = variantMapper;
    }

    @Override
    public ProductVariantResponse createVariant(ProductVariantCreateRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + request.getProductId()));

        ProductVariant variant = variantMapper.toEntity(request);
        variant.setProduct(product);
        variant = variantRepository.save(variant);
        return variantMapper.toResponse(variant);
    }

    @Override
    public ProductVariantResponse updateVariant(Long id, ProductVariantUpdateRequest request) {
        ProductVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant not found with id " + id));

        variantMapper.updateEntity(request, variant);
        variant = variantRepository.save(variant);
        return variantMapper.toResponse(variant);
    }

    @Override
    public void deleteVariant(Long id) {
        ProductVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant not found with id " + id));
        variantRepository.delete(variant);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductVariantResponse getVariantById(Long id) {
        ProductVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductVariant not found with id " + id));
        return variantMapper.toResponse(variant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductVariantResponse> getVariantsByProductId(Long productId) {
        List<ProductVariant> variants = variantRepository.findByProductId(productId);
        return variants.stream().map(variantMapper::toResponse).collect(Collectors.toList());
    }
}
