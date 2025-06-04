package com.Ecommerce.service.Impl;

import com.Ecommerce.dto.request.ProductImage.ProductImageRequest;
import com.Ecommerce.dto.response.ProductImage.ProductImageResponse;
import com.Ecommerce.entity.Product;
import com.Ecommerce.entity.ProductImage;
import com.Ecommerce.exception.ResourceNotFoundException;
import com.Ecommerce.repository.ProductImageRepository;
import com.Ecommerce.repository.ProductRepository;
import com.Ecommerce.service.ProductImageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductImageServiceImpl implements ProductImageService {
    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;

    public ProductImageServiceImpl(ProductImageRepository productImageRepository, ProductRepository productRepository) {
        this.productImageRepository = productImageRepository;
        this.productRepository = productRepository;
    }
    @Value("${storage.product.relative.path}")
    private String relativePath;


    @Value("${storage.root.folder.product}")
    private String storagePath;


    @Override
    public ProductImageResponse createProductImage(ProductImageRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        ProductImage image = new ProductImage();
        image.setProduct(product);
        image.setImageUrl(request.getImageUrl());
        image.setAltText(request.getAltText());
        image.setPrimary(request.getPrimary() != null ? request.getPrimary() : false);
        image.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);

        ProductImage saved = productImageRepository.save(image);
        return mapToResponse(saved);
    }

    @Override
    public ProductImageResponse updateProductImage(Long id, ProductImageRequest request) {
        ProductImage image = productImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + id));

        if(request.getImageUrl() != null) image.setImageUrl(request.getImageUrl());
        if(request.getAltText() != null) image.setAltText(request.getAltText());
        if(request.getPrimary() != null) image.setPrimary(request.getPrimary());
        if(request.getSortOrder() != null) image.setSortOrder(request.getSortOrder());

        ProductImage updated = productImageRepository.save(image);
        return mapToResponse(updated);
    }

    @Override
    public void deleteProductImage(Long id) {
        ProductImage image = productImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product image not found with id: " + id));
        productImageRepository.delete(image);
    }

    @Override
    public List<ProductImageResponse> getImagesByProductId(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        List<ProductImage> images = productImageRepository.findByProduct(product);
        return images.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private ProductImageResponse mapToResponse(ProductImage image) {
        ProductImageResponse response = new ProductImageResponse();
        response.setId(image.getId());
        response.setProductId(image.getId());
        response.setImageUrl(image.getImageUrl());
        response.setAltText(image.getAltText());
        response.setPrimary(image.getPrimary());
        response.setSortOrder(image.getSortOrder());
        response.setCreatedAt(image.getCreatedAt());
        response.setUpdatedAt(image.getUpdatedAt());
        return response;
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
