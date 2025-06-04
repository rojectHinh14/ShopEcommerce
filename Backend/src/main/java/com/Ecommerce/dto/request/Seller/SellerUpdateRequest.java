package com.Ecommerce.dto.request.Seller;

import com.Ecommerce.enums.SellerStatus;

public class SellerUpdateRequest {
    private String businessName;
    private String businessLicense;
    private SellerStatus status;

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
}
