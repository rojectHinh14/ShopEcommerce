package com.Ecommerce.repository;

import com.Ecommerce.entity.Cart;
import com.Ecommerce.entity.CartItem;
import com.Ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartIdAndIsActiveTrue(Long cartId);
    Optional<CartItem> findByCartIdAndProductIdAndIsActiveTrue(Long cartId, Long productId);

    @Modifying
    @Query("UPDATE CartItem ci SET ci.isActive = false WHERE ci.cart.id = :cartId AND ci.id IN :itemIds")
    void softDeleteCartItems(@Param("cartId") Long cartId, @Param("itemIds") List<Long> itemIds);

}

