package com.Ecommerce.dto.request;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;


@FieldDefaults(level = AccessLevel.PRIVATE)
public class IntrospectRequest {


    String token;
    public IntrospectRequest(String token) {
        this.token = token;
    }
    public IntrospectRequest() {}
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
