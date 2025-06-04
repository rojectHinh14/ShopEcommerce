package com.Ecommerce.repository;

import com.Ecommerce.entity.Shop;
import com.Ecommerce.enums.ShopStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
    Page<Shop> findByStatus(ShopStatus status, Pageable pageable);

}
