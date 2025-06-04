package com.Ecommerce.entity;

import com.Ecommerce.dto.request.Address.AddressCreateRequest;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(name = "addresses")
@EqualsAndHashCode(callSuper = true)
public class Address extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "address_line")
    private String addressLine;

    private String ward;
    private String district;
    private String province;
    private String country = "Vietnam";

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "is_default")
    private Boolean isDefault = false;

    @Enumerated(EnumType.STRING)
    private AddressType type = AddressType.HOME;

    public Address(User user, String fullName, String phoneNumber, String addressLine, String ward, String district, String province, String country, String postalCode, Boolean aDefault, AddressCreateRequest.AddressType type) {
        this.user = user;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.addressLine = addressLine;
        this.ward = ward;
        this.district = district;
        this.province = province;
        this.country = country;
        this.postalCode = postalCode;
        this.isDefault = aDefault;

    }

    public enum AddressType {
        HOME, OFFICE, OTHER
    }

    public Address() {}

    public Address(User user, String fullName, String phoneNumber, String addressLine, String ward, String district, String province, String country, String postalCode, Boolean isDefault, AddressType type) {
        this.user = user;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.addressLine = addressLine;
        this.ward = ward;
        this.district = district;
        this.province = province;
        this.country = country;
        this.postalCode = postalCode;
        this.isDefault = isDefault;
        this.type = type;
    }

    public Address(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, Boolean isActive, User user, String fullName, String phoneNumber, String addressLine, String ward, String district, String province, String country, String postalCode, Boolean isDefault, AddressType type) {
        super(id, createdAt, updatedAt, isActive);
        this.user = user;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.addressLine = addressLine;
        this.ward = ward;
        this.district = district;
        this.province = province;
        this.country = country;
        this.postalCode = postalCode;
        this.isDefault = isDefault;
        this.type = type;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public void setAddressLine(String addressLine) {
        this.addressLine = addressLine;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public Boolean getDefault() {
        return isDefault;
    }

    public void setDefault(Boolean aDefault) {
        isDefault = aDefault;
    }

    public AddressType getType() {
        return type;
    }

    public void setType(AddressType type) {
        this.type = type;
    }
}
