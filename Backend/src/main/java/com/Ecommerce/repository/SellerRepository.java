package com.Ecommerce.repository;

import com.Ecommerce.entity.Seller;
import com.Ecommerce.enums.SellerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {
    Page<Seller> findByStatus(SellerStatus status, Pageable pageable);

}
