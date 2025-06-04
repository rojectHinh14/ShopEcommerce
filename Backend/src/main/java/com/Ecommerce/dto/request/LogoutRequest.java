package com.Ecommerce.dto.request;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;


@FieldDefaults(level = AccessLevel.PRIVATE)
public class LogoutRequest {
    String token;
    public LogoutRequest(String token) {
        this.token = token;
    }
    public LogoutRequest() {

    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
}
