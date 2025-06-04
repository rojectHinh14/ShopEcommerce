package com.Ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
@EqualsAndHashCode(callSuper = true)
public class CartItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;
    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    @Column(name = "variant_info")
    private String variantInfo;

    @Column(name = "is_selected")
    private Boolean isSelected = true;

    public CartItem(){}
    public CartItem(Cart cart, Product product, Integer quantity, String variantInfo, Boolean isSelected) {
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
        this.variantInfo = variantInfo;
        this.isSelected = isSelected;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getVariantInfo() {
        return variantInfo;
    }

    public void setVariantInfo(String variantInfo) {
        this.variantInfo = variantInfo;
    }

    public Boolean getSelected() {
        return isSelected;
    }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public void setSelected(Boolean selected) {
        isSelected = selected;
    }
}