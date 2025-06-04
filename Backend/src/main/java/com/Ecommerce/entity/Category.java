package com.Ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "categories")

@EqualsAndHashCode(callSuper = true)
public class Category extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String description;



    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<Product> products;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    public Category() {}

    public Category(String name, String description, String imageUrl, String iconUrl, Category parent, List<Category> children, List<Product> products, Integer sortOrder) {
        this.name = name;
        this.description = description;

        this.products = products;
        this.sortOrder = sortOrder;
    }

    public Category(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive, String name, String description, String imageUrl, String iconUrl, Category parent, List<Category> children, List<Product> products, Integer sortOrder) {
        super(id, createdAt, updatedAt, isActive);
        this.name = name;
        this.description = description;
        this.products = products;
        this.sortOrder = sortOrder;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}