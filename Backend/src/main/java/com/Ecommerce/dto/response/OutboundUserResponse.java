package com.Ecommerce.dto.response;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.experimental.FieldDefaults;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class OutboundUserResponse {
    String id;
    String email;
    boolean verifiedEmail;
    String name;
    String givenName;
    String familyName;
    String picture;
    String locale;

    public OutboundUserResponse() {}

    public OutboundUserResponse(String id, String email, boolean verifiedEmail, String name, String givenName, String familyName, String picture, String locale) {
        this.id = id;
        this.email = email;
        this.verifiedEmail = verifiedEmail;
        this.name = name;
        this.givenName = givenName;
        this.familyName = familyName;
        this.picture = picture;
        this.locale = locale;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isVerifiedEmail() {
        return verifiedEmail;
    }

    public void setVerifiedEmail(boolean verifiedEmail) {
        this.verifiedEmail = verifiedEmail;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGivenName() {
        return givenName;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }
}