package com.Ecommerce.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;


@FieldDefaults(level = AccessLevel.PRIVATE)
public class PasswordCreationRequest {
    @Size(min = 6, message = "INVALID_PASSWORD")
    String password;

    public PasswordCreationRequest(String password) {
        this.password = password;
    }
    public PasswordCreationRequest() {}
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}