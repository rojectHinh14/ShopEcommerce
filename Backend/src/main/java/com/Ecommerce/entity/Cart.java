package com.Ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")

@EqualsAndHashCode(callSuper = true)
public class Cart extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CartItem> cartItems = new ArrayList<>();
    public Cart() {}

    public Cart(User user, List<CartItem> cartItems) {
        this.user = user;
        this.cartItems = cartItems;
    }

    public Cart(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive, User user, List<CartItem> cartItems) {
        super(id, createdAt, updatedAt, isActive);
        this.user = user;
        this.cartItems = cartItems;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }
}

