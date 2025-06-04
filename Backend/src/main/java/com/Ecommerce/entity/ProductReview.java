package com.Ecommerce.entity;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "product_reviews")
public class ProductReview extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Integer rating; // 1-5 stars

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "is_verified_purchase")
    private Boolean isVerifiedPurchase = false;

    @Column(name = "helpful_count")
    private Integer helpfulCount = 0;

    @Column(name = "image_urls")
    private String imageUrls; // JSON array of image URLs

    public ProductReview() {
    }

    public ProductReview(Product product, User user, Integer rating, String comment,
                         Boolean isVerifiedPurchase, Integer helpfulCount, String imageUrls) {
        this.product = product;
        this.user = user;
        this.rating = rating;
        this.comment = comment;
        this.isVerifiedPurchase = isVerifiedPurchase;
        this.helpfulCount = helpfulCount;
        this.imageUrls = imageUrls;
    }

    // Getters and Setters
    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Boolean getIsVerifiedPurchase() {
        return isVerifiedPurchase;
    }

    public void setIsVerifiedPurchase(Boolean isVerifiedPurchase) {
        this.isVerifiedPurchase = isVerifiedPurchase;
    }

    public Integer getHelpfulCount() {
        return helpfulCount;
    }

    public void setHelpfulCount(Integer helpfulCount) {
        this.helpfulCount = helpfulCount;
    }

    public String getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(String imageUrls) {
        this.imageUrls = imageUrls;
    }

    // equals and hashCode (based on id from BaseEntity if exists, or fields)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductReview)) return false;
        if (!super.equals(o)) return false;
        ProductReview that = (ProductReview) o;
        return Objects.equals(product, that.product) &&
                Objects.equals(user, that.user) &&
                Objects.equals(rating, that.rating) &&
                Objects.equals(comment, that.comment) &&
                Objects.equals(isVerifiedPurchase, that.isVerifiedPurchase) &&
                Objects.equals(helpfulCount, that.helpfulCount) &&
                Objects.equals(imageUrls, that.imageUrls);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), product, user, rating, comment, isVerifiedPurchase, helpfulCount, imageUrls);
    }

    @Override
    public String toString() {
        return "ProductReview{" +
                "product=" + product +
                ", user=" + user +
                ", rating=" + rating +
                ", comment='" + comment + '\'' +
                ", isVerifiedPurchase=" + isVerifiedPurchase +
                ", helpfulCount=" + helpfulCount +
                ", imageUrls='" + imageUrls + '\'' +
                '}';
    }
}
