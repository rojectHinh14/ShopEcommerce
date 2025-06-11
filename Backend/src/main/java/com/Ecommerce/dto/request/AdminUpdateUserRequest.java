package com.Ecommerce.dto.request;

import com.Ecommerce.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

public class AdminUpdateUserRequest {
    @NotNull(message = "Status is required")
    private Boolean isActive;

    @NotNull(message = "Roles are required")
    private Set<Role> roles;

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
}
