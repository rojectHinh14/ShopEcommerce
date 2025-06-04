package com.Ecommerce.service.Impl;

import com.Ecommerce.dto.request.Seller.SellerCreateRequest;
import com.Ecommerce.dto.request.Seller.SellerUpdateRequest;
import com.Ecommerce.dto.response.Seller.SellerResponse;
import com.Ecommerce.entity.Seller;
import com.Ecommerce.enums.SellerStatus;
import com.Ecommerce.mapper.SellerMapper;
import com.Ecommerce.repository.SellerRepository;
import com.Ecommerce.repository.UserRepository;
import com.Ecommerce.service.SellerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final UserRepository userRepository; // giả định bạn có UserRepository
    private final SellerMapper sellerMapper;

    public SellerServiceImpl(SellerRepository sellerRepository, UserRepository userRepository, SellerMapper sellerMapper) {
        this.sellerRepository = sellerRepository;
        this.userRepository = userRepository;
        this.sellerMapper = sellerMapper;
    }

    @Override
    public SellerResponse createSeller(SellerCreateRequest request) {
        var user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Seller seller = new Seller();
        seller.setUser(user);
        seller.setBusinessName(request.getBusinessName());
        seller.setBusinessLicense(request.getBusinessLicense());
        seller.setStatus(request.getStatus() != null ? request.getStatus() : SellerStatus.PENDING);

        Seller saved = sellerRepository.save(seller);
        return sellerMapper.toResponse(saved);
    }

    @Override
    public SellerResponse updateSeller(Long id, SellerUpdateRequest request) {
        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (request.getBusinessName() != null) {
            seller.setBusinessName(request.getBusinessName());
        }
        if (request.getBusinessLicense() != null) {
            seller.setBusinessLicense(request.getBusinessLicense());
        }
        if (request.getStatus() != null) {
            seller.setStatus(request.getStatus());
        }

        Seller updated = sellerRepository.save(seller);
        return sellerMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public SellerResponse getSellerById(Long id) {
        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        return sellerMapper.toResponse(seller);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SellerResponse> getAllSellers(Pageable pageable) {
        return sellerRepository.findAll(pageable).map(sellerMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SellerResponse> getSellersByStatus(SellerStatus status, Pageable pageable) {
        return sellerRepository.findByStatus(status, pageable).map(sellerMapper::toResponse);
    }

    @Override
    public void deleteSeller(Long id) {
        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        sellerRepository.delete(seller);
    }
}