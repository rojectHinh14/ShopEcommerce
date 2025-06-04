package com.Ecommerce.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "product_variants")
public class ProductVariant extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "variant_name")
    private String variantName; // Size, Color, etc.

    @Column(name = "variant_value")
    private String variantValue; // M, Red, etc.

    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;

    @Column(name = "sku_code")
    private String skuCode;

    @Column(name = "image_url")
    private String imageUrl;

    public ProductVariant() {
    }

    public ProductVariant(Product product, String variantName, String variantValue,
                          BigDecimal price, Integer stockQuantity, String skuCode, String imageUrl) {
        this.product = product;
        this.variantName = variantName;
        this.variantValue = variantValue;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.skuCode = skuCode;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getVariantName() {
        return variantName;
    }

    public void setVariantName(String variantName) {
        this.variantName = variantName;
    }

    public String getVariantValue() {
        return variantValue;
    }

    public void setVariantValue(String variantValue) {
        this.variantValue = variantValue;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getSkuCode() {
        return skuCode;
    }

    public void setSkuCode(String skuCode) {
        this.skuCode = skuCode;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // equals and hashCode based on fields + superclass
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductVariant)) return false;
        if (!super.equals(o)) return false;
        ProductVariant that = (ProductVariant) o;
        return Objects.equals(product, that.product) &&
                Objects.equals(variantName, that.variantName) &&
                Objects.equals(variantValue, that.variantValue) &&
                Objects.equals(price, that.price) &&
                Objects.equals(stockQuantity, that.stockQuantity) &&
                Objects.equals(skuCode, that.skuCode) &&
                Objects.equals(imageUrl, that.imageUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            super.hashCode(),
            variantName,
            variantValue,
            price,
            stockQuantity,
            skuCode,
            imageUrl,
            product != null ? product.getId() : null
        );
    }

    @Override
    public String toString() {
        return "ProductVariant{" +
                "product=" + product +
                ", variantName='" + variantName + '\'' +
                ", variantValue='" + variantValue + '\'' +
                ", price=" + price +
                ", stockQuantity=" + stockQuantity +
                ", skuCode='" + skuCode + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
