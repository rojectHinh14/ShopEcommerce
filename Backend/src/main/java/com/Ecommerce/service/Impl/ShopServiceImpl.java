package com.Ecommerce.service.Impl;

import com.Ecommerce.dto.request.Shop.ShopCreateRequest;
import com.Ecommerce.dto.request.Shop.ShopUpdateRequest;
import com.Ecommerce.dto.response.Shop.ShopResponse;
import com.Ecommerce.entity.Shop;
import com.Ecommerce.enums.ShopStatus;
import com.Ecommerce.mapper.ShopMapper;
import com.Ecommerce.repository.SellerRepository;
import com.Ecommerce.repository.ShopRepository;
import com.Ecommerce.service.ShopService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;
    private final SellerRepository sellerRepository;
    private final ShopMapper shopMapper;

    public ShopServiceImpl(ShopRepository shopRepository, SellerRepository sellerRepository, ShopMapper shopMapper) {
        this.shopRepository = shopRepository;
        this.sellerRepository = sellerRepository;
        this.shopMapper = shopMapper;
    }


    @Override
    public ShopResponse createShop(ShopCreateRequest request) {
        var seller = sellerRepository.findById(request.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Shop shop = new Shop();
        shop.setSeller(seller);
        shop.setName(request.getName());
        shop.setDescription(request.getDescription());
        shop.setStatus(request.getStatus() != null ? request.getStatus() : ShopStatus.ACTIVE);

        Shop saved = shopRepository.save(shop);
        return shopMapper.toResponse(saved);
    }

    @Override
    public ShopResponse updateShop(Long id, ShopUpdateRequest request) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        if (request.getName() != null) {
            shop.setName(request.getName());
        }
        if (request.getDescription() != null) {
            shop.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            shop.setStatus(request.getStatus());
        }

        Shop updated = shopRepository.save(shop);
        return shopMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public ShopResponse getShopById(Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        return shopMapper.toResponse(shop);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ShopResponse> getAllShops(Pageable pageable) {
        return shopRepository.findAll(pageable).map(shopMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ShopResponse> getShopsByStatus(ShopStatus status, Pageable pageable) {
        return shopRepository.findByStatus(status, pageable).map(shopMapper::toResponse);
    }

    @Override
    public void deleteShop(Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        shopRepository.delete(shop);
    }
}