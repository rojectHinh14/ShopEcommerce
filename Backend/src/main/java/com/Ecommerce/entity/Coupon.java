package com.Ecommerce.entity;

import com.Ecommerce.enums.CouponType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@EqualsAndHashCode(callSuper = true)
public class Coupon extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String code;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private CouponType type = CouponType.PERCENTAGE;

    @Column(name = "discount_value", precision = 12, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "max_discount", precision = 12, scale = 2)
    private BigDecimal maxDiscount;

    @Column(name = "min_order_value", precision = 12, scale = 2)
    private BigDecimal minOrderValue;

    @Column(name = "usage_limit")
    private Integer usageLimit;

    @Column(name = "used_count")
    private Integer usedCount = 0;

    @Column(name = "valid_from")
    private LocalDateTime validFrom;

    @Column(name = "valid_until")
    private LocalDateTime validUntil;

    @Column(name = "is_public")
    private Boolean isPublic = true;

    public Coupon() {}

    public Coupon(String code, String name, String description, CouponType type, BigDecimal discountValue, BigDecimal maxDiscount, BigDecimal minOrderValue, Integer usageLimit, Integer usedCount, LocalDateTime validFrom, LocalDateTime validUntil, Boolean isPublic) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.type = type;
        this.discountValue = discountValue;
        this.maxDiscount = maxDiscount;
        this.minOrderValue = minOrderValue;
        this.usageLimit = usageLimit;
        this.usedCount = usedCount;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.isPublic = isPublic;
    }

    public Coupon(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive, String code, String name, String description, CouponType type, BigDecimal discountValue, BigDecimal maxDiscount, BigDecimal minOrderValue, Integer usageLimit, Integer usedCount, LocalDateTime validFrom, LocalDateTime validUntil, Boolean isPublic) {
        super(id, createdAt, updatedAt, isActive);
        this.code = code;
        this.name = name;
        this.description = description;
        this.type = type;
        this.discountValue = discountValue;
        this.maxDiscount = maxDiscount;
        this.minOrderValue = minOrderValue;
        this.usageLimit = usageLimit;
        this.usedCount = usedCount;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.isPublic = isPublic;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
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

    public CouponType getType() {
        return type;
    }

    public void setType(CouponType type) {
        this.type = type;
    }

    public BigDecimal getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(BigDecimal discountValue) {
        this.discountValue = discountValue;
    }

    public BigDecimal getMaxDiscount() {
        return maxDiscount;
    }

    public void setMaxDiscount(BigDecimal maxDiscount) {
        this.maxDiscount = maxDiscount;
    }

    public BigDecimal getMinOrderValue() {
        return minOrderValue;
    }

    public void setMinOrderValue(BigDecimal minOrderValue) {
        this.minOrderValue = minOrderValue;
    }

    public Integer getUsageLimit() {
        return usageLimit;
    }

    public void setUsageLimit(Integer usageLimit) {
        this.usageLimit = usageLimit;
    }

    public Integer getUsedCount() {
        return usedCount;
    }

    public void setUsedCount(Integer usedCount) {
        this.usedCount = usedCount;
    }

    public LocalDateTime getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDateTime validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDateTime getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDateTime validUntil) {
        this.validUntil = validUntil;
    }

    public Boolean getPublic() {
        return isPublic;
    }

    public void setPublic(Boolean aPublic) {
        isPublic = aPublic;
    }
}
