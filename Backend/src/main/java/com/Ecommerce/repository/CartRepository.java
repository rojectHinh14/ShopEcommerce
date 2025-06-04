package com.Ecommerce.repository;

import com.Ecommerce.entity.Cart;
import com.Ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserId(Long userId);
    Optional<Cart> findByUser(User user);

    @Query("SELECT c FROM Cart c JOIN FETCH c.cartItems WHERE c.user = :user")
    Optional<Cart> findByUserWithCartItems(@Param("user") User user);
}
