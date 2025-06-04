package com.Ecommerce.entity;

import com.Ecommerce.enums.SellerStatus;
import jakarta.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "sellers")
public class Seller extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "business_name")
    private String businessName;

    @Column(name = "business_license")
    private String businessLicense;

    @Enumerated(EnumType.STRING)
    private SellerStatus status = SellerStatus.PENDING;


    // Default constructor
    public Seller() {
    }

    // Getters and setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getBusinessLicense() {
        return businessLicense;
    }

    public void setBusinessLicense(String businessLicense) {
        this.businessLicense = businessLicense;
    }



    public SellerStatus getStatus() {
        return status;
    }

    public void setStatus(SellerStatus status) {
        this.status = status;
    }


    // equals and hashCode based on ID (inherited from BaseEntity)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Seller)) return false;
        if (!super.equals(o)) return false;
        Seller seller = (Seller) o;
        return Objects.equals(getId(), seller.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), getId());
    }
}
