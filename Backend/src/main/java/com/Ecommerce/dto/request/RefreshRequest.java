package com.Ecommerce.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;


@FieldDefaults(level = AccessLevel.PRIVATE)
public class RefreshRequest {
    String token;
    public RefreshRequest(String token) {
        this.token = token;
    }
    public RefreshRequest() {}
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
}